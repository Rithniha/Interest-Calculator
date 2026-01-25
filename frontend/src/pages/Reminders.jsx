import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LucideArrowLeft, LucideBell, LucideClock, LucideAlertTriangle, LucideCheckCircle, LucideCalendar, LucideMessageCircle } from 'lucide-react';
import api from '../utils/api';
import Navigation from '../components/Navigation';

const Reminders = () => {
    const [reminders, setReminders] = useState({ overdue: [], today: [], upcoming: [] });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchReminders();
    }, []);

    const fetchReminders = async () => {
        try {
            const res = await api.get('/stats/reminders');
            setReminders(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleWhatsApp = (rem) => {
        const msg = `Hello ${rem.personName}, this is a reminder for your payment of ₹${rem.amount} which was due on ${new Date(rem.dueDate).toLocaleDateString()}. Status: ${rem.days} days delayed.`;
        window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
    };

    const Section = ({ title, data, type }) => {
        const config = {
            overdue: { icon: LucideAlertTriangle, color: 'var(--error)', bg: 'rgba(239, 68, 68, 0.1)', darkColor: '#991b1b' },
            today: { icon: LucideClock, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', darkColor: '#92400e' },
            upcoming: { icon: LucideCalendar, color: 'var(--primary)', bg: 'rgba(94, 104, 177, 0.1)', darkColor: 'var(--primary)' }
        }[type];

        const Icon = config.icon;

        return (
            <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                    <div style={{ padding: '8px', borderRadius: '10px', background: config.bg, color: config.color }}>
                        <Icon size={20} />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>{title} ({data.length})</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {data.length === 0 ? (
                        <p style={{ color: 'var(--gray-500)', fontSize: '14px', fontStyle: 'italic', paddingLeft: '40px' }}>No payments in this category.</p>
                    ) : (
                        data.map((rem, idx) => (
                            <div key={idx} className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '18px', borderLeft: `5px solid ${config.color}` }}>
                                <div onClick={() => navigate(`/ledger/${rem.accountId}`)} style={{ cursor: 'pointer', flex: 1 }}>
                                    <h4 style={{ margin: 0, fontWeight: '700' }}>{rem.personName}</h4>
                                    <div style={{ display: 'flex', gap: '15px', marginTop: '5px' }}>
                                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            ₹ <span style={{ fontWeight: 'bold', color: 'var(--black)' }}>{rem.amount}</span>
                                        </p>
                                        <p style={{ margin: 0, fontSize: '11px', color: config.color, fontWeight: 'bold' }}>
                                            {type === 'overdue' ? `Delayed ${rem.days} days` : type === 'today' ? 'Due Today' : `In ${rem.days} days`}
                                        </p>
                                    </div>
                                    <p style={{ margin: '5px 0 0 0', fontSize: '10px', color: 'var(--gray-400)' }}>
                                        Due Date: {new Date(rem.dueDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleWhatsApp(rem)}
                                    style={{ background: 'var(--gray-100)', border: 'none', padding: '10px', borderRadius: '12px', cursor: 'pointer', color: '#25D366' }}
                                >
                                    <LucideMessageCircle size={20} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="container" style={{ background: 'var(--bg-main)' }}>
            <header style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <LucideArrowLeft size={24} color="var(--primary)" />
                </button>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Reminders & Dues</h2>
            </header>

            <div style={{ padding: '0 20px' }}>
                <div className="content-center">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '100px' }}><h2>Loading alerts...</h2></div>
                    ) : (
                        <>
                            <Section title="Overdue Payments" data={reminders.overdue} type="overdue" />
                            <Section title="Due Today" data={reminders.today} type="today" />
                            <Section title="Upcoming (7 Days)" data={reminders.upcoming} type="upcoming" />
                        </>
                    )}
                </div>
            </div>
            <Navigation />
        </div>
    );
};

export default Reminders;
