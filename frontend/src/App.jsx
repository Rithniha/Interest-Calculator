import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LucideHome, LucideWallet, LucideTrendingUp, LucideUser, LucidePlus } from 'lucide-react';

// Placeholder components
const Dashboard = () => (
  <div className="container">
    <header style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <p style={{ color: 'var(--gray-500)' }}>Hello Monica!</p>
        <h2 style={{ fontSize: '1.2rem' }}>Welcome back</h2>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <LucideWallet size={24} />
        <LucideUser size={24} />
      </div>
    </header>

    <div style={{ padding: '0 20px' }}>
      <div className="card" style={{ background: 'var(--white)', padding: '25px' }}>
        <p style={{ color: 'var(--gray-500)', marginBottom: '10px' }}>Available amount</p>
        <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>₹ 45,987.15</h1>
        <button className="btn btn-primary" style={{ width: '100%', borderRadius: '16px' }}>Redeem Now</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around', margin: '20px 0' }}>
        {/* More cards/sections based on UI */}
      </div>

      <button className="btn btn-primary" style={{ position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)', borderRadius: '30px', padding: '15px 30px' }}>
        <LucidePlus /> Add Transactions
      </button>
    </div>

    {/* Bottom Nav Bar */}
    <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '70px', background: 'white', display: 'flex', justifyContent: 'space-around', alignItems: 'center', boxShadow: '0 -2px 10px rgba(0,0,0,0.05)', borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }}>
      <LucideHome color="var(--primary)" />
      <LucideWallet color="var(--gray-200)" />
      <LucideTrendingUp color="var(--gray-200)" />
      <LucideUser color="var(--gray-200)" />
    </nav>
  </div>
);

function App() {
  const [theme, setTheme] = useState('borrower'); // or 'investor'

  return (
    <Router>
      <div data-theme={theme}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
