import { Navbar } from "@/components/navbar/nav-menue";
import ShotDetails from "@/components/shots/shot-details";

export default function Testing() {
  return (
    <div>
      <Navbar/>
      <div className="pt-24 lg:pt-28 px-3">
        <ShotDetails />
      </div>
    </div>
  );
}
