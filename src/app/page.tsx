import MasonryGrid from "@/components/masonry";
import { Navbar } from "@/components/navbar/nav-menue";

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
