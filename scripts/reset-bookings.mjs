import { copyFile } from "node:fs/promises";

await copyFile(
  "data/bookings.seed.json",
  "data/bookings.json"
);

console.log("Booking data restored to the original seed.");