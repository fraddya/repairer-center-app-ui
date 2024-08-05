import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import UserList from './components/UserList';
import UserDetail from './components/UserDetail';

const App: React.FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const env = process.env.REACT_APP_ENV;
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/:id" element={<UserDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
