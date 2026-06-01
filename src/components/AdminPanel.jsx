import React, { useState, useEffect } from 'react';

const AdminPanel = () => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const response = await fetch('/api/tarifas');
      const data = await response.json();
      setMachines(data);
    } catch (error) {
      console.error('Error fetching rates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRateChange = (id, newRate) => {
    setMachines(machines.map(m => m.id === id ? { ...m, precio_hora: newRate } : m));
  };

  const handleSave = async (id, newRate) => {
    try {
      const response = await fetch(`/api/tarifas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ precio_hora: Number(newRate) }),
      });
      
      if (response.ok) {
        alert('Rate updated successfully.');
      } else {
        alert('Failed to update rate.');
      }
    } catch (error) {
      console.error('Error updating rate:', error);
      alert('Error updating rate.');
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
        
        <div className="space-y-6">
          {machines.map((machine) => (
            <div key={machine.id} className="flex items-center justify-between bg-darkbg/50 p-4 rounded-lg border border-titanium/20">
              <div>
                <h3 className="text-lg font-medium text-steel">{machine.tipo_maquina}</h3>
                <p className="text-xs text-titanium uppercase tracking-wider mt-1">ID: MCH-{machine.id.toString().padStart(3, '0')}</p>
              </div>
              <div className="flex items-center gap-4">
                <label className="text-titanium text-sm uppercase tracking-wider">$/hr</label>
                <input
                  type="number"
                  value={machine.precio_hora}
                  onChange={(e) => handleRateChange(machine.id, e.target.value)}
                  className="w-24 bg-black/40 border border-titanium/50 rounded-lg px-3 py-2 text-white text-right focus:outline-none focus:border-metalaccent focus:ring-1 focus:ring-metalaccent transition-colors font-mono"
                />
                <button 
                  onClick={() => handleSave(machine.id, machine.precio_hora)}
                  className="bg-metalaccent/20 border border-metalaccent hover:bg-metalaccent text-metalaccent hover:text-white text-sm font-semibold py-2 px-4 rounded transition-colors uppercase tracking-wider"
                >
                  Save
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
