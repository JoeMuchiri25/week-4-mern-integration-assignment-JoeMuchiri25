import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-300 bg-white shadow-sm">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-blue-600 hover:underline font-semibold">Home</Link>
        {user && (
          <Link to="/new" className="text-blue-600 hover:underline font-semibold">New Post</Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-gray-700">👋 Hello, <strong>{user.name}</strong></span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-blue-600 hover:underline font-semibold">Login</Link>
            <Link to="/register" className="text-blue-600 hover:underline font-semibold">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
