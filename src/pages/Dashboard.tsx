import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Home, Work, People, LocalOffer, DirectionsCar } from '@mui/icons-material';
import { useNavigate, Outlet } from 'react-router-dom';

const drawerWidth = 240;

const Dashboard: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('Home');
  const navigate = useNavigate();

  const handleListItemClick = (item: string, path: string) => {
    setActiveItem(item);
    navigate(path);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Drawer
  sx={{
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      boxSizing: 'border-box',
      backgroundColor: '#2C3E50',  // Dark blue-gray color for the sidebar
      color: '#ECF0F1',  // Light text color for contrast
    },
  }}
  variant="permanent"
  anchor="left"
>
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
    <img src='./images/Main_logo.png' alt="Company Logo" onClick={() => handleListItemClick('Home', '/dashboard')} style={{ height: '120px' }} />
  </Box>
  <List>
    {[
      { text: 'Home', icon: <Home />, path: '/dashboard/home' },
      { text: 'Job', icon: <Work />, path: '/dashboard/job' },
      { text: 'Employee', icon: <People />, path: '/dashboard/employee' },
      { text: 'Brand', icon: <LocalOffer />, path: '/dashboard/brand' },
      { text: 'Vehicle Part', icon: <DirectionsCar />, path: '/dashboard/vehicle-part' },
    ].map(({ text, icon, path }) => (
      <ListItem
        button
        key={text}
        onClick={() => handleListItemClick(text, path)}
        sx={{
          color: '#ECF0F1',  // Light text color for list items
          '&:hover': {
            backgroundColor: '#34495E',  // Slightly lighter color for hover effect
          },
          backgroundColor: activeItem === text ? '#34495E' : 'inherit',
        }}
      >
        {icon}
        <ListItemText primary={text} sx={{ color: '#ECF0F1' }} />
      </ListItem>
    ))}
  </List>
</Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          height: 'full-height',
          background: 'linear-gradient(45deg, #ffcc00, #ff9900, #ff6600, #ff3300)',
          backgroundSize: '400% 400%',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;
