import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Divider, MenuItem, FormControl, Select, InputLabel } from '@mui/material';
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
        // Create an updatedJob object with the correct assignEmployee format
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

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 1, headerClassName: 'header-style' },
    { field: 'jobDateAndTime', headerName: 'Date & Time', flex: 2, headerClassName: 'header-style' },
    { field: 'jobDescription', headerName: 'Description', flex: 3, headerClassName: 'header-style' },
    { field: 'customer.firstName', headerName: 'Customer Name', flex: 2, headerClassName: 'header-style' },
    {
      field: 'edit',
      headerName: 'Edit',
      flex: 1,
      headerClassName: 'header-style',
      renderCell: (params) => (
        <Button variant="contained" onClick={() => handleEditClick(params.row)}>Edit</Button>
      ),
    },
    {
      field: 'details',
      headerName: 'Details',
      flex: 1,
      headerClassName: 'header-style',
      renderCell: (params) => (
        <Button variant="outlined" style={{ color: 'white', borderColor: 'white' }} onClick={() => handleRowClick(params)}>View Details</Button>
      ),
    },
  ];

  return (
    <div style={{ height: 600, width: '100%' }}>
      <h2>Employee Assign For Job</h2>
      <DataGrid
        rows={jobs}
        columns={columns}
        pageSizeOptions={[5]}
        pagination
        autoHeight
        sx={{
          '.header-style': {
            fontWeight: 'bold',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f5f5f5',
          },
          '& .MuiDataGrid-row': {
            cursor: 'pointer',
          },
        }}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Job</DialogTitle>
        <DialogContent>
          {selectedJob && (
            <>
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
            </>
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
