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
        <div className="container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px' }}>
            <div className="card" style={{ marginTop: '20%' }}>
                <h2 style={{ marginBottom: '25px', textAlign: 'center', color: 'var(--primary)' }}>Welcome Back</h2>
                {error && <p style={{ color: 'var(--error)', marginBottom: '15px', fontSize: '14px' }}>{error}</p>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input
                        type="email"
                        placeholder="Email Address"
                        className="card"
                        style={{ width: '100%', marginBottom: '0', padding: '15px' }}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="card"
                        style={{ width: '100%', marginBottom: '0', padding: '15px' }}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '15px', marginTop: '10px' }}>
                        Login
                    </button>
                </form>
                <p style={{ marginTop: '20px', textAlign: 'center', color: 'var(--gray-500)' }}>
                    Don't have an account? <span onClick={() => navigate('/register')} style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}>Sign Up</span>
                </p>
            </div>
        </div>
    );
};

export default Login;
