import React from 'react';
import { Link } from 'react-router-dom';

function NavBar({ user, onLogout }) {
  return (
    <nav style={{ background: '#343a40', padding: '0.5rem 1rem', color: 'white' }}>
      <Link to="/" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>
        Bootcamp
      </Link>
      {user && user.role === 'admin' && (
        <>
          <Link to="/admin" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>
            Admin
          </Link>
        </>
      )}
      {user && user.role === 'trainer' && (
        <>
          <Link to="/trainer" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>
            Trainer
          </Link>
        </>
      )}
      {user && user.role === 'student' && (
        <>
          <Link to="/attendance" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>
            Attendance
          </Link>
        </>
      )}
      <span style={{ float: 'right' }}>
        {user ? (
          <>
            <span style={{ marginRight: '1rem' }}>
              Hello, {user.firstName} ({user.role})
            </span>
            <button onClick={onLogout} style={{ padding: '0.3rem 0.6rem' }}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
            Login
          </Link>
        )}
      </span>
    </nav>
  );
}

export default NavBar;