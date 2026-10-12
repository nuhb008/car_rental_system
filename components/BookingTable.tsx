
"use client";

import { useState } from "react";
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
  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);

  function closeModal() {
    setSelectedBooking(null);
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
                    onClick={() => setSelectedBooking(booking)}
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