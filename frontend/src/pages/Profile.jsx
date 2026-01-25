import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LucideArrowLeft, LucideLogOut, LucideUser, LucideMail,
    LucideShield, LucideLock, LucideBell, LucideSettings,
    LucideDatabase, LucidePalette, LucidePhone, LucideEdit3,
    LucideCheckCircle, LucideSave, LucideX
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Navigation from '../components/Navigation';
import api from '../utils/api';

const Profile = () => {
    const navigate = useNavigate();
    const { role, toggleRole } = useTheme();
    const [activeTab, setActiveTab] = useState('personal');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    // Form states
    const [profileForm, setProfileForm] = useState({ fullName: '', email: '', phone: '' });
    const [settingsForm, setSettingsForm] = useState({});
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/users/profile');
            setUser(res.data);
            setProfileForm({
                fullName: res.data.fullName,
                email: res.data.email,
                phone: res.data.phone || ''
            });
            setSettingsForm(res.data.settings || {});
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await api.put('/users/profile', profileForm);
            setUser({ ...user, ...res.data.user });
            setEditing(false);
            alert('Profile updated successfully');
        } catch (err) {
            alert(err.response?.data?.message || 'Update failed');
        }
    };

    const handleSettingsUpdate = async (updatedFields) => {
        try {
            const newSettings = { ...settingsForm, ...updatedFields };
            await api.put('/users/settings', newSettings);
            setSettingsForm(newSettings);
        } catch (err) {
            alert('Failed to update settings');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            return alert('Passwords do not match');
        }
        try {
            await api.put('/users/change-password', {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            alert('Password changed successfully');
        } catch (err) {
            alert(err.response?.data?.message || 'Password change failed');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you absolutely sure? This will delete all your records forever.')) {
            try {
                await api.delete('/users/deactivate');
                handleLogout();
            } catch (err) {
                alert('Action failed');
            }
        }
    };

    if (loading) return <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><h2>Loading profile...</h2></div>;

    const tabs = [
        { id: 'personal', label: 'Personal', icon: LucideUser },
        { id: 'interest', label: 'Interest', icon: LucideSettings },
        { id: 'notifications', label: 'Alerts', icon: LucideBell },
        { id: 'prefs', label: 'App Prefs', icon: LucidePalette },
        { id: 'security', label: 'Security', icon: LucideDatabase }
    ];

    return (
        <div className="container" style={{ background: 'var(--bg-main)' }}>
            <header style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <LucideArrowLeft size={24} color="var(--primary)" />
                </button>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Settings & Profile</h2>
            </header>

            <div style={{ padding: '0 20px' }}>
                <div className="content-center">
                    {/* Compact Top Profile Card */}
                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', marginBottom: '20px' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '20px', background: 'var(--gray-100)', overflow: 'hidden' }}>
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`} alt="Avatar" style={{ width: '100%' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>{user.fullName}</h3>
                            <p style={{ margin: 0, fontSize: '12px', color: 'var(--gray-500)' }}>{user.email}</p>
                        </div>
                        <div style={{ background: 'rgba(var(--primary-rgb), 0.1)', padding: '6px 12px', borderRadius: '12px', fontSize: '10px', color: 'var(--primary)', fontWeight: 'bold' }}>
                            {role.toUpperCase()}
                        </div>
                    </div>

                    {/* Horizontal Tab Navigation */}
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '25px', paddingBottom: '5px', scrollbarWidth: 'none' }}>
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    whiteSpace: 'nowrap', padding: '10px 18px', borderRadius: '15px', border: 'none',
                                    display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                                    background: activeTab === tab.id ? 'var(--primary)' : 'white',
                                    color: activeTab === tab.id ? 'white' : 'var(--gray-500)',
                                    fontWeight: '700', fontSize: '13px', transition: 'all 0.2s',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                                }}
                            >
                                <tab.icon size={16} /> {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content Areas */}
                    <div className="card" style={{ padding: '30px' }}>

                        {/* 1. Personal Information */}
                        {activeTab === 'personal' && (
                            <form onSubmit={handleProfileUpdate}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '800' }}>Personal Information</h3>
                                    {!editing ? (
                                        <button type="button" onClick={() => setEditing(true)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
                                            <LucideEdit3 size={16} /> Edit
                                        </button>
                                    ) : (
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button type="button" onClick={() => setEditing(false)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}><LucideX size={20} /></button>
                                            <button type="submit" style={{ background: 'none', border: 'none', color: 'var(--success)', cursor: 'pointer' }}><LucideSave size={20} /></button>
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {[
                                        { label: 'Full Name', key: 'fullName', icon: LucideUser },
                                        { label: 'Email ID', key: 'email', icon: LucideMail, type: 'email' },
                                        { label: 'Phone Number', key: 'phone', icon: LucidePhone }
                                    ].map(field => (
                                        <div key={field.key}>
                                            <label style={{ fontSize: '12px', color: 'var(--gray-500)', display: 'block', marginBottom: '8px' }}>{field.label}</label>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--gray-100)', padding: '12px 15px', borderRadius: '12px' }}>
                                                <field.icon size={18} color="var(--gray-400)" />
                                                <input
                                                    type={field.type || 'text'}
                                                    disabled={!editing}
                                                    style={{ border: 'none', outline: 'none', width: '100%', background: 'transparent', fontSize: '14px', color: editing ? 'black' : 'var(--gray-600)' }}
                                                    value={profileForm[field.key]}
                                                    onChange={(e) => setProfileForm({ ...profileForm, [field.key]: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </form>
                        )}

                        {/* 2. Interest Preferences */}
                        {activeTab === 'interest' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: '800' }}>Interest Logic Defaults</h3>

                                <div>
                                    <label style={{ fontSize: '12px', color: 'var(--gray-500)', display: 'block', marginBottom: '10px' }}>Default Interest Type</label>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        {['Simple', 'Compound'].map(type => (
                                            <button
                                                key={type}
                                                onClick={() => handleSettingsUpdate({ defaultInterestType: type })}
                                                style={{
                                                    flex: 1, padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                                                    background: settingsForm.defaultInterestType === type ? 'var(--primary)' : 'var(--gray-100)',
                                                    color: settingsForm.defaultInterestType === type ? 'white' : 'black',
                                                    fontWeight: '700', transition: '0.2s'
                                                }}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: '12px', color: 'var(--gray-500)', display: 'block', marginBottom: '8px' }}>Default Rate (%)</label>
                                    <input
                                        type="number"
                                        className="card"
                                        style={{ width: '100%', marginBottom: 0, padding: '15px', background: 'var(--gray-100)', border: 'none' }}
                                        value={settingsForm.defaultInterestRate}
                                        onBlur={(e) => handleSettingsUpdate({ defaultInterestRate: parseFloat(e.target.value) })}
                                        onChange={(e) => setSettingsForm({ ...settingsForm, defaultInterestRate: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label style={{ fontSize: '12px', color: 'var(--gray-500)', display: 'block', marginBottom: '10px' }}>Grace Period (Days)</label>
                                    <p style={{ fontSize: '11px', color: 'var(--gray-400)', marginBottom: '8px' }}>Days before interest starts accruing</p>
                                    <input
                                        type="number"
                                        className="card"
                                        style={{ width: '100%', marginBottom: 0, padding: '15px', background: 'var(--gray-100)', border: 'none' }}
                                        value={settingsForm.gracePeriod}
                                        onBlur={(e) => handleSettingsUpdate({ gracePeriod: parseInt(e.target.value) })}
                                        onChange={(e) => setSettingsForm({ ...settingsForm, gracePeriod: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        {/* 3. Notification Settings */}
                        {activeTab === 'notifications' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: '800' }}>In-App Reminders</h3>
                                        <p style={{ fontSize: '12px', color: 'var(--gray-500)' }}>Enable automated due alerts</p>
                                    </div>
                                    <div
                                        onClick={() => handleSettingsUpdate({ notificationsEnabled: !settingsForm.notificationsEnabled })}
                                        style={{ width: '50px', height: '26px', background: settingsForm.notificationsEnabled ? 'var(--success)' : 'var(--gray-300)', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: '0.3s' }}
                                    >
                                        <div style={{ position: 'absolute', top: '3px', left: settingsForm.notificationsEnabled ? '27px' : '3px', width: '20px', height: '20px', background: 'white', borderRadius: '50%', transition: '0.3s' }}></div>
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: '12px', color: 'var(--gray-500)', display: 'block', marginBottom: '12px' }}>Show Reminders</label>
                                    <select
                                        className="card"
                                        style={{ width: '100%', marginBottom: 0, padding: '15px', background: 'var(--gray-100)', border: 'none' }}
                                        value={settingsForm.reminderAdvance}
                                        onChange={(e) => handleSettingsUpdate({ reminderAdvance: parseInt(e.target.value) })}
                                    >
                                        <option value={1}>1 Day before</option>
                                        <option value={3}>3 Days before</option>
                                        <option value={7}>1 week before</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* 4. App Preferences */}
                        {activeTab === 'prefs' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                <div>
                                    <label style={{ fontSize: '12px', color: 'var(--gray-500)', display: 'block', marginBottom: '12px' }}>Currency Display</label>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        {['₹', '$', '€', '£'].map(curr => (
                                            <button
                                                key={curr}
                                                onClick={() => handleSettingsUpdate({ currency: curr })}
                                                style={{
                                                    flex: 1, padding: '15px', borderRadius: '15px', border: 'none', cursor: 'pointer',
                                                    background: settingsForm.currency === curr ? 'var(--primary)' : 'var(--gray-100)',
                                                    color: settingsForm.currency === curr ? 'white' : 'black',
                                                    fontWeight: '800', fontSize: '18px'
                                                }}
                                            >
                                                {curr}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: '12px', color: 'var(--gray-500)', display: 'block', marginBottom: '12px' }}>Mode Switch</label>
                                    <button
                                        className="btn btn-primary"
                                        style={{ width: '100%', padding: '18px', borderRadius: '16px' }}
                                        onClick={toggleRole}
                                    >
                                        Switch to {role === 'Borrower' ? 'Investor' : 'Borrower'} Mode
                                    </button>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '800' }}>Show Charts</h3>
                                    <div
                                        onClick={() => handleSettingsUpdate({ showGraphs: !settingsForm.showGraphs })}
                                        style={{ width: '50px', height: '26px', background: settingsForm.showGraphs ? 'var(--primary)' : 'var(--gray-300)', borderRadius: '20px', position: 'relative', cursor: 'pointer' }}
                                    >
                                        <div style={{ position: 'absolute', top: '3px', left: settingsForm.showGraphs ? '27px' : '3px', width: '20px', height: '20px', background: 'white', borderRadius: '50%', transition: '0.3s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 5. Security & Data */}
                        {activeTab === 'security' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                                <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '800' }}>Security</h3>
                                    <input
                                        type="password" placeholder="Current Password" required
                                        style={{ padding: '15px', background: 'var(--gray-100)', border: 'none', borderRadius: '12px', width: '100%' }}
                                        value={passwordForm.currentPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                    />
                                    <input
                                        type="password" placeholder="New Password" required
                                        style={{ padding: '15px', background: 'var(--gray-100)', border: 'none', borderRadius: '12px', width: '100%' }}
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                    />
                                    <input
                                        type="password" placeholder="Confirm New Password" required
                                        style={{ padding: '15px', background: 'var(--gray-100)', border: 'none', borderRadius: '12px', width: '100%' }}
                                        value={passwordForm.confirmPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                    />
                                    <button type="submit" className="btn btn-primary" style={{ padding: '15px', borderRadius: '12px' }}>Update Password</button>
                                </form>

                                <div style={{ paddingTop: '20px', borderTop: '1px solid var(--gray-100)' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '15px', color: 'var(--error)' }}>Danger Zone</h3>
                                    <button
                                        onClick={handleLogout}
                                        className="btn" style={{ width: '100%', marginBottom: '10px', background: 'rgba(0,0,0,0.05)', borderRadius: '12px' }}
                                    >
                                        Logout from Device
                                    </button>
                                    <button
                                        onClick={handleDeleteAccount}
                                        className="btn" style={{ width: '100%', color: 'var(--error)', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '12px' }}
                                    >
                                        Deactivate Account
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Navigation />
        </div>
    );
};

export default Profile;
