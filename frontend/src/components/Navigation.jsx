import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Cookies from "js-cookie";
import { UserCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

export function Navigation() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  async function logout() {
    try {
      const response = await fetch("http://localhost:3000/user/logout", {
        credentials: "include",
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Logout failed");
      Cookies.remove("token");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  // Function to close profile modal when clicking outside
  const handleOutsideClick = () => setIsProfileOpen(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          {/* Left Side (Logo + Links) */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-indigo-600">
              CrowdFund
            </Link>
            <Link
              to="/discover"
              className="text-gray-900 hover:text-indigo-600"
            >
              Discover
            </Link>
            <Link
              to="/start-project"
              className="text-gray-900 hover:text-indigo-600"
            >
              Start a Project
            </Link>
          </div>

          {/* Right Side (Profile / Auth Links) */}
          <div className="flex items-center space-x-6 relative">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-900 hover:text-indigo-600"
                >
                  Dashboard
                </Link>

                {/* Profile Icon */}
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="relative flex items-center space-x-2 hover:bg-gray-200 px-3 py-2 rounded-full transition focus:outline-none"
                >
                  <UserCircleIcon className="w-10 h-10 text-gray-700 hover:text-indigo-600 transition" />
                </button>

                {/* Profile Modal with Overlay */}
                {isProfileOpen && (
                  <>
                    {/* Full-Screen Clickable Background */}
                    <div
                      className="fixed inset-0 w-screen h-screen opacity-30 z-50"
                      onClick={handleOutsideClick}
                    />

                    {/* Profile Card */}
                    <div
                      className="absolute right-0 top-14 w-80 bg-white shadow-xl rounded-lg p-4 z-50"
                      onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
                    >
                      {/* Header */}
                      <div className="flex justify-between items-center border-b pb-2">
                        <h2 className="text-lg font-semibold">Profile</h2>
                        <button
                          onClick={() => setIsProfileOpen(false)}
                          className="focus:outline-none"
                        >
                          <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-red-500 transition" />
                        </button>
                      </div>

                      {/* Profile Info */}
                      <div className="flex flex-col items-center mt-3">
                        <UserCircleIcon className="w-16 h-16 text-gray-400" />
                        <h3 className="mt-2 text-lg font-semibold">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>

                      {/* User Details */}
                      <div className="mt-4 space-y-2 px-2 text-gray-700">
                        <p>
                          <span className="font-semibold">Mobile:</span>{" "}
                          {user.mobile}
                        </p>
                        <p>
                          <span className="font-semibold">Contact ID:</span>{" "}
                          {user.contact_id}
                        </p>
                      </div>

                      {/* Sign Out Button */}
                      <button
                        onClick={logout}
                        className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md text-sm font-medium transition focus:outline-none"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="space-x-4">
                <Link
                  to="/login"
                  className="text-gray-900 hover:text-indigo-600"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
