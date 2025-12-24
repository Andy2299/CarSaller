import type { Server as IOServer } from "socket.io";

export function getIO(): IOServer | undefined {
  return (global as unknown as { io?: IOServer }).io;
}

export function setIO(io: IOServer) {
  (global as unknown as { io?: IOServer }).io = io;
}
