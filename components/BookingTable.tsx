"use client";

import { useActionState, useState } from "react";
import { armNextBookingFailure,updateBookingStatus } from "@/app/bookings/actions";
import type { Booking, BookingStatus } from "@/lib/types";

type BookingTableProps = {
  bookings: Booking[];
};

function formatAmount(amount: number): string {
  return `৳${amount.toLocaleString("en-BD")}`;
}

function formatDate(date: string): string {
  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusClass(status: BookingStatus): string {
  switch (status) {
    case "Confirmed":
      return "bg-emerald-100 text-emerald-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-amber-100 text-amber-700";
  }
}

export default function BookingTable({
  bookings,
}: BookingTableProps) {
  const [selectedBookingId, setSelectedBookingId] =
  useState<string | null>(null);

  const selectedBooking =
  bookings.find((booking) => booking.id === selectedBookingId) ?? null;

  const [state, formAction, isPending] = useActionState(
  updateBookingStatus,
  { success: false, message: "" }
  );

  function closeModal() {
    setSelectedBookingId(null);
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-5 py-4">Booking ID</th>
              <th className="px-5 py-4">Customer</th>
              <th className="px-5 py-4">Car</th>
              <th className="px-5 py-4">Rental dates</th>
              <th className="px-5 py-4">Amount</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-5 py-4 font-semibold text-gray-900">
                  {booking.id}
                </td>

                <td className="px-5 py-4">
                  <p className="font-medium text-gray-900">
                    {booking.customerName}
                  </p>
                  <p className="mt-1 text-gray-500">
                    {booking.customerEmail}
                  </p>
                </td>

                <td className="px-5 py-4 text-gray-700">
                  {booking.carName}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                  {formatDate(booking.startDate)}
                  <span className="mx-1">–</span>
                  {formatDate(booking.endDate)}
                </td>

                <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-900">
                  {formatAmount(booking.totalAmount)}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => setSelectedBookingId(booking.id)}
                    className="whitespace-nowrap rounded-lg border border-indigo-200 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
                  >
                    View details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {bookings.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="font-medium text-gray-900">
              No bookings found
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or filters.
            </p>
          </div>
        )}
      </div>

      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">
                  Booking ID: {selectedBooking.id}
                </p>
                <h2
                  id="booking-modal-title"
                  className="mt-1 text-xl font-bold text-gray-900"
                >
                  Booking details
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close booking details"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {selectedBooking.customerName}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedBooking.customerEmail}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Car</p>
                  <p className="mt-1 font-medium text-gray-900">
                    {selectedBooking.carName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Total amount</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {formatAmount(selectedBooking.totalAmount)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Start date</p>
                  <p className="mt-1 text-gray-900">
                    {formatDate(selectedBooking.startDate)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">End date</p>
                  <p className="mt-1 text-gray-900">
                    {formatDate(selectedBooking.endDate)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                    selectedBooking.status
                  )}`}
                >
                  {selectedBooking.status}
                </span>
              </div>
              
                  {selectedBooking.status !== "Cancelled" && (
                    <form action={formAction} className="mt-6 space-y-4">
                      <input
                        type="hidden"
                        name="bookingId"
                        value={selectedBooking.id}
                      />

                      {isPending && (
                        <p role="status" className="text-sm text-indigo-600">
                          Saving booking status... Please wait.
                        </p>
                      )}

                      <div>
                        <label
                          htmlFor="cancellationReason"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Cancellation reason
                        </label>

                        <textarea
                          id="cancellationReason"
                          name="cancellationReason"
                          rows={3}
                          maxLength={200}
                          placeholder="Enter a reason if cancelling (10–200 characters)"
                          className="mt-2 w-full rounded-lg border border-gray-300 p-3 text-sm"
                        />

                        <p className="mt-1 text-xs text-gray-500">
                          Required only when cancelling.
                        </p>
                      </div>

                      {state.message && (
                        <p
                          role="status"
                          className={`text-sm ${
                            state.success ? "text-green-700" : "text-red-600"
                          }`}
                        >
                          {state.message}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-3">
                        {selectedBooking.status === "Pending" && (
                          <button
                            type="submit"
                            name="status"
                            value="Confirmed"
                            disabled={isPending}
                            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                          >
                            {isPending ? "Saving..." : "Confirm booking"}
                          </button>
                        )}

                        <button
                          type="submit"
                          name="status"
                          value="Cancelled"
                          disabled={isPending}
                          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                        >
                          {isPending ? "Saving..." : "Cancel booking"}
                        </button>
                      </div>
                    </form>
                  )}

                  {process.env.NODE_ENV === "development" && (
                    <form action={armNextBookingFailure} className="mt-4">
                      <button
                        type="submit"
                        className="rounded-lg border border-amber-300 px-3 py-2 text-sm text-amber-800 hover:bg-amber-50"
                      >
                        Simulate next update failure
                      </button>

                      <p className="mt-1 text-xs text-gray-500">
                        Testing only: the next valid status update will fail once.
                      </p>
                    </form>
                  )}
            </div>

            <div className="mt-7 flex justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}