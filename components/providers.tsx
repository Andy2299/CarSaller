"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode, useEffect } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocketClient() {
  if (!socket) {
    socket = io("/api/socket");
  }
  return socket;
}

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    const client = getSocketClient();
    client.on("connect", () => console.info("socket connected"));
    return () => {
      client.disconnect();
    };
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}
