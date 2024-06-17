import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Container, Button, TextField, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, MenuItem, Select, InputLabel } from '@mui/material';
import { useParams } from 'react-router-dom';
import supabase from '../Services/Supabase';

function Pharmaceutical() {
    const { supplyId } = useParams();
    const [pharmaceuticalSupplies, setPharmaceuticalSupplies] = useState([]);
    const [supplies, setSupplies] = useState([]);
    const [selectedSupplyId, setSelectedSupplyId] = useState('');
    const [newDrugName, setNewDrugName] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newDosage, setNewDosage] = useState('');
    const [newMethodAdministration, setNewMethodAdministration] = useState('');
    const [newQuantityStock, setNewQuantityStock] = useState(0);
    const [newReorderLevel, setNewReorderLevel] = useState(0);
    const [newCostPerUnit, setNewCostPerUnit] = useState(0);

    useEffect(() => {
        fetchSupplies();
        fetchPharmaceuticalSupplies();
    }, [supplyId]);

    const fetchSupplies = async () => {
        try {
            const { data, error } = await supabase
                .from('supply')
                .select('supply_id, supplier_name');

            if (error) {
                throw error;
            }

            setSupplies(data);
        } catch (error) {
            console.error('Error fetching supplies:', error.message);
        }
    };

    const fetchPharmaceuticalSupplies = async () => {
        try {
            let query = supabase.from('pharmaceutical_supplies').select('*');
    
            if (supplyId) {
                query = query.eq('supply_id', supplyId);
            }
    
            const { data, error } = await query;
    
            if (error) {
                throw error;
            }
    
            setPharmaceuticalSupplies(data);
        } catch (error) {
            console.error('Error fetching pharmaceutical supplies:', error.message);
        }
    };

    const handleAddPharmaceutical = async () => {
        try {
            const newSupply = {
                supply_id: selectedSupplyId,
                drug_name: newDrugName,
                description: newDescription,
                dosage: newDosage,
                method_administration: newMethodAdministration,
                quantity_stock: newQuantityStock,
                reorder_level: newReorderLevel,
                cost_per_unit: newCostPerUnit
            };
    
            console.log('Data to be inserted:', newSupply);
    
            const { data, error } = await supabase
                .from('pharmaceutical_supplies')
                .insert([newSupply])
                .select();
    
            if (error) {
                console.error('Supabase error:', error);
                throw error;
            }
    
            console.log('Supabase response data:', data);
    
            if (data) {
                setPharmaceuticalSupplies([...pharmaceuticalSupplies, data]);
                clearForm(); // Clear the form after successful insertion
            } else {
                console.error('Error adding pharmaceutical supply: Data is empty');
            }
        } catch (error) {
            console.error('Error adding pharmaceutical supply:', error.message);
        }
    };
    
    
    

    const clearForm = () => {
        setNewDrugName('');
        setNewDescription('');
        setNewDosage('');
        setNewMethodAdministration('');
        setNewQuantityStock(0);
        setNewReorderLevel(0);
        setNewCostPerUnit(0);
        setSelectedSupplyId('');
    };

    return (
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 4 }}>
                        <Typography variant="h5" gutterBottom>
                            Add New Pharmaceutical Supply
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <InputLabel id="supplier-select-label">Select Supplier</InputLabel>
                                <Select
                                    labelId="supplier-select-label"
                                    id="supplier-select"
                                    value={selectedSupplyId}
                                    onChange={(e) => setSelectedSupplyId(e.target.value)}
                                    fullWidth
                                >
                                    {supplies.map((supply) => (
                                        <MenuItem key={supply.supply_id} value={supply.supply_id}>
                                            {supply.supplier_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Drug Name"
                                    fullWidth
                                    value={newDrugName}
                                    onChange={(e) => setNewDrugName(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Description"
                                    fullWidth
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Dosage"
                                    fullWidth
                                    value={newDosage}
                                    onChange={(e) => setNewDosage(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Method of Administration"
                                    fullWidth
                                    value={newMethodAdministration}
                                    onChange={(e) => setNewMethodAdministration(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    type="number"
                                    label="Quantity in Stock"
                                    fullWidth
                                    value={newQuantityStock}
                                    onChange={(e) => setNewQuantityStock(parseInt(e.target.value))}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    type="number"
                                    label="Reorder Level"
                                    fullWidth
                                    value={newReorderLevel}
                                    onChange={(e) => setNewReorderLevel(parseInt(e.target.value))}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    type="number"
                                    label="Cost per Unit"
                                    fullWidth
                                    value={newCostPerUnit}
                                    onChange={(e) => setNewCostPerUnit(parseFloat(e.target.value))}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button onClick={handleAddPharmaceutical} variant="contained" sx={{ mt: 2 }}>
                                    Add Pharmaceutical Supply
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            <Typography variant="h5" sx={{ mt: 4 }}>
                Pharmaceutical Supplies
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Drug Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Dosage</TableCell>
                            <TableCell>Method of Administration</TableCell>
                            <TableCell>Quantity in Stock</TableCell>
                            <TableCell>Reorder Level</TableCell>
                            <TableCell>Cost per Unit</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pharmaceuticalSupplies.map((supply, index) => (
                            <TableRow key={index}>
                                <TableCell>{supply.drug_name}</TableCell>
                                <TableCell>{supply.description}</TableCell>
                                <TableCell>{supply.dosage}</TableCell>
                                <TableCell>{supply.method_administration}</TableCell>
                                <TableCell>{supply.quantity_stock}</TableCell>
                                <TableCell>{supply.reorder_level}</TableCell>
                                <TableCell>{supply.cost_per_unit}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default Pharmaceutical;
