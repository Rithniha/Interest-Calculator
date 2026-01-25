import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LucideArrowLeft, LucidePlus, LucideMessageCircle, LucideDownload, LucideTrendingUp, LucideTrendingDown, LucideCalendar } from 'lucide-react';
import api from '../utils/api';
import Navigation from '../components/Navigation';

const AccountLedger = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ledger, setLedger] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLedger();
    }, [id]);

    const fetchLedger = async () => {
        try {
            const res = await api.get(`/accounts/${id}/ledger`);
            setLedger(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleWhatsAppReminder = () => {
        const message = `Hello ${ledger.account.name}, this is a reminder regarding your outstanding balance of ₹${ledger.stats.totalPayable} (Principal: ₹${ledger.stats.netPrincipal} + Accrued Interest: ₹${ledger.stats.accruedInterest}). Please check the status at your earliest convenience.`;
        window.open(`https://wa.me/${ledger.account.phone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    if (loading) return <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><h2>Loading Ledger...</h2></div>;
    if (!ledger) return <div className="container"><h2>Account not found</h2></div>;

    return (
        <div className="container" style={{ background: 'var(--bg-main)' }}>
            <header style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <LucideArrowLeft size={24} color="var(--primary)" />
                    </button>
                    <h2 style={{ fontSize: '1.2rem' }}>Ledger: {ledger.account.name}</h2>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={handleWhatsAppReminder} style={{ background: '#25D366', color: 'white', border: 'none', padding: '10px', borderRadius: '12px', cursor: 'pointer' }}>
                        <LucideMessageCircle size={20} />
                    </button>
                    <button className="card" style={{ padding: '10px', borderRadius: '12px', marginBottom: 0 }}>
                        <LucideDownload size={20} color="var(--primary)" />
                    </button>
                </div>
            </header>

            <div style={{ padding: '0 20px' }}>
                <div className="content-center">
                    {/* Stats Overview */}
                    <div className="card" style={{ background: 'var(--primary)', color: 'white', padding: '30px', display: 'flex', flexWrap: 'wrap', gap: '30px', boxShadow: '0 15px 35px rgba(94, 104, 177, 0.3)' }}>
                        <div style={{ flex: 1, minWidth: '150px' }}>
                            <p style={{ fontSize: '12px', opacity: 0.8, marginBottom: '5px' }}>Net Outstanding</p>
                            <h2 style={{ fontSize: '2rem', fontWeight: '900' }}>₹ {ledger.stats.totalPayable}</h2>
                            <p style={{ fontSize: '12px', opacity: 0.8, marginTop: '10px' }}>Principal: ₹ {ledger.stats.netPrincipal}</p>
                        </div>
                        <div style={{ flex: 1, minWidth: '150px', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '20px' }}>
                            <p style={{ fontSize: '12px', opacity: 0.8, marginBottom: '5px' }}>Accrued Interest</p>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>+ ₹ {ledger.stats.accruedInterest}</h2>
                            <p style={{ fontSize: '12px', opacity: 0.8, marginTop: '10px' }}>Role: {ledger.account.role}</p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
                        <button
                            className="btn btn-primary"
                            style={{ flex: 1, padding: '15px', borderRadius: '18px' }}
                            onClick={() => navigate(`/add-transaction/${id}`)}
                        >
                            <LucidePlus size={20} /> Add Entry
                        </button>
                    </div>

                    {/* Transaction History / Ledger Table */}
                    <h3 style={{ marginBottom: '15px', fontWeight: '800' }}>Transaction History</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {ledger.transactions.length === 0 ? (
                            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                                <p style={{ color: 'var(--gray-500)' }}>No transactions found for this account.</p>
                            </div>
                        ) : (
                            ledger.transactions.map((t, idx) => (
                                <div key={idx} className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '18px', borderLeft: `6px solid ${t.isRepayment ? 'var(--success)' : (t.type === 'Given' ? 'var(--primary)' : 'var(--error)')}` }}>
                                    <div style={{ padding: '10px', borderRadius: '15px', background: 'var(--gray-100)', color: 'var(--primary)' }}>
                                        {t.isRepayment ? <LucideTrendingDown size={22} color="var(--success)" /> : (t.type === 'Given' ? <LucideTrendingUp size={22} /> : <LucideTrendingDown size={22} color="var(--error)" />)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <h4 style={{ margin: 0, fontWeight: '700' }}>{t.category} {t.isRepayment && '(Repayment)'}</h4>
                                            <p style={{ margin: 0, fontWeight: '900', color: t.isRepayment ? 'var(--success)' : t.type === 'Given' ? 'var(--primary)' : 'var(--error)' }}>
                                                {t.isRepayment ? '-' : '+'} ₹ {t.amount}
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '15px', marginTop: '5px' }}>
                                            <p style={{ margin: 0, fontSize: '12px', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <LucideCalendar size={14} /> {new Date(t.date).toLocaleDateString()}
                                            </p>
                                            <p style={{ margin: 0, fontSize: '12px', color: 'var(--gray-500)' }}>
                                                Int: {t.interestRate}% ({t.interestType})
                                            </p>
                                        </div>
                                        {t.notes && <p style={{ margin: '8px 0 0 0', fontSize: '12px', fontStyle: 'italic', color: 'var(--gray-600)' }}>"{t.notes}"</p>}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <Navigation />
        </div>
    );
};

export default AccountLedger;
