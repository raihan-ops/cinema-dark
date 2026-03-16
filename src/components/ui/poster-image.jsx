import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function PosterImage({
  src,
  alt,
  className,
  fallbackClassName,
  iconSize = 36,
  showLabel = true,
  ...rest
}) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center gap-1.5 bg-surface-card",
          fallbackClassName,
        )}
      >
        <ImageOff
          size={iconSize}
          className="text-text-muted opacity-40"
          strokeWidth={1.5}
        />
        {showLabel && (
          <span className="text-[10px] font-medium uppercase tracking-widest text-text-muted opacity-40">
            No Image
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
      {...rest}
    />
  );
}
