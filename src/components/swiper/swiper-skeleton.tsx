"use client";

import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function SwiperSkelton({ styleName }: { styleName?: object }) {
  return (
    <Card style={styleName} className="relative h-[90vh] bg-background border-0">
      <CardContent className="flex flex-col justify-between h-full gap-2">
        <Skeleton className="h-full w-full" />
        <div className="flex gap-2 items-center">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-[250px]" />
        </div>
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[250px]" />
        </div>
      </CardContent>
    </Card>
  );
}
