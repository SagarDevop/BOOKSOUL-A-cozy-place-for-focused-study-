import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Phone, MessageCircle, Home } from "lucide-react";

export default function ConfirmBooking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedSeats } = location.state || { selectedSeats: [] };

  const bookingId = Math.floor(100000 + Math.random() * 900000);
  const bookingDate = new Date().toLocaleString();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      
      {/* Success Header */}
      <div className="text-center mb-12 animate-pulse">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
        <h1 className="text-4xl font-bold mt-4 text-gray-800">Booking Request Submitted 🎉</h1>
        <p className="text-lg mt-2 text-gray-600">
          Thank you for choosing <span className="font-semibold text-gray-900">Chitrakoot Digital Library</span>
        </p>
      </div>

      {/* Booking Details */}
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg p-6 mb-12 border-l-4 border-green-500">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">📖 Booking Details</h2>
        <div className="space-y-2 text-gray-700">
          <p><span className="font-semibold">Booking ID:</span> {bookingId}</p>
          <p><span className="font-semibold">Date & Time:</span> {bookingDate}</p>
          <p>
            <span className="font-semibold">Selected Seats:</span>{" "}
            {selectedSeats.length > 0 ? selectedSeats.join(", ") : "No seats selected"}
          </p>
        </div>
      </div>

      {/* Premium Next Steps Timeline */}
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg p-6 mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">📝 Your Booking Progress</h2>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 w-1 h-full bg-gray-200"></div>

          {/* Steps */}
          <div className="flex flex-col space-y-12 ml-10">
            {/* Step 1 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                  1
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Contact Admin</h3>
                <p className="text-gray-600">
                  Reach out via call or WhatsApp to confirm your booking request.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center">
                  2
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Await Approval</h3>
                <p className="text-gray-600">
                  Your seats remain in <span className="italic text-blue-600">pending status</span> until the admin approves.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                  3
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Receive Confirmation</h3>
                <p className="text-gray-600">
                  Once approved, you’ll receive a confirmation message with final booking details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Admin Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl mb-6">
        <a
          href="tel:+918756754080"
          className="flex items-center justify-center gap-2 text-white bg-green-500 hover:bg-green-600 px-6 py-3 rounded-2xl font-semibold transition shadow-md"
        >
          <Phone className="w-5 h-5" /> Call Admin
        </a>
        <a
          href="https://wa.me/918756754080"
          className="flex items-center justify-center gap-2 text-white bg-teal-500 hover:bg-teal-600 px-6 py-3 rounded-2xl font-semibold transition shadow-md"
        >
          <MessageCircle className="w-5 h-5" /> WhatsApp Admin
        </a>
      </div>

      
    </div>
  );
}
