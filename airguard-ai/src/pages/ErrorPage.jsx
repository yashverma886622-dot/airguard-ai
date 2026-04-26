import { Link, useRouteError } from 'react-router-dom';
import ErrorComponent from '../components/ErrorComponent';

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="mx-auto max-w-3xl">
      <ErrorComponent
        title="Page unavailable"
        message={error?.statusText || error?.message || 'The page you requested could not be found.'}
      />
      <div className="mt-5 text-center">
        <Link className="focus-ring inline-flex rounded-lg bg-sea px-4 py-2 text-sm font-bold text-white" to="/">
          Return Home
        </Link>
      </div>
    </div>
  );
}
