"use client"
import dynamic from 'next/dynamic';

const ResponsiveMasonry = dynamic(
  () => import('react-responsive-masonry').then(mod => mod.ResponsiveMasonry),
  { ssr: false }
);

const Masonry = dynamic(
  () => import('react-responsive-masonry'),
  { ssr: false }
);

export function MasnoryLayout({ children }: { children: React.ReactNode }) {
  const columnsCountBreakPoints = {
    350: 1,
    800: 2,
    1200: 3,
  };
  
  return (
    <ResponsiveMasonry columnsCountBreakPoints={columnsCountBreakPoints}>
      <Masonry>
        {children}
      </Masonry>
    </ResponsiveMasonry>
  );
}
