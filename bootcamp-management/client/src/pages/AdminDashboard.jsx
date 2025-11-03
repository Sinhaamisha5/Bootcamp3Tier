import React, { useState, useEffect } from 'react';
import api from '../services/api.js';

function AdminDashboard() {
  const [bootcamps, setBootcamps] = useState([]);
  const [newBootcamp, setNewBootcamp] = useState({ name: '', description: '', startDate: '', endDate: '', driveFolderId: '' });
  const [message, setMessage] = useState(null);
  const [batchForm, setBatchForm] = useState({ bootcampId: '', name: '', coordinatorId: '', trainerId: '', startTime: '', endTime: '' });

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

  const handleBootcampChange = (e) => {
    setNewBootcamp({ ...newBootcamp, [e.target.name]: e.target.value });
  };

  const submitBootcamp = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await api.post('/bootcamps', newBootcamp);
      setMessage('Bootcamp created');
      setNewBootcamp({ name: '', description: '', startDate: '', endDate: '', driveFolderId: '' });
      fetchBootcamps();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error creating bootcamp');
    }
  };

  const handleBatchChange = (e) => {
    setBatchForm({ ...batchForm, [e.target.name]: e.target.value });
  };

  const submitBatch = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      const payload = { ...batchForm };
      const res = await api.post('/batches', payload);
      setMessage('Batch created');
      setBatchForm({ bootcampId: '', name: '', coordinatorId: '', trainerId: '', startTime: '', endTime: '' });
      fetchBootcamps();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error creating batch');
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {message && <div style={{ marginBottom: '1rem', color: 'green' }}>{message}</div>}
      <h3>Create Bootcamp</h3>
      <form onSubmit={submitBootcamp} style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          name="name"
          value={newBootcamp.name}
          onChange={handleBootcampChange}
          placeholder="Name"
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
        />
        <textarea
          name="description"
          value={newBootcamp.description}
          onChange={handleBootcampChange}
          placeholder="Description"
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
        />
        <input
          type="date"
          name="startDate"
          value={newBootcamp.startDate}
          onChange={handleBootcampChange}
          required
          style={{ padding: '0.5rem', marginBottom: '0.5rem' }}
        />
        <input
          type="date"
          name="endDate"
          value={newBootcamp.endDate}
          onChange={handleBootcampChange}
          required
          style={{ padding: '0.5rem', marginBottom: '0.5rem' }}
        />
        <input
          type="text"
          name="driveFolderId"
          value={newBootcamp.driveFolderId}
          onChange={handleBootcampChange}
          placeholder="Google Drive Folder ID (optional)"
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>Create</button>
      </form>
      <h3>Create Batch</h3>
      <form onSubmit={submitBatch} style={{ marginBottom: '2rem' }}>
        <select
          name="bootcampId"
          value={batchForm.bootcampId}
          onChange={handleBatchChange}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
        >
          <option value="">Select Bootcamp</option>
          {bootcamps.map((b) => (
            <option key={b._id} value={b._id}>{b.name}</option>
          ))}
        </select>
        <input
          type="text"
          name="name"
          value={batchForm.name}
          onChange={handleBatchChange}
          placeholder="Batch Name"
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
        />
        <input
          type="text"
          name="coordinatorId"
          value={batchForm.coordinatorId}
          onChange={handleBatchChange}
          placeholder="Coordinator User ID"
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
        />
        <input
          type="text"
          name="trainerId"
          value={batchForm.trainerId}
          onChange={handleBatchChange}
          placeholder="Trainer User ID"
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
        />
        <input
          type="time"
          name="startTime"
          value={batchForm.startTime}
          onChange={handleBatchChange}
          placeholder="Start Time"
          style={{ padding: '0.5rem', marginBottom: '0.5rem' }}
        />
        <input
          type="time"
          name="endTime"
          value={batchForm.endTime}
          onChange={handleBatchChange}
          placeholder="End Time"
          style={{ padding: '0.5rem', marginBottom: '0.5rem' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>Create Batch</button>
      </form>
      <h3>Existing Bootcamps</h3>
      <ul>
        {bootcamps.map((b) => (
          <li key={b._id}>
            {b.name} – {new Date(b.startDate).toLocaleDateString()} to {new Date(b.endDate).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;