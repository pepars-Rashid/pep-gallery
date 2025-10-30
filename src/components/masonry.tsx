// components/MasonryGrid.tsx
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Bookmark, Heart, Share2 } from "lucide-react";
import { MasnoryLayout } from "./masnory-layout";
import { MasonrySkelton } from "./masonry-skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";

export interface PicsumImage {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

export default function MasonryGrid() {
  const [images, setImages] = useState<PicsumImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);

        // Add fake loading delay
        await new Promise((resolve) => setTimeout(resolve, 5 * 1000));

        const response = [
          {
            id: "80",
            author: "Sonja Langford",
            width: 3888,
            height: 2592,
            url: "https://unsplash.com/photos/Y2PYfopoz-k",
            download_url: "https://picsum.photos/id/80/3888/2592",
          },
          {
            id: "81",
            author: "Sander Weeteling",
            width: 5000,
            height: 3250,
            url: "https://unsplash.com/photos/rlxZqmc6D_I",
            download_url: "https://picsum.photos/id/81/5000/3250",
          },
          {
            id: "82",
            author: "Rula Sibai",
            width: 1500,
            height: 997,
            url: "https://unsplash.com/photos/-vq7mi4oF0s",
            download_url: "https://picsum.photos/id/82/1500/997",
          },
          {
            id: "83",
            author: "Julie Geiger",
            width: 2560,
            height: 1920,
            url: "https://unsplash.com/photos/dYshDcTI1Js",
            download_url: "https://picsum.photos/id/83/2560/1920",
          },
          {
            id: "84",
            author: "Johnny Lam",
            width: 1280,
            height: 848,
            url: "https://unsplash.com/photos/63qfL0TciY8",
            download_url: "https://picsum.photos/id/84/1280/848",
          },
          {
            id: "85",
            author: "Gozha Net",
            width: 1280,
            height: 774,
            url: "https://unsplash.com/photos/xDrxJCdedcI",
            download_url: "https://picsum.photos/id/85/1280/774",
          },
          {
            id: "87",
            author: "Barcelona",
            width: 1280,
            height: 960,
            url: "https://unsplash.com/photos/o697BgRH_-M",
            download_url: "https://picsum.photos/id/87/1280/960",
          },
          {
            id: "88",
            author: "Barcelona",
            width: 1280,
            height: 1707,
            url: "https://unsplash.com/photos/muC_6gTMLR4",
            download_url: "https://picsum.photos/id/88/1280/1707",
          },
          {
            id: "89",
            author: "Vectorbeast",
            width: 4608,
            height: 2592,
            url: "https://unsplash.com/photos/rsJtMXn3p_c",
            download_url: "https://picsum.photos/id/89/4608/2592",
          },
          {
            id: "90",
            author: "Rula Sibai",
            width: 3000,
            height: 1992,
            url: "https://unsplash.com/photos/qVj3KuEikvg",
            download_url: "https://picsum.photos/id/90/3000/1992",
          },
          {
            id: "91",
            author: "Jennifer Trovato",
            width: 3504,
            height: 2336,
            url: "https://unsplash.com/photos/baRYCsjO6z4",
            download_url: "https://picsum.photos/id/91/3504/2336",
          },
          {
            id: "92",
            author: "Rafael Souza",
            width: 3568,
            height: 2368,
            url: "https://unsplash.com/photos/QxkBP3A9XmU",
            download_url: "https://picsum.photos/id/92/3568/2368",
          },
          {
            id: "93",
            author: "Caroline Sada",
            width: 2000,
            height: 1334,
            url: "https://unsplash.com/photos/r1XwWjI4PyE",
            download_url: "https://picsum.photos/id/93/2000/1334",
          },
          {
            id: "94",
            author: "Jean Kleisz",
            width: 2133,
            height: 1200,
            url: "https://unsplash.com/photos/4yzPVohNuVI",
            download_url: "https://picsum.photos/id/94/2133/1200",
          },
          {
            id: "95",
            author: "Kundan Ramisetti",
            width: 2048,
            height: 2048,
            url: "https://unsplash.com/photos/87TJNWkepvI",
            download_url: "https://picsum.photos/id/95/2048/2048",
          },
          {
            id: "96",
            author: "Pawel Kadysz",
            width: 4752,
            height: 3168,
            url: "https://unsplash.com/photos/CuFYW1c97w8",
            download_url: "https://picsum.photos/id/96/4752/3168",
          },
        ];

        const data: PicsumImage[] = response;
        setImages(data);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (isLoading) {
    return (
      <div>
        <MasnoryLayout>
          {[
            { width: 700, height: 500 },
            { width: 600, height: 400 },
            { width: 400, height: 300 },
            { width: 2200, height: 700 },
            { width: 1800, height: 900 },
            { width: 800, height: 800 },
          ].map((size, index) => (
            <MasonrySkelton
              styleName={{
                width: `${size.width}px`,
                height: `${size.height}px`,
              }}
              key={index}
            />
          ))}
        </MasnoryLayout>
      </div>
    );
  }

  return (
    <div>
      <MasnoryLayout>
        {images.map((image) => (
          <Card className="p-1 relative" key={image.id}>
            <CardContent className="p-1">
              <Link href={"swiper"} target="_blank" rel="noopener noreferrer">
                <Image
                  alt={`Photo by ${image.author}`}
                  src={image.download_url}
                  width={image.width}
                  height={image.height}
                  className="rounded-sm hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="absolute top-5 left-5 flex items-center gap-3">
                <Link href={`/profile/${image.author}`}>
                  <Avatar className="size-10 rounded-lg border flex items-center justify-center bg-black">
                    <AvatarImage
                      src="https://avatar.iran.liara.run/public/15"
                      alt="@evilrabbit"
                    />
                    <AvatarFallback>ER</AvatarFallback>
                  </Avatar>
                </Link>
                <Link href={`/profile/${image.author}`}>
                  <span className="text-sm font-medium text-white drop-shadow-md">
                    {image.author}
                  </span>
                </Link>
              </div>
              <div className="absolute bottom-5 right-5 flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </MasnoryLayout>
    </div>
  );
}
