//read json
import { promises as fs } from "fs";
import path from "path";
import type { Booking } from "./types";
const bookingsFile = path.join(
  process.cwd(),
  "data",
  "bookings.json"
);

export async function getBookings(): Promise<Booking[]> {
  const file = await fs.readFile(bookingsFile, "utf-8");

  return JSON.parse(file) as Booking[];
}