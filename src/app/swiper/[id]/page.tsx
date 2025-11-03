import { VerticalCarousel } from "@/components/swiper/vertical-swiper";

export default async function DynamicSwiper({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="w-full h-full flex justify-center items-center">
      <VerticalCarousel />
    </div>
  );
}
