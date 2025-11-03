import React, { useState } from 'react';
import api from '../services/api.js';

function AttendancePage() {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState(null);

  const submitCode = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await api.post('/attendance/mark', { code });
      setMessage('Attendance marked successfully');
      setCode('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to mark attendance');
    }
  };

  return (
    <div>
      <h2>Mark Attendance</h2>
      {message && <div style={{ marginBottom: '0.5rem', color: message.includes('successfully') ? 'green' : 'red' }}>{message}</div>}
      <form onSubmit={submitCode}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter attendance code"
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>Submit</button>
      </form>
      <p>You can scan a QR code with your device and paste the code here.</p>
    </div>
  );
}

export default AttendancePage;