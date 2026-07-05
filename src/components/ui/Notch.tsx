interface NotchProps {
  className?: string;
}

export default function Notch({ className = "" }: NotchProps) {
  return (
    <div className={`notch-element${className ? ` ${className}` : ""}`} aria-hidden="true">
      <svg viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0 256H256C114.616 256 0 141.385 0 0V256Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
