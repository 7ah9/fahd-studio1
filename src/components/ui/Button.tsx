import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { IconArrow } from "./Icons";

type Variant = "primary" | "ghost";

const base =
  "group relative inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-[15px] font-medium transition-all duration-500 ease-[var(--ease-expo)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-ink shadow-[0_0_0_1px_rgb(156_192_228/0.5),0_10px_40px_-10px_rgb(111_156_203/0.7)] hover:bg-white hover:shadow-[0_0_0_1px_#fff,0_14px_50px_-8px_rgb(156_192_228/0.8)]",
  ghost:
    "glass text-white/90 hover:border-accent/50 hover:bg-white/[0.07] hover:text-white",
};

type CommonProps = {
  variant?: Variant;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
};

export function Button({
  href,
  variant = "primary",
  arrow = false,
  className = "",
  children,
}: CommonProps & { href: string }) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
      {arrow && (
        <IconArrow
          width={18}
          height={18}
          className="transition-transform duration-500 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
        />
      )}
    </Link>
  );
}

export function SubmitButton({
  variant = "primary",
  className = "",
  children,
  ...rest
}: Omit<CommonProps, "arrow"> & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
