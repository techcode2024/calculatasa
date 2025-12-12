import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface HistoryChartProps {
    data: { date: string; usd: number; eur: number; usdt: number }[];
}

export const HistoryChart: React.FC<HistoryChartProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="card animate-fade-in" style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p className="subtitle">Cargando histórico...</p>
            </div>
        );
    }

    return (
        <div className="card animate-fade-in" style={{ animationDelay: '0.2s', height: '350px' }}>
            <h2 className="title" style={{ fontSize: '1.25rem' }}>Histórico</h2>
            <div style={{ width: '100%', height: '250px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorUsd" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorEur" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorUsdt" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                            itemStyle={{ color: '#f8fafc' }}
                        />
                        <Area type="monotone" dataKey="usd" stroke="#10b981" fillOpacity={1} fill="url(#colorUsd)" name="Dólar BCV" />
                        <Area type="monotone" dataKey="usdt" stroke="#f59e0b" fillOpacity={1} fill="url(#colorUsdt)" name="USDT" />
                        <Area type="monotone" dataKey="eur" stroke="#3b82f6" fillOpacity={1} fill="url(#colorEur)" name="Euro" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
