import React from "react";

type ButtonVariant = "primary" | "gold" | "outline" | "ghost" | "danger" | "dark";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "ciraaya-btn-primary",
  gold: "ciraaya-btn-gold",
  outline: "ciraaya-btn-outline",
  ghost: "ciraaya-btn-ghost",
  dark: "bg-[#18181B] text-white hover:bg-[#C5A059] border border-[#18181B]",
  danger: "bg-[#C53030] text-white hover:bg-[#9E2424] border border-[#C53030]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "ciraaya-btn-sm",
  md: "px-5 py-2.5 text-xs min-h-[44px]",
  lg: "ciraaya-btn-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={`
        ciraaya-btn
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? "w-full" : ""}
        ${isDisabled ? "opacity-50 cursor-not-allowed !transform-none !shadow-none" : ""}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      )}
      <span className="flex items-center gap-2">{children}</span>
    </button>
  );
}
