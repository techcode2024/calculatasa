import { useState, useMemo, useEffect } from 'react';
import { DollarSign, Euro, Calendar, RefreshCw, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { RateCard } from './components/RateCard';
import { Calculator } from './components/Calculator';
import { SimpleCalculator } from './components/SimpleCalculator';
import { fetchHistory, type RateData } from './services/api';

function App() {
  const [historyData, setHistoryData] = useState<RateData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchHistory();
      if (data.length > 0) {
        setHistoryData(data);
        const lastDate = data[data.length - 1].fullDate;
        setSelectedDate(format(lastDate, 'yyyy-MM-dd'));
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const currentData = useMemo(() => {
    if (historyData.length === 0) return { usd: 0, eur: 0, usdt: 0 };
    const found = [...historyData].reverse().find(d => d.isoDate <= selectedDate);
    return found || historyData[0];
  }, [selectedDate, historyData]);

  const prevData = useMemo(() => {
    if (historyData.length === 0) return { usd: 0, eur: 0, usdt: 0 };
    const currentIdx = historyData.findIndex(d => d.isoDate === (currentData as RateData).isoDate);
    if (currentIdx > 0) return historyData[currentIdx - 1];
    return historyData[0];
  }, [currentData, historyData]);

  const getTrend = (current: number, prev: number) => {
    if (current > prev) return 'up';
    if (current < prev) return 'down';
    return 'neutral';
  };

  if (loading) {
    return (
      <div className="container flex-center" style={{ height: '100vh', flexDirection: 'column' }}>
        <RefreshCw className="animate-spin" size={48} color="var(--accent-primary)" />
        <p className="subtitle" style={{ marginTop: '1rem' }}>Cargando tasas...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '0.5rem', paddingBottom: '1rem' }}>
      <header className="flex-between" style={{ marginBottom: '0.5rem' }}>
        <div>
          <h1 className="title" style={{ margin: 0, fontSize: '1.5rem' }}>Calculatasa</h1>
          <p className="subtitle" style={{ fontSize: '0.8rem' }}>Tasa del día</p>
        </div>
        <div className="flex-center" style={{ gap: '0.5rem' }}>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Calculatasa',
                  text: `Tasa del día:\nUSD BCV: ${currentData.usd} Bs\nUSDT: ${currentData.usdt} Bs`,
                  url: window.location.href
                }).catch(console.error);
              } else {
                alert('Copia este enlace para compartir: ' + window.location.href);
              }
            }}
            className="flex-center"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '0.4rem',
              cursor: 'pointer',
              color: 'var(--accent-secondary)'
            }}
            aria-label="Compartir"
          >
            <Share2 size={18} />
          </button>

          <div className="flex-center" style={{ background: 'var(--bg-card)', padding: '0.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <Calendar size={18} style={{ marginRight: '0.25rem', color: 'var(--accent-primary)' }} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: '0.8rem', outline: 'none', colorScheme: 'dark', width: '85px' }}
            />
          </div>
        </div>
      </header>

      <div className="grid-2" style={{ marginBottom: '0.5rem', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
        <RateCard
          currency="BCV"
          rate={currentData.usd}
          trend={getTrend(currentData.usd, prevData.usd)}
          icon={<DollarSign size={18} color="#10b981" />}
        />
        <RateCard
          currency="USDT"
          rate={currentData.usdt}
          trend={getTrend(currentData.usdt, prevData.usdt)}
          icon={<DollarSign size={18} color="#fbbf24" />}
        />
        <RateCard
          currency="EUR"
          rate={currentData.eur}
          trend={getTrend(currentData.eur, prevData.eur)}
          icon={<Euro size={18} color="#3b82f6" />}
        />
      </div>

      <Calculator usdRate={currentData.usd} eurRate={currentData.eur} usdtRate={currentData.usdt} />

      <div style={{ marginTop: '0.5rem' }}>
        <SimpleCalculator />
      </div>

      <footer style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.7rem' }}>
        <p>© 2025 Calculatasa PWA.</p>
      </footer>
    </div>
  );
}

export default App;