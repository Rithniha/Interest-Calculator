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
                {/* Profile Card */}
                <div className="card" style={{ textAlign: 'center', padding: '30px 20px' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--gray-100)', margin: '0 auto 15px', overflow: 'hidden', border: '3px solid var(--primary)' }}>
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`} alt="Avatar" />
                    </div>
                    <h2 style={{ fontSize: '1.4rem', margin: '0 0 5px 0' }}>{user.fullName}</h2>
                    <p style={{ color: 'var(--gray-500)', fontSize: '14px', margin: 0 }}>{user.email}</p>
                    <div style={{ marginTop: '15px', display: 'inline-block', background: 'var(--bg-main)', padding: '5px 15px', borderRadius: '20px', fontSize: '12px', color: 'var(--primary)', fontWeight: 'bold' }}>
                        {role.toUpperCase()} PANEL
                    </div>
                </div>

                {/* Settings List */}
                <div style={{ marginTop: '20px' }}>
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px' }}>
                        <div
                            style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', cursor: 'pointer', borderRadius: '14px' }}
                            onClick={toggleRole}
                        >
                            <div style={{ background: 'var(--bg-main)', padding: '8px', borderRadius: '10px', color: 'var(--primary)' }}>
                                {role === 'Borrower' ? <LucideShield size={20} /> : <LucideUser size={20} />}
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontWeight: '600' }}>Change Role</p>
                                <p style={{ margin: 0, fontSize: '12px', color: 'var(--gray-500)' }}>Switch to {role === 'Borrower' ? 'Investor' : 'Borrower'} mode</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', borderRadius: '14px' }}>
                            <div style={{ background: 'var(--bg-main)', padding: '8px', borderRadius: '10px', color: 'var(--primary)' }}>
                                <LucideMail size={20} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontWeight: '600' }}>Email Notification</p>
                            </div>
                            <div style={{ width: '40px', height: '20px', background: 'var(--primary)', borderRadius: '20px', position: 'relative' }}>
                                <div style={{ position: 'absolute', right: '2px', top: '2px', width: '16px', height: '16px', borderRadius: '50%', background: 'white' }}></div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', borderRadius: '14px' }}>
                            <div style={{ background: 'var(--bg-main)', padding: '8px', borderRadius: '10px', color: 'var(--primary)' }}>
                                <LucideLock size={20} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontWeight: '600' }}>Privacy Policy</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="btn"
                    style={{ width: '100%', marginTop: '30px', padding: '15px', borderRadius: '16px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', gap: '10px' }}
                >
                    <LucideLogOut size={20} /> Logout Account
                </button>
            </div>
            <Navigation />
        </div>
    );
};

export default Profile;
