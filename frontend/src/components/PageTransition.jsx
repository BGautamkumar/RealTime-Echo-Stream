import { useEffect, useState } from "react";
import { memo } from "react";

const PageTransition = memo(({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`
        transition-all duration-200 ease-out
        ${isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-[6px]'
        }
      `}
    >
      {children}
    </div>
  );
});

export default PageTransition;
