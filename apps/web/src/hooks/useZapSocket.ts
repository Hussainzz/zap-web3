import { zapSocketState } from "@zap/recoil";
import { useSetRecoilState } from "recoil";
import { io } from "socket.io-client";

const useZapSocket = () => {
  const setZapSocket = useSetRecoilState(zapSocketState);

  const connectToZapSocket = async () => {
    const socket = io(process.env.NEXT_PUBLIC_ZAP_ACTION_SERVICE as string, {
      withCredentials: true,
      extraHeaders: {
        "zap-socket-key": process.env.NEXT_PUBLIC_ZAP_SOCKET_SECRET as string,
      },
    });
    socket.on("connect", () => {
      console.log("Zap Socket Client connected");
      setZapSocket(socket);
    });

    socket.on("disconnect", () => {
      console.log("Zap Socket Client disconnected");
    });
  };
  return {
    connectToZapSocket
  };
};

export default useZapSocket;
