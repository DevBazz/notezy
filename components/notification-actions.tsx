"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { LoaderIcon } from "lucide-react";
import toast from "react-hot-toast";
import { acceptShareRequest, rejectShareRequest } from "@/app/actions/share-note.actions";

interface Props {
  shareId: string;
}

export default function NotificationActions({ shareId }: Props) {
  const [loading, setLoading] = useState(false);

  const handle = async (action: "accept" | "reject") => {
    setLoading(true);
    try {
      const res =
        action === "accept"
          ? await acceptShareRequest(shareId)
          : await rejectShareRequest(shareId);

      if (res?.success) {
        toast.success(res.message ?? "Success");
      } else {
        toast.error(res?.message ?? "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Action failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button onClick={() => handle("accept")} disabled={loading}>
        {loading ? <LoaderIcon className="animate-spin" /> : "Accept"}
      </Button>
      <Button variant="outline" onClick={() => handle("reject")} disabled={loading}>
        Decline
      </Button>
    </div>
  );
}
