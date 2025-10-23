"use client";

import * as React from "react";
import Link from "next/link";
import {
  BellRingIcon,
  Bookmark,
  CircleCheckIcon,
  CircleHelpIcon,
  CircleIcon,
  HeartIcon,
  LogIn,
  LucideActivity,
  Menu,
  Settings,
  ChevronDown,
  X,
} from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

export function NavigationMenuDemo() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return( 
      <div className="w-full fixed top-0 left-0 z-50 bg-background">
        <MobileNavbar />
      </div>
  );
  }

  return (
    <div className="w-full fixed top-0 left-0 z-50 bg-background">
    <DesktopNavbar />
    </div>
  );
}

function MobileNavbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const isMobile = useIsMobile();
  return (
    <div className="relative p-6">
      <div className="flex items-center justify-between w-full px-4 py-2">
        {/* Hamburger/X Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`${isMobile ? "" : "hidden"}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="relative w-6 h-6">
            <Menu
              className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
                isMenuOpen ? "opacity-0 rotate-180" : "opacity-100 rotate-0"
              }`}
            />
            <X
              className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
                isMenuOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-180"
              }`}
            />
          </div>
          <span className="sr-only">Toggle menu</span>
        </Button>

        {/* Logo */}
        <Link
          href="/"
          className="flex flex-row items-center justify-center"
        >
          <LucideActivity />
          <span className="ml-2">pep-gallery</span>
        </Link>

        {/* Right side - Bell and Profile */}
        <div className="flex items-center gap-2">
          {/* Bell Icon */}
          <Link href="/profile/notifications">
            <BellRingIcon className="h-5 w-5" />
          </Link>

          {/* Profile Drawer */}
          <ProfileDrawer />
        </div>
      </div>

      {/* Dropdown Menu Below Navbar */}
      <Collapsible open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <CollapsibleContent className="absolute top-full left-0 right-0 z-50 bg-background border-t shadow-lg">
          <div className="p-4">
            <div className="flex flex-col space-y-4">
              {/* Navigation Links with Collapsible Dropdowns */}
              <div className="space-y-3">
                <Link
                  href="/contact-us"
                  className="block py-2 text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact Us
                </Link>

                {/* Explore Dropdown */}
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-base font-medium">
                    Explore
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 pt-2 pb-3 pl-4">
                    <Link
                      href="#"
                      className="block py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Components
                    </Link>
                    <Link
                      href="#"
                      className="block py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Documentation
                    </Link>
                    <Link
                      href="#"
                      className="block py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Blocks
                    </Link>
                  </CollapsibleContent>
                </Collapsible>

                {/* With Icon Dropdown */}
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-base font-medium">
                    With Icon
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 pt-2 pb-3 pl-4">
                    <Link
                      href="#"
                      className="flex items-center gap-2 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <CircleHelpIcon className="h-4 w-4" />
                      Backlog
                    </Link>
                    <Link
                      href="#"
                      className="flex items-center gap-2 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <CircleIcon className="h-4 w-4" />
                      To Do
                    </Link>
                    <Link
                      href="#"
                      className="flex items-center gap-2 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <CircleCheckIcon className="h-4 w-4" />
                      Done
                    </Link>
                  </CollapsibleContent>
                </Collapsible>

                {/* Upgrade to Pro */}
                <div className="pt-2">
                  <Link
                    href="/pro"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button variant="outline" className="w-full">
                      Upgrade to pro
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

function ProfileDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon">
          <Avatar className="rounded-full size-8">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="@evilrabbit"
              className="rounded-full"
            />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Profile</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 space-y-4">
          {/* Profile Info */}
          <div className="flex items-center gap-3">
            <Avatar className="rounded-full size-12">
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="@evilrabbit"
                className="rounded-full"
              />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">Pepars Rashid</p>
              <p className="text-sm text-muted-foreground">@evilrabbit</p>
            </div>
          </div>

          {/* Profile Links */}
          <div className="space-y-2">
            <Link
              href="/profile"
              className="flex items-center gap-3 py-2 text-sm font-medium"
            >
              <Avatar className="rounded-full size-8">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@evilrabbit"
                  className="rounded-full"
                />
                <AvatarFallback>ER</AvatarFallback>
              </Avatar>
              View Profile
            </Link>

            <Link
              href="/profile/favorites"
              className="flex items-center gap-3 py-2 text-sm"
            >
              <HeartIcon className="h-4 w-4" />
              Favorites
            </Link>

            <Link
              href="/profile/saved-later"
              className="flex items-center gap-3 py-2 text-sm"
            >
              <Bookmark className="h-4 w-4" />
              Save to later
            </Link>

            <Link
              href="/settings"
              className="flex items-center gap-3 py-2 text-sm"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>

            <hr className="my-4" />

            <Link
              href="/sign-out"
              className="flex items-center gap-3 py-2 text-sm text-red-600"
            >
              <LogIn className="h-4 w-4" />
              Sign out
            </Link>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function DesktopNavbar() {
  const isMobile = useIsMobile();
  return (
    <NavigationMenu viewport={false} className="flex justify-between p-6">
      <NavigationMenuList className="flex-wrap">
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link
              href="/"
              className="flex flex-row items-center justify-center"
            >
              <LucideActivity />
              <span>pep-gallery</span>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className={`${isMobile ? "hidden" : ""}`}>
          <NavigationMenuTrigger>
            <Link href={"/gallery"}>Explore</Link>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link href="#">Components</Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="#">Documentation</Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="#">Blocks</Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className={`${isMobile ? "hidden" : ""}`}>
          <NavigationMenuTrigger>With Icon</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link href="#" className="flex-row items-center gap-2">
                    <CircleHelpIcon />
                    Backlog
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="#" className="flex-row items-center gap-2">
                    <CircleIcon />
                    To Do
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="#" className="flex-row items-center gap-2">
                    <CircleCheckIcon />
                    Done
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/contact-us">Contact Us</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuList className="flex-wrap">
        {/* if user exist and not subsctiber update to pro */}
        <Link href={"/pro"}>
          <Button variant="outline">Upgrade to pro</Button>
        </Link>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/profile/notifications">
              <BellRingIcon />
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className={`${isMobile ? "hidden" : ""} profile-menu-left`}>
          <NavigationMenuTrigger className="no-hover-effect">
            <Link href={"/profile"}>
              <Avatar className="rounded-full size-10">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@evilrabbit"
                  className="rounded-full"
                />
                <AvatarFallback>ER</AvatarFallback>
              </Avatar>
            </Link>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li className="flex flex-col gap-2">
                <NavigationMenuLink asChild className="flex items-center gap-2">
                  <Link href="/profile">
                    <Avatar className="rounded-full size-10">
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@evilrabbit"
                        className="rounded-full"
                      />
                      <AvatarFallback>ER</AvatarFallback>
                    </Avatar>
                    Pepars Rashid
                  </Link>
                </NavigationMenuLink>
                <div className="flex flex-col gap-1">
                  <NavigationMenuLink
                    asChild
                  >
                    <Link href="profile/favorites" className="flex flex-row items-center gap-2">
                      <HeartIcon />
                      Favorites
                    </Link>
                  </NavigationMenuLink>

                  <NavigationMenuLink
                    asChild
                  >
                    <Link href="/profile/saved-later" className="flex flex-row items-center gap-2">
                      <Bookmark />
                      Save to later
                    </Link>
                  </NavigationMenuLink>

                  <NavigationMenuLink asChild>
                    <Link
                      href="/settings"
                      className="flex flex-row items-center gap-2"
                    >
                      <Settings />
                      Settings
                    </Link>
                  </NavigationMenuLink>
                  <hr />
                  <NavigationMenuLink asChild>
                    <Link
                      href="/sign-out"
                      className="flex flex-row items-center gap-2"
                    >
                      <LogIn />
                      Sign out
                    </Link>
                  </NavigationMenuLink>
                </div>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
