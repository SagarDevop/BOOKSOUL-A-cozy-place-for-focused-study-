import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  // Fetch all booking requests from backend
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

  // Handle Approve/Reject
  const handleAction = async (id, action) => {
    try {
      const res = await fetch(
        `https://booksoul-a-cozy-place-for-focused-study.onrender.com/update_booking/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        }
      );
      const result = await res.json();

      if (result.success) {
        // ✅ Update the status in local state instead of removing
        setRequests((prev) =>
          prev.map((r) =>
            r._id === id ? { ...r, status: action } : r
          )
        );

        toast.success(
          action === "approve"
            ? "Booking approved successfully!"
            : "Booking was rejected!"
        );
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error updating booking", error);
      toast.error("Server error while updating booking");
    }
  };

  // Filter requests based on search
  const filteredRequests = requests.filter(
    (r) =>
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.status.toLowerCase().includes(search.toLowerCase())
  );

  // Analytics counts
  const approvedCount = requests.filter((r) => r.status === "approve").length;
  const rejectedCount = requests.filter((r) => r.status === "reject").length;
  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav className="flex flex-col space-y-3">
          <a href="/admin" className="text-gray-700 hover:text-blue-600">Dashboard</a>
          <a href="/admin/analytics" className="text-gray-700 hover:text-blue-600">Analytics</a>
        
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">👋 Welcome, <span className="text-red-900">Shiv! </span></h1>
            <p className="text-gray-600">Manage your bookings efficiently.</p>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-gray-500">Total Requests</p>
            <p className="text-2xl font-bold">{requests.length}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg shadow text-center">
            <p className="text-green-700">Approved</p>
            <p className="text-2xl font-bold">{approvedCount}</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg shadow text-center">
            <p className="text-red-700">Rejected</p>
            <p className="text-2xl font-bold">{rejectedCount}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg shadow text-center">
            <p className="text-yellow-700">Pending</p>
            <p className="text-2xl font-bold">{pendingCount}</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by email or status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Booking Table */}
        <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
          <table className="table-auto w-full border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2 text-left">Email</th>
                <th className="border px-4 py-2 text-left">Phone</th>
                <th className="border px-4 py-2 text-left">Seats</th>
                <th className="border px-4 py-2 text-left">Status</th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req, index) => (
                <tr key={req._id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="border px-4 py-2">{req.email}</td>
                  <td className="border px-4 py-2">{req.phone}</td>
                  <td className="border px-4 py-2">{req.seats.join(", ")}</td>
                  <td className="border px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-white text-sm font-semibold ${
                      req.status === "approve" ? "bg-green-500" :
                      req.status === "reject" ? "bg-red-500" :
                      "bg-yellow-500"
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="border px-4 py-2 space-x-2">
                    {req.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleAction(req._id, "approve")}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(req._id, "reject")}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center p-4 text-gray-500">
                    No requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
