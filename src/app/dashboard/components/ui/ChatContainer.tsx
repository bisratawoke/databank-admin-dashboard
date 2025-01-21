"use client";

import React, { useEffect, useState } from "react";
import createMessage from "../../actions/createMessage";
import { useSession } from "next-auth/react";

interface IChat {
  subject: string;
  _id: string;
  messages: Array<IMessage>;
}

interface IMessage {
  _id: string;
  message: string;
  from: string;
  user: {
    firstName: string;
    lastName: string;
    email?: string;
  };
}

export default function ChatContainer(ChatInfo: IChat) {
  const session: any = useSession<any>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMessages(ChatInfo.messages);
    setLoading(false);
  }, [ChatInfo]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await createMessage({
        message: newMessage,
        chatterId: ChatInfo._id,
      });

      if (response.status === 201) {
        // Attach user info from the session to the new message
        const newMessages = response.body.messages.map((msg: IMessage) => ({
          ...msg,
          user: {
            firstName: session.data.user.firstName,
            lastName: session.data.user.lastName,
            email: session.data.user.email,
          },
        }));

        setMessages((prev) => [...prev, ...newMessages]);
        setNewMessage("");
      } else {
        console.error("Failed to send message:", response.body);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div style={{ minWidth: "100%", margin: "auto" }}>
      {!loading && (
        <div
          style={{
            // border: "1px solid #ddd",
            padding: "10px",
            borderRadius: "5px",
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={msg._id}
              style={{
                display: "flex",
                justifyContent: index % 2 === 0 ? "flex-start" : "flex-end",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  maxWidth: "70%",
                  padding: "10px",
                  borderRadius: "10px",
                  backgroundColor: index % 2 === 0 ? "#f1f1f1" : "#007bff",
                  color: index % 2 === 0 ? "#000" : "#fff",
                }}
              >
                <strong>{msg.user.firstName}:</strong> {msg.message}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "10px", display: "flex" }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "5px 0 0 5px",
          }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            padding: "10px",
            border: "none",
            backgroundColor: "#007bff",
            color: "white",
            borderRadius: "0 5px 5px 0",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
