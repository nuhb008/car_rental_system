
"use server";

import { promises as fs } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import type { Booking, BookingStatus } from "@/lib/types";

type ActionState = {
  success: boolean;
  message: string;
};
let failNextUpdate = false;
const bookingsFile = path.join(
  process.cwd(),
  "data",
  "bookings.json"
);
export async function armNextBookingFailure() {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  failNextUpdate = true;
}

export async function updateBookingStatus(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const bookingId = String(
    formData.get("bookingId") ?? ""
  ).trim();

  const requestedStatus = formData.get("status");

  const cancellationReason = String(
    formData.get("cancellationReason") ?? ""
  ).trim();

  if (!bookingId) {
    return { success: false, message: "Booking ID is required." };
  }

  if (
    requestedStatus !== "Confirmed" &&
    requestedStatus !== "Cancelled"
  ) {
    return { success: false, message: "Invalid status selected." };
  }

  if (
    requestedStatus === "Cancelled" &&
    (cancellationReason.length < 10 ||
      cancellationReason.length > 200)
  ) {
    return {
      success: false,
      message: "Cancellation reason must be 10–200 characters.",
    };
  }

  try {
    const file = await fs.readFile(bookingsFile, "utf-8");
    const bookings = JSON.parse(file) as Booking[];

    const bookingIndex = bookings.findIndex(
      (booking) => booking.id === bookingId
    );

    if (bookingIndex === -1) {
      return { success: false, message: "Booking not found." };
    }

    const booking = bookings[bookingIndex];

    const allowedTransition =
      (booking.status === "Pending" &&
        (requestedStatus === "Confirmed" ||
          requestedStatus === "Cancelled")) ||
      (booking.status === "Confirmed" &&
        requestedStatus === "Cancelled");

    if (!allowedTransition) {
      return {
        success: false,
        message: `Cannot change ${booking.status} to ${requestedStatus}.`,
      };
    }

    const updatedBooking: Booking = {
      ...booking,
      status: requestedStatus as BookingStatus,
      ...(requestedStatus === "Cancelled"
        ? { cancellationReason }
        : {}),
    };

    bookings[bookingIndex] = updatedBooking;

    // Simulate a one-time server failure in development.
    await new Promise((resolve) => setTimeout(resolve, 700));

    if (
    process.env.NODE_ENV === "development" &&
    failNextUpdate
    ) {
    failNextUpdate = false;

    return {
        success: false,
        message: "Simulated failure: the booking was not saved. Please try again.",
    };
    }

    await fs.writeFile(
      bookingsFile,
      JSON.stringify(bookings, null, 2),
      "utf-8"
    );

    revalidatePath("/bookings");

    return {
      success: true,
      message: `Booking ${bookingId} updated to ${requestedStatus}.`,
    };
  } catch {
    return {
      success: false,
      message: "Unable to update the booking. Please try again.",
    };
  }
}