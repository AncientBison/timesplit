import LoginButton from "@components/loginButton";
import Link from "next/link";
import { Button } from "@ui/button";
import { auth } from "~/server/auth";

export default async function HomePage() {
  const session = await auth();

  console.log("Session:", session);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
        Timesplit
      </h1>
      {!session ? (
        <LoginButton />
      ) : (
        <Button size="lg" asChild>
          <Link href="/planner" className="text-xl">Continue to Planner →</Link>
        </Button>
      )}
    </main>
  );
}
