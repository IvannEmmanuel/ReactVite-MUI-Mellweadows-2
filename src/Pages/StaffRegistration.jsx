import React, { useState, useEffect } from 'react';
import Supabase from '../Services/Supabase';
import { Table, TableRow, TableHead, TableCell, TableBody, Typography } from '@mui/material';

const StaffRegistration = () => {
  // State variables for staff details
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [cellphoneNumber, setCellphoneNumber] = useState('');
  const [sex, setSex] = useState('');
  const [nin, setNin] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [workExperience, setWorkExperience] = useState('');
  const [wardNumber, setWardNumber] = useState('');

  // State variables for job positions
  const [jobPositions, setJobPositions] = useState([]);
  const [positionHeld, setPositionHeld] = useState('');

  // State variables for wards
  const [wards, setWards] = useState([]);

  // Fetch job positions and wards on component mount
  useEffect(() => {
    const fetchJobPositions = async () => {
      const { data, error } = await Supabase.from('job_position').select('job_position_id, position_held');
      if (error) {
        console.error('Error fetching job positions:', error.message);
      } else {
        setJobPositions(data);
      }
    };

    const fetchWards = async () => {
      const { data, error } = await Supabase.from('ward').select('ward_num');
      if (error) {
        console.error('Error fetching wards:', error.message);
      } else {
        setWards(data);
      }
    };

    fetchJobPositions();
    fetchWards();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Retrieve job position ID based on the selected position
      const selectedJobPosition = jobPositions.find(job => job.position_held === positionHeld);

      if (!selectedJobPosition) {
        throw new Error('Job position not found');
      }

      const jobPositionId = selectedJobPosition.job_position_id;

      // Insert into Staff table with job_position_id and ward_num
      const { data: staffData, error: staffError } = await Supabase.from('staff').insert([
        {
          firstname,
          lastname,
          date_of_birth: dateOfBirth,
          address,
          cellphone_number: cellphoneNumber,
          sex,
          nin,
          qualifications,
          work_experience: workExperience,
          job_position_id: jobPositionId,
          ward_num: wardNumber,
        },
      ]).single();

      if (staffError) {
        throw staffError;
      }

      // Reset form fields
      resetFormFields();

      alert('Staff registered successfully!');
    } catch (error) {
      console.error('Error registering staff:', error.message);
      alert('Error registering staff. Please try again.');
    }
  };

  // Function to reset form fields
  const resetFormFields = () => {
    setFirstname('');
    setLastname('');
    setDateOfBirth('');
    setAddress('');
    setCellphoneNumber('');
    setSex('');
    setNin('');
    setQualifications('');
    setWorkExperience('');
    setPositionHeld('');
    setWardNumber('');
  };

  return (
    <div>
      <h2>Staff Registration</h2>
      <form onSubmit={handleSubmit}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell colSpan={6}>
                <Typography variant="h6">Staff Details</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant="body1">First Name:</Typography>
              </TableCell>
              <TableCell>
                <input
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                />
              </TableCell>
              <TableCell>
                <Typography variant="body1">Last Name:</Typography>
              </TableCell>
              <TableCell>
                <input
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                />
              </TableCell>
              <TableCell>
                <Typography variant="body1">Date of Birth:</Typography>
              </TableCell>
              <TableCell>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1">Address:</Typography>
              </TableCell>
              <TableCell>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </TableCell>
              <TableCell>
                <Typography variant="body1">Cellphone Number:</Typography>
              </TableCell>
              <TableCell>
                <input
                  type="text"
                  value={cellphoneNumber}
                  onChange={(e) => setCellphoneNumber(e.target.value)}
                  required
                />
              </TableCell>
              <TableCell>
                <Typography variant="body1">Sex:</Typography>
              </TableCell>
              <TableCell>
                <input
                  type="text"
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                  required
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1">NIN (National Identification Number):</Typography>
              </TableCell>
              <TableCell>
                <input
                  type="text"
                  value={nin}
                  onChange={(e) => setNin(e.target.value)}
                  required
                />
              </TableCell>
              <TableCell>
                <Typography variant="body1">Qualifications:</Typography>
              </TableCell>
              <TableCell>
                <textarea
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  required
                />
              </TableCell>
              <TableCell>
                <Typography variant="body1">Work Experience:</Typography>
              </TableCell>
              <TableCell>
                <textarea
                  value={workExperience}
                  onChange={(e) => setWorkExperience(e.target.value)}
                  required
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1">Position Held:</Typography>
              </TableCell>
              <TableCell>
                <select
                  value={positionHeld}
                  onChange={(e) => setPositionHeld(e.target.value)}
                  required
                >
                  <option value="">Select Position</option>
                  {jobPositions.map((job) => (
                    <option key={job.job_position_id} value={job.position_held}>
                      {job.position_held}
                    </option>
                  ))}
                </select>
              </TableCell>
              <TableCell>
                <Typography variant="body1">Ward Number:</Typography>
              </TableCell>
              <TableCell>
                <select
                  value={wardNumber}
                  onChange={(e) => setWardNumber(e.target.value)}
                  required
                >
                  <option value="">Select Ward</option>
                  {wards.map((ward) => (
                    <option key={ward.ward_num} value={ward.ward_num}>
                      Ward {ward.ward_num}
                    </option>
                  ))}
                </select>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default StaffRegistration;