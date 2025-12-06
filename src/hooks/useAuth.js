import { useState, useEffect } from 'react';
import { mockUsers } from '../api/mockData';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load user dari localStorage saat app pertama kali load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function
  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulasi API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Cari user di mock data
      const foundUser = mockUsers.find(
        (u) => u.username === username && u.password === password
      );

      if (!foundUser) {
        throw new Error('Username atau password salah');
      }

      // Simpan user ke state dan localStorage
      const userData = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        name: foundUser.name,
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', 'fake-token-' + Date.now());

      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (username, email, password, name) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulasi API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Validasi
      if (mockUsers.find((u) => u.username === username)) {
        throw new Error('Username sudah terdaftar');
      }

      if (mockUsers.find((u) => u.email === email)) {
        throw new Error('Email sudah terdaftar');
      }

      // Buat user baru
      const newUser = {
        id: mockUsers.length + 1,
        username,
        email,
        password,
        name,
      };

      mockUsers.push(newUser);

      // Auto-login setelah signup
      const userData = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        name: newUser.name,
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', 'fake-token-' + Date.now());

      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return {
    user,
    isLoading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };
}
