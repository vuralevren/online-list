import TodoForm from "../forms/todo-form";
import SideModal from "./side-modal";

export default function TodoSideModal({ show, setShow }) {
  return (
    <SideModal title="Todo" show={show} setShow={setShow}>
      {show && <TodoForm />}
    </SideModal>
  );
}
