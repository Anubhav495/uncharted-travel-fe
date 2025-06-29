"use client";
import React, { useEffect, useRef, useState } from "react"; // Removed useMemo as it's not used
import { MotionValue, motion, useScroll, useTransform } from "framer-motion";
import { cn } from "../../lib/utils.ts";
// Icons for keyboard are no longer needed.

export const MapScrollAnimation = ({
  src,
  showGradient,
  title,
}: {
  src?: string;
  showGradient?: boolean;
  title?: string | React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window && window.innerWidth < 768) {
      setIsMobile(true);
    }
  }, []);

  // These transforms need to be re-evaluated for an unrolling map.
  // For now, we keep them to see the structure, but they will change.
  // `scaleY` will likely control the height of the unrolled map.
  // `rotate` is not suitable for an unrolling map in its current form.
  // Adjusted animation parameters for better initial visibility and unrolling
  const mapHeight = useTransform(scrollYProgress, [0, 0.2, 0.6, 1], [0.05, 0.6, 1, 1]); // Starts 5% visible, mostly unrolls by 60%
  const mapTranslateY = useTransform(scrollYProgress, [0, 0.2], [0, 0]); // Keep it pinned at the top initially
  const mapScale = useTransform(scrollYProgress, [0, 0.3], [1, isMobile ? 1.1 : 1.2]); // Start at 100% scale, then slightly grow

  const textInitialY = -30; // Adjust to position title correctly above the map
  const textTransform = useTransform(scrollYProgress, [0, 0.15, 0.3], [textInitialY, textInitialY, textInitialY + 50]); // Title moves down slightly later
  const textOpacity = useTransform(scrollYProgress, [0, 0.15, 0.25], [1, 1, 0]); // Title stays visible longer, then fades

  return (
    <div
      ref={ref}
      // Adjusted scaling, min-height and padding for better initial view
      className="flex min-h-[200vh] shrink-0 scale-[0.6] transform flex-col items-center justify-start py-0 [perspective:800px] sm:scale-[0.7] md:scale-100 md:py-20"
    >
      <motion.h2
        style={{
          translateY: textTransform,
          opacity: textOpacity,
        }}
        className="mb-8 text-center text-3xl font-bold text-neutral-800 dark:text-white" // Adjusted margin
      >
        {title}
      </motion.h2>
      <ScrollPaper
        src={src}
        // Pass new animation values
        mapHeight={mapHeight}
        mapTranslateY={mapTranslateY}
        mapScale={mapScale}
      />
      {showGradient && (
        <div className="absolute inset-x-0 bottom-0 z-50 h-40 w-full bg-gradient-to-t from-white via-white to-transparent dark:from-black dark:via-black"></div>
      )}
    </div>
  );
};

export const ScrollPaper = ({
  mapHeight,
  mapTranslateY,
  mapScale,
  src,
}: {
  mapHeight: MotionValue<number>;
  mapTranslateY: MotionValue<number>;
  mapScale: MotionValue<number>;
  src?: string;
}) => {
  const animatedHeight = useTransform(mapHeight, (val) => `${val * 100}%`);

  return (
    // Container for the scroll and its "rolled" top part
    <motion.div 
      // Adjusted size to be slightly smaller to account for initial scaling
      className="relative w-[24rem] h-[32rem] md:w-[28rem] md:h-[36rem]" 
      style={{ scale: mapScale }}
    >
      {/* Static "Rolled Top" visual - slightly smaller */}
      <div className="absolute top-0 left-1/2 z-10 h-8 w-full -translate-x-1/2 transform rounded-t-md bg-yellow-700 p-1 shadow-md dark:bg-yellow-800 md:h-10">
        <div className="h-full w-full rounded-t-sm bg-yellow-600 dark:bg-yellow-700 flex items-center justify-center text-xs text-white/70">
          {/* Optional: could add wood texture or end caps */}
        </div>
      </div>

      {/* Unfurling Paper content */}
      <motion.div
        style={{
          height: animatedHeight, // Animate height from 0% to 100%
          translateY: mapTranslateY, // Using the new mapTranslateY
          transformOrigin: "top",
          overflow: "hidden",
        }}
        className="absolute top-8 md:top-10 left-0 w-full bg-yellow-50 shadow-xl dark:bg-neutral-200 rounded-b-md" // Positioned below the "roll"
      >
        {/* Inner div for background color and image */}
        <div className="absolute inset-0">
          {src ? (
            <img
              src={src}
              alt="Map content"
              className="h-full w-full object-cover object-top" // object-top to show top of map first
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-neutral-500">Map image not available</span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
