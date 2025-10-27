"use client"
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export function MasonrySkelton({styleName}  : {styleName?:{}}) {
  return (
   <Card style={styleName} className="relative">
    <CardContent className="flex flex-col justify-between h-full gap-2">
      <div className="flex gap-2 items-center">
      <Skeleton className="h-12 w-12 rounded-full" />
      <Skeleton className="h-4 w-[250px]" />
      </div>
        <Skeleton className="h-full w-full" />

      </CardContent>
    </Card>
  );
}