function AccountModal({ user, onClose, onLogout }) {
  if (!user) {
    // Just close the modal or show a fallback if user is missing
    return null; // or return a simple message
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 shadow-2xl w-[90%] max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✖
        </button>
        <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">Your Account</h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Name:</span>
            <span className="text-gray-900">{user.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Email:</span>
            <span className="text-gray-900">{user.email}</span>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="mt-8 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-semibold transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default AccountModal;