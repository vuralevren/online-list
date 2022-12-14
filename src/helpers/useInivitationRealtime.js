import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import realtimeService from "../redux/realtime/realtimeService";

export const InvitationEventType = {
  CHANNEL: "INVITATION",
  INVITE_MEMBER: "INVITE_MEMBER",
};

export default function useInivitationRealtime() {
  const user = useSelector(({ auth }) => auth.user);
  const [invitePopup, setInvitePopup] = useState(false);

  const inviteMember = ({ message }) => {
    const { invitedEmail, workspaceId, workspaceName } = message;
    if (invitedEmail !== user?.email) return;

    setInvitePopup({
      workspaceId,
      workspaceName,
    });
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

  return [invitePopup, setInvitePopup];
}
