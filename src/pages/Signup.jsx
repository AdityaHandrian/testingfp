import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { ROUTES } from '../utils/constants';
import { AlertCircle, Loader, CheckCircle } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [validationError, setValidationError] = useState('');
  const { signup, isLoading, error } = useAuthContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationError('');
  };

  const validateForm = () => {
    if (!formData.name || !formData.username || !formData.email || !formData.password) {
      setValidationError('Semua field harus diisi');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setValidationError('Password tidak cocok');
      return false;
    }

    if (formData.password.length < 6) {
      setValidationError('Password minimal 6 karakter');
      return false;
    }

    if (!formData.email.includes('@')) {
      setValidationError('Email tidak valid');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await signup(
        formData.username,
        formData.email,
        formData.password,
        formData.name
      );
      navigate(ROUTES.RECOMMENDATION);
    } catch (err) {
      console.error('Signup error:', err);
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
            Daftar ke RecSystem
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Buat akun untuk mulai mendapatkan rekomendasi
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {/* Error Messages */}
          {(error || validationError) && (
            <div className="rounded-md bg-red-50 p-4 flex items-start space-x-3">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <div className="text-sm text-red-800">{error || validationError}</div>
            </div>
          )}

          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nama Lengkap
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan nama lengkap"
              disabled={isLoading}
            />
          </div>

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
              value={formData.username}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Pilih username unik"
              disabled={isLoading}
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan email"
              disabled={isLoading}
            />
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
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Minimal 6 karakter"
              disabled={isLoading}
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Konfirmasi Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ketik ulang password"
              disabled={isLoading}
            />
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
                Mendaftar...
              </>
            ) : (
              'Daftar'
            )}
          </button>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Sudah punya akun?{' '}
              <Link
                to={ROUTES.LOGIN}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Login di sini
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
