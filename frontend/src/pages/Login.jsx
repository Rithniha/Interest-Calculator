import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="form-container">
                <div style={{ textAlign: 'center', marginBottom: '40px', marginTop: '40px' }}>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '10px' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--gray-500)' }}>Manage your interest effortlessly</p>
                </div>

                <div className="card" style={{ padding: '30px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
                    {error && <p style={{ color: 'var(--error)', marginBottom: '20px', fontSize: '14px', background: 'rgba(239, 68, 68, 0.05)', padding: '10px', borderRadius: '8px' }}>{error}</p>}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ fontSize: '13px', color: 'var(--gray-500)', display: 'block', marginBottom: '8px' }}>Email Address</label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className="card"
                                style={{ width: '100%', marginBottom: '0', padding: '15px', background: 'var(--gray-100)', border: 'none' }}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '13px', color: 'var(--gray-500)', display: 'block', marginBottom: '8px' }}>Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="card"
                                style={{ width: '100%', marginBottom: '0', padding: '15px', background: 'var(--gray-100)', border: 'none' }}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '18px', marginTop: '10px', borderRadius: '16px', fontSize: '16px' }}>
                            Sign In
                        </button>
                    </form>
                    <p style={{ marginTop: '25px', textAlign: 'center', color: 'var(--gray-500)', fontSize: '14px' }}>
                        New here? <span onClick={() => navigate('/register')} style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}>Create Account</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
