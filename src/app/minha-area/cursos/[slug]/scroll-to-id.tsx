"use client";

import { useEffect } from "react";

export function ScrollToId({ id }: { id: string }) {
  useEffect(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [id]);

  return null;
}
