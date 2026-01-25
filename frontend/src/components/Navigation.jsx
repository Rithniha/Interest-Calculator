import { useNavigate, useLocation } from 'react-router-dom';
import { LucideHome, LucideWallet, LucideBell, LucideUser, LucideTrendingUp } from 'lucide-react';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: '/', icon: LucideHome, label: 'Home' },
    { id: '/transactions', icon: LucideWallet, label: 'Wallet' },
    { id: '/reminders', icon: LucideBell, label: 'Alerts' },
    { id: '/profile', icon: LucideUser, label: 'Profile' }
  ];

  return (
    <nav style={{
      position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
      width: '90%', maxWidth: '400px', height: '75px',
      background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)',
      display: 'flex', justifyContent: 'space-around',
      alignItems: 'center', boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
      borderRadius: '25px', padding: '0 20px', zIndex: 1000,
      border: '1px solid rgba(255, 255, 255, 0.3)'
    }}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.id;
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            onClick={() => navigate(item.id)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '4px', cursor: 'pointer', flex: 1, transition: 'all 0.3s ease'
            }}
          >
            <div style={{
              padding: '8px',
              borderRadius: '16px',
              background: isActive ? 'rgba(94, 104, 177, 0.1)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isActive ? 'var(--primary)' : '#64748b',
              transform: isActive ? 'translateY(-4px)' : 'none',
              transition: 'all 0.3s ease'
            }}>
              <Icon size={isActive ? 26 : 22} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <p style={{
              margin: 0, fontSize: '10px', fontWeight: isActive ? '800' : '600',
              color: isActive ? 'var(--primary)' : '#64748b',
              textTransform: 'uppercase', letterSpacing: '0.5px'
            }}>
              {item.label}
            </p>
          </div>
        );
      })}
    </nav>
  );
};

export default Navigation;
