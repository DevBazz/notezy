"use client"
import React from "react";
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

const ClerkUser = () => {
  return (
    <div className="p-2">
      <SignedIn>
        <div className="flex items-center gap-3">
          <UserButton />
          <div className="hidden sm:block">
            {/* The UserButton provides a dropdown with user details; keep label for spacing */}
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="flex items-center">
          <SignInButton>
            <Button className="text-white px-3 py-1 rounded-md border border-neutral-800 bg-transparent hover:bg-neutral-900">Sign in</Button>
          </SignInButton>

           <SignUpButton>
            <Button className="text-white ml-2 px-3 py-1 rounded-md border border-neutral-800 bg-transparent hover:bg-neutral-900">Sign up</Button>
           </SignUpButton>
        </div>
      </SignedOut>
    </div>
  );
};

export default ClerkUser;
