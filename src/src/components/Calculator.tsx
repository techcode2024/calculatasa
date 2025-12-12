import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Copy, Check } from 'lucide-react';

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
    const [igtf, setIgtf] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);

    useEffect(() => {
        const val = parseFloat(amount);
        if (isNaN(val)) {
            setResult(0);
            return;
        }
        let rate = usdRate;
        if (currency === 'EUR') rate = eurRate;
        if (currency === 'USDT') rate = usdtRate;

        let res = 0;
        if (mode === 'toBs') {
            res = val * rate;
        } else {
            res = val / rate;
        }

        // Apply IGTF (3%) only if converting TO Bs (paying in foreign currency)
        if (igtf && mode === 'toBs') {
            res = res * 1.03;
        }

        setResult(res);
    }, [amount, currency, mode, usdRate, eurRate, usdtRate, igtf]);

    const handleCopy = () => {
        navigator.clipboard.writeText(result.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="card animate-fade-in" style={{ animationDelay: '0.1s', padding: '0.75rem' }}>
            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                <h2 className="title" style={{ fontSize: '1rem', marginBottom: 0 }}>Calculadora</h2>
                {mode === 'toBs' && (
                    <button
                        onClick={() => setIgtf(!igtf)}
                        style={{
                            background: igtf ? 'var(--accent-primary)' : 'transparent',
                            border: `1px solid ${igtf ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                            color: igtf ? '#000' : 'var(--text-secondary)',
                            borderRadius: '4px',
                            padding: '2px 6px',
                            fontSize: '0.7rem',
                            cursor: 'pointer',
                            fontWeight: 600,
                            transition: 'all 0.2s'
                        }}
                    >
                        +3% IGTF
                    </button>
                )}
            </div>

            <div className="input-group" style={{ marginBottom: '0.5rem' }}>
                <div className="flex-between" style={{ marginBottom: '0.25rem' }}>
                    <label className="subtitle" style={{ fontSize: '0.8rem' }}>Monto</label>
                    <button
                        onClick={() => setMode(prev => prev === 'toBs' ? 'fromBs' : 'toBs')}
                        style={{ background: 'none', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}
                    >
                        <ArrowRightLeft size={14} />
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
                        style={{ padding: '0.5rem', fontSize: '1rem' }}
                    />
                    <select
                        className="select"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value as 'USD' | 'EUR' | 'USDT')}
                        style={{ padding: '0.5rem', fontSize: '1rem' }}
                    >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="USDT">USDT</option>
                    </select>
                </div>
            </div>

            <div style={{ background: 'var(--bg-primary)', padding: '0.5rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ textAlign: 'left' }}>
                    <div className="subtitle" style={{ fontSize: '0.7rem', marginBottom: '0.25rem' }}>Resultado {igtf && mode === 'toBs' && '(inc. 3%)'}</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                        {result.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        <span style={{ fontSize: '0.8rem', marginLeft: '0.25rem', color: 'var(--text-secondary)' }}>
                            {mode === 'toBs' ? 'Bs' : currency}
                        </span>
                    </div>
                </div>
                <button
                    onClick={handleCopy}
                    style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.5rem',
                        cursor: 'pointer',
                        color: copied ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
            </div>
        </div>
    );
};
