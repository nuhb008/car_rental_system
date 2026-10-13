
"use client";

type BookingErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function BookingError({
  error,
  reset,
}: BookingErrorProps) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <section className="rounded-xl border border-red-200 bg-white p-6">
        <h2 className="text-xl font-bold text-gray-900">
          Unable to load bookings
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          Something went wrong while loading the dashboard.
          Please try again.
        </p>

        {process.env.NODE_ENV === "development" && (
          <p className="mt-3 break-words text-sm text-red-600">
            {error.message}
          </p>
        )}

        <button
          type="button"
          onClick={reset}
          className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Try again
        </button>
      </section>
    </main>
  );
}