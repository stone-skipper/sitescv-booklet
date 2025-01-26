import { useState, useEffect } from "react";

export const useDesktopDetect = () => {
  const [isDesktop, setIsDesktop] = useState(() => {
    // Check if window is defined (we're in the browser, not server-side)
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024;
    }
    // Default to false if window is not defined
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isDesktop;
};
