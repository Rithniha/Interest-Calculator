import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LucideArrowLeft, LucideUser, LucidePhone, LucideMapPin, LucideBriefcase } from 'lucide-react';
import api from '../utils/api';

const AddContact = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        role: 'Borrower' // Default role
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/accounts', formData);
            navigate('/'); // Go back to dashboard after success
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create contact');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ background: 'var(--bg-main)' }}>
            <header style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <LucideArrowLeft size={24} color="var(--primary)" />
                </button>
                <h2 style={{ fontSize: '1.2rem' }}>Add New Customer</h2>
            </header>

            <div style={{ padding: '20px' }}>
                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                        {/* Form Card */}
                        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '25px', padding: '30px' }}>
                            <div>
                                <label style={{ fontSize: '13px', color: 'var(--gray-500)', display: 'block', marginBottom: '8px' }}>Full Name</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--gray-100)', padding: '12px 15px', borderRadius: '12px' }}>
                                    <LucideUser size={18} color="var(--gray-500)" />
                                    <input
                                        type="text"
                                        placeholder="Enter name"
                                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px', background: 'transparent' }}
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: '13px', color: 'var(--gray-500)', display: 'block', marginBottom: '8px' }}>Phone Number</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--gray-100)', padding: '12px 15px', borderRadius: '12px' }}>
                                    <LucidePhone size={18} color="var(--gray-500)" />
                                    <input
                                        type="text"
                                        placeholder="+91"
                                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px', background: 'transparent' }}
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: '13px', color: 'var(--gray-500)', display: 'block', marginBottom: '8px' }}>Address</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--gray-100)', padding: '12px 15px', borderRadius: '12px' }}>
                                    <LucideMapPin size={18} color="var(--gray-500)" />
                                    <input
                                        type="text"
                                        placeholder="City, State"
                                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px', background: 'transparent' }}
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: '13px', color: 'var(--gray-500)', display: 'block', marginBottom: '8px' }}>Categorize As</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--gray-100)', padding: '12px 15px', borderRadius: '12px' }}>
                                    <LucideBriefcase size={18} color="var(--gray-500)" />
                                    <select
                                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px', background: 'transparent' }}
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="Borrower">Borrower (Customer)</option>
                                        <option value="Investor">Investor (Giver)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '30px', padding: '18px', borderRadius: '16px', fontSize: '16px' }}
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Customer'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddContact;
