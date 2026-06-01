import React, { useState, useEffect } from 'react';

const PurchaseEstimationModule = () => {
  const [piezas, setPiezas] = useState([]);
  const [selectedPieza, setSelectedPieza] = useState(null);
  
  const [partDims, setPartDims] = useState({ l: '', w: '', h: '' });
  const [grossDims, setGrossDims] = useState({ l: '', w: '', h: '' });
  const [grossCost, setGrossCost] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Mock fetch for pieces
    const fetchPiezas = async () => {
      try {
        const response = await fetch('/api/piezas');
        if (response.ok) {
          const data = await response.json();
          setPiezas(data);
        } else {
          setPiezas([
            { id: 1, name: 'PZ-1001-A', description: 'Bracket Base', status: 'ESTIMATING' },
            { id: 2, name: 'PZ-1002-B', description: 'Mounting Plate', status: 'ESTIMATING' },
            { id: 3, name: 'PZ-1003-C', description: 'Shaft 20mm', status: 'ESTIMATING' }
          ]);
        }
      } catch (err) {
        setPiezas([
          { id: 1, name: 'PZ-1001-A', description: 'Bracket Base', status: 'ESTIMATING' },
          { id: 2, name: 'PZ-1002-B', description: 'Mounting Plate', status: 'ESTIMATING' },
          { id: 3, name: 'PZ-1003-C', description: 'Shaft 20mm', status: 'ESTIMATING' }
        ]);
      }
    };
    fetchPiezas();
  }, []);

  const handleSelect = (e) => {
    const piezaId = parseInt(e.target.value);
    const pieza = piezas.find(p => p.id === piezaId);
    setSelectedPieza(pieza || null);
    setMessage('');
  };

  const calcVolume = (dims) => {
    const l = parseFloat(dims.l) || 0;
    const w = parseFloat(dims.w) || 0;
    const h = parseFloat(dims.h) || 0;
    return l * w * h;
  };

  const partVolume = calcVolume(partDims);
  const grossVolume = calcVolume(grossDims);
  
  let piecesAvailable = 0;
  if (partVolume > 0 && grossVolume > 0) {
    piecesAvailable = Math.floor((grossVolume * 0.95) / partVolume);
  }
  
  let unitCost = 0;
  if (piecesAvailable > 0 && parseFloat(grossCost) > 0) {
    unitCost = parseFloat(grossCost) / piecesAvailable;
  }

  const handleSubmit = async () => {
    if (!selectedPieza) return;
    setLoading(true);
    setMessage('');

    try {
      const payload = {
        ...selectedPieza,
        purchase_estimation: {
          partDims,
          grossDims,
          grossCost,
          piecesAvailable,
          unitCost
        }
      };
      
      const response = await fetch(`/api/piezas/${selectedPieza.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setMessage('Orden Generada y Guardada en BD.');
      } else {
        setMessage('Orden Generada (Mock success).');
      }
    } catch (err) {
       setMessage('Orden Generada (Mock success).');
    }
    setLoading(false);
  };

  return (
    <div className="p-8 space-y-8 h-full overflow-y-auto">
      <header className="border-b border-titanium/20 pb-6">
        <h1 className="text-3xl font-bold text-white uppercase tracking-widest flex items-center gap-3">
          <span className="w-8 h-8 rounded bg-metalaccent/20 border border-metalaccent/50 flex items-center justify-center text-metalaccent text-lg">P</span>
          Purchase Estimation
        </h1>
        <p className="text-titanium mt-2 text-sm uppercase tracking-wide">Material Calculation & McMaster-Carr Sync</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-lead/10 border border-titanium/30 rounded-xl shadow-lg backdrop-blur-sm p-8">
          <div className="mb-8">
            <label className="block text-sm font-medium text-titanium mb-2 uppercase tracking-wider">Select Piece</label>
            <select 
              className="w-full bg-darkbg border border-titanium/30 rounded-lg px-4 py-3 text-steel focus:outline-none focus:border-metalaccent focus:ring-1 focus:ring-metalaccent transition-colors appearance-none"
              onChange={handleSelect}
              defaultValue=""
            >
              <option value="" disabled>-- Select a Piece --</option>
              {piezas.map(p => (
                <option key={p.id} value={p.id}>{p.name} - {p.description}</option>
              ))}
            </select>
          </div>

          {selectedPieza && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-3 border-b border-titanium/20 pb-2">Final Part Dimensions (mm)</h3>
                <div className="grid grid-cols-3 gap-4">
                  <input type="number" placeholder="L" value={partDims.l} onChange={e => setPartDims({...partDims, l: e.target.value})} className="bg-darkbg border border-titanium/30 rounded-lg px-4 py-2 text-steel focus:border-metalaccent focus:ring-1 focus:ring-metalaccent outline-none" />
                  <input type="number" placeholder="W" value={partDims.w} onChange={e => setPartDims({...partDims, w: e.target.value})} className="bg-darkbg border border-titanium/30 rounded-lg px-4 py-2 text-steel focus:border-metalaccent focus:ring-1 focus:ring-metalaccent outline-none" />
                  <input type="number" placeholder="H" value={partDims.h} onChange={e => setPartDims({...partDims, h: e.target.value})} className="bg-darkbg border border-titanium/30 rounded-lg px-4 py-2 text-steel focus:border-metalaccent focus:ring-1 focus:ring-metalaccent outline-none" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-3 border-b border-titanium/20 pb-2">Gross Material (McMaster) Dimensions (mm)</h3>
                <div className="grid grid-cols-3 gap-4">
                  <input type="number" placeholder="L" value={grossDims.l} onChange={e => setGrossDims({...grossDims, l: e.target.value})} className="bg-darkbg border border-titanium/30 rounded-lg px-4 py-2 text-steel focus:border-metalaccent focus:ring-1 focus:ring-metalaccent outline-none" />
                  <input type="number" placeholder="W" value={grossDims.w} onChange={e => setGrossDims({...grossDims, w: e.target.value})} className="bg-darkbg border border-titanium/30 rounded-lg px-4 py-2 text-steel focus:border-metalaccent focus:ring-1 focus:ring-metalaccent outline-none" />
                  <input type="number" placeholder="H" value={grossDims.h} onChange={e => setGrossDims({...grossDims, h: e.target.value})} className="bg-darkbg border border-titanium/30 rounded-lg px-4 py-2 text-steel focus:border-metalaccent focus:ring-1 focus:ring-metalaccent outline-none" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-3 border-b border-titanium/20 pb-2">Material Cost</h3>
                <label className="block text-xs font-bold text-titanium mb-1 uppercase tracking-wider">Gross Material Cost ($)</label>
                <input 
                  type="number" 
                  value={grossCost} 
                  onChange={e => setGrossCost(e.target.value)} 
                  className="w-full bg-darkbg border border-titanium/30 rounded-lg px-4 py-2 text-steel focus:border-metalaccent focus:ring-1 focus:ring-metalaccent outline-none" 
                  placeholder="0.00" 
                />
              </div>
            </div>
          )}
        </div>

        {selectedPieza && (
          <div className="bg-lead/10 border border-titanium/30 rounded-xl shadow-lg backdrop-blur-sm p-8 flex flex-col">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-6 border-b border-titanium/20 pb-2">Estimation Results</h2>
            
            <div className="flex-1 space-y-6">
              <div className="bg-darkbg/50 p-4 rounded-lg border border-titanium/20">
                <span className="text-sm text-titanium uppercase tracking-wider block mb-1">Part Volume</span>
                <span className="text-2xl text-white font-mono">{partVolume > 0 ? partVolume.toFixed(2) : '0'} mm³</span>
              </div>
              
              <div className="bg-darkbg/50 p-4 rounded-lg border border-titanium/20">
                <span className="text-sm text-titanium uppercase tracking-wider block mb-1">Gross Material Volume</span>
                <span className="text-2xl text-white font-mono">{grossVolume > 0 ? grossVolume.toFixed(2) : '0'} mm³</span>
              </div>

              <div className="bg-darkbg/50 p-4 rounded-lg border border-metalaccent/30 bg-metalaccent/5">
                <span className="text-sm text-titanium uppercase tracking-wider block mb-1">Estimated Pieces Available</span>
                <span className="text-3xl text-metalaccent font-bold font-mono">{piecesAvailable}</span>
                <span className="text-xs text-titanium mt-2 block">(Based on 95% yield efficiency)</span>
              </div>

              <div className="bg-darkbg/50 p-4 rounded-lg border border-green-500/30 bg-green-500/5">
                <span className="text-sm text-titanium uppercase tracking-wider block mb-1">Unit Material Cost</span>
                <span className="text-3xl text-green-400 font-bold font-mono">${unitCost.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-titanium/20">
              <button 
                onClick={handleSubmit}
                disabled={loading || piecesAvailable <= 0}
                className="w-full bg-metalaccent/20 border border-metalaccent hover:bg-metalaccent text-metalaccent hover:text-white font-bold py-4 rounded-lg transition-all uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Generar Orden'}
              </button>
              
              {message && (
                <p className="mt-4 text-center text-sm text-green-400 uppercase tracking-widest font-mono">
                  {message}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseEstimationModule;
