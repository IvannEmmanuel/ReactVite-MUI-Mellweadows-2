import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Container, Button, TextField, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Select, MenuItem } from '@mui/material';
import { useParams } from 'react-router-dom';
import supabase from '../Services/Supabase';

function Surgical() {
    const { supplyId } = useParams();
    const [surgicalSupplies, setSurgicalSupplies] = useState([]);
    const [supplyOptions, setSupplyOptions] = useState([]);
    const [newName, setNewName] = useState('');
    const [newItemDescription, setNewItemDescription] = useState('');
    const [newQuantityStock, setNewQuantityStock] = useState(0);
    const [newReorderLevel, setNewReorderLevel] = useState(0);
    const [newCostPerUnit, setNewCostPerUnit] = useState(0);
    const [selectedSupplyId, setSelectedSupplyId] = useState('');

    useEffect(() => {
        fetchSurgicalSupplies();
        fetchSupplyOptions();
    }, []);

    const fetchSurgicalSupplies = async () => {
        try {
            const { data, error } = await supabase
                .from('surgical_supplies')
                .select('*');

            if (error) {
                throw error;
            }

            setSurgicalSupplies(data || []);
        } catch (error) {
            console.error('Error fetching surgical supplies:', error.message);
        }
    };

    const fetchSupplyOptions = async () => {
        try {
            const { data, error } = await supabase
                .from('supply')
                .select('supply_id, supplier_name');

            if (error) {
                throw error;
            }

            setSupplyOptions(data);
        } catch (error) {
            console.error('Error fetching supply options:', error.message);
        }
    };

    const handleAddSurgical = async () => {
        try {
            const { error } = await supabase
                .from('surgical_supplies')
                .insert([
                    {
                        supply_id: selectedSupplyId,
                        name: newName,
                        item_description: newItemDescription,
                        quantity_stock: newQuantityStock,
                        reorder_level: newReorderLevel,
                        cost_per_unit: newCostPerUnit
                    }
                ]);

            if (error) {
                throw error;
            }

            // Update local state without relying on inserted data
            const newSupply = {
                supply_id: selectedSupplyId,
                name: newName,
                item_description: newItemDescription,
                quantity_stock: newQuantityStock,
                reorder_level: newReorderLevel,
                cost_per_unit: newCostPerUnit
            };

            setSurgicalSupplies([...surgicalSupplies, newSupply]);
            clearForm();
        } catch (error) {
            console.error('Error adding surgical supply:', error.message);
        }
    };

    const clearForm = () => {
        setNewName('');
        setNewItemDescription('');
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
                            Add New Surgical Supply
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    label="Name"
                                    fullWidth
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Item Description"
                                    fullWidth
                                    value={newItemDescription}
                                    onChange={(e) => setNewItemDescription(e.target.value)}
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
                            <Grid item xs={6}>
                                <Select
                                    value={selectedSupplyId}
                                    onChange={(e) => setSelectedSupplyId(e.target.value)}
                                    fullWidth
                                    displayEmpty
                                    placeholder="Select Supplier"
                                >
                                    {supplyOptions.map((option) => (
                                        <MenuItem key={option.supply_id} value={option.supply_id}>
                                            {option.supplier_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                            <Grid item xs={12}>
                                <Button onClick={handleAddSurgical} variant="contained" sx={{ mt: 2 }}>
                                    Add Surgical Supply
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            <Typography variant="h5" sx={{ mt: 4 }}>
                Surgical Supplies
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Item Description</TableCell>
                            <TableCell>Quantity in Stock</TableCell>
                            <TableCell>Reorder Level</TableCell>
                            <TableCell>Cost per Unit</TableCell>
                            <TableCell>Supply ID</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {surgicalSupplies.map((supply, index) => (
                            <TableRow key={index}>
                                <TableCell>{supply.name}</TableCell>
                                <TableCell>{supply.item_description}</TableCell>
                                <TableCell>{supply.quantity_stock}</TableCell>
                                <TableCell>{supply.reorder_level}</TableCell>
                                <TableCell>{supply.cost_per_unit}</TableCell>
                                <TableCell>{supply.supply_id}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default Surgical;
