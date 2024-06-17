import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Container } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import supabase from '../Services/Supabase';

function Ward() {
    const [wards, setWards] = useState([]);
    const [selectedWard, setSelectedWard] = useState(null);

    useEffect(() => {
        fetchWards();
    }, []);

    const fetchWards = async () => {
        try {
            const { data: bedsData, error } = await supabase
                .from('bed')
                .select('*, patient:patient_id(*), staff:staff_id(*)') // Ensure this is correct
                .order('ward_num', { ascending: true });
    
            if (error) {
                throw error;
            }
    
            // Log the fetched data
            console.log("Fetched Beds Data: ", bedsData);
    
            // Group beds data by ward_num to display in the grid
            const groupedByWard = Array.from({ length: 17 }, (_, index) => {
                const wardNum = index + 1;
                const filteredBeds = bedsData.filter(bed => bed.ward_num === wardNum);
                // Determine the total number of beds based on ward index
                const totalBeds = index === 0 || index === 3 ? 15 : 14;
                const occupiedBeds = filteredBeds.filter(bed => bed.patient_id !== null).length;
                const availableBeds = totalBeds - occupiedBeds;
                const isFull = availableBeds === 0;
                return {
                    wardNum,
                    beds: filteredBeds,
                    availableBeds,
                    isFull
                };
            });
    
            setWards(groupedByWard);
        } catch (error) {
            console.error('Error fetching wards:', error.message);
        }
    };
    
    
    

    const handleWardButtonClick = (wardNum) => {
        setSelectedWard(wardNum);
    };

    const getWardName = (wardNum) => {
        const wardNames = ['ICU', 'NICU', 'Pediatrics', 'Maternity', 'Surgical', 'Emergency', 'Medical', 'Orthopedic', 'Cardiology', 'Oncology', 'Psychiatric', 'Burn Unit', 'Neurology', 'Geriatic', 'Rehabilitation', 'Isolation', 'Hematology'];
        return wardNames[wardNum - 1];
    };

    return (
        <Container>
            <Grid container spacing={2} style={{ overflowY: 'auto', maxHeight: '250px' }}>
                {wards.map((ward, index) => (
                    <Grid key={index} item xs={4}>
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <Button
                                onClick={() => handleWardButtonClick(ward.wardNum)}
                                variant="contained"
                                sx={{
                                    textTransform: 'none',
                                    fontSize: '20px',
                                    width: '100%',
                                    height: '100px',
                                    backgroundColor: 'white',
                                    color: 'black',
                                    '&:hover': {
                                        backgroundColor: 'rgb(234, 234, 234)',
                                    },
                                }}
                            >
                                {`Ward ${ward.wardNum}: ${getWardName(ward.wardNum)}`}
                            </Button>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontSize: '20px',
                                    textAlign: 'center',
                                    marginTop: 2,
                                    backgroundColor: ward.isFull ? 'rgb(255, 204, 204)' : 'rgb(120, 231, 120)',
                                    color: 'white',
                                    padding: '10px 0'
                                }}
                            >
                                {ward.isFull ? 'Full Capacity' : `Available Beds: ${ward.availableBeds}`}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Typography sx={{ fontSize: '30px', marginTop: 5, marginBottom: 5, fontWeight: 700 }}>
                {selectedWard !== null ? `WARD ${selectedWard}` : ''}
            </Typography>

            {selectedWard !== null && (
                <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                    <Table sx={{ minWidth: 650 }} aria-label="ward-patients table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Patient Name</TableCell>
                                <TableCell align="center">Gender</TableCell>
                                <TableCell align="center">Address</TableCell>
                                <TableCell align="center">Date of Birth</TableCell>
                                <TableCell align="center">Marital Status</TableCell>
                                <TableCell align="center">Cellphone Number</TableCell>
                                <TableCell align="center">Staff name</TableCell>
                                <TableCell align="center">Ward Name</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {wards
                                .find(ward => ward.wardNum === selectedWard)
                                .beds.map((bed, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="center">{`${bed.patient?.firstname ?? 'N/A'} ${bed.patient?.lastname ?? ''}`}</TableCell>
                                        <TableCell align="center">{bed.patient?.sex ?? 'N/A'}</TableCell>
                                        <TableCell align="center">{bed.patient?.address ?? 'N/A'}</TableCell>
                                        <TableCell align="center">{bed.patient?.birthday ?? 'N/A'}</TableCell>
                                        <TableCell align="center">{bed.patient?.marital_status ?? 'N/A'}</TableCell>
                                        <TableCell align="center">{bed.patient?.cellphone_number ?? 'N/A'}</TableCell>
                                        {/* Display staff information with a conditional check */}
                                        <TableCell align="center">
                                            {bed.staff ? `${bed.staff.firstname ?? 'N/A'} ${bed.staff.lastname ?? ''}` : 'N/A'}
                                        </TableCell>
                                        <TableCell align="center">{getWardName(bed.ward_num)}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
}

export default Ward;
