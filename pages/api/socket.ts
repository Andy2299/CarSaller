import type { NextApiRequest } from "next";
import { Server as IOServer } from "socket.io";
import { getIO, setIO } from "@/lib/socket";
import type { NextApiResponseServerIO } from "@/types/socket";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (!res.socket.server.io) {
    const io = new IOServer(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
    });

    io.on("connection", (socket) => {
      socket.on("join", ({ conversationId }) => {
        if (conversationId) socket.join(conversationId);
      });
    });

    res.socket.server.io = io;
    setIO(io);
  } else if (!getIO()) {
    setIO(res.socket.server.io as unknown as IOServer);
  }

  res.end();
}
