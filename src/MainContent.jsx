import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import Supabase from './Services/Supabase';

const MainContent = () => {
  const [waitingList, setWaitingList] = useState([]);
  const [inPatients, setInPatients] = useState([]);
  const [outPatients, setOutPatients] = useState([]);

  useEffect(() => {
    const fetchWaitingList = async () => {
      try {
        const { data, error } = await Supabase
          .from('wait_list')
          .select(
            `*, 
             patient:patient_id (
               firstname,
               lastname,
               sex,
               address,
               birthday,
               marital_status,
               cellphone_number,
               date_registered
             )`
          );

        if (error) {
          throw error;
        }

        setWaitingList(data || []);
      } catch (error) {
        console.error('Error fetching waiting list:', error.message);
      }
    };

    const fetchOutPatients = async () => {
      try {
        const { data, error } = await Supabase
          .from('out_patient')
          .select(
            `*, 
             patient:patient_id (
               firstname,
               lastname,
               sex,
               address,
               birthday,
               marital_status,
               cellphone_number,
               date_registered
             )`
          );

        if (error) {
          throw error;
        }

        setOutPatients(data || []);
      } catch (error) {
        console.error('Error fetching out patients:', error.message);
      }
    };

    const fetchInPatients = async () => {
      try {
        const { data, error } = await Supabase
          .from('in_patient')
          .select(
            `
              *,
              patient:patient_id (
                firstname,
                lastname,
                sex,
                address,
                birthday,
                marital_status,
                cellphone_number,
                date_registered
              )
            `
          )
          .range(0, 20)
          .order('patient_id', { ascending: true });

        if (error) {
          throw error;
        }

        setInPatients(data || []);
      } catch (error) {
        console.error('Error fetching in-patients:', error.message);
      }
    };

    fetchWaitingList();
    fetchOutPatients();
    fetchInPatients();
  }, []);

  const handleAddOutPatient = async (patient) => {
    try {
      const { data, error } = await Supabase
        .from('out_patient')
        .insert([{ patient_id: patient.patient_id, kin_id: patient.kin_id }]);

      if (error) {
        throw error;
      }

      const updatedWaitingList = waitingList.filter(p => p.patient_id !== patient.patient_id);
      setWaitingList(updatedWaitingList);

      setOutPatients(prevOutPatients => [...prevOutPatients, patient]);

      alert('Patient added to Out Patients successfully!');
    } catch (error) {
      console.error('Error adding patient to Out Patients:', error.message);
      alert('Failed to add patient to Out Patients. Please try again.');
    }
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h1" sx={{ fontSize: '60px', textAlign: 'center', fontWeight: 700 , marginTop: 7 }}>
              124
            </Typography>
            <Typography variant="h1" sx={{ fontSize: '30px', textAlign: 'center', backgroundColor: 'rgb(120, 231, 120)', marginTop: 7 }}>
              TOTAL PATIENT
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h1" sx={{ 
              fontSize: '60px',
              textAlign: 'center',
              marginTop: 7,
              fontWeight: 700,
            }}>
              50
            </Typography>
            <Typography variant="h1" sx={{ 
              fontSize: '30px',
              textAlign: 'center',
              backgroundColor: 'rgb(120, 231, 120)',
              marginTop: 7 
            }}>
              BED CAPACITY
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h1" sx={{ fontSize: '60px', textAlign: 'center', marginTop: 7, fontWeight: 700 }}>
              124
            </Typography>
            <Typography variant="h1" sx={{ fontSize: '30px', textAlign: 'center', backgroundColor: 'rgb(120, 231, 120)', marginTop: 7 }}>
              STAFFS
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Typography sx={{ marginTop: 5, fontSize: '30px', marginBottom: 5, fontFamily: 'Helvetica, sans-serif'}}>
        Waiting List:
      </Typography>

      <TableContainer component={Paper} sx={{ marginTop: 2, maxHeight: '50vh', overflow: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="waiting-list table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Patient Name</TableCell>
              <TableCell align="center">Gender</TableCell>
              <TableCell align="center">Address</TableCell>
              <TableCell align="center">Birthday</TableCell>
              <TableCell align="center">Marital Status</TableCell>
              <TableCell align="center">Cellphone Number</TableCell>
              <TableCell align="center">Date Registered</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {waitingList.map((patient, index) => (
              <TableRow key={index}>
                <TableCell align="center">{`${patient.patient.firstname} ${patient.patient.lastname}`}</TableCell>
                <TableCell align="center">{patient.patient.sex}</TableCell>
                <TableCell align="center">{patient.patient.address}</TableCell>
                <TableCell align="center">{patient.patient.birthday}</TableCell>
                <TableCell align="center">{patient.patient.marital_status}</TableCell>
                <TableCell align="center">{patient.patient.cellphone_number}</TableCell>
                <TableCell align="center">{patient.patient.date_registered}</TableCell>
                <TableCell align="center">
                  <Button variant="contained" color="primary" onClick={() => handleAddOutPatient(patient)}>
                    Add to Out Patients
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography sx={{ marginTop: 5, fontSize: '30px', marginBottom: 5, fontFamily: 'Helvetica, sans-serif' }}>
        In Patients
      </Typography>

      <TableContainer component={Paper} sx={{ marginTop: 2, maxHeight: '50vh', overflow: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="in-patients table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Patient Name</TableCell>
              <TableCell align="center">Gender</TableCell>
              <TableCell align="center">Address</TableCell>
              <TableCell align="center">Birthday</TableCell>
              <TableCell align="center">Marital Status</TableCell>
              <TableCell align="center">Cellphone Number</TableCell>
              <TableCell align="center">Date Registered</TableCell>
              <TableCell align="center">Ward Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inPatients.map((inpatient, index) => (
              <TableRow key={index}>
                <TableCell align="center">{`${inpatient.patient.firstname} ${inpatient.patient.lastname}`}</TableCell>
                <TableCell align="center">{inpatient.patient.sex}</TableCell>
                <TableCell align="center">{inpatient.patient.address}</TableCell>
                <TableCell align="center">{inpatient.patient.birthday}</TableCell>
                <TableCell align="center">{inpatient.patient.marital_status}</TableCell>
                <TableCell align="center">{inpatient.patient.cellphone_number}</TableCell>
                <TableCell align="center">{inpatient.patient.date_registered}</TableCell>
                <TableCell align="center">{inpatient.ward_num || 'Not assigned'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography sx={{ marginTop: 5, fontSize: '30px', marginBottom: 5, fontFamily: 'Helvetica, sans-serif' }}>
        Out Patients
      </Typography>

      <TableContainer component={Paper} sx={{ marginTop: 2, maxHeight: '50vh', overflow: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="out-patients table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Patient Name</TableCell>
              <TableCell align="center">Gender</TableCell>
              <TableCell align="center">Address</TableCell>
              <TableCell align="center">Birthday</TableCell>
              <TableCell align="center">Marital Status</TableCell>
              <TableCell align="center">Cellphone Number</TableCell>
              <TableCell align="center">Date Registered</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {outPatients.map((outPatient, index) => (
              <TableRow key={index}>
                <TableCell align="center">{`${outPatient.patient.firstname} ${outPatient.patient.lastname}`}</TableCell>
                <TableCell align="center">{outPatient.patient.sex}</TableCell>
                <TableCell align="center">{outPatient.patient.address}</TableCell>
                <TableCell align="center">{outPatient.patient.birthday}</TableCell>
                <TableCell align="center">{outPatient.patient.marital_status}</TableCell>
                <TableCell align="center">{outPatient.patient.cellphone_number}</TableCell>
                <TableCell align="center">{outPatient.patient.date_registered}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default MainContent;
