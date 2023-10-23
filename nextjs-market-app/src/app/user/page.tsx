import React from "react";
import getCurrentUser from "@/app/actions/getCurrentUser";

async function UserPage() {
  const userData = await getCurrentUser();
  return <div>USER PAGE</div>;
}

export default UserPage;
