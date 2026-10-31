"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCity } from "@/features/location/contexts/city-context";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, MapPin } from "lucide-react";
import { useState } from "react";

export default function LocationSelect() {
  const { cities, selectedCity, setSelectedCity } = useCity();
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full max-w-xs">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger
          aria-label="انتخاب شهر"
          className="flex w-full items-center justify-between rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-200 hover:bg-slate-800 hover:no-underline"
        >
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-cyan-400" aria-hidden="true" />
            <span className="flex flex-col items-start gap-0.5">
              <span>{selectedCity?.name ?? "انتخاب شهر"}</span>
            </span>
          </span>
          <ChevronDown
            className={cn("ms-2 h-4 w-4 text-slate-500 transition-transform", {
              "rotate-180": open,
            })}
            aria-hidden="true"
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="z-100 mt-2 rounded-xl border border-slate-700 bg-slate-900 p-1 shadow-lg">
          {cities.length === 0 && (
            <p className="px-2 py-3 text-xs text-slate-400">شهری پیدا نشد.</p>
          )}

          {cities.length > 0 && (
            <div
              className="max-h-64 space-y-1 overflow-y-auto"
              role="listbox"
              aria-label="شهرها"
            >
              {cities.map((city) => {
                const selected = selectedCity?.id === city.id;
                return (
                  <DropdownMenuItem
                    key={city.id}
                    onClick={() => {
                      setSelectedCity(city);
                      setOpen(false);
                    }}
                    className="h-auto w-full justify-between px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    {city.name}
                    {selected && (
                      <Check
                        className="h-4 w-4 text-cyan-400"
                        aria-hidden="true"
                      />
                    )}
                  </DropdownMenuItem>
                );
              })}
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
