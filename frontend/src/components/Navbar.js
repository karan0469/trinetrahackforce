import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Menu, 
  X, 
  Home, 
  LayoutDashboard, 
  FileText, 
  Trophy, 
  Gift, 
  LogOut,
  UserCircle,
  Settings
} from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <ShieldCheck className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">Good Citizen</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/create-report"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition"
                >
                  <FileText className="h-4 w-4" />
                  <span>Create Report</span>
                </Link>
                <Link
                  to="/my-reports"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition"
                >
                  <FileText className="h-4 w-4" />
                  <span>My Reports</span>
                </Link>
                <Link
                  to="/leaderboard"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition"
                >
                  <Trophy className="h-4 w-4" />
                  <span>Leaderboard</span>
                </Link>
                <Link
                  to="/rewards"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition"
                >
                  <Gift className="h-4 w-4" />
                  <span>Rewards</span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}
                
                {/* User Info */}
                <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                    <div className="text-xs text-primary-600 font-semibold">{user?.points} points</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-md text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition"
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isAuthenticated ? (
              <>
                <div className="px-3 py-2 bg-primary-50 rounded-md mb-2">
                  <div className="font-medium text-gray-900">{user?.name}</div>
                  <div className="text-sm text-primary-600 font-semibold">{user?.points} points</div>
                </div>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/create-report"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FileText className="h-5 w-5" />
                  <span>Create Report</span>
                </Link>
                <Link
                  to="/my-reports"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FileText className="h-5 w-5" />
                  <span>My Reports</span>
                </Link>
                <Link
                  to="/leaderboard"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Trophy className="h-5 w-5" />
                  <span>Leaderboard</span>
                </Link>
                <Link
                  to="/rewards"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Gift className="h-5 w-5" />
                  <span>Rewards</span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Admin</span>
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home className="h-5 w-5" />
                  <span>Home</span>
                </Link>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
