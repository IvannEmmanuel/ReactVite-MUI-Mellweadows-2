import React, { useState, useEffect } from 'react';
import Supabase from '../Services/Supabase';

const WardRequisition = () => {
  const [requestedBy, setRequestedBy] = useState('');
  const [requestedDate, setRequestedDate] = useState('');
  const [wardNum, setWardNum] = useState('');
  const [wards, setWards] = useState([]);

  useEffect(() => {
    const fetchWards = async () => {
      const { data, error } = await Supabase.from('ward').select('ward_num, ward_name');
      if (error) {
        console.error('Error fetching wards:', error.message);
      } else {
        setWards(data);
      }
    };

    fetchWards();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await Supabase.from('ward_requisition').insert([
        {
          requested_by: requestedBy,
          requested_date: requestedDate,
          ward_num: wardNum,
        },
      ]);

      if (error) {
        throw error;
      }

      alert('Ward requisition submitted successfully!');
      resetForm();
    } catch (error) {
      console.error('Error submitting ward requisition:', error.message);
      alert('Error submitting ward requisition. Please try again.');
    }
  };

  const resetForm = () => {
    setRequestedBy('');
    setRequestedDate('');
    setWardNum('');
  };

  return (
    <div>
      <h2>Ward Requisition</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Requested By"
          value={requestedBy}
          onChange={(e) => setRequestedBy(e.target.value)}
          required
        />
        <input
          type="date"
          value={requestedDate}
          onChange={(e) => setRequestedDate(e.target.value)}
          required
        />
        <label htmlFor="wardNum">Ward</label>
        <select
          id="wardNum"
          value={wardNum}
          onChange={(e) => setWardNum(e.target.value)}
          required
        >
          <option value="">Select Ward</option>
          {wards.map((ward) => (
            <option key={ward.ward_num} value={ward.ward_num}>
              {ward.ward_name} (Ward {ward.ward_num})
            </option>
          ))}
        </select>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default WardRequisition;
