import { useEffect } from "react";
import { clientKey } from "../configs/altogic";
import realtimeService from "../redux/realtime/realtimeService";

const Channels = {
  INVITATION: "invitation",
};

const EventType = {
  MESSAGE: "message",
};

export default function useListenRealtime() {
  useEffect(() => {
    console.log("buırda mıyız");
    realtimeService.join(Channels.INVITATION);
    realtimeService.sendMessage(Channels.INVITATION, EventType.MESSAGE, "hey");
    realtimeService.listen(EventType.MESSAGE, (payload) => {
      console.log({ payload });
    });
  }, []);
}
