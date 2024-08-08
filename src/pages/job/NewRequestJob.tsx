import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, Divider, FormControl, FormControlLabel, Radio, RadioGroup, Card, CardContent, Grid } from '@mui/material';
import { fetchJobs, updateJob, Job } from '../../services/JobService';
import { JobStatus } from '../../enums/JobStatus';

const NewRequestJob: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [expandedJob, setExpandedJob] = useState<Job | null>(null);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const jobs = await fetchJobs('NEWREQUEST');
        setJobs(jobs);
      } catch (error) {
        console.error('Failed to load jobs:', error);
      }
    };

    loadJobs();
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
        await updateJob(selectedJob.id, selectedJob);
        setOpen(false);
        setSelectedJob(null);
        const updatedJobs = await fetchJobs('NEWREQUEST');
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
    { field: 'id', headerName: 'ID', flex: 1, headerAlign: 'center' },
    { field: 'jobDateAndTime', headerName: 'Date & Time', flex: 2, headerAlign: 'center' },
    { field: 'jobDescription', headerName: 'Description', flex: 3, headerAlign: 'center' },
    { field: 'customer.firstName', headerName: 'Customer Name', flex: 2, headerAlign: 'center' },
    {
      field: 'edit',
      headerName: 'Edit',
      flex: 1,
      headerAlign: 'center',
      renderCell: (params) => (
        <Button variant="contained" onClick={() => handleEditClick(params.row)}>Edit</Button>
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
            <CardContent sx={glassContentStyles}><h2>New Requested Job</h2></CardContent>
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

              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Job</DialogTitle>
                <DialogContent>
                  {selectedJob && (
                    <>
                      <TextField
                        autoFocus
                        margin="dense"
                        label="Estimate Time"
                        type="number"
                        fullWidth
                        variant="standard"
                        value={selectedJob.estimateTime}
                        onChange={(e) => setSelectedJob({ ...selectedJob, estimateTime: e.target.value as unknown as number })}
                      />
                      <TextField
                        margin="dense"
                        label="Estimate Price"
                        type="number"
                        fullWidth
                        variant="standard"
                        value={selectedJob.estimatePrice}
                        onChange={(e) => setSelectedJob({ ...selectedJob, estimatePrice: parseFloat(e.target.value) })}
                      />
                      <div>
                        <Typography>Status:</Typography>
                        <FormControl component="fieldset">
                          <RadioGroup
                            row
                            aria-label="jobStatus"
                            name="jobStatus"
                            value={selectedJob.jobStatus}
                            onChange={(e) => setSelectedJob({ ...selectedJob, jobStatus: e.target.value as JobStatus })}
                          >
                            <FormControlLabel value={JobStatus.WAITING_FOR_CONFIRMATION} control={<Radio />} label="Accepted" />
                            <FormControlLabel value={JobStatus.REJECTED} control={<Radio />} label="Rejected" />
                          </RadioGroup>
                        </FormControl>
                      </div>
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default NewRequestJob;
