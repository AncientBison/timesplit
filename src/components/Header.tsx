import Link from "next/link";
import { Button } from "@ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@ui/navigation-menu";

export default function Header() {
  return (
    <header className="bg-background border-b">
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
      </div>
    </header>
  );
}
