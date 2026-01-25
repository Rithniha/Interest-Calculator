import { useState, useEffect } from 'react';
import { useNavigate, BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AddContact from './pages/AddContact';
import SelectCustomer from './pages/SelectCustomer';
import AddTransaction from './pages/AddTransaction';
import InterestCalculator from './pages/InterestCalculator';
import api from './utils/api';
import { LucideHome, LucideWallet, LucideTrendingUp, LucideUser, LucidePlus, LucideCalculator } from 'lucide-react';

// Protected Route Component
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalOutstanding: 0, topAccounts: [] });

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
  }, []);

  return (
    <div className="container">
      <header style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: 'var(--gray-500)' }}>Hello {user.fullName || 'User'}!</p>
          <h2 style={{ fontSize: '1.2rem' }}>Welcome back</h2>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div
            style={{ background: 'white', padding: '8px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', cursor: 'pointer' }}
            onClick={() => navigate('/calculator')}
          >
            <LucideCalculator size={20} color="var(--primary)" />
          </div>
          <div style={{ background: 'white', padding: '8px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <LucideUser size={20} color="var(--primary)" />
          </div>
        </div>
      </header>

      <div style={{ padding: '0 20px' }}>
        <div className="card" style={{ background: 'var(--white)', padding: '25px', position: 'relative', overflow: 'hidden' }}>
          <p style={{ color: 'var(--gray-500)', marginBottom: '10px' }}>Available amount</p>
          <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>₹ {stats.totalOutstanding.toLocaleString()}</h1>
          <button className="btn btn-primary" style={{ width: '100%', borderRadius: '16px' }}>Redeem Now</button>
        </div>

        <div style={{ marginTop: '30px' }}>
          <h3 style={{ marginBottom: '15px' }}>Investor Performance</h3>
          {stats.topAccounts.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: 'var(--gray-500)', padding: '40px' }}>
              <p>No transactions yet.</p>
              <p style={{ fontSize: '14px' }}>Click the + button to add one!</p>
            </div>
          ) : (
            stats.topAccounts.map(acc => (
              <div key={acc._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {acc.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0 }}>{acc.name}</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--gray-500)' }}>{acc.role}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>₹ {acc.outstandingBalance.toLocaleString()}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          className="btn btn-primary"
          onClick={() => navigate('/select-customer')}
          style={{ position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)', borderRadius: '30px', padding: '15px 30px', gap: '10px', boxShadow: '0 8px 20px rgba(94, 104, 177, 0.3)', zIndex: 100 }}
        >
          <LucidePlus size={20} /> Add Transactions
        </button>
      </div>

      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '75px', background: 'white', display: 'flex', justifyContent: 'space-around', alignItems: 'center', boxShadow: '0 -4px 15px rgba(0,0,0,0.05)', borderTopLeftRadius: '30px', borderTopRightRadius: '30px', padding: '0 10px', zIndex: 100 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <LucideHome size={24} color="var(--primary)" />
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--primary)' }}></div>
        </div>
        <LucideWallet size={24} color="var(--gray-200)" />
        <LucideTrendingUp size={24} color="var(--gray-200)" />
        <LucideUser size={24} color="var(--gray-200)" />
      </nav>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div data-theme="borrower">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/add-contact" element={<PrivateRoute><AddContact /></PrivateRoute>} />
          <Route path="/select-customer" element={<PrivateRoute><SelectCustomer /></PrivateRoute>} />
          <Route path="/add-transaction/:accountId" element={<PrivateRoute><AddTransaction /></PrivateRoute>} />
          <Route path="/calculator" element={<PrivateRoute><InterestCalculator /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
