import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await login(email, password);
        if (res.success) {
            navigate('/');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 w-full max-w-md text-gray-900">
                <h2 className="text-3xl font-black mb-8 text-center text-gray-900 drop-shadow-sm">Autentificare</h2>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-gray-900 text-lg font-bold mb-3">Email</label>
                        <input
                            type="email"
                            className="w-full p-4 bg-white border-2 border-gray-300 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 font-medium text-lg shadow-sm"
                            placeholder="ex: nume@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-8">
                        <label className="block text-gray-900 text-lg font-bold mb-3">Parola</label>
                        <input
                            type="password"
                            className="w-full p-4 bg-white border-2 border-gray-300 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 font-medium text-lg shadow-sm"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xl p-4 rounded-xl shadow-xl border-2 border-indigo-500 hover:border-indigo-400 transform hover:-translate-y-1 transition duration-300">
                        INTRA IN CONT
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-gray-300">Nu ai cont? <Link to="/register" className="text-indigo-300 hover:text-white hover:underline transition">Inregistreaza-te</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
