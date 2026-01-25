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
import AccountLedger from './pages/AccountLedger';
import { exportToPDF, exportToExcel } from './utils/reports';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Reminders from './pages/Reminders';
import {
  LucideHome, LucideWallet, LucideTrendingUp, LucideUser,
  LucidePlus, LucideCalculator, LucideRefreshCw, LucideDownload, LucideLogOut, LucideBell
} from 'lucide-react';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';

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
  const [stats, setStats] = useState({
    totalGiven: 0, totalTaken: 0, interestEarned: 0, interestPayable: 0,
    totalOutstanding: 0, topAccounts: [], duePayments: [], monthlyStats: []
  });
  const [reminders, setReminders] = useState({ overdue: [] });
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/stats/overview');
        setStats(res.data);

        const remRes = await api.get('/stats/reminders');
        setReminders(remRes.data);
        if (remRes.data.overdue.length > 0 && !sessionStorage.getItem('alertShown')) {
          setShowAlert(true);
          sessionStorage.setItem('alertShown', 'true');
        }
      } catch (err) {
        console.error('Failed to fetch stats');
      }
    };
    fetchStats();
  }, [role]);

  const chartData = stats.monthlyStats?.map(s => ({
    name: new Date(0, s._id.month - 1).toLocaleString('default', { month: 'short' }),
    given: s.given,
    taken: s.taken,
    interest: (s.count * 100) // Mock interest growth for viz
  })) || [];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="container" style={{ background: 'var(--bg-main)' }}>
      {/* Top Bar */}
      <header style={{ padding: '25px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '900', margin: 0, letterSpacing: '-0.5px', color: 'var(--primary)' }}>Interest Hub</h1>
          <p style={{ margin: 0, fontSize: '11px', color: 'var(--gray-500)', fontWeight: '700' }}>PRECISION FINANCE</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            onClick={() => navigate('/reminders')}
            style={{ position: 'relative', background: 'white', padding: '10px', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}
          >
            <LucideBell size={20} color={reminders.overdue.length > 0 ? 'var(--error)' : 'var(--gray-500)'} className={reminders.overdue.length > 0 ? 'shake' : ''} />
            {reminders.overdue.length > 0 && <span style={{ position: 'absolute', top: -5, right: -5, background: 'var(--error)', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', fontWeight: '900', border: '2px solid var(--bg-main)' }}>{reminders.overdue.length}</span>}
          </div>
          <div onClick={() => navigate('/profile')} style={{ width: '45px', height: '45px', borderRadius: '14px', background: 'white', overflow: 'hidden', border: '2px solid white', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`} alt="Profile" />
          </div>
        </div>
      </header>

      <div style={{ padding: '0 20px' }}>
        {/* Onboarding Alert */}
        {showAlert && (
          <div className="card" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error)', color: 'var(--error)', padding: '15px 20px', borderRadius: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', animation: 'slideDown 0.4s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LucideAlertTriangle size={20} />
              <p style={{ margin: 0, fontWeight: '800', fontSize: '13px' }}>{reminders.overdue.length} Overdue Dues Detected!</p>
            </div>
            <button onClick={() => navigate('/reminders')} style={{ background: 'var(--error)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>Resolve Now</button>
          </div>
        )}

        {/* 1. Summary Cards Section */}
        <h2 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '15px', paddingLeft: '5px' }}>Financial Snapshot</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '30px' }}>

          <div className="card" style={{ background: 'var(--primary)', color: 'white', gridColumn: '1 / 3', padding: '25px' }}>
            <p style={{ margin: 0, fontSize: '12px', opacity: 0.8, fontWeight: '600' }}>Outstanding Balance</p>
            <h2 style={{ fontSize: '2.2rem', margin: '5px 0', fontWeight: '900' }}>₹ {stats.totalOutstanding.toLocaleString()}</h2>
            <div style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.3)', borderRadius: '2px', marginTop: '10px' }}></div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <LucideTrendingUp size={18} color="var(--primary)" style={{ marginBottom: '10px' }} />
            <p style={{ margin: 0, fontSize: '11px', color: 'var(--gray-500)', fontWeight: '700' }}>TOTAL GIVEN</p>
            <h3 style={{ margin: '5px 0', fontSize: '1.2rem', fontWeight: '900' }}>₹ {stats.totalGiven.toLocaleString()}</h3>
            <p style={{ margin: 0, fontSize: '10px', color: 'var(--success)', fontWeight: 'bold' }}>+ ₹ {stats.interestEarned} earned</p>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <LucideTrendingDown size={18} color="var(--error)" style={{ marginBottom: '10px' }} />
            <p style={{ margin: 0, fontSize: '11px', color: 'var(--gray-500)', fontWeight: '700' }}>TOTAL TAKEN</p>
            <h3 style={{ margin: '5px 0', fontSize: '1.2rem', fontWeight: '900' }}>₹ {stats.totalTaken.toLocaleString()}</h3>
            <p style={{ margin: 0, fontSize: '10px', color: 'var(--error)', fontWeight: 'bold' }}>- ₹ {stats.interestPayable} payable</p>
          </div>
        </div>

        {/* 2. Charts Section */}
        <div className="grid-layout" style={{ marginBottom: '30px' }}>
          <div className="card">
            <h3 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '20px' }}>Inflow vs Outflow</h3>
            <div style={{ height: '220px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="given" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Lent" />
                  <Bar dataKey="taken" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Borrowed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '20px' }}>Interest Growth</h3>
            <div style={{ height: '220px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="interestGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip />
                  <Area type="monotone" dataKey="interest" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#interestGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 3. Quick Actions */}
        <h2 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '15px', paddingLeft: '5px' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '50px' }}>
          {[
            { label: 'New Loan', icon: LucidePlus, color: 'var(--primary)', bg: 'rgba(94, 104, 177, 0.1)', path: '/select-customer' },
            { label: 'Accounts', icon: LucideUser, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', path: '/select-customer' },
            { label: 'Dues', icon: LucideBell, color: 'var(--error)', bg: 'rgba(239, 68, 68, 0.1)', path: '/reminders' }
          ].map((action, idx) => (
            <div
              key={idx}
              onClick={() => navigate(action.path)}
              style={{ padding: '20px 10px', textAlign: 'center', cursor: 'pointer', borderRadius: '24px', background: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.03)' }}
            >
              <div style={{ width: '45px', height: '45px', borderRadius: '15px', background: action.bg, color: action.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                <action.icon size={22} />
              </div>
              <p style={{ margin: 0, fontSize: '11px', fontWeight: '800', color: 'var(--gray-600)' }}>{action.label}</p>
            </div>
          ))}
        </div>
      </div>

      <Navigation />
    </div >
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
          <Route path="/ledger/:id" element={<PrivateRoute><AccountLedger /></PrivateRoute>} />
          <Route path="/reminders" element={<PrivateRoute><Reminders /></PrivateRoute>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
