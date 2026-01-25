import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LucideArrowLeft, LucideTrendingUp, LucideTrendingDown } from 'lucide-react';
import api from '../utils/api';
import Navigation from '../components/Navigation';

const Transactions = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllTransactions = async () => {
            try {
                // We'll add a route for this, or fetch from all accounts
                const res = await api.get('/stats/overview'); // Reusing stats for now or getting history
                setTransactions(res.data.duePayments || []);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchAllTransactions();
    }, []);

    return (
        <div className="container" style={{ background: 'var(--bg-main)' }}>
            <header style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <LucideArrowLeft size={24} color="var(--primary)" />
                </button>
                <h2 style={{ fontSize: '1.2rem' }}>Transaction History</h2>
            </header>

            <div style={{ padding: '0 20px' }}>
                <div className="content-center">
                    {loading ? (
                        <p>Loading transactions...</p>
                    ) : transactions.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                            <p style={{ color: 'var(--gray-500)', margin: 0 }}>No transactions recorded yet.</p>
                        </div>
                    ) : (
                        <div className="grid-layout">
                            {transactions.map((t, idx) => (
                                <div key={idx} className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '20px' }}>
                                    <div style={{ padding: '12px', borderRadius: '15px', background: t.type === 'Given' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: t.type === 'Given' ? 'var(--success)' : 'var(--error)' }}>
                                        {t.type === 'Given' ? <LucideTrendingUp size={24} /> : <LucideTrendingDown size={24} />}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700' }}>{t.accountId?.name || 'Unknown User'}</h4>
                                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--gray-500)' }}>{new Date(t.date).toLocaleDateString()}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ margin: 0, fontWeight: '800', fontSize: '16px', color: t.type === 'Given' ? 'var(--success)' : 'var(--error)' }}>
                                            {t.type === 'Given' ? '+' : '-'} ₹ {t.amount}
                                        </p>
                                        <p style={{ margin: 0, fontSize: '10px', color: 'var(--gray-500)', textTransform: 'uppercase' }}>{t.interestType || 'Simple'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Navigation />
        </div>
    );
};

export default Transactions;
