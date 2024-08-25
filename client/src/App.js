import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { APIProvider } from './contexts/APIContext';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  return (
    <APIProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {/* Add more routes here as needed */}
        </Routes>
      </Router>
    </APIProvider>
  );
}

export default App;
