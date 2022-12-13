import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import realtimeService from "../redux/realtime/realtimeService";

export const InvitationEventType = {
  CHANNEL: "INVITATION",
  INVITE_MEMBER: "INVITE_MEMBER",
};

export default function useListenRealtime() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(({ auth }) => auth.user);

  const inviteMember = ({ message }) => {
    const { invitedEmail, workspaceId } = message;
    if (invitedEmail !== user?.email) return;

    console.log("davet aldınız..");
  };

  const listen = () => {
    realtimeService.listen(InvitationEventType.INVITE_MEMBER, inviteMember);
  };

  useEffect(() => {
    realtimeService.join(InvitationEventType.CHANNEL);

    listen();

    return () => {
      realtimeService.leave(InvitationEventType.CHANNEL);
    };
  }, []);
}
