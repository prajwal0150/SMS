import { useEffect, useState } from "react";
import { animate, useMotionValue, useTransform } from "motion/react";

interface CountUpProps {
  value: number;
  duration?: number;
}

/**
 * Animates a number from 0 up to `value` when mounted.
 * Used on dashboard stat cards for a lively entrance.
 */
const CountUp = ({ value, duration = 1.2 }: CountUpProps) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(count, value, {
      duration,
      ease: "easeOut",
    });

    const unsubscribe = rounded.on("change", (latest) => {
      setDisplay(latest);
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value, count, rounded, duration]);

  return <span>{display}</span>;
};

export default CountUp;
