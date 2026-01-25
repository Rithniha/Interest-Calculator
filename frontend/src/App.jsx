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
import {
  LucideHome, LucideWallet, LucideTrendingUp, LucideUser,
  LucidePlus, LucideCalculator, LucideRefreshCw, LucideDownload, LucideLogOut
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
  const [stats, setStats] = useState({ totalOutstanding: 0, topAccounts: [], duePayments: [], monthlyStats: [] });

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
  }, [role]);

  // Format data for charts
  const chartData = stats.monthlyStats?.map(s => ({
    name: new Date(0, s._id.month - 1).toLocaleString('default', { month: 'short' }),
    given: s.given,
    taken: s.taken
  })) || [];

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
          <div className="card" style={{ background: 'var(--primary)', color: 'white', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <p style={{ fontSize: '12px', opacity: 0.8, marginBottom: '5px' }}>Total Outstanding</p>
                <h1 style={{ fontSize: '2.5rem', margin: 0, fontWeight: '900' }}>₹ {stats.totalOutstanding.toLocaleString()}</h1>
              </div>
              <button onClick={() => navigate('/calculator')} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '14px', height: 'fit-content', fontWeight: 'bold', cursor: 'pointer' }}>
                Interest Calc
              </button>
            </div>
            <div style={{ display: 'flex', gap: '20px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div>
                <p style={{ fontSize: '10px', opacity: 0.7 }}>Earned (est.)</p>
                <p style={{ margin: 0, fontWeight: 'bold' }}>₹ 1,240.00</p>
              </div>
              <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '20px' }}>
                <p style={{ fontSize: '10px', opacity: 0.7 }}>Active Accounts</p>
                <p style={{ margin: 0, fontWeight: 'bold' }}>{stats.topAccounts.length}</p>
              </div>
            </div>
          </div>

          {/* Quick Analysis Graph */}
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '15px' }}>Monthly Cash Flow</h3>
            <div style={{ height: '140px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorGiven" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip />
                  <Area type="monotone" dataKey="given" stroke="var(--primary)" fillOpacity={1} fill="url(#colorGiven)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '30px 0' }}>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/select-customer')}
            style={{ borderRadius: '40px', padding: '15px 45px', gap: '12px', fontSize: '16px', boxShadow: `0 12px 35px ${role === 'Borrower' ? 'rgba(94, 104, 177, 0.4)' : 'rgba(209, 107, 60, 0.4)'}`, fontWeight: '800' }}
          >
            <LucidePlus size={22} /> Add Portfolio Entry
          </button>
        </div>

        {/* Detailed Reports Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800' }}>Portfolio Stats</h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--primary)', fontWeight: 'bold' }}>Last 6 Months</p>
            </div>
            <div style={{ height: '220px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Legend verticalAlign="top" align="right" iconType="circle" />
                  <Bar dataKey="given" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Lent" />
                  <Bar dataKey="taken" fill="var(--error)" radius={[4, 4, 0, 0]} name="Borrowed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '20px', fontSize: '1rem', fontWeight: '800' }}>Payments Status</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {stats.duePayments.length === 0 ? (
                <p style={{ color: 'var(--gray-500)', fontSize: '14px', textAlign: 'center', padding: '40px' }}>All payments up to date!</p>
              ) : (
                stats.duePayments.map((p, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--gray-100)', borderRadius: '15px', cursor: 'pointer' }} onClick={() => navigate(`/ledger/${p.accountId?._id}`)}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', overflow: 'hidden' }}>
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.accountId?.name}`} alt="user" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: '700' }}>{p.accountId?.name}</p>
                      <p style={{ margin: 0, fontSize: '11px', color: 'var(--gray-500)' }}>Due: Today</p>
                    </div>
                    <p style={{ margin: 0, fontWeight: '800', color: 'var(--error)' }}>₹ {p.amount}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Portfolio Table */}
        <div style={{ paddingBottom: '120px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>Active Portfolios</h3>
            <p
              onClick={() => navigate('/select-customer')}
              style={{ color: 'var(--primary)', fontSize: '14px', fontWeight: '800', cursor: 'pointer' }}
            >
              View All
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
            {stats.topAccounts.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', color: 'var(--gray-500)', padding: '60px', gridColumn: '1 / -1' }}>
                <p>No activity yet.</p>
              </div>
            ) : (
              stats.topAccounts.map(acc => (
                <div key={acc._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', cursor: 'pointer' }} onClick={() => navigate(`/ledger/${acc._id}`)}>
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
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
