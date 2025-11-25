import { useState } from 'react';

const App = () => {
  const [holdings, setHoldings] = useState([]);
  const [newHolding, setNewHolding] = useState({
    coin: '',
    amount: '',
    buyPrice: '',
    currentPrice: '',
    buyDate: ''
  });

  const addHolding = () => {
    if (newHolding.coin && newHolding.amount && newHolding.buyPrice && newHolding.currentPrice && newHolding.buyDate) {
      setHoldings([...holdings, { ...newHolding, id: Date.now() }]);
      setNewHolding({ coin: '', amount: '', buyPrice: '', currentPrice: '', buyDate: '' });
    }
  };

  const removeHolding = (id) => {
    setHoldings(holdings.filter(h => h.id !== id));
  };

  const calculateDaysHeld = (buyDate) => {
    const buy = new Date(buyDate);
    const today = new Date();
    const diffTime = Math.abs(today - buy);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const isLongTerm = (buyDate) => calculateDaysHeld(buyDate) > 365;

  const calculatePnL = (holding) => {
    const costBasis = parseFloat(holding.amount) * parseFloat(holding.buyPrice);
    const currentValue = parseFloat(holding.amount) * parseFloat(holding.currentPrice);
    return currentValue - costBasis;
  };

  const calculateTax = (holding) => {
    const pnl = calculatePnL(holding);
    if (pnl <= 0) return 0;
    return isLongTerm(holding.buyDate) ? 0 : pnl * 0.28;
  };

  const totalPnL = holdings.reduce((sum, h) => sum + calculatePnL(h), 0);
  const totalTax = holdings.reduce((sum, h) => sum + calculateTax(h), 0);
  const totalCostBasis = holdings.reduce((sum, h) => sum + (parseFloat(h.amount) * parseFloat(h.buyPrice)), 0);
  const totalCurrentValue = holdings.reduce((sum, h) => sum + (parseFloat(h.amount) * parseFloat(h.currentPrice)), 0);

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(num);
  };

  const formatPercent = (num) => {
    return (num >= 0 ? '+' : '') + num.toFixed(2) + '%';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #13131f 50%, #0d0d14 100%)',
      fontFamily: "'DM Sans', -apple-system, sans-serif",
      color: '#e4e4e7',
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .glass-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          transition: all 0.3s ease;
        }
        
        .glass-card:hover {
          border-color: rgba(255,255,255,0.15);
          transform: translateY(-2px);
        }
        
        .input-field {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 14px 16px;
          color: #e4e4e7;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          width: 100%;
          transition: all 0.2s ease;
          outline: none;
        }
        
        .input-field:focus {
          border-color: #6366f1;
          background: rgba(99, 102, 241, 0.05);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        
        .input-field::placeholder {
          color: #52525b;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border: none;
          border-radius: 12px;
          padding: 14px 28px;
          color: white;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(99, 102, 241, 0.4);
        }
        
        .btn-danger {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          padding: 8px 12px;
          color: #ef4444;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
        }
        
        .btn-danger:hover {
          background: rgba(239, 68, 68, 0.2);
        }
        
        .stat-value {
          font-family: 'Space Mono', monospace;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        
        .mono {
          font-family: 'Space Mono', monospace;
        }
        
        .fade-in {
          animation: fadeIn 0.5s ease forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.3;
          pointer-events: none;
        }
        
        .tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .tag-green {
          background: rgba(34, 197, 94, 0.15);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }
        
        .tag-amber {
          background: rgba(245, 158, 11, 0.15);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }
      `}</style>
      
      <div className="glow-orb" style={{ width: 400, height: 400, background: '#6366f1', top: -100, left: -100 }} />
      <div className="glow-orb" style={{ width: 300, height: 300, background: '#8b5cf6', bottom: 100, right: -50 }} />
      <div className="glow-orb" style={{ width: 200, height: 200, background: '#22c55e', top: '50%', left: '50%' }} />
      
      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }} className="fade-in">
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 12,
            marginBottom: 16,
            padding: '8px 16px',
            background: 'rgba(99, 102, 241, 0.1)',
            borderRadius: 100,
            border: '1px solid rgba(99, 102, 241, 0.2)'
          }}>
            <span style={{ fontSize: 20 }}>🇵🇹</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#a5a5ab' }}>Portugal Tax Rules</span>
          </div>
          <h1 style={{ 
            fontSize: 42, 
            fontWeight: 700, 
            margin: 0,
            background: 'linear-gradient(135deg, #fff 0%, #a5a5ab 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-1px'
          }}>
            Crypto Tax Calculator
          </h1>
          <p style={{ color: '#71717a', marginTop: 12, fontSize: 15 }}>
            0% tax if held {'>'} 1 year • 28% tax if held {'<'} 1 year
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 40 }}>
          <div className="glass-card fade-in" style={{ padding: 24, animationDelay: '0.1s' }}>
            <p style={{ color: '#71717a', fontSize: 13, marginBottom: 8, fontWeight: 500 }}>PORTFOLIO VALUE</p>
            <p className="stat-value" style={{ color: '#e4e4e7' }}>{formatCurrency(totalCurrentValue)}</p>
            <p style={{ color: '#52525b', fontSize: 13, marginTop: 8 }}>Cost: {formatCurrency(totalCostBasis)}</p>
          </div>
          
          <div className="glass-card fade-in" style={{ padding: 24, animationDelay: '0.2s' }}>
            <p style={{ color: '#71717a', fontSize: 13, marginBottom: 8, fontWeight: 500 }}>TOTAL P&L</p>
            <p className="stat-value" style={{ color: totalPnL >= 0 ? '#22c55e' : '#ef4444' }}>
              {totalPnL >= 0 ? '+' : ''}{formatCurrency(totalPnL)}
            </p>
            <p style={{ color: totalPnL >= 0 ? '#22c55e' : '#ef4444', fontSize: 13, marginTop: 8 }}>
              {totalCostBasis > 0 ? formatPercent((totalPnL / totalCostBasis) * 100) : '0%'}
            </p>
          </div>
          
          <div className="glass-card fade-in" style={{ padding: 24, animationDelay: '0.3s' }}>
            <p style={{ color: '#71717a', fontSize: 13, marginBottom: 8, fontWeight: 500 }}>TAX LIABILITY</p>
            <p className="stat-value" style={{ color: totalTax > 0 ? '#f59e0b' : '#22c55e' }}>
              {formatCurrency(totalTax)}
            </p>
            <p style={{ color: '#52525b', fontSize: 13, marginTop: 8 }}>
              {totalPnL > 0 ? `Effective rate: ${((totalTax / totalPnL) * 100).toFixed(1)}%` : 'No gains to tax'}
            </p>
          </div>
          
          <div className="glass-card fade-in" style={{ padding: 24, animationDelay: '0.4s' }}>
            <p style={{ color: '#71717a', fontSize: 13, marginBottom: 8, fontWeight: 500 }}>NET PROFIT</p>
            <p className="stat-value" style={{ color: (totalPnL - totalTax) >= 0 ? '#22c55e' : '#ef4444' }}>
              {(totalPnL - totalTax) >= 0 ? '+' : ''}{formatCurrency(totalPnL - totalTax)}
            </p>
            <p style={{ color: '#52525b', fontSize: 13, marginTop: 8 }}>After tax deduction</p>
          </div>
        </div>

        <div className="glass-card fade-in" style={{ padding: 28, marginBottom: 30, animationDelay: '0.5s' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20, color: '#e4e4e7' }}>Add Position</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#71717a', marginBottom: 6, fontWeight: 500 }}>COIN</label>
              <input
                type="text"
                placeholder="BTC"
                className="input-field"
                value={newHolding.coin}
                onChange={(e) => setNewHolding({...newHolding, coin: e.target.value.toUpperCase()})}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#71717a', marginBottom: 6, fontWeight: 500 }}>AMOUNT</label>
              <input
                type="number"
                placeholder="0.5"
                className="input-field"
                value={newHolding.amount}
                onChange={(e) => setNewHolding({...newHolding, amount: e.target.value})}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#71717a', marginBottom: 6, fontWeight: 500 }}>BUY PRICE (€)</label>
              <input
                type="number"
                placeholder="25000"
                className="input-field"
                value={newHolding.buyPrice}
                onChange={(e) => setNewHolding({...newHolding, buyPrice: e.target.value})}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#71717a', marginBottom: 6, fontWeight: 500 }}>CURRENT PRICE (€)</label>
              <input
                type="number"
                placeholder="45000"
                className="input-field"
                value={newHolding.currentPrice}
                onChange={(e) => setNewHolding({...newHolding, currentPrice: e.target.value})}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#71717a', marginBottom: 6, fontWeight: 500 }}>BUY DATE</label>
              <input
                type="date"
                className="input-field"
                value={newHolding.buyDate}
                onChange={(e) => setNewHolding({...newHolding, buyDate: e.target.value})}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button className="btn-primary" onClick={addHolding} style={{ width: '100%' }}>
                Add Position
              </button>
            </div>
          </div>
        </div>

        {holdings.length > 0 && (
          <div className="glass-card fade-in" style={{ padding: 28, animationDelay: '0.6s', overflow: 'hidden' }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20, color: '#e4e4e7' }}>Your Positions</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, color: '#71717a', fontWeight: 600, letterSpacing: '0.5px' }}>ASSET</th>
                    <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: 11, color: '#71717a', fontWeight: 600, letterSpacing: '0.5px' }}>AMOUNT</th>
                    <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: 11, color: '#71717a', fontWeight: 600, letterSpacing: '0.5px' }}>COST BASIS</th>
                    <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: 11, color: '#71717a', fontWeight: 600, letterSpacing: '0.5px' }}>VALUE</th>
                    <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: 11, color: '#71717a', fontWeight: 600, letterSpacing: '0.5px' }}>P&L</th>
                    <th style={{ textAlign: 'center', padding: '12px 16px', fontSize: 11, color: '#71717a', fontWeight: 600, letterSpacing: '0.5px' }}>HOLDING</th>
                    <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: 11, color: '#71717a', fontWeight: 600, letterSpacing: '0.5px' }}>TAX</th>
                    <th style={{ padding: '12px 16px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((holding) => {
                    const pnl = calculatePnL(holding);
                    const tax = calculateTax(holding);
                    const daysHeld = calculateDaysHeld(holding.buyDate);
                    const longTerm = isLongTerm(holding.buyDate);
                    
                    return (
                      <tr key={holding.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '16px', fontWeight: 600 }}>
                          <span style={{ fontSize: 16 }}>{holding.coin}</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }} className="mono">
                          {parseFloat(holding.amount).toFixed(6)}
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right', color: '#a5a5ab' }} className="mono">
                          {formatCurrency(parseFloat(holding.amount) * parseFloat(holding.buyPrice))}
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }} className="mono">
                          {formatCurrency(parseFloat(holding.amount) * parseFloat(holding.currentPrice))}
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right', color: pnl >= 0 ? '#22c55e' : '#ef4444', fontWeight: 600 }} className="mono">
                          {pnl >= 0 ? '+' : ''}{formatCurrency(pnl)}
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <span className={`tag ${longTerm ? 'tag-green' : 'tag-amber'}`}>
                            {daysHeld}d {longTerm ? '✓' : ''}
                          </span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right', color: tax > 0 ? '#f59e0b' : '#22c55e', fontWeight: 600 }} className="mono">
                          {formatCurrency(tax)}
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <button className="btn-danger" onClick={() => removeHolding(holding.id)}>
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {holdings.length === 0 && (
          <div className="glass-card fade-in" style={{ padding: 60, textAlign: 'center', animationDelay: '0.6s' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
            <p style={{ color: '#71717a', fontSize: 15 }}>Add your first position to start tracking your portfolio</p>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 40, color: '#52525b', fontSize: 13 }}>
          <p>💡 Hold for more than 365 days to pay 0% capital gains tax in Portugal</p>
        </div>
      </div>
    </div>
  );
};

export default App;
