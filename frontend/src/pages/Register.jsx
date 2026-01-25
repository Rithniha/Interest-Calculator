import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Register = () => {
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px' }}>
            <div className="card" style={{ marginTop: '15%' }}>
                <h2 style={{ marginBottom: '25px', textAlign: 'center', color: 'var(--primary)' }}>Create Account</h2>
                {error && <p style={{ color: 'var(--error)', marginBottom: '15px', fontSize: '14px' }}>{error}</p>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="card"
                        style={{ width: '100%', marginBottom: '0', padding: '15px' }}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                    />
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
                        Register
                    </button>
                </form>
                <p style={{ marginTop: '20px', textAlign: 'center', color: 'var(--gray-500)' }}>
                    Already have an account? <span onClick={() => navigate('/login')} style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}>Login</span>
                </p>
            </div>
        </div>
    );
};

export default Register;
