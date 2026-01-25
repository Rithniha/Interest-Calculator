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
  LucidePlus, LucideCalculator, LucideRefreshCw, LucideDownload, LucideLogOut
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

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
      <header style={{ padding: '30px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '15px', background: 'white', overflow: 'hidden', border: '2px solid white', boxShadow: '0 8px 15px rgba(0,0,0,0.08)' }}>
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`} alt="Avatar" />
          </div>
          <div>
            <p style={{ color: 'var(--gray-500)', fontSize: '13px', margin: 0 }}>Hello {user.fullName || 'User'}!</p>
            <h2 style={{ fontSize: '1.2rem', margin: 0, fontWeight: '800' }}>Welcome back</h2>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {[
            { icon: LucideDownload, title: 'Download PDF', onClick: () => exportToPDF(stats.topAccounts, 'Investor_Performance') },
            { icon: LucideRefreshCw, title: 'Switch Role', onClick: toggleRole },
            { icon: LucideCalculator, title: 'Calculator', onClick: () => navigate('/calculator') },
            { icon: LucideUser, title: 'Profile', onClick: () => navigate('/profile') },
            { icon: LucideLogOut, title: 'Logout', onClick: handleLogout, color: 'var(--error)' }
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={item.onClick}
              style={{
                background: 'white', padding: '12px', borderRadius: '14px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)', cursor: 'pointer',
                color: item.color || 'var(--primary)', transition: 'all 0.2s ease'
              }}
              title={item.title}
              className="header-icon-hover"
            >
              <item.icon size={20} />
            </div>
          ))}
        </div>
      </header>

      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
          {/* Main Balance Card */}
          <div className="card" style={{ background: 'var(--white)', position: 'relative', overflow: 'hidden' }}>
            <p style={{ color: 'var(--gray-500)', marginBottom: '10px', fontSize: '14px' }}>Available amount</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '15px' }}>
              <h1 style={{ fontSize: '2.5rem', margin: 0, fontWeight: '900' }}>₹ {stats.totalOutstanding.toLocaleString()}</h1>
              <button className="btn btn-primary" onClick={() => navigate('/calculator')} style={{ borderRadius: '16px', padding: '14px 25px' }}>Redeem Now</button>
            </div>
            <div style={{ marginTop: '25px', paddingTop: '15px', borderTop: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between' }}>
              <p style={{ fontSize: '13px', color: 'var(--gray-500)' }}>Total redeem: <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>₹ 0.00</span></p>
              <p
                onClick={() => navigate('/transactions')}
                style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '800', cursor: 'pointer' }}
              >
                View history
              </p>
            </div>
          </div>

          {/* Payments Due Section */}
          <div className="card">
            <h3 style={{ marginBottom: '15px', fontSize: '1.2rem', fontWeight: '800' }}>Payments Due</h3>
            <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'none' }}>
              {stats.duePayments.length === 0 ? (
                <p style={{ color: 'var(--gray-500)', fontSize: '14px', width: '100%', textAlign: 'center', padding: '10px' }}>No payments due today.</p>
              ) : (
                stats.duePayments.map((p, idx) => (
                  <div key={idx} style={{ minWidth: '110px', textAlign: 'center', background: 'var(--gray-100)', padding: '12px', borderRadius: '18px' }}>
                    <p style={{ color: 'var(--error)', fontWeight: '800', margin: '0 0 8px 0', fontSize: '14px' }}>₹ {p.amount}</p>
                    <div style={{ width: '45px', height: '45px', borderRadius: '14px', background: 'white', margin: '0 auto 5px', overflow: 'hidden', border: '2px solid white' }}>
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.accountId?.name}`} alt="user" />
                    </div>
                    <p style={{ fontSize: '10px', color: 'var(--gray-500)', fontWeight: '600' }}>Today</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Action Button - Centered on desktop */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '30px 0' }}>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/select-customer')}
            style={{ borderRadius: '30px', padding: '15px 40px', gap: '10px', boxShadow: `0 8px 30px ${role === 'Borrower' ? 'rgba(94, 104, 177, 0.4)' : 'rgba(209, 107, 60, 0.4)'}` }}
          >
            <LucidePlus size={20} /> Add Transactions
          </button>
        </div>

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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
            {stats.topAccounts.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', color: 'var(--gray-500)', padding: '50px', gridColumn: '1 / -1' }}>
                <p>No activity yet.</p>
              </div>
            ) : (
              stats.topAccounts.map(acc => (
                <div key={acc._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px' }}>
                  <div style={{ width: '55px', height: '55px', borderRadius: '18px', background: 'var(--gray-100)', overflow: 'hidden', border: '2px solid var(--gray-100)' }}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${acc.name}`} alt="avatar" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>{acc.name}</h4>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--gray-500)', fontWeight: '500' }}>{new Date(acc.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontWeight: '900', fontSize: '18px' }}>₹ {acc.outstandingBalance.toLocaleString()}</p>
                    <div style={{ fontSize: '10px', color: 'var(--success)', fontWeight: 'bold', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '8px', display: 'inline-block' }}>Active</div>
                  </div>
                </div>
              ))
            )}
          </div>
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
