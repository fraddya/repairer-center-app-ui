import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import NewRequestJob from './job/NewRequestJob';
import EmployeeAssign from './job/EmployeeAssign';
import RunningJob from './job/RunningJob';
import AllJob from './job/AllJob';

const Job: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          indicatorColor="primary" 
          textColor="primary"
          sx={{
            '& .MuiTabs-flexContainer': {
              justifyContent: 'flex-start', // Align tabs to the left
            },
            '& .MuiTab-root': {
              minWidth: '150px',
              padding: '12px 16px', // Add padding for better touch targets
              borderRadius: '4px', // Round the corners for a button-like appearance
              textTransform: 'none', // Prevent uppercase text
              fontWeight: 'bold',
              backgroundColor: 'background.paper', // Default background color for tabs
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow effect
              marginRight: '8px', // Space between tabs
              transition: 'background-color 0.3s, box-shadow 0.3s', // Smooth transition
              '&:hover': {
                backgroundColor: '#ffd900', // Light gray color on hover
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Elevated shadow on hover
              },
            },
            '& .Mui-selected': {
              color: 'white', // White text color for the active tab
              backgroundColor: 'black', // Background color for the active tab
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Elevated shadow for active tab
              borderBottom: '2px solid',
              borderColor: 'primary.main',
            },
          }}
        >
          <Tab label="New Request Job" />
          <Tab label="Employee Assign" />
          <Tab label="Running Job" />
          <Tab label="All Job" />
        </Tabs>
      </Box>
      <Box sx={{ p: 3 }}>
        {activeTab === 0 && <NewRequestJob />}
        {activeTab === 1 && <EmployeeAssign />}
        {activeTab === 2 && <RunningJob />}
        {activeTab === 3 && <AllJob />}
      </Box>
    </Box>
  );
};

export default Job;
