import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Card, CardContent, Snackbar, Alert } from '@mui/material';
import { fetchBrands, createBrand, Brand } from '../services/BrandService';

const BrandPage: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [open, setOpen] = useState(false);
  const [newBrand, setNewBrand] = useState<Partial<Brand>>({ name: '', code: '', description: '' });

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const brands = await fetchBrands();
        setBrands(brands);
      } catch (error) {
        console.error('Failed to load brands:', error);
        setAlertMessage('Failed to load brands');
        setAlertSeverity('error');
        setAlertOpen(true);
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
      setAlertMessage('Brand created successfully!');
      setAlertSeverity('success');
      setAlertOpen(true);
      handleClose();
    } catch (error) {
      console.error('Failed to create brand:', error);
      setAlertMessage('Server error. Failed to create brand.');
      setAlertSeverity('error');
      setAlertOpen(true);
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
            <CardContent sx={glassContentStyles}><h2>Brands</h2></CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card sx={glassCardStyles}>
            <CardContent sx={glassContentStyles}>
              <Button variant="contained" color="primary" onClick={handleCreateClick} style={{ marginBottom: '10px' }}>
                Create Brand
              </Button>
              <DataGrid
                rows={brands}
                columns={[
                  { field: 'id', headerName: 'ID', width: 90, headerAlign: 'center' },
                  { field: 'name', headerName: 'Name', flex: 1, headerAlign: 'center' },
                  { field: 'code', headerName: 'Code', width: 150, headerAlign: 'center' },
                  { field: 'description', headerName: 'Description', flex: 2, headerAlign: 'center' },
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
                    backgroundColor: 'black',
                    color: 'white',
                    fontWeight: 'bold',
                  },
                  '& .MuiDataGrid-columnHeaderTitle': {
                    color: 'white',
                    fontWeight: 'bold',
                  },
                }}
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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

export default BrandPage;
