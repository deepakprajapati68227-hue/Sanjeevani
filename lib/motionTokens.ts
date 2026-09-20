import { Variants, Transition } from "framer-motion";

/**
 * Sanjeevani Centralized Motion Tokens (Section 12 of Design Prompt)
 * Quiet, purposeful, accessible animation system.
 */

export const motionFast: Transition = {
  duration: 0.12,
  ease: "easeOut",
};

export const motionStandard: Transition = {
  duration: 0.22,
  ease: [0.16, 1, 0.3, 1], // ease-out
};

export const motionEmphasis: Transition = {
  duration: 0.35,
  ease: [0.16, 1, 0.3, 1],
};

export const motionSpring: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 28,
};

export const motionStaggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const pageEnterVariant: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: motionStandard },
  exit: { opacity: 0, y: -6, transition: motionFast },
};

export const cardStaggerItem: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: motionStandard },
};

export const drawerVariant: Variants = {
  initial: { x: "100%", opacity: 0.9 },
  animate: { x: 0, opacity: 1, transition: motionEmphasis },
  exit: { x: "100%", opacity: 0.9, transition: motionFast },
};

export const tabCrossfadeVariant: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.18, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.1, ease: "easeIn" } },
};

export const statusChangeVariant: Variants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: motionFast },
};

export const singlePulseRing: Variants = {
  initial: { scale: 1, opacity: 0.8 },
  animate: {
    scale: 1.25,
    opacity: 0,
    transition: { duration: 1.5, ease: "easeOut", repeat: 0 },
  },
};
