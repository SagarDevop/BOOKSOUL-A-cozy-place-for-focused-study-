import React, { useEffect, useState } from "react";

const Admin = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch(
        "https://booksoul-a-cozy-place-for-focused-study.onrender.com/admin/requests"
      );
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests", error);
    }
  };

  // ✅ Approve or Reject a request
  const handleAction = async (id, action) => {
    try {
      const res = await fetch(
        `https://booksoul-a-cozy-place-for-focused-study.onrender.com/update_booking/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }), // "approve" or "reject"
        }
      );
      const result = await res.json();
      if (result.success) {
        // remove it from local state so it vanishes from pending list
        setRequests((prev) => prev.filter((r) => r._id !== id));
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error updating booking", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        📌 Admin Panel - Booking Requests
      </h1>

      {requests.length === 0 ? (
        <p>No booking requests yet.</p>
      ) : (
        <table className="table-auto border-collapse border border-gray-400 w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Seats</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id}>
                <td className="border px-4 py-2">{req.email}</td>
                <td className="border px-4 py-2">{req.seats.join(", ")}</td>
                <td className="border px-4 py-2">{req.status}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleAction(req._id, "approve")}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(req._id, "reject")}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Admin;
