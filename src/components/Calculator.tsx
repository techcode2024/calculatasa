import React, { useState, useEffect } from 'react';
import { ArrowRightLeft } from 'lucide-react';

interface CalculatorProps {
    usdRate: number;
    eurRate: number;
    usdtRate: number;
}

export const Calculator: React.FC<CalculatorProps> = ({ usdRate, eurRate, usdtRate }) => {
    const [amount, setAmount] = useState<string>('');
    const [currency, setCurrency] = useState<'USD' | 'EUR' | 'USDT'>('USD');
    const [mode, setMode] = useState<'toBs' | 'fromBs'>('toBs'); // toBs: USD -> Bs, fromBs: Bs -> USD
    const [result, setResult] = useState<number>(0);

    useEffect(() => {
        const val = parseFloat(amount);
        if (isNaN(val)) {
            setResult(0);
            return;
        }
        let rate = usdRate;
        if (currency === 'EUR') rate = eurRate;
        if (currency === 'USDT') rate = usdtRate;

        if (mode === 'toBs') {
            setResult(val * rate);
        } else {
            setResult(val / rate);
        }
    }, [amount, currency, mode, usdRate, eurRate, usdtRate]);

    return (
        <div className="card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h2 className="title" style={{ fontSize: '1.25rem' }}>Calculadora</h2>

            <div className="input-group">
                <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                    <label className="subtitle">Monto</label>
                    <button
                        onClick={() => setMode(prev => prev === 'toBs' ? 'fromBs' : 'toBs')}
                        style={{ background: 'none', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                        <ArrowRightLeft size={16} />
                        {mode === 'toBs' ? `${currency} → Bs` : `Bs → ${currency}`}
                    </button>
                </div>
                <div className="flex-between" style={{ gap: '0.5rem' }}>
                    <input
                        type="number"
                        className="input"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                    />
                    <select
                        className="select"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value as 'USD' | 'EUR' | 'USDT')}
                    >
                        <option value="USD">USD (BCV)</option>
                        <option value="EUR">EUR</option>
                        <option value="USDT">USDT</option>
                    </select>
                </div>
            </div>

            <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div className="subtitle">Resultado</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                    {result.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    <span style={{ fontSize: '1rem', marginLeft: '0.25rem', color: 'var(--text-secondary)' }}>
                        {mode === 'toBs' ? 'Bs' : currency}
                    </span>
                </div>
            </div>
        </div>
    );
};
