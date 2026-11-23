import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { clearToken, getValidToken } from './auth.js';
import LoginPage from './pages/LoginPage.jsx';
import EnquiriesPage from './pages/EnquiriesPage.jsx';
import EnquiryDetailsPage from './pages/EnquiryDetailsPage.jsx';

// Keep admin pages private and send visitors without a valid token to login.
function ProtectedRoute({ children }) {
  const [hasValidToken, setHasValidToken] = useState(() => Boolean(getValidToken()));

  useEffect(() => {
    const checkToken = () => setHasValidToken(Boolean(getValidToken()));
    const timer = window.setInterval(checkToken, 10000);
    window.addEventListener('storage', checkToken);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('storage', checkToken);
    };
  }, []);

  return hasValidToken ? children : <Navigate to="/login" replace />;
}

// Show the dashboard routes and provide one shared way to sign out.
export default function App() {
  const navigate = useNavigate();

  function handleLogout() {
    clearToken();
    navigate('/login', { replace: true });
  }

  return (
    <Routes>
      <Route path="/login" element={getValidToken() ? <Navigate to="/enquiries" replace /> : <LoginPage />} />
      <Route path="/" element={<Navigate to="/enquiries" replace />} />
      <Route path="/enquiries" element={<ProtectedRoute><EnquiriesPage onLogout={handleLogout} /></ProtectedRoute>} />
      <Route path="/enquiries/:id" element={<ProtectedRoute><EnquiryDetailsPage onLogout={handleLogout} /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/enquiries" replace />} />
    </Routes>
  );
}
