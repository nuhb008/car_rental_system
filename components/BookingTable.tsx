
import type { Booking, BookingStatus } from "@/lib/types";

type BookingTableProps = {
  bookings: Booking[];
};

const statusStyles: Record<BookingStatus, string> = {
  Pending: "bg-amber-50 text-amber-700 ring-amber-200",
  Confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Cancelled: "bg-rose-50 text-rose-700 ring-rose-200",
};

function formatDate(date: string): string {
  const parsedDate = new Date(`${date}T00:00:00`);

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function formatAmount(amount: number): string {
  return `৳${amount.toLocaleString("en-BD")}`;
}

export default function BookingTable({
  bookings,
}: BookingTableProps) {
  if (bookings.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
        <p className="text-lg font-semibold text-gray-800">
          No bookings found
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Bookings will appear here when they are available.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] border-collapse text-left">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Booking
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Customer
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Car
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Rental period
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Total amount
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                className="transition-colors hover:bg-gray-50"
              >
                <td className="whitespace-nowrap px-5 py-4">
                  <span className="font-semibold text-gray-900">
                    {booking.id}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <p className="font-medium text-gray-900">
                    {booking.customerName}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {booking.customerEmail}
                  </p>
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-700">
                  {booking.carName}
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  <p className="text-sm text-gray-800">
                    {formatDate(booking.startDate)}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    to {formatDate(booking.endDate)}
                  </p>
                </td>

                <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-900">
                  {formatAmount(booking.totalAmount)}
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                      statusStyles[booking.status]
                    }`}
                  >
                    <span
                      className={`mr-2 h-1.5 w-1.5 rounded-full ${
                        booking.status === "Pending"
                          ? "bg-amber-500"
                          : booking.status === "Confirmed"
                            ? "bg-emerald-500"
                            : "bg-rose-500"
                      }`}
                    />
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-gray-200 px-5 py-3 text-sm text-gray-500">
        Showing {bookings.length} booking
        {bookings.length === 1 ? "" : "s"}
      </div>
    </div>
  );
}