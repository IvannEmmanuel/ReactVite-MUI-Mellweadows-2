import React, { useState, useEffect } from 'react';
import Supabase from '../Services/Supabase';

const PatientRegistration = () => {
  // State variables for patient details
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [cellphoneNumber, setCellphoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [dateRegistered, setDateRegistered] = useState('');
  const [datePlaceWaiting, setDatePlaceWaiting] = useState('');
  const [datePlaceWard, setDatePlaceWard] = useState('');
  const [dateExpectedLeave, setDateExpectedLeave] = useState('');
  const [wardNumber, setWardNumber] = useState('');

  // State variables for next of kin details
  const [relationshipToPatient, setRelationshipToPatient] = useState('');
  const [kinFirstname, setKinFirstname] = useState('');
  const [kinLastname, setKinLastname] = useState('');
  const [kinAddress, setKinAddress] = useState('');
  const [kinCellphoneNumber, setKinCellphoneNumber] = useState('');

  // State variables for dropdowns
  const [wards, setWards] = useState([]);

  // Fetch wards for dropdowns on component mount
  useEffect(() => {
    const fetchWards = async () => {
      const { data, error } = await Supabase.from('ward').select('ward_num');
      if (error) {
        console.error('Error fetching wards:', error.message);
      } else {
        setWards(data);
      }
    };

    fetchWards();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Insert into Patient table
      const patientData = {
        firstname,
        lastname,
        address,
        cellphone_number: cellphoneNumber,
        sex: gender,
        birthday: dateOfBirth,
        marital_status: maritalStatus,
        date_registered: dateRegistered,
        date_place_waiting: datePlaceWaiting,
        date_place_ward: datePlaceWard,
        date_expected_leave: dateExpectedLeave,
        ward_num: wardNumber || null, // Set ward_num to null if not provided
      };

      const { data: patientInsertData, error: patientInsertError } = await Supabase
        .from('patient')
        .insert([patientData])
        .select();

      if (patientInsertError) throw patientInsertError;
      console.log('Patient added:', patientInsertData);

      const patientId = patientInsertData ? patientInsertData[0].patient_id : null;
      console.log('Inserted Patient ID:', patientId);

      // Insert into Next of Kin table
      const nextOfKinData = {
        firstname: kinFirstname,
        lastname: kinLastname,
        relationship_patient: relationshipToPatient,
        address: kinAddress,
        cellphone_number: kinCellphoneNumber,
        patient_id: patientId,
      };

      const { data: nextOfKinInsertData, error: nextOfKinInsertError } = await Supabase
        .from('next_of_kin')
        .insert([nextOfKinData]);

      if (nextOfKinInsertError) throw nextOfKinInsertError;
      console.log('Next of Kin added:', nextOfKinInsertData);

      // Reset form fields
      resetFormFields()

      alert('Patient, Bed, and Next of Kin registered successfully!');
    } catch (error) {
      console.error('Error registering patient, bed, and next of kin:', error.message);
      alert('Error registering patient, bed, and next of kin. Please try again.');
    }
  };

  // Function to reset form fields
  const resetFormFields = () => {
    setFirstname('');
    setLastname('');
    setDateOfBirth('');
    setAddress('');
    setCellphoneNumber('');
    setGender('');
    setMaritalStatus('');
    setDateRegistered('');
    setDatePlaceWaiting('');
    setDatePlaceWard('');
    setDateExpectedLeave('');
    setWardNumber('');
    setRelationshipToPatient('');
    setKinFirstname('');
    setKinLastname('');
    setKinAddress('');
    setKinCellphoneNumber('');
  };

  return (
    <div>
      <h2>Patient Registration</h2>
      <form onSubmit={handleSubmit}>
        {/* Patient registration fields */}
        <input
          type="text"
          placeholder="First Name"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          required
        />
        <input
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Cellphone Number"
          value={cellphoneNumber}
          onChange={(e) => setCellphoneNumber(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Marital Status"
          value={maritalStatus}
          onChange={(e) => setMaritalStatus(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Date Registered"
          value={dateRegistered}
          onChange={(e) => setDateRegistered(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Date Placed on Waiting List"
          value={datePlaceWaiting}
          onChange={(e) => setDatePlaceWaiting(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Date Placed in Ward"
          value={datePlaceWard}
          onChange={(e) => setDatePlaceWard(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Expected Leave Date"
          value={dateExpectedLeave}
          onChange={(e) => setDateExpectedLeave(e.target.value)}
          required
        />
        <select
          value={wardNumber}
          onChange={(e) => setWardNumber(e.target.value)}
        >
          <option value="">Select Ward (Optional)</option>
          {wards.map((ward) => (
            <option key={ward.ward_num} value={ward.ward_num}>
              Ward {ward.ward_num}
            </option>
          ))}
        </select>

        {/* Next of Kin fields */}
        <input
          type="text"
          placeholder="Relationship to Patient"
          value={relationshipToPatient}
          onChange={(e) => setRelationshipToPatient(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Next of Kin First Name"
          value={kinFirstname}
          onChange={(e) => setKinFirstname(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Next of Kin Last Name"
          value={kinLastname}
          onChange={(e) => setKinLastname(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Next of Kin Address"
          value={kinAddress}
          onChange={(e) => setKinAddress(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Next of Kin Cellphone Number"
          value={kinCellphoneNumber}
          onChange={(e) => setKinCellphoneNumber(e.target.value)}
          required
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PatientRegistration;
