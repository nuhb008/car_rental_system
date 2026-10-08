import { Suspense } from "react";
import { getBookings } from "@/lib/data";

async function BookingsContent() {
  const bookings = await getBookings();

  return (
    <>
      {bookings.map((booking) => (
        <div key={booking.id}>
          <p>Booking ID: {booking.id}</p>
          <p>Customer: {booking.customerName}</p>
          <p>Email: {booking.customerEmail}</p>
          <p>Car: {booking.carName}</p>
          <p>
            Dates: {booking.startDate} → {booking.endDate}
          </p>
          <p>Amount: ৳{booking.totalAmount}</p>
          <p>Status: {booking.status}</p>

          <hr />
        </div>
      ))}
    </>
  );
}

export default function BookingsPage() {
  return (
    <main>
      <h1>Booking Dashboard</h1>

      <Suspense fallback={<p>Loading bookings...</p>}>
        <BookingsContent />
      </Suspense>
    </main>
  );
}