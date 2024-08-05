import React from 'react';
import { Container, Typography, Box, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Home, Info, ContactMail } from '@mui/icons-material';

const drawerWidth = 240;

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <List>
          <ListItem button>
            <Home />
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button>
            <Info />
            <ListItemText primary="About" />
          </ListItem>
          <ListItem button>
            <ContactMail />
            <ListItemText primary="Contact" />
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Typography variant="h4" gutterBottom>Dashboard</Typography>
        <Typography variant="body1">
          Welcome to the dashboard! Here you can manage your application.
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;