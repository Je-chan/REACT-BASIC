"use client";
import React, { useEffect, useState } from "react";
import { User } from "@prisma/client";
import axios from "axios";
import useSWR from "swr";
import { TUserWithChat } from "@/types";
import Contacts from "@/components/chat/Contacts";
import Chat from "@/components/chat/Chat";

interface ChatClientProps {
  currentUser?: User | null;
}
const ChatClient = ({ currentUser }: ChatClientProps) => {
  const [receiver, setReceiver] = useState({
    receiverId: "",
    receiverName: "",
    receiverImage: "",
  });

  const [layout, setLayout] = useState(false);

  const fetcher = (url: string) => axios.get(url).then((res) => res.data);

  const {
    data: users,
    error,
    isLoading,
  } = useSWR("/api/chat", fetcher, {
    refreshInterval: 1000,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>ERROR</p>;

  const currentUserWithMessage = users?.find(
    (user: TUserWithChat) => user.email === currentUser?.email,
  );

  return (
    <main>
      <div className="grid grid-cols-[1fr] md:grid-cols-[300px_1fr]">
        {/* md 보다 클 때는 둘다 보여야함. */}
        {/* md보다 작고 layout이 true 일때는 contact 안보임  */}
        <section className={`md:flex ${layout && "hidden"}  `}>
          <Contacts
            users={users}
            currentUser={currentUserWithMessage}
            setLayout={setLayout}
            setReceiver={setReceiver}
          />
        </section>

        {/* md 보다 클 때는 둘다 보여야함. */}
        {/* md보다 작고 layout이 false 일때는 chat 안보임  */}
        <section className={`md:flex ${!layout && "hidden"}`}>
          <Chat
            currentUser={currentUserWithMessage}
            receiver={receiver}
            setLayout={setLayout}
          />
        </section>
      </div>
    </main>
  );
};

export default ChatClient;
