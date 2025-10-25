"use client";
import * as React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Button } from "../ui/button";
import {
  ChevronDown,
  CircleCheckIcon,
  CircleHelpIcon,
  CircleIcon,
  LucideActivity,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";

export default function HamburgerMenue({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  return (
    <>
      <div className="flex items-center justify-between w-full px-4 py-2">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
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
          <Link href="/" className="flex flex-row items-center justify-center">
            <LucideActivity />
            <span className="ml-2">pep-gallery</span>
          </Link>
        </div>
        {children}
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
                  <Link href="/pro" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Upgrade Plan
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
}
