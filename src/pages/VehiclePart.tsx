import React, { useEffect, useState } from 'react';
import { DataGrid, GridCellEditStopParams } from '@mui/x-data-grid';
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
      } catch (error) {
        console.error('Failed to create vehicle part:', error);
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
        } else {
          console.error('Editing vehicle part does not have an ID');
        }
      } catch (error) {
        console.error('Failed to update vehicle part:', error);
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

  return (
    <div style={{ height: 600, width: '100%' }}>
      <h2>Vehicle Parts</h2>
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
          { field: 'id', headerName: 'ID', flex: 1 },
          { field: 'partCode', headerName: 'Part Code', flex: 1 },
          { field: 'name', headerName: 'Name', flex: 1 },
          { field: 'price', headerName: 'Price', flex: 1 },
          { field: 'description', headerName: 'Description', flex: 1 },
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
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingVehiclePart ? 'Edit Vehicle Part' : 'Create Vehicle Part'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Part Code"
            type="text"
            fullWidth
            variant="standard"
            value={newVehiclePart.partCode}
            onChange={(e) => setNewVehiclePart({ ...newVehiclePart, partCode: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={newVehiclePart.name}
            onChange={(e) => setNewVehiclePart({ ...newVehiclePart, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            variant="standard"
            value={newVehiclePart.price}
            onChange={(e) => setNewVehiclePart({ ...newVehiclePart, price: parseFloat(e.target.value) })}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            value={newVehiclePart.description}
            onChange={(e) => setNewVehiclePart({ ...newVehiclePart, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={editingVehiclePart ? handleEditSave : handleSave}>
            {editingVehiclePart ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default VehiclePartsPage;
