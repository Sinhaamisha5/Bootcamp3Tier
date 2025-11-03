import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import QRCode from 'qrcode';

function TrainerDashboard() {
  const [bootcamps, setBootcamps] = useState([]);
  const [selectedBootcamp, setSelectedBootcamp] = useState('');
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState(null);
  const [attendanceParams, setAttendanceParams] = useState({ bootcampId: '', batchId: '' });
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [sessionInfo, setSessionInfo] = useState(null);

  useEffect(() => {
    fetchBootcamps();
  }, []);

  async function fetchBootcamps() {
    try {
      const res = await api.get('/bootcamps');
      setBootcamps(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const submitUpload = async (e) => {
    e.preventDefault();
    if (!file || !selectedBootcamp) {
      setUploadMessage('Please select a bootcamp and file');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file', file);
      await api.post(`/documents/${selectedBootcamp}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadMessage('File uploaded successfully');
      setFile(null);
    } catch (err) {
      setUploadMessage(err.response?.data?.message || 'Upload failed');
    }
  };

  const handleAttendanceChange = (e) => {
    setAttendanceParams({ ...attendanceParams, [e.target.name]: e.target.value });
  };

  const submitAttendanceSession = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/attendance/session', attendanceParams);
      const { code, expiresAt } = res.data;
      setSessionInfo(res.data);
      const url = await QRCode.toDataURL(code);
      setQrDataUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Trainer Dashboard</h2>
      <h3>Upload Document</h3>
      {uploadMessage && <div style={{ marginBottom: '0.5rem', color: 'green' }}>{uploadMessage}</div>}
      <form onSubmit={submitUpload} style={{ marginBottom: '2rem' }}>
        <select
          value={selectedBootcamp}
          onChange={(e) => setSelectedBootcamp(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
        >
          <option value="">Select Bootcamp</option>
          {bootcamps.map((b) => (
            <option key={b._id} value={b._id}>{b.name}</option>
          ))}
        </select>
        <input type="file" onChange={handleFileChange} style={{ marginBottom: '0.5rem' }} />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>Upload</button>
      </form>
      <h3>Generate Attendance QR Code</h3>
      <form onSubmit={submitAttendanceSession} style={{ marginBottom: '2rem' }}>
        <select
          name="bootcampId"
          value={attendanceParams.bootcampId}
          onChange={handleAttendanceChange}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
        >
          <option value="">Select Bootcamp</option>
          {bootcamps.map((b) => (
            <option key={b._id} value={b._id}>{b.name}</option>
          ))}
        </select>
        {/* After selecting bootcamp, list batches */}
        <select
          name="batchId"
          value={attendanceParams.batchId}
          onChange={handleAttendanceChange}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
        >
          <option value="">Select Batch</option>
          {attendanceParams.bootcampId && bootcamps.find((b) => b._id === attendanceParams.bootcampId)?.batches.map((batchId) => (
            <option key={batchId} value={batchId}>{batchId}</option>
          ))}
        </select>
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>Generate QR</button>
      </form>
      {qrDataUrl && sessionInfo && (
        <div>
          <p>Attendance session code: {sessionInfo.code}</p>
          <p>Expires at: {new Date(sessionInfo.expiresAt).toLocaleTimeString()}</p>
          <img src={qrDataUrl} alt="QR Code" />
        </div>
      )}
    </div>
  );
}

export default TrainerDashboard;