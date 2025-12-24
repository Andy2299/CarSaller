"use client";

import { useEffect, useRef, useState } from "react";
import { getSocketClient } from "@/components/providers";

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
}

export function ChatPanel({ conversationId, userId }: { conversationId: string; userId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const socketRef = useRef(getSocketClient());

  useEffect(() => {
    const client = socketRef.current;
    client.emit("join", { conversationId });
    client.on("message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });
    const loadMessages = async () => {
      const res = await fetch(`/api/messages?conversationId=${conversationId}`);
      if (res.ok) {
        const data = (await res.json()) as Message[];
        setMessages(data);
      }
    };
    loadMessages();
    return () => {
      client.off("message");
      client.emit("leave", { conversationId });
    };
  }, [conversationId]);

  const sendMessage = async () => {
    if (!content.trim()) return;
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId, content }),
    });
    if (res.ok) {
      const message = (await res.json()) as Message;
      setMessages((prev) => [...prev, message]);
      setContent("");
    }
  };

  return (
    <div className="card p-4 flex flex-col gap-4">
      <div className="flex-1 space-y-2 max-h-96 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}>
            <div className={`rounded-lg px-3 py-2 text-sm ${msg.senderId === userId ? "bg-primary text-white" : "bg-gray-100"}`}>
              <p>{msg.content}</p>
              <span className="block text-[10px] opacity-70">{new Date(msg.createdAt).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
        {messages.length === 0 && <p className="text-sm text-gray-500">Aún no hay mensajes.</p>}
      </div>
      <div className="flex gap-2">
        <input
          className="input"
          placeholder="Escribe tu mensaje"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} className="btn-primary">Enviar</button>
      </div>
    </div>
  );
}
