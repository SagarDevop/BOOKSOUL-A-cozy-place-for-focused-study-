import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Phone, MessageCircle, Home } from "lucide-react";

export default function ConfirmBooking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedSeats } = location.state || { selectedSeats: [] };

  const bookingId = Math.floor(100000 + Math.random() * 900000); // dummy booking id
  const bookingDate = new Date().toLocaleString();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black p-6">
      
      {/* Success Header */}
      <div className="text-center mb-8 animate-bounce">
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
        <h1 className="text-3xl font-bold mt-4">Booking Request Submitted 🎉</h1>
        <p className="text-lg mt-2 text-gray-900">
          Thank you for choosing <span className="font-semibold">Chitrakoot Digital Library</span>
        </p>
      </div>

      {/* Booking Details */}
      <div className="w-full max-w-lg bg-gray-100 rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">📖 Booking Details</h2>
        <div className="space-y-2 text-gray-700">
          <p><span className="font-semibold">Booking ID:</span> {bookingId}</p>
          <p><span className="font-semibold">Date & Time:</span> {bookingDate}</p>
          <p>
            <span className="font-semibold">Selected Seats:</span>{" "}
            {selectedSeats.length > 0 ? selectedSeats.join(", ") : "No seats selected"}
          </p>
        </div>
      </div>

      {/* Next Steps */}
      <div className="w-full max-w-lg bg-gray-100 rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">📌 Next Steps</h2>
        <p className="text-gray-700">
          ✅ Please contact the admin to <span className="underline">confirm your booking approval</span>.  
          Until then, your seats remain in <span className="italic">pending status</span>.
        </p>
      </div>

      {/* Contact Admin */}
      <div className="flex gap-4 mb-6">
        <a
          href="tel:+917887263984"
          className="flex items-center gap-2 text-white bg-green-500 hover:bg-green-600 px-5 py-3 rounded-xl font-semibold transition"
        >
          <Phone className="w-5 h-5" /> Call Admin
        </a>
        <a
          href="https://wa.me/917887263984"
          className="flex items-center gap-2 text-white bg-teal-500 hover:bg-teal-600 px-5 py-3 rounded-xl font-semibold transition"
        >
          <MessageCircle className="w-5 h-5" /> WhatsApp
        </a>
      </div>

      
    </div>
  );
}
