import Link from "next/link";
import { Button } from "@ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@ui/navigation-menu";
import { signOut } from "next-auth/react";

export default function Header() {
  return (
    <header className="bg-background border-b fixed top-0 z-50 w-full shadow-sm">
      <div className="container flex min-w-full items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-bold">
          TimeSplit
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              {/* <Link href="/about">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  About
                </NavigationMenuLink>
              </Link> */}
            </NavigationMenuItem>
            <NavigationMenuItem>
              {/* <Link href="/contact">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Contact
                </NavigationMenuLink>
              </Link> */}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <Button onClick={async () => {
          await signOut({ callbackUrl: "/" })
        }}>
          Log Out
        </Button>
      </div>
    </header>
  );
}
