import { Navbar } from "@/components/navbar/nav-menue";
import { SearchBar } from "@/components/search-bar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <Navbar/>
      <main className="flex flex-col w-full row-start-2 items-center sm:items-start">
        <SearchBar/>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        
      </footer>
    </div>
  );
}
