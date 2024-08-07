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
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        indicatorColor="primary" 
        textColor="primary"
        sx={{
          '& .MuiTabs-flexContainer': {
            justifyContent: 'space-around',
          },
          '& .MuiTab-root': {
            minWidth: '120px',
            '&:hover': {
              color: 'primary.dark',
            },
          },
          '& .Mui-selected': {
            color: 'primary.main',
          },
        }}
      >
        <Tab label="New Request Job" />
        <Tab label="Employee Assign" />
        <Tab label="Running Job" />
        <Tab label="All Job" />
      </Tabs>
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
