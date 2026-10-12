
import { Suspense } from "react";
import Link from "next/link";
import { getBookings, getFilteredBookings } from "@/lib/data";
import type { BookingStatus } from "@/lib/types";
import BookingTable from "@/components/BookingTable";
import BookingPagination from "@/components/BookingPagination";

type PageProps = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

function getParam(
  value: string | string[] | undefined
): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function formatAmount(amount: number): string {
  return `৳${amount.toLocaleString("en-BD")}`;
}

async function BookingsContent({ searchParams }: PageProps) {
  const params = await searchParams;

  const search = getParam(params.q);
  const requestedStatus = getParam(params.status);
  const requestedSort = getParam(params.sort);

  const validStatuses: BookingStatus[] = [
    "Pending",
    "Confirmed",
    "Cancelled",
  ];

  const status: BookingStatus | "All" =
    validStatuses.includes(requestedStatus as BookingStatus)
      ? (requestedStatus as BookingStatus)
      : "All";

  const sort =
    requestedSort === "asc" || requestedSort === "desc"
      ? requestedSort
      : "default";

  // All records are used for the summary cards.
  const allBookings = await getBookings();

  // The server applies the selected search, filter, and sort.
  const filteredBookings = await getFilteredBookings({
    search,
    status,
    sort,
  });

  
  
  const pageSize = 5;
  
  // Read the requested page from the URL.
  const requestedPage = Number.parseInt(
  getParam(params.page),
  10
  );
  
  // Invalid or missing page values should start at page 1.
  const safeRequestedPage =
    Number.isFinite(requestedPage) && requestedPage >= 1
      ? requestedPage
      : 1;
  
  // Calculate how many pages the filtered results require.
  const totalPages = Math.ceil(
    filteredBookings.length / pageSize
  );
  
  // Use at least one as the minimum valid page.
  const lastPage = Math.max(1, totalPages);
  
  // If someone requests a page beyond the last page,
  // use the last available page instead.
  const currentPage = Math.min(safeRequestedPage, lastPage);
  
  // Select only the bookings for this page.
  const startIndex = (currentPage - 1) * pageSize;
  
  const bookings = filteredBookings.slice(
    startIndex,
    startIndex + pageSize
  );  
  const pendingCount = allBookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  const confirmedCount = allBookings.filter(
    (booking) => booking.status === "Confirmed"
  ).length;

  const totalBookingValue = allBookings.reduce(
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
            {allBookings.length}
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
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-900">
            All bookings
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Search customers, filter reservation status, and sort by amount.
          </p>
        </div>

        <form
          method="GET"
          action="/bookings"
          className="mb-5 grid grid-cols-1 gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-2 xl:grid-cols-4"
        >
          <div className="xl:col-span-2">
            <label
              htmlFor="q"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Search bookings
            </label>
            <input
              id="q"
              name="q"
              type="search"
              defaultValue={search}
              placeholder="Name, email, or booking ID..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Booking status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={status}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="All">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="sort"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Sort by amount
            </label>
            <select
              id="sort"
              name="sort"
              defaultValue={sort}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="default">Default order</option>
              <option value="asc">Lowest amount first</option>
              <option value="desc">Highest amount first</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-3 md:col-span-2 xl:col-span-4">
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Apply filters
            </button>

            <Link
              href="/bookings"
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Reset
            </Link>

            <p className="text-sm text-gray-500 md:ml-auto">
              {bookings.length} matching booking
              {bookings.length === 1 ? "" : "s"}
            </p>
          </div>
        </form>

        <BookingTable bookings={bookings} />
        <BookingPagination
        currentPage={currentPage}
        totalPages={totalPages}
        search={search}
        status={status}
        sort={sort}
        />
      </section>
    </div>
  );
}

export default function BookingsPage(props: PageProps) {
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
          <BookingsContent searchParams={props.searchParams} />
        </Suspense>

        <footer className="mt-8 border-t border-gray-200 pt-5 text-center text-xs text-gray-500">
          DriveDesk Booking Management
        </footer>
      </div>
    </main>
  );
}