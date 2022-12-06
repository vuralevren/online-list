import TeamForm from "../forms/team-form";
import SideModal from "./side-modal";

export default function TeamSideModal({ show, setShow }) {
  return (
    <SideModal title="Team" show={show} setShow={setShow}>
      {show && <TeamForm />}
    </SideModal>
  );
}
