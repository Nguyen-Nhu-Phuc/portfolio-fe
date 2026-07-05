interface ArrowRightLongProps {
  className?: string;
}

export default function ArrowRightLong({ className = "" }: ArrowRightLongProps) {
  return (
    <svg
      className={className}
      overflow="visible"
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M164 48L244 126.709M244 126.709L164 207M244 126.709H12"
        stroke="currentColor"
        strokeWidth="4"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
