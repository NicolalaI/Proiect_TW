import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white/90 backdrop-blur-md border-b border-white/50 p-4 mb-6 sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-extrabold text-black tracking-wide">Bug Tracker</Link>

                <div className="flex items-center space-x-4">
                    {user && (
                        <>
                            <span className="text-gray-800 font-medium">Salut, <span className="font-bold text-black">{user.nume}</span>!</span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
                            >
                                Deconectare
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
