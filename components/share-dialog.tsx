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
import { Share2, Loader2, Check } from "lucide-react";
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

  // Fetch all users when dialog opens
  useEffect(() => {
    if (open && users.length === 0) {
      fetchUsers();
    }
  }, [open]);

  const fetchUsers = async () => {
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

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Toggle user selection
  const toggleUserSelection = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  // Share note with selected users
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

      // Check if all shares were successful
      const allSuccess = results.every((result) => result.success);

      if (allSuccess) {
        toast.success(
          `Note shared with ${selectedUsers.size} user${selectedUsers.size > 1 ? "s" : ""}`
        );
        setSelectedUsers(new Set());
        setSearchQuery("");
        setOpen(false);
      } else {
        // Handle partial failures
        const failedCount = results.filter((r) => !r.success).length;
        if (failedCount === results.length) {
          toast.error("Failed to share note");
        } else {
          toast.success(
            `Note shared with ${results.length - failedCount} user${results.length - failedCount > 1 ? "s" : ""}`
          );
          setSelectedUsers(new Set());
          setSearchQuery("");
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
        variant="ghost"
        size="icon"
        className="rounded-xl"
        onClick={() => setOpen(true)}
        title="Share note"
      >
        <Share2 className="h-5 w-5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share Note</DialogTitle>
            <DialogDescription>
              Select users to share this note with
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search Bar */}
            <Input
              placeholder="Search by name, username, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-lg"
            />

            {/* Users List */}
            <div className="max-h-64 overflow-y-auto border rounded-lg p-3 bg-muted/30">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  {users.length === 0
                    ? "No users found"
                    : "No users match your search"}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => toggleUserSelection(user.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedUsers.has(user.id)
                          ? "bg-primary/10 border border-primary"
                          : "hover:bg-muted border border-transparent"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* User Avatar */}
                        <div className="flex-shrink-0">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.username}
                              className="h-8 w-8 rounded-full"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-sm font-semibold">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm truncate">
                              {user.name || user.username}
                            </h4>
                            {selectedUsers.has(user.id) && (
                              <Check className="h-4 w-4 text-primary flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            @{user.username}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Count */}
            {selectedUsers.size > 0 && (
              <div className="text-sm text-muted-foreground">
                {selectedUsers.size} user{selectedUsers.size > 1 ? "s" : ""} selected
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1"
                disabled={sharing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleShare}
                disabled={sharing || selectedUsers.size === 0}
                className="flex-1"
              >
                {sharing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sharing...
                  </>
                ) : (
                  "Share Note"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
