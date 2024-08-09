import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Divider, MenuItem, FormControl, Select, InputLabel, Grid, Card, CardContent, Snackbar, Alert } from '@mui/material';
import { fetchJobs, assingJob, Job } from '../../services/JobService';
import { fetchEmployees } from '../../services/userService';
import { User } from '../../services/userService';

const EmployeeAssign: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [expandedJob, setExpandedJob] = useState<Job | null>(null);
  const [employees, setEmployees] = useState<User[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const jobs = await fetchJobs('CONFIRM');
        setJobs(jobs);
      } catch (error) {
        console.error('Failed to load jobs:', error);
        setSnackbarMessage('Failed to load jobs');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    };

    const loadEmployees = async () => {
      try {
        const employees = await fetchEmployees();
        setEmployees(employees);
      } catch (error) {
        console.error('Failed to load employees:', error);
        setSnackbarMessage('Failed to load employees');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    };

    loadJobs();
    loadEmployees();
  }, []);

  const handleEditClick = (job: Job) => {
    setSelectedJob(job);
    setOpen(true);
  };

  const handleRowClick = (params: any) => {
    const job = params.row;
    setExpandedJob(job);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedJob(null);
  };

  const handleSave = async () => {
    if (selectedJob && selectedJob.assignEmployee) {
      try {
        // Extract the ID from the selected employee
        const employeeId = selectedJob.assignEmployee.id;
  
        // Call assingJob with the job ID and employee ID
        await assingJob(selectedJob.id, employeeId);
        
        setSnackbarMessage('Employee assigned successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setOpen(false);
        setSelectedJob(null);
  
        // Reload jobs after assignment
        const updatedJobs = await fetchJobs('CONFIRM');
        setJobs(updatedJobs);
      } catch (error) {
        console.error('Failed to assign job:', error);
        setSnackbarMessage('Server Error');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    }
  };
  
  


  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90, headerAlign: 'center' },
    { field: 'jobDateAndTime', headerName: 'Date & Time', flex: 2, headerAlign: 'center' },
    { field: 'jobDescription', headerName: 'Description', flex: 3, headerAlign: 'center' },
    { field: 'customer.firstName', headerName: 'Customer Name', flex: 2, headerAlign: 'center' },
    {
      field: 'edit',
      headerName: 'Edit',
      flex: 1,
      headerAlign: 'center',
      renderCell: (params) => (
        <Button variant="contained" color="primary" onClick={() => handleEditClick(params.row)}>Edit</Button>
      ),
    },
    {
      field: 'details',
      headerName: 'Details',
      flex: 1,
      headerAlign: 'center',
      renderCell: (params) => (
        <Button variant="outlined" style={{ color: 'black', borderColor: 'black' }} onClick={() => handleRowClick(params)}>View Details</Button>
      ),
    },
  ];

  return (
    <div style={{ height: 600, width: '100%' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} paddingBottom={2}>
          <Card sx={glassCardStyles}>
            <CardContent sx={glassContentStyles}><h2>Employee Assign For Job</h2></CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card sx={glassCardStyles}>
            <CardContent sx={glassContentStyles}>
              <DataGrid
                rows={jobs}
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Job</DialogTitle>
        <DialogContent>
          {selectedJob && (
            <FormControl fullWidth margin="dense">
              <InputLabel id="employee-select-label">Assign Employee</InputLabel>
              <Select
                labelId="employee-select-label"
                value={selectedJob.assignEmployee ? selectedJob.assignEmployee.id : ''}
                onChange={(e) => setSelectedJob({
                  ...selectedJob,
                  assignEmployee: { ...selectedJob.assignEmployee, id: Number(e.target.value) }
                })}
              >
                {employees.map((employee) => (
                  <MenuItem key={employee?.id} value={employee?.id}>
                    {employee?.firstName} {employee?.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!expandedJob} onClose={() => setExpandedJob(null)}>
        <DialogTitle>Job Details</DialogTitle>
        <DialogContent>
          {expandedJob && (
            <>
              <Typography variant="h6">Repairer Items:</Typography>
              {expandedJob.repairerItems.map(item => (
                <div key={item.id}>
                  <Typography variant="body1"><strong>Description:</strong> {item.part.name}</Typography>
                  <Typography variant="body1"><strong>Description:</strong> {item.description}</Typography>
                  <Typography variant="body1"><strong>Quantity:</strong> {item.quantity}</Typography>
                  <Typography variant="body1"><strong>Estimate Price:</strong> ${item.estimatePrice.toFixed(2)}</Typography>
                  <Divider style={{ margin: '10px 0' }} />
                </div>
              ))}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExpandedJob(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        message={snackbarMessage}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EmployeeAssign;
