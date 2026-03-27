"use client";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import { LogIn, UserPlus } from "lucide-react";

const ClerkUser = () => {
  return (
    <div className="px-1">
      <SignedIn>
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-accent transition-colors">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 rounded-lg",
              },
            }}
          />
          <span className="text-sm font-medium text-foreground/80">Account</span>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="flex flex-col gap-2">
          <SignInButton mode="modal">
            <Button
              variant="outline"
              className="w-full rounded-xl border-border/60 text-sm font-medium
                         hover:bg-accent hover:border-primary/30 transition-all duration-200 gap-2"
            >
              <LogIn size={15} />
              Sign in
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button
              className="w-full rounded-xl text-sm font-medium gap-2
                         bg-primary text-primary-foreground hover:bg-primary/90
                         transition-all duration-200"
            >
              <UserPlus size={15} />
              Sign up
            </Button>
          </SignUpButton>
        </div>
      </SignedOut>
    </div>
  );
};

export default ClerkUser;
