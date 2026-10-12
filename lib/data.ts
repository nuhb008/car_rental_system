//read json

import { promises as fs } from "fs";
import path from "path";
import type { Booking, BookingStatus } from "./types";

const bookingsFile = path.join(
  process.cwd(),
  "data",
  "bookings.json"
);

export type BookingSort = "default" | "asc" | "desc";

export type BookingQuery = {
  search?: string;
  status?: BookingStatus | "All";
  sort?: BookingSort;
};

export async function getBookings(): Promise<Booking[]> {
  const file = await fs.readFile(bookingsFile, "utf-8");

  return JSON.parse(file) as Booking[];
}

export async function getFilteredBookings(
  query: BookingQuery = {}
): Promise<Booking[]> {
  const allBookings = await getBookings();

  //  Prepare the search text
  const searchText = (query.search ?? "").trim().toLowerCase();

  //  Search by booking ID, customer name, or email
  let results = allBookings.filter((booking) => {
    if (!searchText) {
      return true;
    }

    return (
      booking.id.toLowerCase().includes(searchText) ||
      booking.customerName.toLowerCase().includes(searchText) ||
      booking.customerEmail.toLowerCase().includes(searchText)
    );
  });

  // Filter by booking status
  if (
    query.status &&
    query.status !== "All"
  ) {
    results = results.filter(
      (booking) => booking.status === query.status
    );
  }

  // 4. Sort by total amount.
  if (query.sort === "asc") {
    results.sort(
      (a, b) =>
        a.totalAmount - b.totalAmount ||
        a.id.localeCompare(b.id)
    );
  } else if (query.sort === "desc") {
    results.sort(
      (a, b) =>
        b.totalAmount - a.totalAmount ||
        a.id.localeCompare(b.id)
    );
  }

  return results;
}