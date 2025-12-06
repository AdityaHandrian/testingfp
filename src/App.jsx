import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthProvider } from './contexts/AuthContext';
import { ROUTES } from './utils/constants';
import Signup from './pages/Signup';
import Footer from './components/Footer';

// Placeholder components
import Home from './pages/Home';
import Login from './pages/Login';
import Recommendation from './pages/Recommendation';
import SentimentAnalysis from './pages/SentimentAnalysis';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />

          <main className="flex-1">
            <Routes>
              <Route path={ROUTES.HOME} element={<Home />} />
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route path={ROUTES.SIGNUP} element={<Signup />} />
              <Route path={ROUTES.RECOMMENDATION} element={<Recommendation />} />
              <Route path={ROUTES.SENTIMENT} element={<SentimentAnalysis />} />
              <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
              <Route
                path="*"
                element={
                  <div className="text-center mt-20">
                    <h1>404 - Page Not Found</h1>
                  </div>
                }
              />
            </Routes>
          </main>

          <Footer /> {/* Footer berada setelah <main> */}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
