import Link from "next/link";

export default function NotFound() {
  return (
    <main className="error-page">
      <h1>404</h1>
      <p>Page not found.</p>
      <Link href="/en/about" className="btn-primary">
        Back to home
      </Link>
    </main>
  );
}
