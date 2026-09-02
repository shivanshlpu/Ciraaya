/* ─── Skeleton Loader ─────────────────────────────── */
/* Gold-shimmer skeleton per spec §2.3 */

interface SkeletonProps {
  className?: string;
  variant?: "rect" | "circle" | "text";
  width?: string;
  height?: string;
  count?: number;
}

export function Skeleton({
  className = "",
  variant = "rect",
  width,
  height,
  count = 1,
}: SkeletonProps) {
  const baseClasses = `
    bg-gradient-to-r from-cream via-gold-light/30 to-cream
    bg-[length:200%_100%] animate-shimmer rounded
  `;

  const variantClasses = {
    rect: "rounded-lg",
    circle: "rounded-full",
    text: "rounded h-4",
  };

  const style = {
    width: width || (variant === "circle" ? "40px" : "100%"),
    height:
      height ||
      (variant === "circle" ? "40px" : variant === "text" ? "16px" : "200px"),
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${baseClasses} ${variantClasses[variant]} ${className}`}
          style={style}
          aria-hidden="true"
        />
      ))}
    </>
  );
}

/* ─── Product Card Skeleton ───────────────────────── */
export function ProductCardSkeleton() {
  return (
    <div className="bg-surface rounded-xl overflow-hidden">
      <Skeleton height="280px" className="!rounded-b-none" />
      <div className="p-4 space-y-3">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="80%" />
        <div className="flex gap-3">
          <Skeleton variant="text" width="30%" />
          <Skeleton variant="text" width="25%" />
        </div>
      </div>
    </div>
  );
}

/* ─── Product Grid Skeleton ───────────────────────── */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export const SkeletonProductGrid = ProductGridSkeleton;

