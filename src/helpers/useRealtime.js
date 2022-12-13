import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { clientKey } from "../configs/altogic";
import { listActions } from "../redux/list/listSlice";
import realtimeService from "../redux/realtime/realtimeService";
import { workspaceActions } from "../redux/workspace/workspaceSlice";
import useQuery from "./useQuery";
import { myRouter } from "./routes";
import { TodoStatusTypes } from "./utils";
import { todoActions } from "../redux/todo/todoSlice";

export const EventType = {
  WORKSPACE_NAME_CHANGED: "WORKSPACE_NAME_CHANGED",

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

  const newList = ({ message }) => {
    const { sent, workspace, data } = message;
    if (realtimeKey === sent || workspace !== workspaceSlug) return;

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
    const { sent, workspace, data } = message;
    if (realtimeKey === sent || workspace !== workspaceSlug) return;

    navigate(myRouter.HOME(data?.workspaceSlug));
  };

  const updateList = ({ message }) => {
    const { sent, workspace, list, data } = message;
    if (realtimeKey === sent || workspace !== workspaceSlug) return;

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

  const deleteList = ({ message }) => {
    const { sent, workspace, list } = message;
    if (realtimeKey === sent || workspace !== workspaceSlug) return;

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
    const { sent, workspace, status, list, data } = message;
    if (
      realtimeKey === sent ||
      workspace !== workspaceSlug ||
      list !== listSlug
    )
      return;

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
    const { sent, workspace, status, list, data } = message;
    if (
      realtimeKey === sent ||
      workspace !== workspaceSlug ||
      list !== listSlug ||
      currentStatus !== status
    )
      return;

    dispatch(
      todoActions.updateTodos({
        key: data?._id,
        value: data,
      })
    );
  };

  const changeStatusTodo = ({ message }) => {
    const { sent, workspace, list, data } = message;
    if (
      realtimeKey === sent ||
      workspace !== workspaceSlug ||
      list !== listSlug
    )
      return;

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
    const { sent, workspace, list, data } = message;
    if (
      realtimeKey === sent ||
      workspace !== workspaceSlug ||
      list !== listSlug
    )
      return;

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
    realtimeService.listen(
      EventType.WORKSPACE_NAME_CHANGED,
      workspaceNameChange
    );
    realtimeService.listen(EventType.NEW_LIST, newList);
    realtimeService.listen(EventType.UPDATE_LIST, updateList);
    realtimeService.listen(EventType.DELETE_LIST, deleteList);
    realtimeService.listen(EventType.NEW_TODO, newTodo);
    realtimeService.listen(EventType.UPDATE_TODO, updateTodo);
    realtimeService.listen(EventType.CHANGE_STATUS_TODO, changeStatusTodo);
    realtimeService.listen(EventType.DELETE_TODO, deleteTodo);
  };

  useEffect(() => {
    realtimeService.join(clientKey);

    listen();

    return () => {
      realtimeService.leave(clientKey);
    };
  }, []);
}
