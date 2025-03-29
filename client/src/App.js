import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { APIProvider } from './contexts/APIContext';
import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';

function App() {
  return (
    <AuthProvider>
      <APIProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* Add more routes here as needed */}
          </Routes>
        </Router>
      </APIProvider>
    </AuthProvider>
  );
}

export default App;