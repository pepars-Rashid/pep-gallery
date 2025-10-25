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
  Settings,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import HamburgerMenue from "./hamburger-menue";
import { auth } from "@/lib/auth/auth";
import { Session } from "next-auth";

export async function Navbar() {
  const session = await auth();

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-background">
      {/* mobile nav */}
      <MobileNavbar session={session} />
      {/* __________ */}

      {/* desktop nav */}
      <DesktopNavbar session={session} />
      {/* ___________ */}
    </nav>
  );
}

function MobileNavbar({ session }: { session: Session | null }) {
  return (
    <div className="relative p-6 lg:hidden">
      <HamburgerMenue>
        {/* Right side - Bell and Profile */}
        {/* search bar */}
        <div className="flex items-center gap-3">
          {session ? (
            <>
              {/* Bell Icon */}
              <Link href="/profile/notifications">
                <BellRingIcon className="h-5 w-5" />
              </Link>
              {/* Profile Drawer */}
              <ProfileDrawer session={session} />
            </>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
          )}
        </div>
      </HamburgerMenue>
    </div>
  );
}

function ProfileDrawer({ session }: { session: Session }) {
  const user = session?.user;
  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon">
          <Avatar className="rounded-full size-8">
            <AvatarImage
              src={user?.image || ""}
              alt={user?.name || "User"}
              className="rounded-full"
            />
            <AvatarFallback>{userInitials}</AvatarFallback>
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
                src={user?.image || ""}
                alt={user?.name || "User"}
                className="rounded-full"
              />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{user?.name || "User"}</p>
              <p className="text-sm text-muted-foreground">
                {user?.email || ""}
              </p>
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
                  src={user?.image || ""}
                  alt={user?.name || "User"}
                  className="rounded-full"
                />
                <AvatarFallback>{userInitials}</AvatarFallback>
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

function DesktopNavbar({ session }: { session: Session | null }) {
  const user = session?.user;
  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <NavigationMenu
      viewport={false}
      className="hidden lg:flex justify-between p-6 "
    >
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
        <NavigationMenuItem className="hidden lg:block">
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
        <NavigationMenuItem className="hidden lg:block">
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
        {session ? (
          <>
            {/* if user exist and not subsctiber update to pro */}
            <Link href={"/pricing"}>
              <Button variant="outline">Upgrade Plan</Button>
            </Link>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/profile/notifications">
                  <BellRingIcon />
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem className="hidden lg:block profile-menu-left">
              <NavigationMenuTrigger className="no-hover-effect">
                <Link href={"/profile"}>
                  <Avatar className="rounded-full size-10">
                    <AvatarImage
                      src={user?.image || ""}
                      alt={user?.name || "User"}
                      className="rounded-full"
                    />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                </Link>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-4">
                  <li className="flex flex-col gap-2">
                    <NavigationMenuLink
                      asChild
                      className="flex items-center gap-2"
                    >
                      <Link href="/profile">
                        <Avatar className="rounded-full size-10">
                          <AvatarImage
                            src={user?.image || ""}
                            alt={user?.name || "User"}
                            className="rounded-full"
                          />
                          <AvatarFallback>{userInitials}</AvatarFallback>
                        </Avatar>
                        {user?.name || "User"}
                      </Link>
                    </NavigationMenuLink>
                    <div className="flex flex-col gap-1">
                      <NavigationMenuLink asChild>
                        <Link
                          href="profile/favorites"
                          className="flex flex-row items-center gap-2"
                        >
                          <HeartIcon />
                          Favorites
                        </Link>
                      </NavigationMenuLink>

                      <NavigationMenuLink asChild>
                        <Link
                          href="/profile/saved-later"
                          className="flex flex-row items-center gap-2"
                        >
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
          </>
        ) : (
          <>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/signup">
                  <Button variant="outline">Sign Up</Button>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

// function ListItem({
//   title,
//   children,
//   href,
//   ...props
// }: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
//   return (
//     <li {...props}>
//       <NavigationMenuLink asChild>
//         <Link href={href}>
//           <div className="text-sm leading-none font-medium">{title}</div>
//           <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
//             {children}
//           </p>
//         </Link>
//       </NavigationMenuLink>
//     </li>
//   );
// }
