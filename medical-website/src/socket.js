import { io } from "socket.io-client";

// chỉ tạo 1 socket duy nhất
export const socket = io("http://localhost:5000", {
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
});
