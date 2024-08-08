import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Card,
  CardContent,
  Grid,
  Snackbar,
  Alert
} from '@mui/material';
import { fetchBrands, Brand } from '../services/BrandService';
import { fetchVehiclePartSuggestions, createVehiclePart, updateVehiclePart, VehiclePart } from '../services/VehiclePartService';
import { SelectChangeEvent } from '@mui/material';

const VehiclePartsPage: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [vehicleParts, setVehicleParts] = useState<VehiclePart[]>([]);
  const [open, setOpen] = useState(false);
  const [newVehiclePart, setNewVehiclePart] = useState<Partial<VehiclePart>>({
    partCode: '',
    name: '',
    price: 0,
    description: '',
    brand: { id: 0, name: '' },
  });
  const [editingVehiclePart, setEditingVehiclePart] = useState<VehiclePart | null>(null);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const brands = await fetchBrands();
        setBrands(brands);
        setSelectedBrand(brands[0]); // Set the first brand as the default selected brand
      } catch (error) {
        console.error('Failed to load brands:', error);
      }
    };

    loadBrands();
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      const loadVehicleParts = async () => {
        try {
          const vehicleParts = await fetchVehiclePartSuggestions(selectedBrand.id);
          setVehicleParts(vehicleParts);
        } catch (error) {
          console.error('Failed to load vehicle parts:', error);
        }
      };

      loadVehicleParts();
    }
  }, [selectedBrand]);

  const handleBrandChange = (event: SelectChangeEvent<number>) => {
    const brand = brands.find((b) => b.id === event.target.value as number);
    setSelectedBrand(brand || null);
  };

  const handleCreateClick = () => {
    setEditingVehiclePart(null); // Clear editing part
    setNewVehiclePart({
      partCode: '',
      name: '',
      price: 0,
      description: '',
      brand: selectedBrand || { id: 0, name: '' },
    });
    setOpen(true);
  };

  const handleEditClick = (vehiclePart: VehiclePart) => {
    setEditingVehiclePart(vehiclePart);
    setNewVehiclePart({
      partCode: vehiclePart.partCode,
      name: vehiclePart.name,
      price: vehiclePart.price,
      description: vehiclePart.description,
      brand: vehiclePart.brand,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingVehiclePart(null);
    setNewVehiclePart({
      partCode: '',
      name: '',
      price: 0,
      description: '',
      brand: { id: 0, name: '' },
    });
  };

  const handleSave = async () => {
    if (selectedBrand) {
      try {
        const createdVehiclePart = await createVehiclePart({ ...newVehiclePart, brand: selectedBrand });
        setVehicleParts((prevVehicleParts) => [...prevVehicleParts, createdVehiclePart]);
        handleClose();
        loadVehicleParts(selectedBrand.id); // Reload vehicle parts after saving
        setAlertMessage('Vehicle part created successfully!');
        setAlertSeverity('success');
        setAlertOpen(true);
      } catch (error) {
        console.error('Failed to create vehicle part:', error);
        setAlertMessage('Server error. Failed to create vehicle part.');
        setAlertSeverity('error');
        setAlertOpen(true);
      }
    }
  };

  const handleEditSave = async () => {
    if (selectedBrand && editingVehiclePart) {
      try {
        if (editingVehiclePart.id !== undefined) {
          const updatedVehiclePart = await updateVehiclePart(editingVehiclePart.id, { ...newVehiclePart, brand: selectedBrand });
          setVehicleParts((prevVehicleParts) =>
            prevVehicleParts.map((part) => (part.id === updatedVehiclePart.id ? updatedVehiclePart : part))
          );
          handleClose();
          loadVehicleParts(selectedBrand.id); // Reload vehicle parts after updating
          setAlertMessage('Vehicle part updated successfully!');
          setAlertSeverity('success');
          setAlertOpen(true);
        } else {
          console.error('Editing vehicle part does not have an ID');
        }
      } catch (error) {
        console.error('Failed to update vehicle part:', error);
        setAlertMessage('Server error. Failed to update vehicle part.');
        setAlertSeverity('error');
        setAlertOpen(true);
      }
    }
  };

  const loadVehicleParts = async (brandId: number) => {
    try {
      const vehicleParts = await fetchVehiclePartSuggestions(brandId);
      setVehicleParts(vehicleParts);
    } catch (error) {
      console.error('Failed to load vehicle parts:', error);
    }
  };

  const glassCardStyles = {
    borderRadius: '16px',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    background: 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  };

  const glassContentStyles = {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: '16px',
  };

  return (
    <div style={{ height: 600, width: '100%' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} paddingBottom={2}>
          <Card sx={glassCardStyles}>
            <CardContent sx={glassContentStyles}><h2>Vehicle Parts</h2></CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card sx={glassCardStyles}>
            <CardContent sx={glassContentStyles}>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Button variant="contained" color="primary" onClick={handleCreateClick}>
                  Create Vehicle Part
                </Button>
                <FormControl variant="outlined" style={{ minWidth: 200 }}>
                  <InputLabel id="brand-select-label">Brand</InputLabel>
                  <Select
                    labelId="brand-select-label"
                    id="brand-select"
                    value={selectedBrand ? selectedBrand.id : ''}
                    onChange={handleBrandChange}
                    label="Brand"
                  >
                    {brands.map((brand) => (
                      <MenuItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <DataGrid
                rows={vehicleParts}
                columns={[
                  { field: 'id', headerName: 'ID', width: 90, headerAlign: 'center' },
                  { field: 'partCode', headerName: 'Part Code', flex: 1, headerAlign: 'center' },
                  { field: 'name', headerName: 'Name', flex: 1, headerAlign: 'center' },
                  { field: 'price', headerName: 'Price', flex: 1, headerAlign: 'center' },
                  { field: 'description', headerName: 'Description', flex: 2, headerAlign: 'center' },
                  {
                    field: 'edit',
                    headerName: 'Edit',
                    width: 100,
                    renderCell: (params) => (
                      <Button variant="contained" color="primary" onClick={() => handleEditClick(params.row as VehiclePart)}>Edit</Button>
                    ),
                  },
                ]}
                pageSizeOptions={[5]}
                pagination
                autoHeight
                sx={{
                  '& .MuiDataGrid-root': {
                    border: 'none',
                  },
                  '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid red', // Red table lines
                    textAlign: 'center',
                  },
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: 'rgba(255, 165, 0, 0.2)', // Orange hover effect
                  },
                  '& .MuiDataGrid-columnHeader': {
                    backgroundColor: 'rgba(255, 165, 0, 0.6)', // Orange header background
                    color: '#000000',
                    fontWeight: 'bold',
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingVehiclePart ? 'Edit Vehicle Part' : 'Create Vehicle Part'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Part Code"
            fullWidth
            value={newVehiclePart.partCode}
            onChange={(e) => setNewVehiclePart({ ...newVehiclePart, partCode: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={newVehiclePart.name}
            onChange={(e) => setNewVehiclePart({ ...newVehiclePart, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            value={newVehiclePart.price}
            onChange={(e) => setNewVehiclePart({ ...newVehiclePart, price: Number(e.target.value) })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            value={newVehiclePart.description}
            onChange={(e) => setNewVehiclePart({ ...newVehiclePart, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancel</Button>
          <Button onClick={editingVehiclePart ? handleEditSave : handleSave} color="primary">
            {editingVehiclePart ? 'Save Changes' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default VehiclePartsPage;
