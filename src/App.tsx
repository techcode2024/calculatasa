import { useState, useMemo, useEffect } from 'react';
import { DollarSign, Euro, Calendar, RefreshCw, Share2, Coins } from 'lucide-react';
import { format } from 'date-fns';
import { RateCard } from './components/RateCard';
import { Calculator } from './components/Calculator';
import { HistoryChart } from './components/HistoryChart';
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
        // Set selected date to the last available date in data
        const lastDate = data[data.length - 1].fullDate;
        setSelectedDate(format(lastDate, 'yyyy-MM-dd'));
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const currentData = useMemo(() => {
    if (historyData.length === 0) return { usd: 0, eur: 0, usdt: 0 };

    // Find the latest rate that is <= selectedDate
    const found = [...historyData].reverse().find(d => d.isoDate <= selectedDate);

    return found || historyData[0];
  }, [selectedDate, historyData]);

  const prevData = useMemo(() => {
    if (historyData.length === 0) return { usd: 0, eur: 0, usdt: 0 };

    // Find index of currentData in history
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
    <div className="container">
      <header className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="title" style={{ margin: 0, fontSize: '2rem' }}>Calculatasa</h1>
          <p className="subtitle">Tasa del día y conversiones</p>
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
              padding: '0.5rem',
              cursor: 'pointer',
              color: 'var(--accent-secondary)'
            }}
            aria-label="Compartir"
          >
            <Share2 size={20} />
          </button>

          <div className="flex-center" style={{ background: 'var(--bg-card)', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <Calendar size={20} style={{ marginRight: '0.5rem', color: 'var(--accent-primary)' }} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: '0.9rem', outline: 'none', colorScheme: 'dark' }}
            />
          </div>
        </div>
      </header>

      <div className="grid-2" style={{ marginBottom: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
        <RateCard
          currency="Dólar BCV"
          rate={currentData.usd}
          trend={getTrend(currentData.usd, prevData.usd)}
          icon={<DollarSign size={24} color="#10b981" />}
        />
        <RateCard
          currency="USDT"
          rate={currentData.usdt}
          trend={getTrend(currentData.usdt, prevData.usdt)}
          icon={<Coins size={24} color="#f59e0b" />}
        />
        <RateCard
          currency="Euro"
          rate={currentData.eur}
          trend={getTrend(currentData.eur, prevData.eur)}
          icon={<Euro size={24} color="#3b82f6" />}
        />
      </div>

      <Calculator usdRate={currentData.usd} eurRate={currentData.eur} usdtRate={currentData.usdt} />

      <HistoryChart data={historyData} />

      <footer style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
        <p>© 2025 Calculatasa PWA. Datos referenciales.</p>
      </footer>
    </div>
  );
}

export default App;