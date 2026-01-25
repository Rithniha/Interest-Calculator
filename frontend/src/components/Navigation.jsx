import { useNavigate, useLocation } from 'react-router-dom';
import { LucideHome, LucideWallet, LucideTrendingUp, LucideUser } from 'lucide-react';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: '/', icon: LucideHome, label: 'Home' },
    { id: '/transactions', icon: LucideWallet, label: 'Wallet' },
    { id: '/calculator', icon: LucideTrendingUp, label: 'Calculator' },
    { id: '/profile', icon: LucideUser, label: 'Profile' }
  ];

  return (
    <nav style={{ 
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: '480px', height: '85px', 
      background: 'white', display: 'flex', justifyContent: 'space-around', 
      alignItems: 'center', boxShadow: '0 -10px 40px rgba(0,0,0,0.1)', 
      borderTopLeftRadius: '30px', borderTopRightRadius: '30px', padding: '0 10px', zIndex: 100 
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
