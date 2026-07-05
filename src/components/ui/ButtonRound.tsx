import { type ButtonHTMLAttributes, type ReactNode } from "react";

interface ButtonRoundProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "accent" | "border";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  as?: "button" | "div";
}

export default function ButtonRound({
  variant = "accent",
  size = "md",
  children,
  className = "",
  as = "button",
  ...props
}: ButtonRoundProps) {
  const classes = `button-round button-round--${variant} button-round--${size}${className ? ` ${className}` : ""}`;

  if (as === "div") {
    return <div className={classes}>{children}</div>;
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
