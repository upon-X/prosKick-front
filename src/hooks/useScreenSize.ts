"use client";

import { useState, useEffect } from 'react';

export function useScreenSize() {
  const [isMobile, setIsMobile] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const mobile = width < 768; // md breakpoint
      const desktop = width >= 768;
      
      setIsMobile(mobile);
      setIsDesktop(desktop);
    };

    // Check initial size
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return { isMobile, isDesktop };
}
