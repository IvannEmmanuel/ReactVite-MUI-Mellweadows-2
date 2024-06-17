// Supplies.jsx

import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Container, Button, TextField, Table, TableContainer, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import supabase from '../Services/Supabase';

function Supplies() {
    const [supplies, setSupplies] = useState([]);
    const [newSupplierName, setNewSupplierName] = useState('');
    const [newSupplierAddress, setNewSupplierAddress] = useState('');
    const [newTelephoneNumber, setNewTelephoneNumber] = useState('');
    const [newFaxNumber, setNewFaxNumber] = useState('');

    useEffect(() => {
        fetchSupplies();
    }, []);

    const fetchSupplies = async () => {
        try {
            const { data, error } = await supabase
                .from('supply')
                .select('*');

            if (error) {
                throw error;
            }

            setSupplies(data);
        } catch (error) {
            console.error('Error fetching supplies:', error.message);
        }
    };

    const handleAddSupply = async () => {
        try {
            const { data, error } = await supabase
                .from('supply')
                .insert([
                    {
                        supplier_name: newSupplierName,
                        supplier_address: newSupplierAddress,
                        telephone_number: newTelephoneNumber.toString(), // Convert to string
                        fax_number: newFaxNumber
                    }
                ])
                .single();
    
            console.log('Supabase response:', data, error);
    
            if (error) {
                throw error;
            }
    
            if (data) {
                // Update supplies state by adding the newly inserted supply to the existing supplies array
                setSupplies([...supplies, data]);
            } else {
                // If the API response is empty, insert the data manually
                const newSupply = {
                    supplier_name: newSupplierName,
                    supplier_address: newSupplierAddress,
                    telephone_number: newTelephoneNumber, // No need to convert to string here
                    fax_number: newFaxNumber
                };
                setSupplies([...supplies, newSupply]);
            }
    
            clearForm();
        } catch (error) {
            console.error('Error adding supply:', error.message);
        }
    };
    

    const clearForm = () => {
        setNewSupplierName('');
        setNewSupplierAddress('');
        setNewTelephoneNumber('');
        setNewFaxNumber('');
    };

    return (
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 4 }}>
                        <Typography variant="h5" gutterBottom>
                            Add New Supply
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    label="Supplier Name"
                                    fullWidth
                                    value={newSupplierName}
                                    onChange={(e) => setNewSupplierName(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Supplier Address"
                                    fullWidth
                                    value={newSupplierAddress}
                                    onChange={(e) => setNewSupplierAddress(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Telephone Number"
                                    fullWidth
                                    value={newTelephoneNumber}
                                    onChange={(e) => setNewTelephoneNumber(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Fax Number"
                                    fullWidth
                                    value={newFaxNumber}
                                    onChange={(e) => setNewFaxNumber(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button onClick={handleAddSupply} variant="contained" sx={{ mt: 2 }}>
                                    Add Supply
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            <Typography variant="h5" sx={{ mt: 4 }}>
                Current Supplies
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }} style={{ overflowY: 'auto', maxHeight: '300px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Supplier Name</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Telephone Number</TableCell>
                            <TableCell>Fax Number</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {supplies.map((supply, index) => (
                            <TableRow key={index}>
                                <TableCell>{supply.supplier_name}</TableCell>
                                <TableCell>{supply.supplier_address}</TableCell>
                                <TableCell>{supply.telephone_number}</TableCell>
                                <TableCell>{supply.fax_number}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default Supplies;
