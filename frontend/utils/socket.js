import { io } from "socket.io-client";
import { root_url } from "./utils";

let socket;

export const initSocket = (userId) => {
  if (!socket) {
    socket = io(root_url, { 
      query: { userId },
    });

    socket.on("connect", () => {
      console.log("Connected to socket server:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });
  }
  return socket;
};

export const getSocket = () => socket;
