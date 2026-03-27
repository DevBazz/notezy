"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Loader2, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  acceptShareRequest,
  rejectShareRequest,
} from "@/app/actions/share-note.actions";

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
      <Button
        size="sm"
        onClick={() => handle("accept")}
        disabled={loading}
        className="rounded-xl h-8 px-3 gap-1.5 bg-emerald-500 hover:bg-emerald-600
                   text-white text-xs font-medium transition-all duration-200"
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <>
            <Check className="h-3.5 w-3.5" />
            Accept
          </>
        )}
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => handle("reject")}
        disabled={loading}
        className="rounded-xl h-8 px-3 gap-1.5 border-border/60 text-xs font-medium
                   hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive
                   transition-all duration-200"
      >
        <X className="h-3.5 w-3.5" />
        Decline
      </Button>
    </div>
  );
}
