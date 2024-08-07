import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { fetchBrands, createBrand, Brand } from '../services/BrandService';

const BrandPage: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [open, setOpen] = useState(false);
  const [newBrand, setNewBrand] = useState<Partial<Brand>>({ name: '', code: '', description: '' });

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const brands = await fetchBrands();
        setBrands(brands);
      } catch (error) {
        console.error('Failed to load brands:', error);
      }
    };

    loadBrands();
  }, []);

  const handleCreateClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewBrand({ name: '', code: '', description: '' });
  };

  const handleSave = async () => {
    try {
      const createdBrand = await createBrand(newBrand);
      setBrands((prevBrands) => [...prevBrands, createdBrand]);
      handleClose();
    } catch (error) {
      console.error('Failed to create brand:', error);
    }
  };

  return (
    <div style={{ height: 600, width: '100%' }}>
      <h2>Brands</h2>
      <Button variant="contained" color="primary" onClick={handleCreateClick} style={{ marginBottom: '10px' }}>
        Create Brand
      </Button>
      <DataGrid
        rows={brands}
        columns={[
          { field: 'id', headerName: 'ID', flex: 1 },
          { field: 'name', headerName: 'Name', flex: 1 },
          { field: 'code', headerName: 'Code', flex: 1 },
          { field: 'description', headerName: 'Description', flex: 2 },
        ]}
        pageSizeOptions={[5]}
        pagination
        autoHeight
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Brand</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={newBrand.name}
            onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Code"
            type="text"
            fullWidth
            variant="standard"
            value={newBrand.code}
            onChange={(e) => setNewBrand({ ...newBrand, code: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            value={newBrand.description}
            onChange={(e) => setNewBrand({ ...newBrand, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BrandPage;
