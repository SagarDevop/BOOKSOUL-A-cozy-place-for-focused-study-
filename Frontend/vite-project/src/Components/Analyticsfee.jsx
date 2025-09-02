import React, { useEffect, useState } from "react";

function Analyticsfee() {
  const [requests, setRequests] = useState([]);

  // Fetch booking requests
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch(
        "https://booksoul-a-cozy-place-for-focused-study.onrender.com/booked-admin"
      );
      const data = await res.json();
      setRequests(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching requests", error);
    }
  };

  // Save subscription period for user
  const handleSave = async (userId, seatId, startDate, durationMonths) => {
    try {
      const res = await fetch(
        "https://booksoul-a-cozy-place-for-focused-study.onrender.com/admin/set-subscription",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            seatId,
            startDate,
            durationMonths,
          }),
        }
      );
      const result = await res.json();
      if (result.success) {
        alert("✅ Subscription period saved!");
      } else {
        alert("❌ Failed to save subscription");
      }
    } catch (err) {
      console.error("Error saving subscription:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav className="flex flex-col space-y-3">
          <a href="/admin" className="text-gray-700 hover:text-blue-600">
            Dashboard
          </a>
          <a href="/admin/analytics" className="text-gray-700 hover:text-blue-600">
            Analytics
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          📊 Subscription Management
        </h1>

        {/* User Table */}
        <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
          <table className="table-auto w-full border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">Email</th>
                
                <th className="border px-4 py-2">Seat</th>
                <th className="border px-4 py-2">Start Date</th>
                <th className="border px-4 py-2">Duration</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id}>
                  <td className="border px-4 py-2">{req.email}</td>
                  
                  <td className="border px-4 py-2">{req.seats?.join(", ")}</td>
                  <td className="border px-4 py-2">
                    <input
                      type="date"
                      className="border p-1 rounded"
                      onChange={(e) => (req.startDate = e.target.value)}
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <select
                      className="border p-1 rounded"
                      onChange={(e) =>
                        (req.durationMonths = parseInt(e.target.value))
                      }
                    >
                      <option value="1">1 Month</option>
                      <option value="2">2 Months</option>
                      <option value="3">3 Months</option>
                    </select>
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() =>
                        handleSave(
                          req._id,
                          req.seats[0],
                          req.startDate,
                          req.durationMonths
                        )
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-gray-500">
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
}

export default Analyticsfee;
