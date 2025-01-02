"use client";

import { useEffect, useState } from "react";

export function useIntersectionObserver(
  refs: Record<string, React.RefObject<HTMLElement>>,
  options: IntersectionObserverInit = { threshold: 0.2 }
) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = Object.keys(refs).find(
            (key) => refs[key].current === entry.target
          );
          if (id) setActiveId(id);
        }
      });
    }, options);

    Object.values(refs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [refs, options]);

  return activeId;
}
