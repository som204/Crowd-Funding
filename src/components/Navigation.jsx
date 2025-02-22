import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function Navigation() {
  const { user, signOut } = useAuth()

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-indigo-600">CrowdFund</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/discover" className="inline-flex items-center px-1 pt-1 text-gray-900">
                Discover
              </Link>
              <Link to="/start-project" className="inline-flex items-center px-1 pt-1 text-gray-900">
                Start a Project
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-gray-900">Dashboard</Link>
                <button
                  onClick={signOut}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link
                  to="/login"
                  className="text-gray-900"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}