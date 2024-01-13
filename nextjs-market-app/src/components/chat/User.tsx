import React from "react";
import { TUserWithChat } from "@/types";

interface UserProps {
  user: TUserWithChat;
  currentUserId: TUserWithChat["id"];
}
const User = ({ user, currentUserId }: UserProps) => {
  return <div>USER</div>;
};

export default User;
