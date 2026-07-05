interface BannerProps {
  copy: string;
  size?: "sm" | "md";
  className?: string;
}

export default function Banner({
  copy,
  size = "md",
  className = "",
}: BannerProps) {
  return (
    <div
      className={`banner banner-size-${size}${className ? ` ${className}` : ""}`}
    >
      <div className="banner-background" aria-hidden="true" />
      <p className={`banner-copy banner-copy-size-${size}`}>{copy}</p>
    </div>
  );
}
