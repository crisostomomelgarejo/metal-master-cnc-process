import React, { useState, useEffect } from 'react';

const ManufacturingTimesModule = () => {
  const [piezas, setPiezas] = useState([]);
  const [selectedPieza, setSelectedPieza] = useState(null);
  const [hours, setHours] = useState({
    cnc: '',
    torno: '',
    laser: ''
  });
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
          // Fallback mock data
          setPiezas([
            { id: 1, name: 'PZ-1001-A', description: 'Bracket Base', status: 'PENDIENTE' },
            { id: 2, name: 'PZ-1002-B', description: 'Mounting Plate', status: 'PENDIENTE' },
            { id: 3, name: 'PZ-1003-C', description: 'Shaft 20mm', status: 'PENDIENTE' }
          ]);
        }
      } catch (err) {
        setPiezas([
          { id: 1, name: 'PZ-1001-A', description: 'Bracket Base', status: 'PENDIENTE' },
          { id: 2, name: 'PZ-1002-B', description: 'Mounting Plate', status: 'PENDIENTE' },
          { id: 3, name: 'PZ-1003-C', description: 'Shaft 20mm', status: 'PENDIENTE' }
        ]);
      }
    };
    fetchPiezas();
  }, []);

  const handleSelect = (e) => {
    const piezaId = parseInt(e.target.value);
    const pieza = piezas.find(p => p.id === piezaId);
    setSelectedPieza(pieza || null);
    setHours({ cnc: '', torno: '', laser: '' });
    setMessage('');
  };

  const handleInputChange = (e) => {
    setHours({
      ...hours,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    if (!selectedPieza) return;
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`/api/piezas/${selectedPieza.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...selectedPieza,
          manufacturing_times: hours,
          estado: 'EN_APROBACION'
        })
      });

      if (response.ok) {
        setMessage('Estimación cargada. Estado: EN_APROBACION');
      } else {
        setMessage('Estimación cargada (Mock success).');
      }
    } catch (err) {
       setMessage('Estimación cargada (Mock success).');
    }
    setLoading(false);
  };

  return (
    <div className="p-8 space-y-8 h-full overflow-y-auto">
      <header className="border-b border-titanium/20 pb-6">
        <h1 className="text-3xl font-bold text-white uppercase tracking-widest flex items-center gap-3">
          <span className="w-8 h-8 rounded bg-metalaccent/20 border border-metalaccent/50 flex items-center justify-center text-metalaccent text-lg">M</span>
          Manufacturing Times
        </h1>
        <p className="text-titanium mt-2 text-sm uppercase tracking-wide">Time Estimation & Resource Planning</p>
      </header>

      <div className="bg-lead/10 border border-titanium/30 rounded-xl shadow-lg backdrop-blur-sm p-8 max-w-3xl">
        <div className="mb-8">
          <label className="block text-sm font-medium text-titanium mb-2 uppercase tracking-wider">Select Piece for Estimation</label>
          <select 
            className="w-full bg-darkbg border border-titanium/30 rounded-lg px-4 py-3 text-steel focus:outline-none focus:border-metalaccent focus:ring-1 focus:ring-metalaccent transition-colors appearance-none"
            onChange={handleSelect}
            defaultValue=""
          >
            <option value="" disabled>-- Select a Piece --</option>
            {piezas.map(p => (
              <option key={p.id} value={p.id}>{p.name} - {p.description} ({p.status})</option>
            ))}
          </select>
        </div>

        {selectedPieza && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-4 border-b border-titanium/20 pb-2">Enter Estimated Hours</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-titanium mb-2 uppercase tracking-wider">CNC Milling (Hrs)</label>
                <input 
                  type="number" 
                  name="cnc"
                  min="0"
                  step="0.5"
                  value={hours.cnc}
                  onChange={handleInputChange}
                  className="w-full bg-darkbg border border-titanium/30 rounded-lg px-4 py-2 text-steel focus:outline-none focus:border-metalaccent focus:ring-1 focus:ring-metalaccent transition-colors"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-titanium mb-2 uppercase tracking-wider">Torno / Lathe (Hrs)</label>
                <input 
                  type="number" 
                  name="torno"
                  min="0"
                  step="0.5"
                  value={hours.torno}
                  onChange={handleInputChange}
                  className="w-full bg-darkbg border border-titanium/30 rounded-lg px-4 py-2 text-steel focus:outline-none focus:border-metalaccent focus:ring-1 focus:ring-metalaccent transition-colors"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-titanium mb-2 uppercase tracking-wider">Laser Cutting (Hrs)</label>
                <input 
                  type="number" 
                  name="laser"
                  min="0"
                  step="0.5"
                  value={hours.laser}
                  onChange={handleInputChange}
                  className="w-full bg-darkbg border border-titanium/30 rounded-lg px-4 py-2 text-steel focus:outline-none focus:border-metalaccent focus:ring-1 focus:ring-metalaccent transition-colors"
                  placeholder="0.0"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-titanium/20">
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="w-full md:w-auto bg-metalaccent/20 border border-metalaccent hover:bg-metalaccent text-metalaccent hover:text-white font-bold py-3 px-8 rounded-lg transition-all uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Cargar Estimación'}
              </button>
              
              {message && (
                <p className="mt-4 text-sm text-green-400 uppercase tracking-widest font-mono">
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

export default ManufacturingTimesModule;
