"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Loader2Icon } from "lucide-react";
import toast from "react-hot-toast";
import { toggleFollow } from "@/actions/user.action";

function FollowButton({ userId }: { userId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const handdleFollow = async () => {
    setIsLoading(true);
    try {
      await toggleFollow(userId);
      toast.success("Followed User");
    } catch (error) {
      console.log("error in following user", error);
      toast.error("Error in Following User");
    }
  };
  return (
    <Button
      size={"sm"}
      variant={"secondary"}
      onClick={handdleFollow}
      disabled={isLoading}
      className="w-20"
    >
      {isLoading ? <Loader2Icon className="size-4 animate-spin" /> : "Follow"}
    </Button>
  );
}

export default FollowButton;
