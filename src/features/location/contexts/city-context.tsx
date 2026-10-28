"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { City } from "../types/types";
import { useCities } from "../hooks/location-hooks";

interface CityContextValue {
  cities: City[];
  selectedCity: City | undefined;
  setSelectedCity: (city: City) => void;
}

const CityContext = createContext<CityContextValue | undefined>(undefined);

export function CityProvider({
  children,
  initialCity,
}: {
  children: ReactNode;
  initialCity?: City;
}) {
  const { data } = useCities();
  const cities = useMemo(() => data?.items ?? [], [data?.items]);
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
