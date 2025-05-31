import LoginButton from "@components/loginButton";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
        Timesplit
      </h1>
      <LoginButton />
    </main>
  );
}
