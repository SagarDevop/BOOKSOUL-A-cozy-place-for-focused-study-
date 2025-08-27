import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Blocks with left and right seat counts
const seatBlocks = [
  { id: "Block1", leftSeats: 6, rightSeats: 6 },
  { id: "Block2", leftSeats: 7, rightSeats: 7 },
  { id: "Block3", leftSeats: 7, rightSeats: 4 },
  { id: "Block4", leftSeats: 5, rightSeats: 5 },
  { id: "Block5", leftSeats: 5, rightSeats: 0 },
];

export default function Page3() {
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [animateBlocks, setAnimateBlocks] = useState([]);
  const navigate = useNavigate();



  useEffect(() => {
    // Animate each block in one by one
    seatBlocks.forEach((_, index) => {
      setTimeout(() => {
        setAnimateBlocks((prev) => [...prev, index]);
      }, index * 300); // delay between each block
    });
  }, []);

  useEffect(() => {
    fetch('https://booksoul-a-cozy-place-for-focused-study.onrender.com/booked-seats')
      .then(res => res.json())
      .then(data => setBookedSeats(data));
  }, []);
  
  const toggleSeat = (seatId) => {
    if (bookedSeats.includes(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleBooking = async () => {
  if (selectedSeats.length === 0) return;

  // 🔥 Check user login from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;

  if (!email) {
    toast.error("Please log in to book seats.");
    return; // ⛔ stop here if not logged in
  }

  try {
    // 1️⃣ Save booking request in DB as "pending"
    const response = await fetch(
      "https://booksoul-a-cozy-place-for-focused-study.onrender.com/request-booking",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seats: selectedSeats,
          email,
          status: "pending", // 👈 always pending until admin approves
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      toast.success("Booking request sent! Waiting for admin approval.");

      // 2️⃣ Navigate to confirm-booking page (with selected seats)
      navigate("/confirm-booking", { state: { selectedSeats, email } });

      // ✅ Reset selected seats locally
      setSelectedSeats([]);
    } else {
      toast.error(data.error || "Booking request failed.");
    }
  } catch (error) {
    console.error("Error requesting booking:", error);
    toast.error("Something went wrong.");
  }
};

  
  

  const renderBlock = (block, index) => {
    const maxRows = Math.max(block.leftSeats, block.rightSeats);
    const rows = [];

    for (let i = 1; i <= maxRows; i++) {
      const leftSeatId = `${block.id}-L${i}`;
      const rightSeatId = `${block.id}-R${i}`;

      rows.push(
        <div key={i} className="flex justify-center items-center mb-2 gap-8">
          {/* Left Seat */}
          {i <= block.leftSeats ? (
            <div
              onClick={() => toggleSeat(leftSeatId)}
              className={`w-12 h-12 rounded-md cursor-pointer flex items-center justify-center text-white font-bold transition-all duration-300 ease-in-out 
              hover:scale-110 hover:ring-2 hover:ring-blue-400 hover:animate-pulse
              ${bookedSeats.includes(leftSeatId)
                ? "bg-red-500"
                : selectedSeats.includes(leftSeatId)
                ? "bg-blue-500 animate-wiggle"
                : "bg-green-500 transition-colors"}`}
            >
              {`L${i}`}
            </div>
          ) : (
            <div className="w-12 h-12"></div>
          )}

          {/* Center Divider */}
          <div className="w-2"></div>

          {/* Right Seat */}
          {i <= block.rightSeats ? (
            <div
              onClick={() => toggleSeat(rightSeatId)}
              className={`w-12 h-12 rounded-md cursor-pointer flex items-center justify-center text-white font-bold transition-all duration-300 ease-in-out 
              hover:scale-110 hover:ring-2 hover:ring-blue-400 hover:animate-pulse
              ${bookedSeats.includes(rightSeatId)
                ? "bg-red-500"
                : selectedSeats.includes(rightSeatId)
                ? "bg-blue-500 animate-wiggle"
                : "bg-green-500 transition-colors"}`}
            >
              {`R${i}`}
            </div>
          ) : (
            <div className="w-12 h-12"></div>
          )}
        </div>
      );
    }

    const isVisible = animateBlocks.includes(index);

    return (
      <div
        key={block.id}
        className={`snap-center min-w-[280px] p-4 rounded-xl shadow-xl border border-white/10 bg-white/10 backdrop-blur-md transition-all duration-700 ease-out
        transform ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}
      >
        <h2 className="text-center font-bold mb-4 text-white tracking-wide">
          {block.id}
        </h2>
        {rows}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-900 to-white-400 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        📚 Book Your Study Seat
      </h1>

      {/* Slider Wrapper */}
      <div className="flex overflow-x-auto gap-6 snap-x snap-mandatory px-2 pb-4 hide-scrollbar">

        {seatBlocks.map((block, i) => renderBlock(block, i))}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handleBooking}
          disabled={selectedSeats.length === 0}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 
          transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          🎟️ Confirm Booking
        </button>
      </div>
    </div>
  );
}
