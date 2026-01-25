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
                <form onSubmit={handleSubmit}>
                    {/* Form Card */}
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid var(--gray-100)', paddingBottom: '10px' }}>
                            <LucideUser size={20} color="var(--gray-500)" />
                            <input
                                type="text"
                                placeholder="Full Name"
                                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '16px' }}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid var(--gray-100)', paddingBottom: '10px' }}>
                            <LucidePhone size={20} color="var(--gray-500)" />
                            <input
                                type="text"
                                placeholder="Phone Number"
                                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '16px' }}
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid var(--gray-100)', paddingBottom: '10px' }}>
                            <LucideMapPin size={20} color="var(--gray-500)" />
                            <input
                                type="text"
                                placeholder="Address"
                                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '16px' }}
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <LucideBriefcase size={20} color="var(--gray-500)" />
                            <select
                                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '16px', background: 'none' }}
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="Borrower">Borrower (Customer)</option>
                                <option value="Investor">Investor (Giver)</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '30px', padding: '15px', borderRadius: '16px' }}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Customer'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddContact;
