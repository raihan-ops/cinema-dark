import { clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge"

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      rounded: ['rounded-primary'],
    },
  },
})

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
