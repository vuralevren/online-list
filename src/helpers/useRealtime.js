import _ from "lodash";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { listActions } from "../redux/list/listSlice";
import realtimeService from "../redux/realtime/realtimeService";
import { todoActions } from "../redux/todo/todoSlice";
import { workspaceActions } from "../redux/workspace/workspaceSlice";
import { myRouter } from "./routes";
import useQuery from "./useQuery";
import { TodoStatusTypes } from "./utils";

export const EventType = {
  WORKSPACE_NAME_CHANGED: "WORKSPACE_NAME_CHANGED",
  JOINED_WORKSPACE: "JOINED_WORKSPACE",
  LEAVED_WORKSPACE: "LEAVED_WORKSPACE",

  NEW_LIST: "NEW_LIST",
  UPDATE_LIST: "UPDATE_LIST",
  DELETE_LIST: "DELETE_LIST",

  NEW_TODO: "NEW_TODO",
  UPDATE_TODO: "UPDATE_TODO",
  CHANGE_STATUS_TODO: "CHANGE_STATUS_TODO",
  DELETE_TODO: "DELETE_TODO",
};

export default function useListenRealtime() {
  const { workspaceSlug, listSlug } = useParams();
  const statusSlug = useQuery("status");
  const currentStatus =
    statusSlug === TodoStatusTypes.COMPLETED
      ? TodoStatusTypes.COMPLETED
      : TodoStatusTypes.TODO;
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const user = useSelector(({ auth }) => auth.user);
  const realtimeKey = useSelector(({ auth }) => auth.realtimeKey);
  const workspace = useSelector(({ workspace }) =>
    _.get(workspace.workspaceList, workspaceSlug)
  );

  const newList = ({ message }) => {
    const { sent, data } = message;
    if (realtimeKey === sent) return;

    if (data?.isPublic) {
      dispatch(
        listActions.updateLists({
          key: data?.slug,
          value: data,
        })
      );
    } else if (user) {
      dispatch(
        workspaceActions.getIsMemberWorkspaceRequest({
          slug: workspaceSlug,
          onSuccess: (isMember) => {
            if (isMember) {
              dispatch(
                listActions.updateLists({
                  key: data?.slug,
                  value: data,
                })
              );
            }
          },
        })
      );
    }
  };

  const workspaceNameChange = ({ message }) => {
    const { sent, data } = message;
    if (realtimeKey === sent) return;

    navigate(myRouter.HOME(data?.workspaceSlug));
  };

  const updateList = ({ message }) => {
    const { sent, list, data } = message;
    if (realtimeKey === sent) return;

    dispatch(
      listActions.removeLists({
        key: list,
      })
    );
    dispatch(
      listActions.updateLists({
        key: data.slug,
        value: data,
      })
    );

    if (list === listSlug) {
      navigate(myRouter.HOME(workspaceSlug, data.slug));
    }
  };

  const joinedWorkspace = ({ message }) => {
    const { sent, data } = message;
    if (realtimeKey === sent) return;

    if (workspace) {
      dispatch(
        workspaceActions.updateWorkspaceList({
          key: workspace.slug,
          value: {
            ...workspace,
            userProfilePictures: [...workspace.userProfilePictures, data],
          },
        })
      );
    }
  };

  const leavedWorkspace = ({ message }) => {
    const { sent, data: memberId } = message;
    if (realtimeKey === sent) return;

    if (workspace) {
      if (memberId === user?._id) {
        navigate("/");
      } else {
        dispatch(
          workspaceActions.updateWorkspaceList({
            key: workspace.slug,
            value: {
              ...workspace,
              userProfilePictures: _.reject(
                workspace.userProfilePictures,
                (profile) => profile.user === memberId
              ),
            },
          })
        );
      }
    }
  };

  const deleteList = ({ message }) => {
    const { sent, list } = message;
    if (realtimeKey === sent) return;

    dispatch(
      listActions.removeLists({
        key: list,
      })
    );

    if (list === listSlug) {
      navigate(myRouter.HOME(workspaceSlug));
    }
  };

  const newTodo = ({ message }) => {
    const { sent, status, list, data } = message;
    if (realtimeKey === sent || list !== listSlug) return;

    if (currentStatus === status) {
      dispatch(
        todoActions.updateTodos({
          key: data?._id,
          value: data,
        })
      );
    }

    dispatch(
      listActions.setTodoSize({
        key: data?.listSlug,
        type: "increase",
      })
    );
  };

  const updateTodo = ({ message }) => {
    const { sent, status, list, data } = message;
    if (realtimeKey === sent || list !== listSlug || currentStatus !== status)
      return;

    dispatch(
      todoActions.updateTodos({
        key: data?._id,
        value: data,
      })
    );
  };

  const changeStatusTodo = ({ message }) => {
    const { sent, list, data } = message;
    if (realtimeKey === sent || list !== listSlug) return;

    dispatch(
      todoActions.updateTodos({
        key: data?._id,
        value: data,
      })
    );

    if (data?.status === TodoStatusTypes.TODO) {
      dispatch(
        listActions.setTodoSize({
          key: data?.listSlug,
          type: "increase",
        })
      );
      dispatch(
        listActions.setCompletedSize({
          key: data?.listSlug,
          type: "decrease",
        })
      );
    } else {
      dispatch(
        listActions.setTodoSize({
          key: data?.listSlug,
          type: "decrease",
        })
      );
      dispatch(
        listActions.setCompletedSize({
          key: data?.listSlug,
          type: "increase",
        })
      );
    }
  };

  const deleteTodo = ({ message }) => {
    const { sent, list, data } = message;
    if (realtimeKey === sent || list !== listSlug) return;

    dispatch(
      todoActions.removeTodos({
        key: data?._id,
      })
    );

    if (data?.status === TodoStatusTypes.TODO) {
      dispatch(
        listActions.setTodoSize({
          key: data?.listSlug,
          type: "decrease",
        })
      );
    } else {
      dispatch(
        listActions.setCompletedSize({
          key: data?.listSlug,
          type: "decrease",
        })
      );
    }
  };

  const listen = () => {
    if (listSlug) {
      realtimeService.listen(
        EventType.WORKSPACE_NAME_CHANGED,
        workspaceNameChange
      );
      realtimeService.removeListen(EventType.JOINED_WORKSPACE);
      realtimeService.removeListen(EventType.LEAVED_WORKSPACE);
      realtimeService.removeListen(EventType.NEW_LIST);
      realtimeService.removeListen(EventType.UPDATE_LIST);
      realtimeService.removeListen(EventType.DELETE_LIST);
      realtimeService.removeListen(EventType.NEW_TODO);
      realtimeService.removeListen(EventType.UPDATE_TODO);
      realtimeService.removeListen(EventType.CHANGE_STATUS_TODO);
      realtimeService.removeListen(EventType.DELETE_TODO);

      realtimeService.listen(EventType.JOINED_WORKSPACE, joinedWorkspace);
      realtimeService.listen(EventType.LEAVED_WORKSPACE, leavedWorkspace);
      realtimeService.listen(EventType.NEW_LIST, newList);
      realtimeService.listen(EventType.UPDATE_LIST, updateList);
      realtimeService.listen(EventType.DELETE_LIST, deleteList);
      realtimeService.listen(EventType.NEW_TODO, newTodo);
      realtimeService.listen(EventType.UPDATE_TODO, updateTodo);
      realtimeService.listen(EventType.CHANGE_STATUS_TODO, changeStatusTodo);
      realtimeService.listen(EventType.DELETE_TODO, deleteTodo);
    }
  };

  useEffect(() => {
    listen();
  }, [listSlug]);

  useEffect(() => {
    realtimeService.join(workspaceSlug);

    return () => {
      realtimeService.leave(workspaceSlug);
    };
  }, [workspaceSlug]);
}
