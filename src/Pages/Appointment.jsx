import React, { useState, useEffect } from 'react';
import Supabase from '../Services/Supabase';

const Appointment = () => {
  // State variables
  const [waitListId, setWaitListId] = useState('');
  const [wardNum, setWardNum] = useState('');

  // State variables for dropdowns
  const [waitLists, setWaitLists] = useState([]);
  const [wards, setWards] = useState([]);

  // Fetch wait lists and wards on component mount
  useEffect(() => {
    const fetchWaitLists = async () => {
      try {
        const { data, error } = await Supabase
          .from('wait_list')
          .select(`
            wait_list_id,
            patient_id,
            patient (
              firstname,
              lastname
            )
          `);

        if (error) {
          throw new Error(`Error fetching wait lists: ${error.message}`);
        }
        setWaitLists(data);
      } catch (error) {
        console.error('Error fetching wait lists:', error.message);
      }
    };

    const fetchWards = async () => {
      try {
        const { data, error } = await Supabase.from('ward').select('ward_num, ward_name');
        if (error) {
          throw new Error(`Error fetching wards: ${error.message}`);
        }
        setWards(data);
      } catch (error) {
        console.error('Error fetching wards:', error.message);
      }
    };

    fetchWaitLists();
    fetchWards();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Ensure waitListId and wardNum are not empty
      if (!waitListId) {
        throw new Error('Wait List ID is required.');
      }
      if (!wardNum) {
        throw new Error('Ward is required.');
      }

      // Retrieve patient_id associated with the selected wait_list_id
      const { data: waitListData, error: waitListError } = await Supabase
        .from('wait_list')
        .select('patient_id')
        .eq('wait_list_id', waitListId)
        .single();

      if (waitListError) {
        throw new Error(`Error fetching patient ID: ${waitListError.message}`);
      }

      const patientId = waitListData.patient_id;

      // Retrieve kin_id associated with the patient_id
      const { data: kinData, error: kinError } = await Supabase
        .from('next_of_kin')
        .select('kin_id')
        .eq('patient_id', patientId)
        .single();

      if (kinError) {
        throw new Error(`Error fetching kin ID: ${kinError.message}`);
      }

      const kinId = kinData.kin_id;

      // Update patient record with ward_num
      const { data: patientUpdateData, error: patientUpdateError } = await Supabase
        .from('patient')
        .update({ ward_num: wardNum })
        .eq('patient_id', patientId)
        .single();

      if (patientUpdateError) {
        throw new Error(`Error updating patient record: ${patientUpdateError.message}`);
      }

      // Insert into Bed table
      const bedData = {
        ward_num: wardNum,
        patient_id: patientId,
      };

      const { data: bedInsertData, error: bedInsertError } = await Supabase
        .from('bed')
        .insert([bedData])
        .single();

      if (bedInsertError) {
        throw new Error(`Error assigning bed: ${bedInsertError.message}`);
      }
      console.log('Bed assigned:', bedInsertData);

      // Insert into Appointment table
      const appointmentData = {
        patient_id: patientId,
        ward_num: wardNum,
      };

      const { data: appointmentInsertData, error: appointmentInsertError } = await Supabase
        .from('appointment')
        .insert([appointmentData])
        .single();

      if (appointmentInsertError) {
        throw new Error(`Error inserting appointment: ${appointmentInsertError.message}`);
      }

      // Insert into in_patient table
      const inPatientData = {
        patient_id: patientId,
        kin_id: kinId,
        ward_num: wardNum,
      };

      const { data: inPatientInsertData, error: inPatientInsertError } = await Supabase
        .from('in_patient')
        .insert([inPatientData])
        .single();

      if (inPatientInsertError) {
        throw new Error(`Error inserting in-patient record: ${inPatientInsertError.message}`);
      }

      // Reset form fields
      resetFormFields();

      alert('Appointment created successfully!');
    } catch (error) {
      console.error('Error creating appointment:', error.message);
      alert('Error creating appointment. Please try again.');
    }
  };

  // Function to reset form fields
  const resetFormFields = () => {
    setWaitListId('');
    setWardNum('');
  };

  return (
    <div>
      <h2>Create Appointment</h2>
      <form onSubmit={handleSubmit}>
        {/* Wait List selection */}
        <label htmlFor="waitListSelect">Wait List:</label>
        <select
          id="waitListSelect"
          value={waitListId}
          onChange={(e) => setWaitListId(e.target.value)}
          required
        >
          <option value="">Select Wait List</option>
          {waitLists.map((waitList) => (
            <option key={waitList.wait_list_id} value={waitList.wait_list_id}>
              {`${waitList.patient.firstname} ${waitList.patient.lastname}`}
            </option>
          ))}
        </select>

        {/* Ward selection */}
        <label htmlFor="wardSelect">Ward:</label>
        <select
          id="wardSelect"
          value={wardNum}
          onChange={(e) => setWardNum(e.target.value)}
          required
        >
          <option value="">Select Ward</option>
          {wards.map((ward) => (
            <option key={ward.ward_num} value={ward.ward_num}>
              {ward.ward_name}
            </option>
          ))}
        </select>

        <button type="submit">Create Appointment</button>
      </form>
    </div>
  );
};

export default Appointment;
