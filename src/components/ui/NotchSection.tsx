export type NotchFrom =
  | "parchment"
  | "light"
  | "dark"
  | "dark-2"
  | "dark-3"
  | "canvas";

interface NotchSectionProps {
  className?: string;
  flip?: boolean;
  from?: NotchFrom;
}

function Notch({ flip = false }: { flip?: boolean }) {
  return (
    <div
      className={`notch${flip ? " notch--flip" : ""}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0 256H256C114.616 256 0 141.385 0 0V256Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

export default function NotchSection({
  className = "",
  flip = false,
  from = "parchment",
}: NotchSectionProps) {
  return (
    <div
      className={`notch-section notch-section--from-${from}${className ? ` ${className}` : ""}`}
    >
      <Notch />
      <Notch flip />
    </div>
  );
}
