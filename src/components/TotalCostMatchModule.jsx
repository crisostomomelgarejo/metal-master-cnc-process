import React, { useState, useEffect } from 'react';

const TotalCostMatchModule = () => {
  const [piezas, setPiezas] = useState([]);
  const [selectedPiezaId, setSelectedPiezaId] = useState('');
  const [selectedPieza, setSelectedPieza] = useState(null);

  // Variable Costs State
  const [costoDiseno, setCostoDiseno] = useState(0);
  const [costoPrefab, setCostoPrefab] = useState(0);
  const [costoArmado, setCostoArmado] = useState(0);
  const [costoPulido, setCostoPulido] = useState(0);
  const [costoGrabado, setCostoGrabado] = useState(0);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch piezas
    const fetchPiezas = async () => {
      try {
        const response = await fetch('/api/piezas');
        if (response.ok) {
          const data = await response.json();
          setPiezas(data);
        } else {
          // Mock data if API is not available
          setPiezas([
            {
              id: 1,
              nombre: 'Piece Alpha',
              cantidad: 10,
              costoMaterialUnitario: 150.50,
              horasMecanizado: 3.5,
              tarifaMecanizado: 120.00,
              estado: 'COTIZANDO'
            },
            {
              id: 2,
              nombre: 'Piece Beta',
              cantidad: 25,
              costoMaterialUnitario: 85.00,
              horasMecanizado: 1.25,
              tarifaMecanizado: 110.00,
              estado: 'COTIZANDO'
            }
          ]);
        }
      } catch (error) {
        // Mock data on fetch error
        setPiezas([
          {
            id: 1,
            nombre: 'Piece Alpha (Mock)',
            cantidad: 10,
            costoMaterialUnitario: 150.50,
            horasMecanizado: 3.5,
            tarifaMecanizado: 120.00,
            estado: 'COTIZANDO'
          },
          {
            id: 2,
            nombre: 'Piece Beta (Mock)',
            cantidad: 25,
            costoMaterialUnitario: 85.00,
            horasMecanizado: 1.25,
            tarifaMecanizado: 110.00,
            estado: 'COTIZANDO'
          }
        ]);
      }
    };
    fetchPiezas();
  }, []);

  useEffect(() => {
    if (selectedPiezaId) {
      const pieza = piezas.find(p => p.id.toString() === selectedPiezaId);
      setSelectedPieza(pieza);
      // Reset variables
      setCostoDiseno(0);
      setCostoPrefab(0);
      setCostoArmado(0);
      setCostoPulido(0);
      setCostoGrabado(0);
      setMessage('');
    } else {
      setSelectedPieza(null);
    }
  }, [selectedPiezaId, piezas]);

  const unitMaterialCost = selectedPieza ? selectedPieza.costoMaterialUnitario : 0;
  const unitManufacturingCost = selectedPieza ? (selectedPieza.horasMecanizado * selectedPieza.tarifaMecanizado) : 0;
  
  const totalVariableCosts = Number(costoDiseno) + Number(costoPrefab) + Number(costoArmado) + Number(costoPulido) + Number(costoGrabado);
  const variableCostPerUnit = selectedPieza && selectedPieza.cantidad > 0 ? (totalVariableCosts / selectedPieza.cantidad) : 0;
  
  const totalUnitCost = unitMaterialCost + unitManufacturingCost + variableCostPerUnit;

  const handleFinalizar = async () => {
    if (!selectedPieza) return;
    
    setLoading(true);
    setMessage('');
    
    try {
      const payload = {
        costoDiseno: Number(costoDiseno),
        costoPrefab: Number(costoPrefab),
        costoArmado: Number(costoArmado),
        costoPulido: Number(costoPulido),
        costoGrabado: Number(costoGrabado),
        estado: 'COMPLETADO'
      };
      
      const response = await fetch(`/api/piezas/${selectedPieza.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        setMessage('Cotización finalizada con éxito.');
        // Update local state to reflect change
        setPiezas(piezas.map(p => p.id === selectedPieza.id ? { ...p, estado: 'COMPLETADO' } : p));
      } else {
        setMessage('Mock: Cotización finalizada (API no disponible).');
      }
    } catch (error) {
      setMessage('Mock: Cotización finalizada (Simulada).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white uppercase tracking-widest">Total Cost Match</h1>
          <p className="text-titanium text-sm mt-2">Cotizador Maestro - Final Cost Calculation</p>
        </header>

        {/* Piece Selector */}
        <section className="bg-lead bg-opacity-20 backdrop-blur-md border border-titanium border-opacity-30 p-6 rounded-xl">
          <label className="block text-sm font-medium text-titanium mb-2 uppercase tracking-wide">Select Piece</label>
          <select 
            value={selectedPiezaId}
            onChange={(e) => setSelectedPiezaId(e.target.value)}
            className="w-full bg-darkbg border border-titanium rounded-lg px-4 py-3 text-steel focus:outline-none focus:border-metalaccent focus:ring-1 focus:ring-metalaccent transition-colors appearance-none"
          >
            <option value="">-- Choose a Piece --</option>
            {piezas.map((pieza) => (
              <option key={pieza.id} value={pieza.id}>
                {pieza.nombre} (Qty: {pieza.cantidad}) - Estado: {pieza.estado}
              </option>
            ))}
          </select>
        </section>

        {selectedPieza && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Read-Only Summary */}
            <section className="bg-lead bg-opacity-20 backdrop-blur-md border border-titanium border-opacity-30 p-6 rounded-xl flex flex-col space-y-4">
              <h2 className="text-xl font-semibold text-white uppercase tracking-wide border-b border-titanium/30 pb-2">Unit Base Costs</h2>
              
              <div className="flex justify-between items-center bg-darkbg p-4 rounded-lg border border-titanium/20">
                <span className="text-titanium text-sm">Unit Material Cost</span>
                <span className="text-lg font-mono text-steel">${unitMaterialCost.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center bg-darkbg p-4 rounded-lg border border-titanium/20">
                <div className="flex flex-col">
                  <span className="text-titanium text-sm">Unit Manufacturing Cost</span>
                  <span className="text-xs text-titanium/60">{selectedPieza.horasMecanizado} hrs @ ${selectedPieza.tarifaMecanizado}/hr</span>
                </div>
                <span className="text-lg font-mono text-steel">${unitManufacturingCost.toFixed(2)}</span>
              </div>

              <div className="mt-auto pt-4 border-t border-titanium/30">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium uppercase text-sm">Requested Qty</span>
                  <span className="text-xl font-bold text-metalaccent">{selectedPieza.cantidad} units</span>
                </div>
              </div>
            </section>

            {/* Variable Costs Inputs */}
            <section className="bg-lead bg-opacity-20 backdrop-blur-md border border-titanium border-opacity-30 p-6 rounded-xl flex flex-col space-y-4">
              <h2 className="text-xl font-semibold text-white uppercase tracking-wide border-b border-titanium/30 pb-2">Variable Costs (Total Lot)</h2>
              
              <div className="space-y-3">
                {[
                  { label: 'Costo de Diseño', value: costoDiseno, setter: setCostoDiseno },
                  { label: 'Costo de Prefabricación', value: costoPrefab, setter: setCostoPrefab },
                  { label: 'Costo de Armado', value: costoArmado, setter: setCostoArmado },
                  { label: 'Costo de Pulido', value: costoPulido, setter: setCostoPulido },
                  { label: 'Costo de Grabado', value: costoGrabado, setter: setCostoGrabado },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <label className="text-sm text-titanium w-1/2">{item.label}</label>
                    <div className="w-1/2 relative">
                      <span className="absolute left-3 top-2 text-titanium/60">$</span>
                      <input 
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.value}
                        onChange={(e) => item.setter(e.target.value)}
                        className="w-full bg-darkbg border border-titanium rounded-lg pl-8 pr-4 py-2 text-steel focus:outline-none focus:border-metalaccent focus:ring-1 focus:ring-metalaccent text-right font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Total Cost Calculation & Action */}
            <section className="lg:col-span-2 bg-gradient-to-r from-lead/40 to-darkbg border border-metalaccent/50 p-8 rounded-xl flex flex-col md:flex-row items-center justify-between shadow-2xl">
              <div className="flex flex-col space-y-2 mb-6 md:mb-0">
                <span className="text-titanium uppercase tracking-wider text-sm">Final Calculated</span>
                <span className="text-4xl font-bold text-white tracking-tight">Total Unit Cost</span>
                <span className="text-sm text-titanium/70 pt-2 border-t border-titanium/20">Base + (Variable / Qty)</span>
              </div>
              
              <div className="flex flex-col items-end space-y-4">
                <div className="text-5xl font-mono font-bold text-metalaccent drop-shadow-md">
                  ${totalUnitCost.toFixed(2)}
                </div>
                
                <button 
                  onClick={handleFinalizar}
                  disabled={loading}
                  className="bg-metalaccent hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors uppercase tracking-wider shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Finalizar Cotización'}
                </button>
                {message && <span className="text-xs text-green-400 mt-2">{message}</span>}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default TotalCostMatchModule;
