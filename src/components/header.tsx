import Link from "next/link";
import { Search, ShoppingCart, User, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  // cities: City[];
  // selectedCity?: City;
  // citiesLoading?: boolean;
  // citiesError?: string;
  children?: React.ReactNode;
  // onCityChange: (city: City) => void;
}

export default async function Header({
  // cities,
  children,
}: HeaderProps) {
  return (
    <header className=" bg-slate-950 border-b border-slate-800 z-50 flex justify-between px-4 text-right">
      <div className="mx-4 flex-2">
        {/* Center: Logo + Search */}
        <div className="flex items-center gap-4 flex-1 justify-center my-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-slate-900 font-bold text-lg">ت</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              تربلند
            </span>
          </Link>

          <div className="flex items-center gap-2 w-full ">
            <Input
              type="text"
              placeholder="جستجو در محصولات..."
              className="w-full h-9 bg-slate-900 border border-slate-700 rounded-lg px-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-500"
            />
            <Button className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 h-9 rounded-lg transition-colors">
              <Search className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1">{children}</div>
        </div>

        {/* Navigation links (left side in RTL) */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300 mb-2">
          <Link href="#" className="hover:text-white transition-colors">
            فروشگاه
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            خودرو و جانMotor
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            موبایل و تبلت
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            LECTONICS
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            خانه و آشپزخانه
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            แฟชัน
          </Link>
        </nav>
      </div>
      {/* User actions (right side in RTL) */}
      <div className="flex flex-1 items-start gap-3 justify-end mt-4">
        <Button className="relative p-2 text-slate-300 hover:text-white transition-colors">
          <ShoppingCart />
          <span className="absolute top-1 right-1 bg-cyan-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
            2
          </span>
        </Button>
        <Button className="p-2 text-slate-300 hover:text-white transition-colors">
          <Bell />
        </Button>
        <Button className="p-2 text-slate-300 hover:text-white transition-colors">
          <User />
        </Button>
      </div>
    </header>
  );
}
