import { useState, useEffect } from 'react';
import { useNavigate, useLocation, BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AddContact from './pages/AddContact';
import SelectCustomer from './pages/SelectCustomer';
import AddTransaction from './pages/AddTransaction';
import InterestCalculator from './pages/InterestCalculator';
import Profile from './pages/Profile';
import Transactions from './pages/Transactions';
import api from './utils/api';
import { exportToPDF, exportToExcel } from './utils/reports';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import {
  LucideHome, LucideWallet, LucideTrendingUp, LucideUser,
  LucidePlus, LucideCalculator, LucideRefreshCw, LucideDownload
} from 'lucide-react';

import Navigation from './components/Navigation';

// Protected Route Component
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();
  const { role, toggleRole } = useTheme();
  const [stats, setStats] = useState({ totalOutstanding: 0, topAccounts: [], duePayments: [] });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/stats/overview');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch stats');
      }
    };
    fetchStats();
  }, [role]); // Refresh when role changes

  return (
    <div className="container" style={{ background: 'var(--bg-main)' }}>
      <header style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'white', overflow: 'hidden', border: '2px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`} alt="Avatar" />
          </div>
          <div>
            <p style={{ color: 'var(--gray-500)', fontSize: '12px', margin: 0 }}>Hello {user.fullName || 'User'}!</p>
            <h2 style={{ fontSize: '1rem', margin: 0 }}>Welcome back</h2>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div
            onClick={() => exportToPDF(stats.topAccounts, 'Investor_Performance')}
            style={{ background: 'white', padding: '10px', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', cursor: 'pointer', color: 'var(--primary)' }}
            title="Download PDF"
          >
            <LucideDownload size={20} />
          </div>
          <div
            onClick={toggleRole}
            style={{ background: 'white', padding: '10px', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', cursor: 'pointer', color: 'var(--primary)' }}
            title="Switch Role"
          >
            <LucideRefreshCw size={20} />
          </div>
          <div
            onClick={() => navigate('/calculator')}
            style={{ background: 'white', padding: '10px', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', cursor: 'pointer', color: 'var(--primary)' }}
          >
            <LucideCalculator size={20} />
          </div>
          <div
            style={{ background: 'white', padding: '10px', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', cursor: 'pointer', color: 'var(--primary)' }}
            onClick={() => navigate('/profile')}
          >
            <LucideUser size={20} />
          </div>
        </div>
      </header>

      <div style={{ padding: '0 20px' }}>
        {/* Main Balance Card */}
        <div className="card" style={{ background: 'var(--white)', padding: '25px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.03)' }}>
          <p style={{ color: 'var(--gray-500)', marginBottom: '10px' }}>Available amount</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <h1 style={{ fontSize: '2.2rem', margin: 0 }}>₹ {stats.totalOutstanding.toLocaleString()}</h1>
            <button className="btn btn-primary" onClick={() => navigate('/calculator')} style={{ borderRadius: '16px', padding: '12px 20px' }}>Redeem Now</button>
          </div>
          <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between' }}>
            <p style={{ fontSize: '12px', color: 'var(--gray-500)' }}>Total redeem: <span style={{ color: 'var(--success)' }}>₹ 0.00</span></p>
            <p
              onClick={() => navigate('/transactions')}
              style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer' }}
            >
              View history
            </p>
          </div>
        </div>

        {/* Payments Due Slider */}
        <div style={{ marginTop: '25px', marginBottom: '100px' }}>
          <h3 style={{ marginBottom: '15px', fontSize: '1.1rem' }}>Payments Due</h3>
          <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '15px', scrollbarWidth: 'none' }}>
            {stats.duePayments.length === 0 ? (
              <p style={{ color: 'var(--gray-500)', fontSize: '14px' }}>No payments due today.</p>
            ) : (
              stats.duePayments.map((p, idx) => (
                <div key={idx} className="card" style={{ minWidth: '110px', padding: '15px', textAlign: 'center', marginBottom: 0, boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
                  <p style={{ color: 'var(--error)', fontWeight: 'bold', margin: '0 0 8px 0', fontSize: '14px' }}>₹ {p.amount}</p>
                  <p style={{ fontSize: '10px', color: 'var(--gray-500)', marginBottom: '10px' }}>Today</p>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gray-100)', margin: '0 auto', overflow: 'hidden' }}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.accountId?.name}`} alt="user" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          className="btn btn-primary"
          onClick={() => navigate('/select-customer')}
          style={{ position: 'fixed', bottom: '105px', left: '50%', transform: 'translateX(-50%)', borderRadius: '30px', padding: '15px 30px', gap: '10px', boxShadow: `0 8px 30px ${role === 'Borrower' ? 'rgba(94, 104, 177, 0.4)' : 'rgba(209, 107, 60, 0.4)'}`, zIndex: 100 }}
        >
          <LucidePlus size={20} /> Add Transactions
        </button>

        {/* Investor Performance */}
        <div style={{ marginTop: '25px', paddingBottom: '120px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{role === 'Borrower' ? 'Investor' : 'Borrower'} Performance</h3>
            <p
              onClick={() => navigate('/select-customer')}
              style={{ color: 'var(--primary)', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              View All
            </p>
          </div>
          {stats.topAccounts.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: 'var(--gray-500)', padding: '40px' }}>
              <p>No transactions yet.</p>
            </div>
          ) : (
            stats.topAccounts.map(acc => (
              <div key={acc._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', marginBottom: '12px' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--gray-100)', overflow: 'hidden' }}>
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${acc.name}`} alt="avatar" />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '14px' }}>{acc.name}</h4>
                  <p style={{ margin: 0, fontSize: '11px', color: 'var(--gray-500)' }}>{new Date(acc.createdAt).toLocaleDateString()}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px' }}>₹ {acc.outstandingBalance.toLocaleString()}</p>
                  <p style={{ margin: 0, fontSize: '10px', color: 'var(--gray-500)' }}>1.5% (3K)</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Navigation />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/add-contact" element={<PrivateRoute><AddContact /></PrivateRoute>} />
          <Route path="/select-customer" element={<PrivateRoute><SelectCustomer /></PrivateRoute>} />
          <Route path="/add-transaction/:accountId" element={<PrivateRoute><AddTransaction /></PrivateRoute>} />
          <Route path="/calculator" element={<PrivateRoute><InterestCalculator /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
