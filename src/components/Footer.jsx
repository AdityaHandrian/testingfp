import { Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-10 h-10 bg-white text-blue-600 rounded-lg flex items-center justify-center font-bold mx-auto mb-2">
              RS
            </div>
            <h3 className="text-xl font-bold text-white">RecSystem</h3>
          </div>
          
          <p className="text-sm text-gray-400 mb-4 max-w-md mx-auto">
            Sistem Rekomendasi Produk Tokopedia berbasis Sentiment Analysis, 
            Collaborative Filtering, dan SVD++ untuk pengalaman belanja yang lebih cerdas.
          </p>

          <div className="flex items-center justify-center space-x-4 mb-4">
            <span className="text-xs text-gray-500">
              Proyek Tugas Akademik
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-xs text-gray-500">
              Institut Teknologi Sepuluh Nopember
            </span>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <p className="text-xs text-gray-400">
              © 2025 RecSystem - Built with React, Tailwind CSS, and AI
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Muhammad Aditya Handrian - 5025231292
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
