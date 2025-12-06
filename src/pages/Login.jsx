import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { ROUTES } from '../utils/constants';
import { AlertCircle, Loader } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(username, password);
      // Redirect ke recommendation page setelah login berhasil
      navigate(ROUTES.RECOMMENDATION);
    } catch (err) {
      // Error sudah ditangani di context
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-xl mb-4">
            RS
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Login ke RecSystem
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Masuk untuk mendapatkan rekomendasi produk terbaik
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-red-50 p-4 flex items-start space-x-3">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}

          {/* Username Input */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan username"
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-gray-500">
              Demo: user123 atau aditya_h
            </p>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan password"
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-gray-500">
              Demo password: password123
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin mr-2" size={20} />
                Loading...
              </>
            ) : (
              'Login'
            )}
          </button>

          {/* Signup Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Belum punya akun?{' '}
              <Link
                to={ROUTES.SIGNUP}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Daftar di sini
              </Link>
            </p>
          </div>
        </form>

        {/* Demo Info Box */}
        <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
          <p className="text-sm font-medium text-blue-900 mb-2">
            🔓 Akun Demo Tersedia:
          </p>
          <div className="text-xs text-blue-800 space-y-1">
            <p>
              <strong>User 1:</strong> user123 / password123
            </p>
            <p>
              <strong>User 2:</strong> aditya_h / password123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
