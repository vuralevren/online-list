import ListForm from "../forms/list-form";
import SideModal from "./side-modal";

export default function ListSideModal({ show, setShow }) {
  return (
    <SideModal title="List" show={show} setShow={setShow}>
      {show && <ListForm />}
    </SideModal>
  );
}
