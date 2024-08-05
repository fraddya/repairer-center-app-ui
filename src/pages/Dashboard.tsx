import React, { useState } from 'react';
import { Typography, Box, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Home, Info, ContactMail, Work, People, LocalOffer, DirectionsCar } from '@mui/icons-material';
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
            backgroundColor: '#FF5722',  // Sidebar color
            color: '#FFF',  // Sidebar text color
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <img src='./images/Main_logo.png' alt="Company Logo" onClick={() => handleListItemClick('Home', '/dashboard')} style={{ height: '80px' }} />
        </Box>
        <List>
          {[
            { text: 'Home', icon: <Home />, path: '/dashboard' },
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
                color: '#FFF',
                '&:hover': {
                  backgroundColor: '#FF7043',
                },
                backgroundColor: activeItem === text ? '#FF7043' : 'inherit',
              }}
            >
              {icon}
              <ListItemText primary={text} sx={{ color: '#FFF' }} />
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
          height: '100vh',
          background: 'linear-gradient(45deg, #e68600, #d6982d, #d1ad1d, #f5bc02)',
          backgroundSize: '400% 400%',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;
