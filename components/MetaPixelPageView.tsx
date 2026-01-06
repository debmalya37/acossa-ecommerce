"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export default function MetaPixelPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!window.fbq) return;

    const url =
    pathname + (searchParams?.toString() ? `?${searchParams}` : "");

    // 🔥 Track SPA route change
        window.fbq("track", "PageView", {
        page_path: url,
        });
    }, [pathname, searchParams]);

  return null;
}
