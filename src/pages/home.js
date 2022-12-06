import { useState } from "react";
import ListTable from "../components/list-table";
import ListSideModal from "../components/modals/list-side-modal";
import Tabs from "../components/tabs";
import Template from "../components/template";

export default function Home() {
  const [showList, setShowList] = useState(false);

  const showSideList = () => {
    setShowList(true);
  };

  return (
    <Template newButtonOnClick={showSideList}>
      <Tabs settingsOnClick={showSideList} />
      <ListTable />

      <ListSideModal show={showList} setShow={setShowList} />
    </Template>
  );
}
