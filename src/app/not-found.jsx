import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <div className="not-found">
        <h1 className="not-found-title">404 - Not Found</h1>
        <Link className="not-found-link" href="/music/main">
          На главную страницу
        </Link>
      </div>
    </>
  );
}
