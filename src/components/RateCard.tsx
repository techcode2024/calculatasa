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
        <div className="card animate-fade-in">
            <div className="flex-between">
                <div className="flex-center" style={{ gap: '0.5rem' }}>
                    {icon}
                    <span className="subtitle" style={{ marginBottom: 0, fontSize: '1.1rem', fontWeight: 600 }}>{currency}</span>
                </div>
                <div className={`flex-center`}>
                    {trend === 'up' && <ArrowUp size={20} color="#10b981" />}
                    {trend === 'down' && <ArrowDown size={20} color="#ef4444" />}
                    {trend === 'neutral' && <Minus size={20} color="#94a3b8" />}
                </div>
            </div>
            <div style={{ marginTop: '1rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800 }}>{rate.toFixed(2)}</span>
                <span style={{ marginLeft: '0.5rem', color: 'var(--text-secondary)' }}>Bs</span>
            </div>
        </div>
    );
};
