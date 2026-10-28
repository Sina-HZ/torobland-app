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
  CategoriesLink?: React.ReactNode;
}

export default async function Header({
  // cities,
  children,
  CategoriesLink,
}: HeaderProps) {
  return (
    <header className="z-50 flex justify-between border-b border-slate-800 bg-slate-950 px-4 text-right">
      <div className="mx-4 flex-2">
        {/* Center: Logo + Search */}
        <div className="my-4 flex flex-1 items-center justify-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
              <span className="text-lg font-bold text-slate-900">ت</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              تربلند
            </span>
          </Link>

          <div className="flex w-full items-center gap-2">
            <Input
              type="text"
              placeholder="جستجو در محصولات..."
              className="h-9 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm text-slate-200 placeholder-slate-500 focus:border-transparent focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
            <Button className="h-9 rounded-lg bg-cyan-600 px-4 text-white transition-colors hover:bg-cyan-500">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1">{children}</div>
        </div>

        {/* Navigation links (left side in RTL) */}
        <nav className="mb-2 hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <Link href="#" className="transition-colors hover:text-white">
            فروشگاه
          </Link>
          {/* <Link href="#" className="transition-colors hover:text-white">
            خودرو و جانMotor
          </Link>
          <Link href="#" className="transition-colors hover:text-white">
            موبایل و تبلت
          </Link>
          <Link href="#" className="transition-colors hover:text-white">
            LECTONICS
          </Link>
          <Link href="#" className="transition-colors hover:text-white">
            خانه و آشپزخانه
          </Link>
          <Link href="#" className="transition-colors hover:text-white">
            แฟชัน
          </Link> */}
          {CategoriesLink}
        </nav>
      </div>
      {/* User actions (right side in RTL) */}
      <div className="mt-4 flex flex-1 items-start justify-end gap-3">
        <Button className="relative p-2 text-slate-300 transition-colors hover:text-white">
          <ShoppingCart />
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-600 text-[10px] font-bold text-white">
            2
          </span>
        </Button>
        <Button className="p-2 text-slate-300 transition-colors hover:text-white">
          <Bell />
        </Button>
        <Button className="p-2 text-slate-300 transition-colors hover:text-white">
          <User />
        </Button>
      </div>
    </header>
  );
}
