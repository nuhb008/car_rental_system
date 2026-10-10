
import { Suspense } from "react";
import { getBookings } from "@/lib/data";
import BookingTable from "@/components/BookingTable";

function formatAmount(amount: number): string {
  return `৳${amount.toLocaleString("en-BD")}`;
}

async function BookingsContent() {
  const bookings = await getBookings();

  const pendingCount = bookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  const confirmedCount = bookings.filter(
    (booking) => booking.status === "Confirmed"
  ).length;

  const totalBookingValue = bookings.reduce(
    (total, booking) => total + booking.totalAmount,
    0
  );

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Total bookings
          </p>
          <p className="mt-3 text-3xl font-bold text-gray-900">
            {bookings.length}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            All reservations
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Pending bookings
          </p>
          <p className="mt-3 text-3xl font-bold text-amber-600">
            {pendingCount}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Awaiting review
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Confirmed bookings
          </p>
          <p className="mt-3 text-3xl font-bold text-emerald-600">
            {confirmedCount}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Approved reservations
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Total booking value
          </p>
          <p className="mt-3 break-words text-2xl font-bold text-gray-900">
            {formatAmount(totalBookingValue)}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Across all listed bookings
          </p>
        </div>
      </section>

      <section>
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              All bookings
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Review customer reservations and rental details.
            </p>
          </div>

          <p className="text-sm text-gray-500">
            {bookings.length} records
          </p>
        </div>

        <BookingTable bookings={bookings} />
      </section>
    </div>
  );
}

export default function BookingsPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
              DRIVEDESK / ADMIN
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Booking Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
              Manage rental reservations, review customer details,
              and monitor booking statuses in one place.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Booking system
          </div>
        </header>

        <Suspense
          fallback={
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-sm text-gray-500 shadow-sm">
              Loading booking dashboard...
            </div>
          }
        >
          <BookingsContent />
        </Suspense>

        <footer className="mt-8 border-t border-gray-200 pt-5 text-center text-xs text-gray-500">
          DriveDesk Booking Management
        </footer>
      </div>
    </main>
  );
}