import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import ThemeProvider from "@components/themeProvider";
import ClientHeader from "@components/ClientHeader";

export const metadata: Metadata = {
  title: "TimeSplit",
  description: "Efficient time management made simple.",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientHeader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
