import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LucideArrowLeft, LucidePlus, LucideSearch } from 'lucide-react';
import api from '../utils/api';

const SelectCustomer = () => {
    const [accounts, setAccounts] = useState([]);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const res = await api.get('/accounts');
                setAccounts(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchAccounts();
    }, []);

    const filteredAccounts = accounts.filter(acc =>
        acc.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container" style={{ background: 'var(--bg-main)' }}>
            <header style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <LucideArrowLeft size={24} color="var(--primary)" />
                </button>
                <h2 style={{ fontSize: '1.2rem' }}>Select Customer</h2>
            </header>

            <div style={{ padding: '0 20px' }}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', marginBottom: '20px' }}>
                    <LucideSearch color="var(--gray-500)" size={20} />
                    <input
                        type="text"
                        placeholder="Search name, keyword..."
                        style={{ border: 'none', outline: 'none', width: '100%', background: 'none' }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <button
                    className="btn"
                    style={{ width: '100%', border: '2px dashed var(--primary)', color: 'var(--primary)', marginBottom: '20px' }}
                    onClick={() => navigate('/add-contact')}
                >
                    <LucidePlus size={18} /> New Customer
                </button>

                {filteredAccounts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px', color: 'var(--gray-500)' }}>
                        <p>No customers found.</p>
                    </div>
                ) : (
                    filteredAccounts.map(acc => (
                        <div
                            key={acc._id}
                            className="card"
                            style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}
                            onClick={() => navigate(`/add-transaction/${acc._id}`)}
                        >
                            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--primary)' }}>
                                {acc.name.charAt(0)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: 0 }}>{acc.name}</h4>
                                <p style={{ margin: 0, fontSize: '12px', color: 'var(--gray-500)' }}>{acc.phone || 'No phone'}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ margin: 0, fontSize: '12px', color: 'var(--gray-500)' }}>Balance</p>
                                <p style={{ margin: 0, fontWeight: 'bold' }}>₹ {acc.outstandingBalance}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SelectCustomer;
