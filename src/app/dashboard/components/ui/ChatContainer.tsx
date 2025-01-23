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
    <div className="min-w-[100%]">
      {!loading && (
        <div className="p-[10px] rounded-[5px] m-h-[400px] overflow-y-clip">
          {messages.map((msg, index) => (
            <div
              key={msg._id}
              className={`flex ${
                session.data.user._id == msg.from
                  ? "justify-start"
                  : "justify-end"
              }  mb-[10px]`}
            >
              <div
                className={`m-w-[70%] p-[10px] rounded-[10px] overflow-x-clip overflow-y-clip ${
                  msg.from == session.data.user._id
                    ? "bg-[#f1f1f1] text-[000]"
                    : "bg-[#007bff] text-[fff]"
                }`}
              >
                <div
                  className={`${
                    msg.from == session.data.user._id
                      ? "text-black"
                      : "text-white"
                  }`}
                >
                  <strong>{msg.user.firstName}:</strong>
                  <span>{msg.message}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-[10px] flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-[10px] border-1-[#ddd] rounded-md"
        />
        <button
          onClick={handleSendMessage}
          className=" p-[10px] bg-[#007bff] text-white rounded-md cursor-pointer"
        >
          Send
        </button>
      </div>
    </div>
  );
}
