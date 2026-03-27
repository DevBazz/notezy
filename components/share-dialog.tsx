"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Share2, Loader2, Check, Search } from "lucide-react";
import { getAllUsers } from "@/app/actions/user.actions";
import { shareRequest } from "@/app/actions/share-note.actions";
import toast from "react-hot-toast";

interface User {
  id: string;
  username: string;
  email: string;
  image: string | null;
  name: string | null;
}

interface ShareDialogProps {
  noteId: string;
}

export default function ShareDialog({ noteId }: ShareDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    if (open) {
      fetchUsers();
    } else {
      setSelectedUsers(new Set());
      setSearchQuery("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const fetchUsers = async () => {
    if (users.length > 0) return;
    try {
      setLoading(true);
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleUserSelection = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleShare = async () => {
    if (selectedUsers.size === 0) {
      toast.error("Please select at least one user");
      return;
    }
    try {
      setSharing(true);
      const sharePromises = Array.from(selectedUsers).map((userId) =>
        shareRequest(noteId, userId)
      );
      const results = await Promise.all(sharePromises);
      const allSuccess = results.every((result) => result.success);

      if (allSuccess) {
        toast.success(`Shared with ${selectedUsers.size} user${selectedUsers.size > 1 ? "s" : ""}`);
        setSelectedUsers(new Set());
        setOpen(false);
      } else {
        const failedCount = results.filter((r) => !r.success).length;
        const successCount = results.length - failedCount;
        results.forEach((result) => {
          if (!result.success) toast.error(result.message || "Failed to share with a user");
        });
        if (successCount > 0) {
          toast.success(`Shared with ${successCount} user${successCount > 1 ? "s" : ""}`);
          setSelectedUsers(new Set());
          setOpen(false);
        }
      }
    } catch (error) {
      console.error("Error sharing note:", error);
      toast.error("Failed to share note");
    } finally {
      setSharing(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="rounded-xl gap-2 border-border/60 hover:border-primary/40
                   hover:text-primary transition-all duration-200 text-xs"
        onClick={() => setOpen(true)}
      >
        <Share2 className="h-3.5 w-3.5" />
        Share
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm rounded-2xl border-border/60 p-0 overflow-hidden">
          <DialogHeader className="px-5 pt-5 pb-4 border-b border-border/50">
            <DialogTitle className="text-base font-semibold">Share note</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
              Select people to share this note with
            </DialogDescription>
          </DialogHeader>

          <div className="px-5 py-4 space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search by name or email…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 rounded-xl border-border/60 h-9 text-sm focus-visible:ring-primary/40"
              />
            </div>

            {/* Users list */}
            <div className="max-h-56 overflow-y-auto rounded-xl border border-border/50 bg-muted/20">
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="py-10 text-center text-xs text-muted-foreground">
                  {users.length === 0 ? "No users found" : "No users match your search"}
                </div>
              ) : (
                <div className="p-1.5 space-y-0.5">
                  {filteredUsers.map((user) => {
                    const isSelected = selectedUsers.has(user.id);
                    return (
                      <div
                        key={user.id}
                        onClick={() => toggleUserSelection(user.id)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150
                          ${isSelected
                            ? "bg-primary/10 border border-primary/20"
                            : "hover:bg-accent border border-transparent"
                          }`}
                      >
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.username}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-semibold">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate leading-none">
                            {user.name || user.username}
                          </p>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            @{user.username}
                          </p>
                        </div>

                        {/* Check */}
                        {isSelected && (
                          <Check className="h-4 w-4 text-primary flex-shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Selected count */}
            {selectedUsers.size > 0 && (
              <p className="text-xs text-muted-foreground">
                {selectedUsers.size} user{selectedUsers.size > 1 ? "s" : ""} selected
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-xl border-border/60 text-sm"
                disabled={sharing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleShare}
                disabled={sharing || selectedUsers.size === 0}
                className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-sm"
              >
                {sharing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Share"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
