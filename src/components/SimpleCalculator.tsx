import React, { useState } from 'react';
import { Delete } from 'lucide-react';

export const SimpleCalculator: React.FC = () => {
    const [display, setDisplay] = useState('0');
    const [equation, setEquation] = useState('');

    const handlePress = (val: string) => {
        if (val === 'C') {
            setDisplay('0');
            setEquation('');
        } else if (val === '=') {
            try {
                // Safe evaluation using Function instead of eval
                // eslint-disable-next-line no-new-func
                const res = new Function('return ' + equation + display)();
                setDisplay(String(res));
                setEquation('');
            } catch {
                setDisplay('Error');
            }
        } else if (['+', '-', '*', '/'].includes(val)) {
            setEquation(equation + display + val);
            setDisplay('0');
        } else if (val === 'back') {
            setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
        } else {
            setDisplay(prev => prev === '0' ? val : prev + val);
        }
    };

    const btnStyle = {
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        color: 'var(--text-primary)',
        borderRadius: '8px',
        fontSize: '1.2rem',
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.5rem',
        height: '40px'
    };

    const accentBtnStyle = {
        ...btnStyle,
        background: 'var(--accent-primary)',
        color: '#000',
        border: 'none'
    };

    return (
        <div className="card animate-fade-in" style={{ padding: '0.75rem' }}>
            <h2 className="title" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Calculadora Rápida</h2>

            <div style={{
                background: 'var(--bg-primary)',
                padding: '0.5rem',
                borderRadius: '8px',
                marginBottom: '0.5rem',
                textAlign: 'right',
                height: '50px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', height: '12px' }}>{equation}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{display}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
                <button onClick={() => handlePress('C')} style={{ ...btnStyle, color: '#ef4444' }}>C</button>
                <button onClick={() => handlePress('/')} style={{ ...btnStyle, color: 'var(--accent-secondary)' }}>/</button>
                <button onClick={() => handlePress('*')} style={{ ...btnStyle, color: 'var(--accent-secondary)' }}>×</button>
                <button onClick={() => handlePress('back')} style={btnStyle}><Delete size={18} /></button>

                <button onClick={() => handlePress('7')} style={btnStyle}>7</button>
                <button onClick={() => handlePress('8')} style={btnStyle}>8</button>
                <button onClick={() => handlePress('9')} style={btnStyle}>9</button>
                <button onClick={() => handlePress('-')} style={{ ...btnStyle, color: 'var(--accent-secondary)' }}>-</button>

                <button onClick={() => handlePress('4')} style={btnStyle}>4</button>
                <button onClick={() => handlePress('5')} style={btnStyle}>5</button>
                <button onClick={() => handlePress('6')} style={btnStyle}>6</button>
                <button onClick={() => handlePress('+')} style={{ ...btnStyle, color: 'var(--accent-secondary)' }}>+</button>

                <button onClick={() => handlePress('1')} style={btnStyle}>1</button>
                <button onClick={() => handlePress('2')} style={btnStyle}>2</button>
                <button onClick={() => handlePress('3')} style={btnStyle}>3</button>
                <button onClick={() => handlePress('=')} style={{ ...accentBtnStyle, gridRow: 'span 2' }}>=</button>

                <button onClick={() => handlePress('0')} style={{ ...btnStyle, gridColumn: 'span 2' }}>0</button>
                <button onClick={() => handlePress('.')} style={btnStyle}>.</button>
            </div>
        </div>
    );
};
