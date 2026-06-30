"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="error-page">
      <h1>Something went wrong</h1>
      <p>Please try again or return to the homepage.</p>
      <button type="button" className="btn-primary" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
