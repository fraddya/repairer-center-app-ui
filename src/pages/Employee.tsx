import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Card,
  CardContent,
  Grid,
  Snackbar,
  Alert,
  Box,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { fetchEmployees, User, updateUser, createUser } from '../services/userService';

const EmployeePage: React.FC = () => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Partial<User>>({
    firstName: '',
    lastName: '',
    contactNo: '',
    age: 0,
    genderType: '',
    nic: '',
    nationality: '',
    religion: '',
    email: '',
    passWord: '',
    role: 'EMPLOYEE', // Default value; hidden from UI
  });
  const [editingEmployee, setEditingEmployee] = useState<User | null>(null);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const employees = await fetchEmployees();
      setEmployees(employees);
    } catch (error) {
      console.error('Failed to load employees:', error);
    }
  };

  const handleCreateClick = () => {
    setEditingEmployee(null);
    setNewEmployee({
      firstName: '',
      lastName: '',
      contactNo: '',
      age: 0,
      genderType: '',
      nic: '',
      nationality: '',
      religion: '',
      email: '',
      passWord: '',
      role: 'EMPLOYEE', // Default value; hidden from UI
    });
    setOpen(true);
  };

  const handleEditClick = (employee: User) => {
    setEditingEmployee(employee);
    setNewEmployee({
      firstName: employee.firstName,
      lastName: employee.lastName,
      contactNo: employee.contactNo,
      age: employee.age,
      genderType: employee.genderType,
      nic: employee.nic,
      nationality: employee.nationality,
      religion: employee.religion,
      email: employee.email,
      passWord: employee.passWord,
      role: employee.role, // Ensure role is included for edit
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingEmployee(null);
    setNewEmployee({
      firstName: '',
      lastName: '',
      contactNo: '',
      age: 0,
      genderType: '',
      nic: '',
      nationality: '',
      religion: '',
      email: '',
      passWord: '',
      role: 'EMPLOYEE', // Default value; hidden from UI
    });
  };

  const handleSave = async () => {
    try {
      const createdEmployee = await createUser(newEmployee as User);
      setEmployees((prevEmployees) => [...prevEmployees, createdEmployee]);
      handleClose();
      setAlertMessage('Employee created successfully!');
      setAlertSeverity('success');
      setAlertOpen(true);
    } catch (error) {
      console.error('Failed to create employee:', error);
      setAlertMessage('Server error. Failed to create employee.');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const handleEditSave = async () => {
    if (editingEmployee && editingEmployee.id !== undefined) {
      try {
        const updatedEmployee = await updateUser(editingEmployee.id, newEmployee as User);
        setEmployees((prevEmployees) =>
          prevEmployees.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
        );
        handleClose();
        setAlertMessage('Employee updated successfully!');
        setAlertSeverity('success');
        setAlertOpen(true);
      } catch (error) {
        console.error('Failed to update employee:', error);
        setAlertMessage('Server error. Failed to update employee.');
        setAlertSeverity('error');
        setAlertOpen(true);
      }
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.firstName.toLowerCase().includes(searchTerm) ||
      employee.lastName.toLowerCase().includes(searchTerm) ||
      employee.email.toLowerCase().includes(searchTerm) ||
      employee.nic.toLowerCase().includes(searchTerm)
  );

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

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90, headerAlign: 'center' },
    { field: 'firstName', headerName: 'First Name', flex: 1, headerAlign: 'center' },
    { field: 'lastName', headerName: 'Last Name', flex: 1, headerAlign: 'center' },
    { field: 'contactNo', headerName: 'Contact Number', flex: 1, headerAlign: 'center' },
    { field: 'age', headerName: 'Age', width: 100, headerAlign: 'center' },
    { field: 'genderType', headerName: 'Gender', width: 100, headerAlign: 'center' },
    { field: 'nic', headerName: 'NIC', flex: 1, headerAlign: 'center' },
    { field: 'nationality', headerName: 'Nationality', width: 120, headerAlign: 'center' },
    { field: 'religion', headerName: 'Religion', width: 120, headerAlign: 'center' },
    { field: 'email', headerName: 'Email', flex: 1, headerAlign: 'center' },
    {
      field: 'edit',
      headerName: 'Edit',
      width: 100,
      renderCell: (params) => (
        <Button variant="contained" color="primary" onClick={() => handleEditClick(params.row as User)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div style={{ height: 600, width: '100%' }}>
      <Grid item xs={12} sm={12} md={12} paddingBottom={2}>
          <Card sx={glassCardStyles}>
            <CardContent sx={glassContentStyles}><h2>Employee</h2></CardContent>
          </Card>
        </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card sx={glassCardStyles}>
            <CardContent sx={glassContentStyles}>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Button variant="contained" color="primary" onClick={handleCreateClick}>
                  Create Employee
                </Button>
                <TextField
                  variant="outlined"
                  placeholder="Search by First Name, Last Name, Email, or NIC"
                  value={searchTerm}
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <DataGrid
                rows={filteredEmployees}
                columns={columns}
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
        <DialogTitle>{editingEmployee ? 'Edit Employee' : 'Create Employee'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="First Name"
            fullWidth
            value={newEmployee.firstName}
            onChange={(e) => setNewEmployee({ ...newEmployee, firstName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Last Name"
            fullWidth
            value={newEmployee.lastName}
            onChange={(e) => setNewEmployee({ ...newEmployee, lastName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Contact Number"
            fullWidth
            value={newEmployee.contactNo}
            onChange={(e) => setNewEmployee({ ...newEmployee, contactNo: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Age"
            type="number"
            fullWidth
            value={newEmployee.age}
            onChange={(e) => setNewEmployee({ ...newEmployee, age: Number(e.target.value) })}
          />
          <TextField
            margin="dense"
            label="Gender"
            fullWidth
            value={newEmployee.genderType}
            onChange={(e) => setNewEmployee({ ...newEmployee, genderType: e.target.value })}
          />
          <TextField
            margin="dense"
            label="NIC"
            fullWidth
            value={newEmployee.nic}
            onChange={(e) => setNewEmployee({ ...newEmployee, nic: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Nationality"
            fullWidth
            value={newEmployee.nationality}
            onChange={(e) => setNewEmployee({ ...newEmployee, nationality: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Religion"
            fullWidth
            value={newEmployee.religion}
            onChange={(e) => setNewEmployee({ ...newEmployee, religion: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={newEmployee.email}
            onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={newEmployee.passWord}
            onChange={(e) => setNewEmployee({ ...newEmployee, passWord: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {editingEmployee ? (
            <Button onClick={handleEditSave}>Save</Button>
          ) : (
            <Button onClick={handleSave}>Save</Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar open={alertOpen} 
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

export default EmployeePage;
