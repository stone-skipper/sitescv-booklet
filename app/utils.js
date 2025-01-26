import { useState, useEffect } from "react";

export const useDesktopDetect = () => {
  const [isDesktop, setIsDesktop] = useState(
    window ? window.innerWidth >= 1024 : false
  );

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
