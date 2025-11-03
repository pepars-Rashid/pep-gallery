"use client";
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { PicsumImage } from "../masnory/masonry";
import Image from "next/image";
import {
  ArrowLeft,
  MessageCircle,
  MoreVertical,
  Share2,
  ThumbsUp,
  X,
} from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { Comments } from "../common/comments";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "../ui/avatar";
import { SwiperSkelton } from "./swiper-skeleton";
import { Share } from "./share";
import Link from "next/link";

export function DrawerCarousel({
  children,
  trigger,
}: {
  children: React.ReactNode;
  trigger: React.ReactNode;
}) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className="flex flex-col h-fit items-center gap-1 bg-transparent"
        >
          {trigger}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-2">
        <DrawerClose asChild>
          <Button
            variant="outline"
            className="absolute right-4 top-4 rounded-full"
          >
            <X className="size-5" />
          </Button>
        </DrawerClose>
        {children}
      </DrawerContent>
    </Drawer>
  );
}

export function VerticalCarousel({}) {
  const [images, setImages] = React.useState<PicsumImage[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
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
    return <SwiperSkelton />;
  }

  return (
    <Carousel
      opts={{
        skipSnaps: true,
      }}
      orientation="vertical"
      className="w-full max-w-lg h-[90vh] lg:h-[95vh]"
    >
      <Link href={'/'}>
        <Button
          variant="outline"
          className="absolute size-8 top-5 lg:left-12 left-2 z-50"
        >
          <ArrowLeft className="size-6" />
        </Button>
      </Link>
      <CarouselContent className="h-[90vh] lg:h-[95vh]">
        {images.map((image) => (
          <CarouselItem key={image.id} className="h-[90vh] lg:h-[95vh]">
            <div className="h-full">
              <Card className="relative h-full w-full rounded-none p-0 bg-background">
                <CardContent className="flex items-center justify-center h-full p-0">
                  <Image
                    alt={`Photo by ${image.author}`}
                    src={image.download_url}
                    width={image.width}
                    height={image.height}
                    className="max-h-full max-w-full object-contain"
                  />
                </CardContent>
                <div className="absolute right-1 bottom-18 z-20 flex flex-col gap-0">
                  <Button
                    variant="ghost"
                    className="flex flex-col items-center gap-1 h-fit bg-transparent"
                  >
                    <ThumbsUp className="size-7 " />
                    <span className=" text-xs ">123</span>
                  </Button>

                  <DrawerCarousel
                    trigger={
                      <>
                        <MessageCircle className="size-7 " />
                        <span className=" text-xs ">45</span>
                      </>
                    }
                  >
                    <DrawerHeader>
                      <DrawerTitle className="flex">Comments 100</DrawerTitle>
                    </DrawerHeader>
                    <ScrollArea className="h-[360px]">
                      <Comments />
                    </ScrollArea>
                  </DrawerCarousel>

                  <DrawerCarousel
                    trigger={
                      <>
                        <Share2 className="size-7 " />
                        <span className=" text-xs ">Share</span>
                      </>
                    }
                  >
                    <DrawerHeader>
                      <DrawerTitle>Share</DrawerTitle>
                    </DrawerHeader>
                    <Share />
                  </DrawerCarousel>

                  <DrawerCarousel
                    trigger={
                      <>
                        <MoreVertical className="size-7 " />
                      </>
                    }
                  >
                    <DrawerHeader>
                      <DrawerTitle>Move Goal</DrawerTitle>
                      <DrawerDescription>
                        Set your daily activity goal.
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="h-[300px]"></div>
                  </DrawerCarousel>
                </div>
                <div className="absolute flex flex-col gap-1 bottom-5 left-4">
                  <div className="flex gap-2 items-center">
                    <Avatar className="size-9 rounded-lg border flex items-center justify-center bg-black">
                      <AvatarImage
                        src="https://avatar.iran.liara.run/public/15"
                        alt="@evilrabbit"
                      />
                      <AvatarFallback>ER</AvatarFallback>
                    </Avatar>
                    <p>pep</p>
                    <Button variant="outline">Follow</Button>
                  </div>
                  <Link href={`/shots/${image.id}`}>
                    <p className="line-clamp-2 px-2">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Eius quod, accusantium nobis quis ducimus dolor neque
                      laborum! Magni incidunt aperiam, sapiente labore quos quo
                      fuga facilis at, omnis distinctio ducimus?
                    </p>
                  </Link>
                </div>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* <CarouselPrevious />
      <CarouselNext /> */}
    </Carousel>
  );
}
