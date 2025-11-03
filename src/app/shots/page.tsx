import MasonryGrid from "@/components/masnory/masonry";
import { Navbar } from "@/components/navbar/nav-menue";

export default function Shots() {
  return (
    <div>
      <Navbar />
      <div className="pt-24 lg:pt-28 px-3">
        <MasonryGrid />
      </div>
    </div>
  );
}
