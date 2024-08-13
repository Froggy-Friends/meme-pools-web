"use client";

import { useState } from "react";
import { PostToX } from "./PostToX";
import SignupForm from "./SignupForm";
import Image from "next/image";

export default function Signup() {
  const [hasRegistered, setHasRegistered] = useState(false);

  return (
    <div className="w-full h-screen overflow-y-hidden bg-dark-green flex flex-col gap-10 justify-center items-center">
      <Image
        src="/frog-fun-text-logo.png"
        alt="Frog Fun Logo"
        width={415}
        height={240}
      />
      {hasRegistered ? (
        <PostToX />
      ) : (
        <SignupForm onUserRegistered={() => setHasRegistered(true)} />
      )}
    </div>
  );
}
