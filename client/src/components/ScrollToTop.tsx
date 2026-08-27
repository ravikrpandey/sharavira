import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Moves newly opened internal pages to their beginning, including pages opened from the mobile footer. */
export function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, search]);

  return null;
}
