// components/shop-details.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bookmark, MessageCircle, ThumbsUp, User } from "lucide-react";
import Image from "next/image";
import { MasnoryLayout } from "../masnory/masnory-layout";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";

// Mock data - replace with your actual data
const shopData = {
  title: "Minimalist Photography Studio",
  owner: {
    name: "Alex Johnson",
    avatar: "https://avatar.iran.liara.run/public/15",
    bio: "Professional photographer specializing in minimalist and urban landscapes",
  },
  primaryPhoto: "https://picsum.photos/id/80/1200/800",
  description:
    "A curated collection of minimalist photography capturing the essence of urban landscapes and natural beauty. Each shot is carefully composed to tell a story through simplicity and careful attention to light and shadow.",
};

// Mock images for masonry grids
const previewImages = [
  {
    id: "102",
    author: "Ben Moore",
    width: 4320,
    height: 3240,
    url: "https://unsplash.com/photos/pJILiyPdrXI",
    download_url: "https://picsum.photos/id/102/4320/3240",
  },
  {
    id: "103",
    author: "Ilham Rahmansyah",
    width: 2592,
    height: 1936,
    url: "https://unsplash.com/photos/DwTZwZYi9Ww",
    download_url: "https://picsum.photos/id/103/2592/1936",
  },
  {
    id: "104",
    author: "Dyaa Eldin",
    width: 3840,
    height: 2160,
    url: "https://unsplash.com/photos/2fl-ocJ5MOA",
    download_url: "https://picsum.photos/id/104/3840/2160",
  },
  {
    id: "106",
    author: "Arvee Marie",
    width: 2592,
    height: 1728,
    url: "https://unsplash.com/photos/YnfGtpt2gf4",
    download_url: "https://picsum.photos/id/106/2592/1728",
  },
  {
    id: "107",
    author: "Lukas Schweizer",
    width: 5000,
    height: 3333,
    url: "https://unsplash.com/photos/9VWOr22LhVI",
    download_url: "https://picsum.photos/id/107/5000/3333",
  },
  {
    id: "108",
    author: "Florian Klauer",
    width: 2000,
    height: 1333,
    url: "https://unsplash.com/photos/t1mqA3V3-7g",
    download_url: "https://picsum.photos/id/108/2000/1333",
  },
];

const youMightLikeImages = [
  {
    id: "85",
    download_url: "https://picsum.photos/id/85/500/309",
    width: 500,
    height: 309,
    author: "Sarah Wilson",
  },
  {
    id: "122",
    author: "Vadim Sherbakov",
    width: 4147,
    height: 2756,
    url: "https://unsplash.com/photos/xS_RzdD5CFE",
    download_url: "https://picsum.photos/id/122/4147/2756",
  },
  {
    id: "87",
    download_url: "https://picsum.photos/id/87/500/375",
    width: 500,
    height: 375,
    author: "Emma Davis",
  },
  {
    id: "88",
    download_url: "https://picsum.photos/id/88/500/667",
    width: 500,
    height: 667,
    author: "James Brown",
  },
  {
    id: "89",
    download_url: "https://picsum.photos/id/89/500/281",
    width: 500,
    height: 281,
    author: "Lisa Taylor",
  },
  {
    id: "90",
    download_url: "https://picsum.photos/id/90/500/332",
    width: 500,
    height: 332,
    author: "Tom Wilson",
  },
];

interface MasonryImageCardProps {
  image: {
    id: string;
    download_url: string;
    width: number;
    height: number;
    author: string;
  };
}

function MasonryImageCard({ image }: MasonryImageCardProps) {
  return (
    <Card className="p-1 relative">
      <CardContent className="p-1">
        <Link href={"swiper"} target="_blank" rel="noopener noreferrer">
          <Image
            alt={`Photo by ${image.author}`}
            src={image.download_url}
            width={image.width}
            height={image.height}
            className="rounded-sm hover:scale-105 transition-transform duration-300"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        </Link>
      </CardContent>
    </Card>
  );
}

export default function ShotDetails() {
  return (
    <div className="flex flex-col gap-8 mx-auto max-w-7xl pb-2">
      {/* 1. Shop Title */}
      <h1 className="text-3xl font-bold">{shopData.title}</h1>

      {/* 2. Owner Info Row */}
      <div className="flex items-center justify-between lg:px-6">
        <div className="flex items-center gap-3">
          <Avatar className="size-12">
            <AvatarImage
              src={shopData.owner.avatar}
              alt={shopData.owner.name}
            />
            <AvatarFallback>
              <User className="size-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{shopData.owner.name}</p>
            <Button variant="link" className="text-sm">
              Follow
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <ThumbsUp className="size-7" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bookmark className="size-7" />
          </Button>
          <Button variant="ghost" size="icon">
            <MessageCircle className="size-7" />
          </Button>
        </div>
      </div>

      {/* 3. Full Size Primary Photo */}

      <Image
        src={shopData.primaryPhoto}
        alt="Primary shop photo"
        width={1200}
        height={800}
        className="w-full h-auto"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      />

      {/* 4. Description */}
      <p className="text-xl font-bold">{shopData.description}</p>

      {/* 5. Masonry Previews */}
      {previewImages.length > 0 && (
        <div className="flex flex-col gap-8">
          <h2 className="text-2xl font-semibold">Preview Shots</h2>
          <MasnoryLayout>
            {previewImages.map((image) => (
              <MasonryImageCard key={image.id} image={image} />
            ))}
          </MasnoryLayout>
        </div>
      )}

      {/* 6. Separator with Owner Profile */}
      <Separator className="my-8" />

      <div className="flex flex-col items-center text-center gap-4">
        <Avatar className="size-24">
          <AvatarImage src={shopData.owner.avatar} alt={shopData.owner.name} />
          <AvatarFallback>
            <User className="size-8" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-semibold">{shopData.owner.name}</h3>
          <p className="text-muted-foreground">{shopData.owner.bio}</p>
        </div>
        <Button variant="outline">View Profile</Button>
      </div>

      {/* 7. More Works Masonry */}
      {previewImages.length > 0 && (
        <div className="flex flex-col gap-8">
          <h2 className="text-2xl font-semibold">
            More from {shopData.owner.name}
          </h2>
          <MasnoryLayout>
            {previewImages.map((image) => (
              <MasonryImageCard key={`more-${image.id}`} image={image} />
            ))}
          </MasnoryLayout>
        </div>
      )}

      {/* 8. You Might Like Section */}
      <Separator className="my-8" />

      <div className="flex flex-col gap-8">
        <h2 className="text-2xl font-semibold">You might like</h2>
        <MasnoryLayout>
          {youMightLikeImages.map((image) => (
            <MasonryImageCard key={`suggested-${image.id}`} image={image} />
          ))}
        </MasnoryLayout>
      </div>
    </div>
  );
}
