import Link from "next/link";

export default async function CategoryShots({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  return (
    <>
     category shots: {category}
     <Link href={'/shots/cacoci'}>cacoci</Link>
    </>
  );
}