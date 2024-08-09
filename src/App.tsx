import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Job from './pages/Job';
import Employee from './pages/Employee';
import Brand from './pages/Brand';
import VehiclePart from './pages/VehiclePart';
import Home from './pages/Home';

const App: React.FC = () => {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="home" element={<Home />} />
          <Route path="job" element={<Job />} />
          <Route path="employee" element={<Employee />} />
          <Route path="brand" element={<Brand />} />
          <Route path="vehicle-part" element={<VehiclePart />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
