
export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <div
        role="status"
        className="rounded-xl border border-gray-200 bg-white p-8"
      >
        <p className="font-semibold text-gray-900">
          Loading booking dashboard...
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Please wait while your bookings are loaded.
        </p>
      </div>
    </main>
  );
}