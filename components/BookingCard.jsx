// components/BookingCard.jsx
import React from "react";
import Card from "./Card";
import Button from "./Button";

const BookingCard = ({ booking, onCancel, isOwner = false }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const rentalDate = new Date(booking.rentalDate).toLocaleDateString();
  const returnDate = new Date(booking.returnDate).toLocaleDateString();

  return (
    <Card>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold">
            {booking.serviceId?.name}
          </h3>
          <p className="text-gray-600">Booking by: {booking.userName}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
            booking.status
          )}`}
        >
          {booking.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Rental Date</p>
          <p className="font-semibold">{rentalDate}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Return Date</p>
          <p className="font-semibold">{returnDate}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Phone</p>
          <p className="font-semibold">{booking.phoneNumber}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Quantity</p>
          <p className="font-semibold">{booking.quantity} unit(s)</p>
        </div>
      </div>

      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">Total Price</p>
        <p className="text-2xl font-bold text-blue-600">
          ฿{booking.totalPrice}
        </p>
      </div>

      {booking.notes && (
        <div className="mb-4">
          <p className="text-sm text-gray-500">Notes</p>
          <p className="text-gray-700">{booking.notes}</p>
        </div>
      )}

      {booking.status === "pending" && !isOwner && (
        <Button
          variant="danger"
          className="w-full"
          onClick={() => onCancel(booking._id)}
        >
          Cancel Booking
        </Button>
      )}
    </Card>
  );
};

export default BookingCard;
