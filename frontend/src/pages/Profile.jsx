import { useNavigate } from 'react-router-dom';
import { LucideArrowLeft, LucideLogOut, LucideUser, LucideMail, LucideShield, LucideLock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Navigation from '../components/Navigation';

const Profile = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const { role, toggleRole } = useTheme();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="container" style={{ background: 'var(--bg-main)' }}>
            <header style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <LucideArrowLeft size={24} color="var(--primary)" />
                </button>
                <h2 style={{ fontSize: '1.2rem' }}>My Profile</h2>
            </header>

            <div style={{ padding: '0 20px' }}>
                <div className="content-center">
                    <div className="grid-layout">
                        {/* Profile Summary Card */}
                        <div className="card" style={{ textAlign: 'center', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '100px', height: '100px', borderRadius: '30px', background: 'var(--gray-100)', marginBottom: '20px', overflow: 'hidden', border: '3px solid white', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', margin: '0 0 5px 0' }}>{user.fullName}</h2>
                            <p style={{ color: 'var(--gray-500)', fontSize: '14px', marginBottom: '15px' }}>{user.email}</p>
                            <div style={{ background: 'rgba(var(--primary-rgb), 0.1)', padding: '8px 20px', borderRadius: '25px', fontSize: '12px', color: 'var(--primary)', fontWeight: 'bold', letterSpacing: '1px' }}>
                                {role.toUpperCase()} MODE ACTIVE
                            </div>
                        </div>

                        {/* Settings & Options */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div className="card" style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {[
                                    { icon: LucideShield, title: 'Switch Role', subTitle: `Switch to ${role === 'Borrower' ? 'Investor' : 'Borrower'} mode`, action: toggleRole },
                                    { icon: LucideMail, title: 'Email Notifications', subTitle: 'Get daily interest updates', toggle: true },
                                    { icon: LucideLock, title: 'Privacy Settings', subTitle: 'Manage your data visibility' }
                                ].map((item, idx) => (
                                    <div
                                        key={idx}
                                        onClick={item.action}
                                        style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', cursor: item.action ? 'pointer' : 'default', borderRadius: '16px', transition: 'background 0.2s ease' }}
                                        className="profile-item-hover"
                                    >
                                        <div style={{ background: 'var(--gray-100)', padding: '10px', borderRadius: '12px', color: 'var(--primary)' }}>
                                            <item.icon size={20} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ margin: 0, fontWeight: '700', fontSize: '15px' }}>{item.title}</p>
                                            <p style={{ margin: 0, fontSize: '12px', color: 'var(--gray-500)' }}>{item.subTitle}</p>
                                        </div>
                                        {item.toggle && (
                                            <div style={{ width: '45px', height: '24px', background: 'var(--primary)', borderRadius: '20px', position: 'relative' }}>
                                                <div style={{ position: 'absolute', right: '3px', top: '3px', width: '18px', height: '18px', borderRadius: '50%', background: 'white' }}></div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Logout Section */}
                            <button
                                onClick={handleLogout}
                                className="btn"
                                style={{ width: '100%', padding: '18px', borderRadius: '18px', background: 'rgba(239, 68, 68, 0.08)', color: 'var(--error)', gap: '10px', fontWeight: '700' }}
                            >
                                <LucideLogOut size={20} /> Sign Out Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Navigation />
        </div>
    );
};

export default Profile;
