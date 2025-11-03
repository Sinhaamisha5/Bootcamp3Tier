import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
import Login from './pages/Login.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import TrainerDashboard from './pages/TrainerDashboard.jsx';
import AttendancePage from './pages/AttendancePage.jsx';
import api from './services/api.js';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <NavBar user={user} onLogout={handleLogout} />
      <div style={{ padding: '1rem' }}>
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                user.role === 'admin' ? <Navigate to="/admin" /> : user.role === 'trainer' ? <Navigate to="/trainer" /> : <Navigate to="/attendance" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={setUser} />} />
          <Route
            path="/admin"
            element={user && user.role === 'admin' ? <AdminDashboard user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/trainer"
            element={user && user.role === 'trainer' ? <TrainerDashboard user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/attendance"
            element={user && user.role === 'student' ? <AttendancePage user={user} /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;