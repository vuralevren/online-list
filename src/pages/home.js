import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListTable from "../components/list-table";
import ListSideModal from "../components/modals/list-side-modal";
import Tabs from "../components/tabs";
import Template from "../components/template";
import { useNavigate, useParams } from "react-router-dom";
import { workspaceActions } from "../redux/workspace/workspaceSlice";
import { listActions } from "../redux/list/listSlice";
import Empty from "../components/empty";
import useListenRealtime from "../helpers/useRealtime";
import _ from "lodash";

export default function Home() {
  useListenRealtime();
  const { workspaceSlug, listSlug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(({ auth }) => auth.user);
  const [showList, setShowList] = useState(false);
  const [newList, setNewList] = useState(false);

  const showSideList = (isNew) => {
    setShowList(true);
    setNewList(isNew === true);
  };

  useEffect(() => {
    if (workspaceSlug) {
      dispatch(
        workspaceActions.getWorkspaceListBySlugRequest({
          userId: user?._id,
          slug: workspaceSlug,
          onFailure: () => {
            navigate("/");
          },
        })
      );
    }
  }, [workspaceSlug]);

  useEffect(() => {
    if (listSlug) {
      dispatch(
        listActions.getListBySlugRequest({
          userId: user?._id,
          listSlug,
          onFailure: () => {
            navigate("/");
          },
        })
      );
    }
  }, [listSlug]);

  return (
    <Template newButtonOnClick={showSideList}>
      {listSlug ? (
        <>
          <Tabs settingsOnClick={showSideList} />
          <ListTable />
        </>
      ) : (
        <Empty message="Select or add a list." />
      )}
      <ListSideModal show={showList} setShow={setShowList} newList={newList} />
    </Template>
  );
}
