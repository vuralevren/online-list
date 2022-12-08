import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListTable from "../components/list-table";
import ListSideModal from "../components/modals/list-side-modal";
import Tabs from "../components/tabs";
import Template from "../components/template";
import { useNavigate, useParams } from "react-router-dom";
import { workspaceActions } from "../redux/workspace/workspaceSlice";
import { listActions } from "../redux/list/listSlice";

export default function Home() {
  const { workspaceSlug } = useParams("workspaceSlug");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(({ auth }) => auth.user);
  const [showList, setShowList] = useState(false);

  const showSideList = () => {
    setShowList(true);
  };

  useEffect(() => {
    if (workspaceSlug) {
      dispatch(
        workspaceActions.getWorkspaceListBySlugRequest({
          userId: user?._id,
          slug: workspaceSlug,
          onSuccess: (isMember) => {
            console.log({ isMember });
            dispatch(
              listActions.getListsRequest({
                workspaceSlug,
                onlyPublic: !isMember,
              })
            );
          },
          onFailure: () => {
            navigate("/");
          },
        })
      );
    }
  }, [workspaceSlug]);

  return (
    <Template newButtonOnClick={showSideList}>
      <Tabs settingsOnClick={showSideList} />
      <ListTable />

      <ListSideModal show={showList} setShow={setShowList} />
    </Template>
  );
}
