import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LucideArrowLeft, LucideCalendar, LucideUser, LucideLayers, LucidePercent } from 'lucide-react';
import api from '../utils/api';

const AddTransaction = () => {
    const { accountId } = useParams();
    const navigate = useNavigate();
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        accountId,
        amount: '',
        type: 'Given', // Given (Lend) or Taken (Borrow)
        interestRate: '',
        interestType: 'Simple',
        paymentFrequency: 'Monthly',
        notes: ''
    });

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const res = await api.get(`/accounts/${accountId}`);
                setAccount(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchAccount();
    }, [accountId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/transactions', formData);
            navigate('/'); // Go back to dashboard on success
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to record transaction');
        } finally {
            setLoading(false);
        }
    };

    if (!account) return <div className="container">Loading...</div>;

    return (
        <div className="container" style={{ background: 'var(--bg-main)' }}>
            <header style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <LucideArrowLeft size={24} color="var(--primary)" />
                </button>
                <h2 style={{ fontSize: '1.2rem' }}>New Transaction</h2>
            </header>

            <div style={{ padding: '20px' }}>
                <div className="form-container">
                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', padding: '15px' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '15px', background: 'var(--gray-100)', overflow: 'hidden' }}>
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${account.name}`} alt="avatar" />
                        </div>
                        <div>
                            <h4 style={{ margin: 0 }}>{account.name}</h4>
                            <p style={{ margin: 0, fontSize: '13px', color: 'var(--gray-500)' }}>{account.phone || 'No phone provided'}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '25px', padding: '30px' }}>
                            <div>
                                <label style={{ fontSize: '13px', color: 'var(--gray-500)', display: 'block', marginBottom: '8px' }}>Amount (₹)</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--gray-100)', padding: '12px 15px', borderRadius: '12px' }}>
                                    <LucideLayers size={18} color="var(--gray-500)" />
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '16px', background: 'transparent' }}
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: '13px', color: 'var(--gray-500)', display: 'block', marginBottom: '8px' }}>Interest Rate (%)</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--gray-100)', padding: '12px 15px', borderRadius: '12px' }}>
                                    <LucidePercent size={18} color="var(--gray-500)" />
                                    <input
                                        type="number"
                                        placeholder="2.5"
                                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '16px', background: 'transparent' }}
                                        value={formData.interestRate}
                                        onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: '13px', color: 'var(--gray-500)', display: 'block', marginBottom: '8px' }}>Interest Type</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--gray-100)', padding: '12px 15px', borderRadius: '12px' }}>
                                    <select
                                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px', background: 'transparent' }}
                                        value={formData.interestType}
                                        onChange={(e) => setFormData({ ...formData, interestType: e.target.value })}
                                    >
                                        <option value="Simple">Simple Interest</option>
                                        <option value="Compound">Compound Interest</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: '13px', color: 'var(--gray-500)', display: 'block', marginBottom: '8px' }}>Payment Frequency</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--gray-100)', padding: '12px 15px', borderRadius: '12px' }}>
                                    <select
                                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px', background: 'transparent' }}
                                        value={formData.paymentFrequency}
                                        onChange={(e) => setFormData({ ...formData, paymentFrequency: e.target.value })}
                                    >
                                        <option value="Monthly">Monthly</option>
                                        <option value="Yearly">Yearly</option>
                                        <option value="Daily">Daily</option>
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
                            {loading ? 'Processing...' : 'Save Transaction'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTransaction;
