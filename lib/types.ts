export type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Cancelled";

export type Booking = {
  id: string;
  customerName: string;
  customerEmail: string;
  carName: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: BookingStatus;
  cancellationReason?: string;
};