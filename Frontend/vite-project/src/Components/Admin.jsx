import React, { useEffect, useState } from "react";

const Admin = () => {
  const [requests, setRequests] = useState([]);

  // ✅ Fetch all booking requests
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch("https://booksoul-a-cozy-place-for-focused-study.onrender.com/admin/requests");
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests", error);
    }
  };

  // ✅ Approve/Reject a request
  const updateStatus = async (id, status) => {
    try {
      await fetch(`https://booksoul-a-cozy-place-for-focused-study.onrender.com/admin/requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchRequests(); // refresh list
    } catch (error) {
      console.error("Error updating request", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📌 Admin Panel - Booking Requests</h1>

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
                    onClick={() => updateStatus(req._id, "approved")}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(req._id, "rejected")}
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
