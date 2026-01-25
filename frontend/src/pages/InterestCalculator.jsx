import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LucideArrowLeft, LucideCalculator, LucideRotateCcw } from 'lucide-react';

const InterestCalculator = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        amount: 100000,
        interest: 3,
        frequency: 'Monthly',
        type: 'Simple Interest',
        period: 12 // in months
    });

    const [results, setResults] = useState({
        netInterest: 0,
        totalPayable: 0,
        monthlyPayable: 0
    });

    useEffect(() => {
        calculate();
    }, [data]);

    const calculate = () => {
        const P = parseFloat(data.amount) || 0;
        const R = parseFloat(data.interest) || 0;
        const T = parseFloat(data.period) || 0;

        let interest = 0;
        if (data.type === 'Simple Interest') {
            // Simple Interest = (P * R * T) / 100
            // Assuming R is rate per frequency and T is number of frequencies
            interest = (P * R * T) / 100;
        } else {
            // Compound Interest = P(1 + r/100)^t - P
            interest = P * (Math.pow((1 + (R / 100)), T)) - P;
        }

        setResults({
            netInterest: interest.toFixed(2),
            totalPayable: (P + interest).toFixed(2),
            monthlyPayable: ((P + interest) / T).toFixed(2)
        });
    };

    return (
        <div className="container" style={{ background: 'var(--bg-main)' }}>
            <header style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <LucideArrowLeft size={24} color="var(--primary)" />
                </button>
                <h2 style={{ fontSize: '1.2rem' }}>Interest Calculator</h2>
            </header>

            <div style={{ padding: '20px' }}>
                {/* Results Card */}
                <div className="card" style={{ background: 'var(--primary)', color: 'white', padding: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ fontSize: '12px', opacity: 0.8 }}>Net Interest</p>
                            <h3 style={{ fontSize: '1.2rem' }}>₹ {results.netInterest}</h3>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '12px', opacity: 0.8 }}>Loan amount</p>
                            <h3 style={{ fontSize: '1.2rem' }}>₹ {data.amount}</h3>
                        </div>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '10px' }}>
                        <p style={{ fontSize: '12px', opacity: 0.8 }}>Total payable in {data.period} months</p>
                        <h2 style={{ fontSize: '1.5rem' }}>₹ {results.totalPayable}</h2>
                    </div>
                </div>

                {/* Form Selection */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
                    <div>
                        <label style={{ fontSize: '12px', color: 'var(--gray-500)', display: 'block', marginBottom: '8px' }}>Primary amount</label>
                        <input
                            type="number"
                            className="card"
                            style={{ width: '100%', marginBottom: 0, padding: '15px', background: 'var(--gray-100)', border: 'none' }}
                            value={data.amount}
                            onChange={(e) => setData({ ...data, amount: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label style={{ fontSize: '12px', color: 'var(--gray-500)', display: 'block', marginBottom: '8px' }}>Interest (%)</label>
                            <input
                                type="number"
                                className="card"
                                style={{ width: '100%', marginBottom: 0, padding: '15px', background: 'var(--gray-100)', border: 'none' }}
                                value={data.interest}
                                onChange={(e) => setData({ ...data, interest: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '12px', color: 'var(--gray-500)', display: 'block', marginBottom: '8px' }}>Frequency</label>
                            <select
                                className="card"
                                style={{ width: '100%', marginBottom: 0, padding: '15px', background: 'var(--gray-100)', border: 'none' }}
                                value={data.frequency}
                                onChange={(e) => setData({ ...data, frequency: e.target.value })}
                            >
                                <option>Monthly</option>
                                <option>Yearly</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: '12px', color: 'var(--gray-500)', display: 'block', marginBottom: '8px' }}>Interest Type</label>
                        <select
                            className="card"
                            style={{ width: '100%', marginBottom: 0, padding: '15px', background: 'var(--gray-100)', border: 'none' }}
                            value={data.type}
                            onChange={(e) => setData({ ...data, type: e.target.value })}
                        >
                            <option>Simple Interest</option>
                            <option>Compound Interest</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ fontSize: '12px', color: 'var(--gray-500)', display: 'block', marginBottom: '8px' }}>Interest period (Months)</label>
                        <input
                            type="number"
                            className="card"
                            style={{ width: '100%', marginBottom: 0, padding: '15px', background: 'var(--gray-100)', border: 'none' }}
                            value={data.period}
                            onChange={(e) => setData({ ...data, period: e.target.value })}
                        />
                    </div>
                </div>

                <button
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '10px', padding: '15px', borderRadius: '16px' }}
                    onClick={() => navigate('/select-customer')}
                >
                    Proceed to lend
                </button>
            </div>
        </div>
    );
};

export default InterestCalculator;
