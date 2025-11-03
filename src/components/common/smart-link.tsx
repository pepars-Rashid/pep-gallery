// components/smart-shot-link.tsx
"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";

interface SmartShotLinkProps {
  shotId: string;
  children: React.ReactNode;
  className?: string;
}

export function SmartShotLink({
  shotId,
  children,
  className = "",
}: SmartShotLinkProps) {
  const isMobile  = useIsMobile();

  // Mobile: go to swipe experience
  if (isMobile) {
    return (
      <Link href={`/swiper/${shotId}`} className={className}>
        {children}
      </Link>
    );
  }

  // Desktop: go to shots page (will be intercepted by modal)
  return (
    <Link href={`/shots/${shotId}`} className={className} scroll={false}>
      {children}
    </Link>
  );
}
