import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface RateCardProps {
    currency: string;
    rate: number;
    trend: 'up' | 'down' | 'neutral';
    icon: React.ReactNode;
}

export const RateCard: React.FC<RateCardProps> = ({ currency, rate, trend, icon }) => {
    return (
        <div className="card animate-fade-in" style={{ padding: '0.75rem' }}>
            <div className="flex-between" style={{ marginBottom: '0.25rem' }}>
                <div className="flex-center" style={{ gap: '0.25rem' }}>
                    {icon}
                    <span className="subtitle" style={{ marginBottom: 0, fontSize: '0.8rem', fontWeight: 600 }}>{currency}</span>
                </div>
                <div className={`flex-center`}>
                    {trend === 'up' && <ArrowUp size={14} color="#10b981" />}
                    {trend === 'down' && <ArrowDown size={14} color="#ef4444" />}
                    {trend === 'neutral' && <Minus size={14} color="#94a3b8" />}
                </div>
            </div>
            <div>
                <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{rate.toFixed(2)}</span>
                <span style={{ marginLeft: '0.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Bs</span>
            </div>
        </div>
    );
};
