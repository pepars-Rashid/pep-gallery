import MasonryGrid from "@/components/masonry";
import { MasonrySkelton } from "@/components/masonry-skelton";
import { Navbar } from "@/components/navbar/nav-menue";
import { SearchBar } from "@/components/search-bar";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Navbar/>
      <div className="pt-24 lg:pt-28 px-6">
        <MasonryGrid />
      </div>
    </div>
  );
}
