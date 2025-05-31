"use client";
import { signIn } from "next-auth/react";
import { Button } from "@ui/button";
import GoogleIcon from "@icons/googleIcon";

export default function LoginButton() {
  return (
    <Button size="lg" onClick={() => signIn("google")}>
      <GoogleIcon size={64} /> <p className="text-xl">Login with Google</p>
    </Button>
  );
}
