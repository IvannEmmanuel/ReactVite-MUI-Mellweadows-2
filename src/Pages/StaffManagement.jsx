import React, { useState, useEffect } from 'react';
import Supabase from '../Services/Supabase';
import { TableCell, Typography, Select, MenuItem, TableRow, TableHead, TableBody, Button, Table } from '@mui/material';

const StaffManagement = () => {
  const [staffData, setStaffData] = useState([]);
  const [selectedWard, setSelectedWard] = useState('');
  const [wardChanges, setWardChanges] = useState({});

  // Fetch staff data from Supabase
  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const { data, error } = await Supabase.from('staff').select('*');

        if (error) {
          console.error('Error fetching staff data:', error);
        } else {
          setStaffData(data);
        }
      } catch (error) {
        console.error('Error fetching staff data:', error);
      }
    };

    fetchStaffData();
  }, []);

  // Filter staff data based on the selected ward
  const filteredStaff = staffData.filter(
    (staff) => staff.ward_num === selectedWard || selectedWard === ''
  );

  const handleWardChange = (event) => {
    setSelectedWard(event.target.value);
  };

  const handleStaffWardChange = (staff, newWard) => {
    // Check if the new ward is different from the current ward
    if (newWard !== staff.ward_num) {
      setWardChanges((prevChanges) => ({ ...prevChanges, [staff.staff_id]: newWard }));
    } else {
      // Remove the staff member from the wardChanges state if the new ward is the same as the current ward
      setWardChanges((prevChanges) => {
        const updatedChanges = { ...prevChanges };
        delete updatedChanges[staff.staff_id];
        return updatedChanges;
      });
    }
  };

  const saveWardChanges = async () => {
    try {
      const updates = Object.entries(wardChanges).map(([staffId, newWard]) => ({
        staff_id: parseInt(staffId),
        ward_num: newWard,
      }));
  
      for (const { staff_id, ward_num } of updates) {
        // Update staff table
        const { error: staffError } = await Supabase.from('staff')
          .update({ ward_num })
          .eq('staff_id', staff_id);
  
        if (staffError) {
          console.error('Error updating staff ward:', staffError);
        }
  
        // Update bed table
        const { error: bedError } = await Supabase.from('bed')
          .update({ ward_num })
          .eq('staff_id', staff_id);
  
        if (bedError) {
          console.error('Error updating bed ward:', bedError);
        }
  
        // Update appointment table
        const { error: appointmentError } = await Supabase.from('appointment')
          .update({ ward_num })
          .eq('staff_id', staff_id);
  
        if (appointmentError) {
          console.error('Error updating appointment ward:', appointmentError);
        }
  
        // Update in_patient table
        const { error: inPatientError } = await Supabase.from('in_patient')
          .update({ ward_num })
          .eq('staff_id', staff_id);
  
        if (inPatientError) {
          console.error('Error updating in_patient ward:', inPatientError);
        }
      }
  
      console.log('Staff wards and related tables updated successfully');
      setWardChanges({});
  
      // Fetch updated staff data
      const fetchUpdatedStaffData = async () => {
        try {
          const { data, error } = await Supabase.from('staff').select('*');
  
          if (error) {
            console.error('Error fetching updated staff data:', error);
          } else {
            setStaffData(data);
          }
        } catch (error) {
          console.error('Error fetching updated staff data:', error);
        }
      };
  
      fetchUpdatedStaffData();
    } catch (error) {
      console.error('Error updating staff wards and related tables:', error);
    }
  };

  return (
    <div>
      <Typography variant="h2">Staff Management</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ backgroundColor: 'lightgray' }}>
              Staff ID
            </TableCell>
            <TableCell align="center" sx={{ backgroundColor: 'lightgray' }}>
              First Name
            </TableCell>
            <TableCell align="center" sx={{ backgroundColor: 'lightgray' }}>
              Last Name
            </TableCell>
            <TableCell align="center" sx={{ backgroundColor: 'lightgray' }}>
              Date of Birth
            </TableCell>
            <TableCell align="center" sx={{ backgroundColor: 'lightgray' }}>
              Address
            </TableCell>
            <TableCell align="center" sx={{ backgroundColor: 'lightgray' }}>
              Sex
            </TableCell>
            <TableCell align="center" sx={{ backgroundColor: 'lightgray' }}>
              Ward
              <Select value={selectedWard} onChange={handleWardChange}>
                <MenuItem value="">All Wards</MenuItem>
                {[...Array(17).keys()].map((num) => (
                  <MenuItem key={num + 1} value={num + 1}>
                    Ward {num + 1}
                  </MenuItem>
                ))}
              </Select>
            </TableCell>
            <TableCell align="center" sx={{ backgroundColor: 'lightgray' }}>
              Change Ward
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredStaff.map((staff) => (
            <TableRow key={staff.staff_id}>
              <TableCell align="center" sx={{ backgroundColor: 'white' }}>
                {staff.staff_id}
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: 'white' }}>
                {staff.firstname}
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: 'white' }}>
                {staff.lastname}
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: 'white' }}>
                {staff.date_of_birth}
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: 'white' }}>
                {staff.address}
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: 'white' }}>
                {staff.sex}
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: 'white' }}>
                {staff.ward_num}
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: 'white' }}>
                <Select
                  value={wardChanges[staff.staff_id] || staff.ward_num}
                  onChange={(e) => handleStaffWardChange(staff, e.target.value)}
                >
                  {[...Array(17).keys()].map((num) => (
                    <MenuItem key={num + 1} value={num + 1}>
                      Ward {num + 1}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        variant="contained"
        color="inherit"
        sx={{ backgroundColor: 'white', marginTop: 2 }}
        onClick={saveWardChanges}
      >
        Save Ward Changes
      </Button>
    </div>
  );
};

export default StaffManagement;