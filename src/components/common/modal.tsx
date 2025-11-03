"use client";
import { useCallback, useRef, useEffect, MouseEventHandler } from "react";
import { useRouter } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

export default function Modal({ children }: { children: React.ReactNode }) {
  const overlay = useRef(null);
  const wrapper = useRef(null);
  const router = useRouter();

  const onDismiss = useCallback(() => {
    router.back();
  }, [router]);

  const onClick: MouseEventHandler = useCallback(
    (e) => {
      if (e.target === overlay.current || e.target === wrapper.current) {
        if (onDismiss) onDismiss();
      }
    },
    [onDismiss, overlay, wrapper]
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    },
    [onDismiss]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      ref={overlay}
      className="fixed w-full z-50 left-0 right-0 top-0 bottom-0 mx-auto bg-black/85"
      onClick={onClick}
    >
      <div
        ref={wrapper}
        className="absolute w-full h-full max-w-7xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3"
      >
        <Button
          variant="outline"
          className="absolute size-8 top-7 lg:right-12 right-2 z-50"
          onClick={onDismiss}
        >
          <ArrowRight className="size-6"/>
        </Button>
        <ScrollArea className="h-screen py-6">{children}</ScrollArea>
      </div>
    </div>
  );
}
