"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import defaultSiteData from "@/data/site.data.json";

export type SiteData = typeof defaultSiteData;

const SiteDataContext = createContext<SiteData>(defaultSiteData);

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [siteData, setSiteData] = useState<SiteData>(defaultSiteData);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/site-data", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load site data.");
        }
        return response.json();
      })
      .then((data: SiteData) => setSiteData(data))
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error("[SiteDataProvider] using bundled site data:", error);
      });

    return () => controller.abort();
  }, []);

  const value = useMemo(() => siteData, [siteData]);

  return (
    <SiteDataContext.Provider value={value}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  return useContext(SiteDataContext);
}
