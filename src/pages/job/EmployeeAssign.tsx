import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Divider, MenuItem, FormControl, Select, InputLabel, Grid, Card, CardContent } from '@mui/material';
import { fetchJobs, updateJob, Job } from '../../services/JobService';
import { fetchEmployees } from '../../services/userService';
import { User } from '../../services/userService';

const EmployeeAssign: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [expandedJob, setExpandedJob] = useState<Job | null>(null);
  const [employees, setEmployees] = useState<User[]>([]);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const jobs = await fetchJobs('CONFIRM');
        setJobs(jobs);
      } catch (error) {
        console.error('Failed to load jobs:', error);
      }
    };

    const loadEmployees = async () => {
      try {
        const employees = await fetchEmployees();
        setEmployees(employees);
      } catch (error) {
        console.error('Failed to load employees:', error);
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
    if (selectedJob) {
      try {
        const updatedJob = {
          ...selectedJob,
          assignEmployee: selectedJob.assignEmployee ? { ...selectedJob.assignEmployee, id: selectedJob.assignEmployee.id } : undefined,
        };

        await updateJob(selectedJob.id, updatedJob);
        setOpen(false);
        setSelectedJob(null);
        const updatedJobs = await fetchJobs('CONFIRM');
        setJobs(updatedJobs);
      } catch (error) {
        console.error('Failed to update job:', error);
      }
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
                  <MenuItem key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName}
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
    </div>
  );
};

export default EmployeeAssign;
