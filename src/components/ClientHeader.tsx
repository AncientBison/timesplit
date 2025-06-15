"use client";

import { usePathname } from "next/navigation";
import Header from "@components/Header";

export default function ClientHeader() {
  const pathname = usePathname();

  // Don't render the header on the main page ("/")
  if (pathname === "/") {
    return null;
  }

  return <Header />;
}
