import React, { useState, useEffect } from 'react';

const PurchaseEstimationModule = () => {
  const [piezas, setPiezas] = useState([]);
  const [selectedPieza, setSelectedPieza] = useState(null);
  
  const [unit, setUnit] = useState('mm');
  const [kerf, setKerf] = useState(3.0);

  const [partDims, setPartDims] = useState({ l: '', w: '', h: '' });
  
  // Multi-Lot Cart State
  const [lotes, setLotes] = useState([]);
  const [lotSku, setLotSku] = useState('');
  const [lotDims, setLotDims] = useState({ l: '', w: '', h: '' });
  const [lotCost, setLotCost] = useState('');
  const [lotQty, setLotQty] = useState(1);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchPiezas = async () => {
      try {
        const response = await fetch('/api/piezas');
        if (response.ok) {
          const data = await response.json();
          setPiezas(data);
        } else {
          setPiezas([
            { id: 1, name: 'PZ-1001-A', description: 'Bracket Base', status: 'ESTIMATING', cantidad: 50 },
            { id: 2, name: 'PZ-1002-B', description: 'Mounting Plate', status: 'ESTIMATING', cantidad: 120 },
            { id: 3, name: 'PZ-1003-C', description: 'Shaft 20mm', status: 'ESTIMATING', cantidad: 200 }
          ]);
        }
      } catch (err) {
        setPiezas([
          { id: 1, name: 'PZ-1001-A', description: 'Bracket Base', status: 'ESTIMATING', cantidad: 50 },
          { id: 2, name: 'PZ-1002-B', description: 'Mounting Plate', status: 'ESTIMATING', cantidad: 120 },
          { id: 3, name: 'PZ-1003-C', description: 'Shaft 20mm', status: 'ESTIMATING', cantidad: 200 }
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
    setLotes([]);
  };

  const calculateMaxYield = (gross, part, kValue) => {
    const gl = parseFloat(gross.l) || 0;
    const gw = parseFloat(gross.w) || 0;
    const gh = parseFloat(gross.h) || 0;
    
    const pl = parseFloat(part.l) || 0;
    const pw = parseFloat(part.w) || 0;
    const ph = parseFloat(part.h) || 0;
    
    const k = parseFloat(kValue) || 0;
    
    if (!gl || !gw || !gh || !pl || !pw || !ph) return { pieces: 0, breakdown: '' };

    const rotations = [
      [pl, pw, ph],
      [pl, ph, pw],
      [pw, pl, ph],
      [pw, ph, pl],
      [ph, pl, pw],
      [ph, pw, pl]
    ];
    
    let maxYield = 0;
    let bestBreakdown = '0x0x0 = 0 piezas';
    
    rotations.forEach(rot => {
      const [x, y, z] = rot;
      
      const pX = (x <= gl && x > 0) ? (Math.abs(gl - x) < 0.0001 ? 1 : Math.floor(gl / (x + k))) : 0;
      const pY = (y <= gw && y > 0) ? (Math.abs(gw - y) < 0.0001 ? 1 : Math.floor(gw / (y + k))) : 0;
      const pZ = (z <= gh && z > 0) ? (Math.abs(gh - z) < 0.0001 ? 1 : Math.floor(gh / (z + k))) : 0;
      
      const total = pX * pY * pZ;
      if (total >= maxYield && total > 0) {
        maxYield = total;
        bestBreakdown = `${pX}x${pY}x${pZ} = ${total} piezas`;
      }
    });
    
    return { pieces: maxYield, breakdown: maxYield > 0 ? bestBreakdown : '0x0x0 = 0 piezas' };
  };

  const handleAddLot = () => {
    const { pieces: piecesPerUnit, breakdown } = calculateMaxYield(lotDims, partDims, kerf);
    const qty = parseInt(lotQty) || 1;
    const totalYield = piecesPerUnit * qty;
    
    const newLot = {
      id: Date.now(),
      sku: lotSku,
      dims: { ...lotDims },
      cost: parseFloat(lotCost) || 0,
      qty,
      yieldPerUnit: piecesPerUnit,
      totalYield,
      breakdown
    };
    
    setLotes([...lotes, newLot]);
    
    setLotSku('');
    setLotDims({ l: '', w: '', h: '' });
    setLotCost('');
    setLotQty(1);
  };

  const piecesRequested = selectedPieza?.cantidad || 0;
  const totalYielded = lotes.reduce((sum, lot) => sum + lot.totalYield, 0);
  const totalCost = lotes.reduce((sum, lot) => sum + (lot.cost * lot.qty), 0);
  const unitMaterialCost = piecesRequested > 0 ? (totalCost / piecesRequested) : 0;

  const handleSubmit = async () => {
    if (!selectedPieza) return;
    setLoading(true);
    setMessage('');

    try {
      const payload = {
        ...selectedPieza,
        costo_material_bruto: unitMaterialCost,
        lotes_material_comprado: JSON.stringify(lotes),
        purchase_estimation: {
          unidad: unit,
          kerf,
          partDims,
          totalYielded,
          piecesRequested,
          totalCost
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
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-titanium text-sm uppercase tracking-wider">Unit:</span>
                  <button onClick={() => { setUnit('mm'); setKerf(3.0); }} className={`px-3 py-1 rounded text-sm font-bold tracking-wider ${unit === 'mm' ? 'bg-metalaccent text-white' : 'bg-darkbg text-titanium border border-titanium/30'}`}>MM</button>
                  <button onClick={() => { setUnit('inches'); setKerf(0.125); }} className={`px-3 py-1 rounded text-sm font-bold tracking-wider ${unit === 'inches' ? 'bg-metalaccent text-white' : 'bg-darkbg text-titanium border border-titanium/30'}`}>INCHES</button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-titanium text-sm uppercase tracking-wider">Kerf:</span>
                  <input type="number" value={kerf} onChange={e => setKerf(e.target.value)} className="w-24 bg-darkbg border border-titanium/30 rounded px-3 py-1 text-steel focus:border-metalaccent outline-none" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-3 border-b border-titanium/20 pb-2">Final Part Dimensions ({unit})</h3>
                <div className="grid grid-cols-3 gap-4">
                  <input type="number" placeholder="L" value={partDims.l} onChange={e => setPartDims({...partDims, l: e.target.value})} className="bg-darkbg border border-titanium/30 rounded-lg px-4 py-2 text-steel focus:border-metalaccent focus:ring-1 focus:ring-metalaccent outline-none" />
                  <input type="number" placeholder="W" value={partDims.w} onChange={e => setPartDims({...partDims, w: e.target.value})} className="bg-darkbg border border-titanium/30 rounded-lg px-4 py-2 text-steel focus:border-metalaccent focus:ring-1 focus:ring-metalaccent outline-none" />
                  <input type="number" placeholder="H" value={partDims.h} onChange={e => setPartDims({...partDims, h: e.target.value})} className="bg-darkbg border border-titanium/30 rounded-lg px-4 py-2 text-steel focus:border-metalaccent focus:ring-1 focus:ring-metalaccent outline-none" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-3 border-b border-titanium/20 pb-2">Agregar Lote (McMaster)</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                   <div>
                     <label className="block text-xs font-bold text-titanium mb-1 uppercase tracking-wider">SKU / Item Name</label>
                     <input type="text" value={lotSku} onChange={e => setLotSku(e.target.value)} className="w-full bg-darkbg border border-titanium/30 rounded-lg px-4 py-2 text-steel focus:border-metalaccent focus:ring-1 focus:ring-metalaccent outline-none" placeholder="e.g. 8910K12" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-titanium mb-1 uppercase tracking-wider">Cost per Unit ($)</label>
                     <input type="number" value={lotCost} onChange={e => setLotCost(e.target.value)} className="w-full bg-darkbg border border-titanium/30 rounded-lg px-4 py-2 text-steel focus:border-metalaccent focus:ring-1 focus:ring-metalaccent outline-none" placeholder="0.00" />
                   </div>
                </div>

                <label className="block text-xs font-bold text-titanium mb-1 uppercase tracking-wider">Dimensions ({unit})</label>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <input type="number" placeholder="L" value={lotDims.l} onChange={e => setLotDims({...lotDims, l: e.target.value})} className="bg-darkbg border border-titanium/30 rounded-lg px-4 py-2 text-steel focus:border-metalaccent focus:ring-1 focus:ring-metalaccent outline-none" />
                  <input type="number" placeholder="W" value={lotDims.w} onChange={e => setLotDims({...lotDims, w: e.target.value})} className="bg-darkbg border border-titanium/30 rounded-lg px-4 py-2 text-steel focus:border-metalaccent focus:ring-1 focus:ring-metalaccent outline-none" />
                  <input type="number" placeholder="H" value={lotDims.h} onChange={e => setLotDims({...lotDims, h: e.target.value})} className="bg-darkbg border border-titanium/30 rounded-lg px-4 py-2 text-steel focus:border-metalaccent focus:ring-1 focus:ring-metalaccent outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-4 items-end">
                   <div>
                     <label className="block text-xs font-bold text-titanium mb-1 uppercase tracking-wider">Qty to Buy</label>
                     <input type="number" value={lotQty} onChange={e => setLotQty(e.target.value)} min="1" className="w-full bg-darkbg border border-titanium/30 rounded-lg px-4 py-2 text-steel focus:border-metalaccent focus:ring-1 focus:ring-metalaccent outline-none" placeholder="1" />
                   </div>
                   <button 
                     onClick={handleAddLot}
                     disabled={!lotDims.l || !lotDims.w || !lotDims.h || !partDims.l}
                     className="w-full bg-metalaccent/20 border border-metalaccent hover:bg-metalaccent text-metalaccent hover:text-white font-bold py-2 rounded-lg transition-all uppercase tracking-widest disabled:opacity-50"
                   >
                     + Agregar Lote
                   </button>
                </div>
              </div>

              {unit === 'inches' && (
                <div className="bg-darkbg/80 border border-titanium/20 rounded-lg p-4 mt-2">
                  <h4 className="text-xs font-bold text-titanium uppercase tracking-wider mb-2 border-b border-titanium/10 pb-2 flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-metalaccent/20 border border-metalaccent/50 flex items-center justify-center text-metalaccent text-[10px] font-bold">!</span>
                    Fractional Help Table
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-xs font-mono">
                    <div className="flex justify-between border-b border-titanium/10 pb-1"><span className="text-titanium">1/8"</span><span className="text-steel">0.125</span></div>
                    <div className="flex justify-between border-b border-titanium/10 pb-1"><span className="text-titanium">1/4"</span><span className="text-steel">0.25</span></div>
                    <div className="flex justify-between border-b border-titanium/10 pb-1"><span className="text-titanium">1/3"</span><span className="text-steel">0.333</span></div>
                    <div className="flex justify-between border-b border-titanium/10 pb-1"><span className="text-titanium">1/2"</span><span className="text-steel">0.5</span></div>
                    <div className="flex justify-between border-b border-titanium/10 pb-1"><span className="text-titanium">2/3"</span><span className="text-steel">0.666</span></div>
                    <div className="flex justify-between border-b border-titanium/10 pb-1"><span className="text-titanium">3/4"</span><span className="text-steel">0.75</span></div>
                    <div className="flex justify-between border-b border-titanium/10 pb-1"><span className="text-titanium">7/8"</span><span className="text-steel">0.875</span></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {selectedPieza && (
          <div className="bg-lead/10 border border-titanium/30 rounded-xl shadow-lg backdrop-blur-sm p-8 flex flex-col">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-6 border-b border-titanium/20 pb-2">Estimation Results</h2>
            
            <div className="flex-1 space-y-6">
              <div className="bg-darkbg/50 p-4 rounded-lg border border-titanium/20 mb-4">
                <span className="text-sm text-titanium uppercase tracking-wider block mb-1">Total Pieces Requested</span>
                <span className="text-3xl text-white font-mono">{piecesRequested}</span>
              </div>

              <div className="bg-darkbg/50 p-4 rounded-lg border border-metalaccent/30 bg-metalaccent/5 mb-4">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm text-titanium uppercase tracking-wider block">Total Yielded Pieces</span>
                  <span className="text-3xl text-metalaccent font-bold font-mono">{totalYielded} / {piecesRequested}</span>
                </div>
                <div className="w-full bg-darkbg rounded-full h-2.5 border border-titanium/30">
                  <div className={`h-2.5 rounded-full ${totalYielded >= piecesRequested ? 'bg-green-500' : 'bg-metalaccent'}`} style={{ width: `${Math.min((totalYielded / (piecesRequested || 1)) * 100, 100)}%` }}></div>
                </div>
                <span className="text-xs text-titanium mt-2 block">Yielded {totalYielded} of {piecesRequested} requested pieces</span>
              </div>

              <div className="bg-darkbg/50 p-4 rounded-lg border border-titanium/20 mb-4 h-48 overflow-y-auto">
                <span className="text-sm text-titanium uppercase tracking-wider block mb-3 border-b border-titanium/20 pb-2">Lots Cart</span>
                {lotes.length === 0 ? (
                  <p className="text-titanium text-sm text-center py-4">No lots added yet.</p>
                ) : (
                  <div className="space-y-3">
                    {lotes.map(lot => (
                      <div key={lot.id} className="border border-titanium/30 rounded p-3 bg-darkbg flex justify-between items-center">
                        <div>
                          <p className="text-white font-bold text-sm uppercase">{lot.sku || 'UNNAMED LOT'}</p>
                          <p className="text-titanium text-xs font-mono">{lot.dims.l}x{lot.dims.w}x{lot.dims.h} | Qty: {lot.qty}</p>
                          <p className="text-metalaccent text-xs font-mono mt-1">Yields: {lot.yieldPerUnit} x {lot.qty} = {lot.totalYield} pcs ({lot.breakdown})</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold font-mono">${(lot.cost * lot.qty).toFixed(2)}</p>
                          <button onClick={() => setLotes(lotes.filter(l => l.id !== lot.id))} className="text-red-400 hover:text-red-300 text-xs uppercase tracking-wider mt-2">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <div className="flex-1 bg-darkbg/50 p-4 rounded-lg border border-titanium/20">
                  <span className="text-sm text-titanium uppercase tracking-wider block mb-1">Total Cost</span>
                  <span className="text-2xl text-white font-bold font-mono">${totalCost.toFixed(2)}</span>
                </div>
                <div className="flex-1 bg-darkbg/50 p-4 rounded-lg border border-green-500/30 bg-green-500/5">
                  <span className="text-sm text-titanium uppercase tracking-wider block mb-1">Unit Material Cost</span>
                  <span className="text-2xl text-green-400 font-bold font-mono">${unitMaterialCost.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-titanium/20">
              <button 
                onClick={handleSubmit}
                disabled={loading || lotes.length === 0}
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


