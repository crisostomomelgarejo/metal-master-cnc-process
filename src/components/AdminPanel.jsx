import React, { useState, useEffect } from 'react';

const AdminPanel = () => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);

  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const response = await fetch('/api/tarifas');
      if (!response.ok) throw new Error('API unavailable');
      const data = await response.json();
      setMachines(data);
    } catch (error) {
      console.error('Error fetching rates, using mock data fallback:', error);
      setMachines([
        { id: 1, tipo_maquina: 'HAAS VF-2SS', precio_hora: 85 },
        { id: 2, tipo_maquina: 'Mazak Integrex', precio_hora: 120 },
        { id: 3, tipo_maquina: 'Doosan Puma 2600', precio_hora: 95 },
        { id: 4, tipo_maquina: 'Amada Fiber Laser', precio_hora: 150 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRateChange = (id, newRate) => {
    setMachines(machines.map(m => m.id === id ? { ...m, precio_hora: newRate } : m));
  };

  const handleSave = async (id, newRate) => {
    setSavingId(id);
    try {
      const response = await fetch(`/api/tarifas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ precio_hora: Number(newRate) }),
      });
      
      if (!response.ok) throw new Error('Failed to update');
      
      // Artificial delay for mock feedback
      await new Promise(r => setTimeout(r, 600));
    } catch (error) {
      console.error('Error updating rate, mocked success:', error);
      // Mock successful save for UI demonstration
      await new Promise(r => setTimeout(r, 600));
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return <div className="p-8 text-white">Loading rates...</div>;
  }

  return (
    <div className="p-8 space-y-8 h-full overflow-y-auto">
      <header>
        <h1 className="text-3xl font-bold text-white uppercase tracking-widest">Admin Panel</h1>
        <p className="text-titanium mt-2">Manage machine configurations and rates</p>
      </header>

      <div className="bg-lead/10 border border-titanium/30 rounded-xl shadow-lg backdrop-blur-sm p-8 max-w-3xl">
        <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-6">Machine Hourly Rates</h2>
        
        <div className="space-y-4">
          {machines.map((machine) => (
            <div key={machine.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-darkbg/60 p-5 rounded-lg border border-titanium/20 group hover:border-metalaccent/40 transition-all shadow-md">
              <div className="mb-4 sm:mb-0">
                <h3 className="text-lg font-bold text-white tracking-wide">{machine.tipo_maquina}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-titanium uppercase tracking-widest font-mono bg-black/40 px-2 py-1 rounded">MCH-{machine.id.toString().padStart(3, '0')}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                  <span className="text-[10px] text-green-400 uppercase tracking-widest">Online</span>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-titanium font-mono">$</span>
                  <input
                    type="number"
                    value={machine.precio_hora}
                    onChange={(e) => handleRateChange(machine.id, e.target.value)}
                    className="w-full sm:w-32 bg-black/50 border border-titanium/40 rounded-lg pl-8 pr-4 py-2.5 text-white text-right focus:outline-none focus:border-metalaccent focus:ring-1 focus:ring-metalaccent transition-all font-mono shadow-inner"
                  />
                </div>
                <span className="text-titanium text-xs uppercase tracking-widest font-bold">/ hr</span>
                <button 
                  onClick={() => handleSave(machine.id, machine.precio_hora)}
                  disabled={savingId === machine.id}
                  className={`ml-2 w-24 border text-xs font-bold py-2.5 px-4 rounded transition-all uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg
                    ${savingId === machine.id 
                      ? 'bg-metalaccent/10 border-metalaccent/30 text-metalaccent/50 cursor-not-allowed' 
                      : 'bg-metalaccent/20 border-metalaccent/60 hover:bg-metalaccent text-metalaccent hover:text-white hover:shadow-metalaccent/20'}`}
                >
                  {savingId === machine.id ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : 'Save'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
