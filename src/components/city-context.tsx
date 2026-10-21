"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { City } from "@/lib/api/cities";

interface CityContextValue {
  cities: City[];
  selectedCity: City | undefined;
  setSelectedCity: (city: City) => void;
}

const CityContext = createContext<CityContextValue | undefined>(undefined);

export function CityProvider({
  children,
  cities,
  initialCity,
}: {
  children: ReactNode;
  cities: City[];
  initialCity?: City;
}) {
  const [selectedCity, setSelectedCity] = useState<City | undefined>(
    initialCity,
  );

  const value = useMemo(
    () => ({ cities, selectedCity, setSelectedCity }),
    [cities, selectedCity],
  );

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
}

export function useCity(): CityContextValue {
  const context = useContext(CityContext);
  if (context === undefined) {
    throw new Error("useCity must be used within a <CityProvider>");
  }
  return context;
}
