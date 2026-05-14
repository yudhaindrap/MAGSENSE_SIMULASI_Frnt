// src/App.jsx
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Layout
import MainLayout from './components/MainLayout';

// Import Halaman
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Monitoring from './pages/Monitoring';
import Thresholds from './pages/Thresholds';
import Growth from './pages/Growth';
import Prediction from './pages/Prediction';
import HistoryPage from './pages/History';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Jika tidak ada token, render Login tanpa layout sidebar
  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <Router>
      <Routes>
        {/* Rute yang menggunakan Sidebar Layout */}
        <Route element={<MainLayout setToken={setToken} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/thresholds" element={<Thresholds />} />
          <Route path="/growth" element={<Growth />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>

        {/* Fallback ke Dashboard jika rute tidak ditemukan */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;