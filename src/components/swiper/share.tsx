import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  IconBrandWhatsapp,
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandTelegram,
  IconBrandTwitter,
  IconCopy,
} from "@tabler/icons-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export function Share() {
  const sharePlatforms = [
    {
      name: "WhatsApp",
      icon: IconBrandWhatsapp,
      color: "text-green-500",
      onClick: () => console.log("Share to WhatsApp"),
    },
    {
      name: "Instagram",
      icon: IconBrandInstagram,
      color: "text-pink-500",
      onClick: () => console.log("Share to Instagram"),
    },
    {
      name: "Facebook",
      icon: IconBrandFacebook,
      color: "text-blue-600",
      onClick: () => console.log("Share to Facebook"),
    },
    {
      name: "Twitter",
      icon: IconBrandTwitter,
      color: "text-sky-500",
      onClick: () => console.log("Share to Twitter"),
    },
    {
      name: "Telegram",
      icon: IconBrandTelegram,
      color: "text-blue-400",
      onClick: () => console.log("Share to Telegram"),
    },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    console.log("Link copied to clipboard");
    // You can add a toast notification here later
  };

  return (
    <div className="flex flex-col gap-4 w-full p-2">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 justify-around">
          {sharePlatforms.map((platform) => {
            const IconComponent = platform.icon;
            return (
              <button
                key={platform.name}
                onClick={platform.onClick}
                className="flex flex-col items-center transition-transform hover:scale-105 active:scale-95"
              >
                <div
                  className={`p-2 rounded-full bg-gray-100 ${platform.color}`}
                >
                  <IconComponent className="size-7" />
                </div>
                <span className="text-xs font-medium text-gray-700">
                  {platform.name}
                </span>
              </button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <Separator />
      <div className="flex gap-3 items-center">
      <Button
        variant="outline"
        className="flex items-center gap-2 justify-center size-7"
        onClick={handleCopyLink}
      >
        <IconCopy className="size-7" />
        
      </Button>
        Copy Link
      </div>
    </div>
  );
}
