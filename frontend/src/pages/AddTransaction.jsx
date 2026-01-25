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
                <h2 style={{ fontSize: '1.2rem' }}>Lend to Customer</h2>
            </header>

            <div style={{ padding: '20px' }}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {account.name.charAt(0)}
                    </div>
                    <div>
                        <h4 style={{ margin: 0 }}>{account.name}</h4>
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--gray-500)' }}>{account.phone}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid var(--gray-100)', paddingBottom: '10px' }}>
                            <LucideLayers size={20} color="var(--gray-500)" />
                            <input
                                type="number"
                                placeholder="Amount (₹)"
                                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '16px' }}
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                required
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid var(--gray-100)', paddingBottom: '10px' }}>
                            <LucidePercent size={20} color="var(--gray-500)" />
                            <input
                                type="number"
                                placeholder="Interest Rate (%)"
                                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '16px' }}
                                value={formData.interestRate}
                                onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                                required
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid var(--gray-100)', paddingBottom: '10px' }}>
                            <span style={{ fontSize: '14px', color: 'var(--gray-500)', width: '120px' }}>Interest Type</span>
                            <select
                                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '16px', background: 'none' }}
                                value={formData.interestType}
                                onChange={(e) => setFormData({ ...formData, interestType: e.target.value })}
                            >
                                <option value="Simple">Simple Interest</option>
                                <option value="Compound">Compound Interest</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span style={{ fontSize: '14px', color: 'var(--gray-500)', width: '120px' }}>Frequency</span>
                            <select
                                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '16px', background: 'none' }}
                                value={formData.paymentFrequency}
                                onChange={(e) => setFormData({ ...formData, paymentFrequency: e.target.value })}
                            >
                                <option value="Monthly">Monthly</option>
                                <option value="Yearly">Yearly</option>
                                <option value="Daily">Daily</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '30px', padding: '15px', borderRadius: '16px' }}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Save Transaction'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTransaction;
