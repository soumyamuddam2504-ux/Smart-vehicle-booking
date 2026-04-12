import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activePage }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-0 flex justify-between items-center">
        <div
          className="flex items-center gap-3 cursor-pointer py-4"
          onClick={() => navigate('/search')}
        >
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white text-sm font-bold tracking-tight">SR</span>
          </div>
          <div>
            <p className="text-base font-bold text-gray-900 leading-none tracking-tight">SmartRide</p>
            <p className="text-xs text-blue-500 leading-none mt-0.5 font-medium">RV Booking</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-400 mr-3 hidden sm:block">
            Hi, <span className="font-semibold text-gray-700">{user?.name?.split(' ')[0]}</span>
          </span>
          <button
            onClick={() => navigate('/search')}
            className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
              activePage === 'search'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Find RVs
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
              activePage === 'dashboard'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            My Bookings
          </button>
          <button
            onClick={logout}
            className="text-sm font-medium px-4 py-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors ml-1"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
