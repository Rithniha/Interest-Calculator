import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LucideArrowLeft, LucideCalendar, LucideUser, LucideLayers, LucidePercent, LucideFileText, LucideInfo } from 'lucide-react';
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
        category: 'Principal',
        interestRate: '',
        interestType: 'Simple',
        paymentFrequency: 'Monthly',
        isRepayment: false,
        notes: '',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const res = await api.get(`/accounts/${accountId}`);
                setAccount(res.data);
                // Adjust default type based on account role
                setFormData(prev => ({
                    ...prev,
                    type: res.data.role === 'Borrower' ? 'Given' : 'Taken'
                }));
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
            navigate(`/ledger/${accountId}`); // Go back to ledger view
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to record transaction');
        } finally {
            setLoading(false);
        }
    };

    if (!account) return <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><h2>Loading Account details...</h2></div>;

    return (
        <div className="container" style={{ background: 'var(--bg-main)' }}>
            <header style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <LucideArrowLeft size={24} color="var(--primary)" />
                </button>
                <h2 style={{ fontSize: '1.2rem' }}>New Transaction</h2>
            </header>

            <div style={{ padding: '20px' }}>
                <div className="content-center">
                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', padding: '15px' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '15px', background: 'var(--gray-100)', overflow: 'hidden' }}>
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${account.name}`} alt="avatar" />
                        </div>
                        <div>
                            <h4 style={{ margin: 0 }}>{account.name}</h4>
                            <p style={{ margin: 0, fontSize: '13px', color: 'var(--gray-500)' }}>Account Balance: <span style={{ fontWeight: 'bold' }}>₹ {account.outstandingBalance}</span></p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid-layout">
                            {/* Primary Info */}
                            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '25px' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '10px' }}>Entry Type</h3>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {[
                                        { id: 'Principal', label: 'Loan / Debt', isRepayment: false },
                                        { id: 'Partial Repayment', label: 'Payment Received', isRepayment: true }
                                    ].map(cat => (
                                        <div
                                            key={cat.id}
                                            onClick={() => setFormData({ ...formData, category: cat.id, isRepayment: cat.isRepayment, interestRate: cat.isRepayment ? '0' : formData.interestRate })}
                                            style={{
                                                flex: 1, padding: '15px', borderRadius: '14px', textAlign: 'center', cursor: 'pointer',
                                                background: formData.category === cat.id ? 'var(--primary)' : 'var(--gray-100)',
                                                color: formData.category === cat.id ? 'white' : 'var(--black)',
                                                fontWeight: '700', fontSize: '13px', border: '2px solid transparent',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {cat.label}
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <label style={{ fontSize: '13px', color: 'var(--gray-500)', display: 'block', marginBottom: '8px' }}>Amount (₹)</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--gray-100)', padding: '12px 15px', borderRadius: '14px' }}>
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
                                    <label style={{ fontSize: '13px', color: 'var(--gray-500)', display: 'block', marginBottom: '8px' }}>Transaction Date</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--gray-100)', padding: '12px 15px', borderRadius: '14px' }}>
                                        <LucideCalendar size={18} color="var(--gray-500)" />
                                        <input
                                            type="date"
                                            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px', background: 'transparent' }}
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Interest Info (Hidden for repayments) */}
                            {!formData.isRepayment && (
                                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '25px' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '10px' }}>Interest Logic</h3>
                                    <div>
                                        <label style={{ fontSize: '13px', color: 'var(--gray-500)', display: 'block', marginBottom: '8px' }}>Interest Rate (%)</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--gray-100)', padding: '12px 15px', borderRadius: '14px' }}>
                                            <LucidePercent size={18} color="var(--gray-500)" />
                                            <input
                                                type="number"
                                                placeholder="2.5"
                                                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '16px', background: 'transparent' }}
                                                value={formData.interestRate}
                                                onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                                                required={!formData.isRepayment}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ fontSize: '13px', color: 'var(--gray-500)', display: 'block', marginBottom: '8px' }}>Compound Type</label>
                                        <select
                                            className="card"
                                            style={{ width: '100%', marginBottom: 0, padding: '15px', background: 'var(--gray-100)', border: 'none', fontSize: '15px' }}
                                            value={formData.interestType}
                                            onChange={(e) => setFormData({ ...formData, interestType: e.target.value })}
                                        >
                                            <option value="Simple">Simple Interest</option>
                                            <option value="Compound">Compound Interest</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Notes & Attachments */}
                            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '25px', gridColumn: formData.isRepayment ? '1 / -1' : 'auto' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '5px' }}>Additional Detail</h3>
                                <div>
                                    <label style={{ fontSize: '13px', color: 'var(--gray-500)', display: 'block', marginBottom: '8px' }}>Notes (Optional)</label>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'var(--gray-100)', padding: '12px 15px', borderRadius: '14px' }}>
                                        <LucideFileText size={18} color="var(--gray-500)" style={{ marginTop: '3px' }} />
                                        <textarea
                                            placeholder="Write a note..."
                                            style={{ border: 'none', outline: 'none', width: '100%', height: '80px', fontSize: '14px', background: 'transparent', resize: 'none' }}
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '30px', padding: '20px', borderRadius: '20px', fontSize: '16px', fontWeight: '800', boxShadow: '0 10px 25px rgba(94, 104, 177, 0.3)' }}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Securely Save Entry'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTransaction;
