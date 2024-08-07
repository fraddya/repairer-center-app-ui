import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Divider } from '@mui/material';
import { fetchJobs, Job } from '../../services/JobService';

const RunningJob: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [expandedJob, setExpandedJob] = useState<Job | null>(null);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const jobs = await fetchJobs('START');
        setJobs(jobs);
      } catch (error) {
        console.error('Failed to load jobs:', error);
      }
    };

    loadJobs();
  }, []);

  const handleRowClick = (params: any) => {
    const job = params.row;
    setExpandedJob(job);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 1, headerClassName: 'header-style' },
    { field: 'jobDateAndTime', headerName: 'Date & Time', flex: 2, headerClassName: 'header-style' },
    { field: 'jobDescription', headerName: 'Description', flex: 3, headerClassName: 'header-style' },
    { field: 'customer.firstName', headerName: 'Customer Name', flex: 2, headerClassName: 'header-style' },
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
      <h2>Running job</h2>
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

export default RunningJob;
