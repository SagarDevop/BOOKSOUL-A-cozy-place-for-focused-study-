import React from 'react'

function Analyticsfee() {
  return (
    <>
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

        

        
       
      </main>
    </div>
    </>
  )
}

export default Analyticsfee
