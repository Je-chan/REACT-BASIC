import React from "react";
import getCurrentUser from "@/app/actions/getCurrentUser";
import ChatClient from "@/app/chat/ChatClient";

const ChatPage = async () => {
  const currentUser = await getCurrentUser();
  return <ChatClient currentUser={currentUser} />;
};

export default ChatPage;
