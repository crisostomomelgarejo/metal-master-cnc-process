import React, { useState } from 'react';
import { generateHitoA } from '../utils/pdfGenerator';

const ReceptionModule = () => {
  const [partName, setPartName] = useState('');
  const [evaluationDate, setEvaluationDate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [originalRefId, setOriginalRefId] = useState('');
  const [internalMfgNo, setInternalMfgNo] = useState('');
  const [requestedMaterial, setRequestedMaterial] = useState('');
  const [alternativeMaterials, setAlternativeMaterials] = useState('');
  const [inInventory, setInInventory] = useState(false);
  const [tools, setTools] = useState({
    cnc: false,
    laser: false,
    plasma: false,
    waterjet: false,
    pressbrake: false
  });
  const [bomItems, setBomItems] = useState([{ id: 1, name: '', quantity: 1 }]);

  const handleToolChange = (tool) => {
    setTools(prev => ({ ...prev, [tool]: !prev[tool] }));
  };

  const handleAddBomItem = () => {
    setBomItems([...bomItems, { id: Date.now(), name: '', quantity: 1 }]);
  };

  const handleBomChange = (id, field, value) => {
    setBomItems(bomItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleRemoveBomItem = (id) => {
    setBomItems(bomItems.filter(item => item.id !== id));
  };

  const handleGenerateQuote = async () => {
    console.log("Generating Quote (Hito A)", { partName, evaluationDate, quantity, originalRefId, internalMfgNo, requestedMaterial, alternativeMaterials, inInventory, tools, bomItems });
    let rates = [];
    try {
      const res = await fetch('/api/tarifas');
      if (res.ok) {
        rates = await res.json();
      }
    } catch (e) {
      console.error('Error fetching rates:', e);
    }
    
    const formData = {
        orderId: internalMfgNo || `ORD-${Math.floor(Math.random()*1000)}`,
        tools: Object.keys(tools).filter(t => tools[t]).map(t => ({ name: t, quantity: 1, notes: '' })),
        boms: bomItems.map(b => ({ partNumber: b.name, description: b.name, quantity: b.quantity })),
        material: requestedMaterial || 'TBD',
        supplier: 'TBD',
        materialStatus: inInventory ? 'In Inventory' : 'Pending Purchase',
        estimatedDelivery: 'TBD',
        estimatedHours: [] // To be filled in later steps
    };
    
    try {
      generateHitoA(formData, rates);
      alert("Preliminary Quote (Hito A) PDF generated!");
    } catch (e) {
      console.error('Error generating PDF:', e);
      alert("Failed to generate PDF.");
    }
  };

  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto bg-lead/10 border border-titanium/20 rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm p-8">
        <div className="mb-8 border-b border-titanium/20 pb-4">
          <h2 className="text-2xl font-bold text-white tracking-wider uppercase">Reception & Discretization</h2>
          <p className="text-titanium text-sm mt-1">Step 1-3 Workflow: Initial part entry and requirement specification</p>
        </div>

        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          {/* Part Information */}
          <div className="bg-darkbg/50 p-6 rounded-lg border border-titanium/10">
            <h3 className="text-lg font-semibold text-steel mb-4 uppercase tracking-wide">1. Part Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-titanium mb-2">Part Name / Designation</label>
                  <input 
                    type="text" 
                    value={partName}
                    onChange={(e) => setPartName(e.target.value)}
                    className="w-full bg-darkbg border border-titanium/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-metalaccent focus:ring-1 focus:ring-metalaccent transition-colors"
                    placeholder="e.g. Bracket Assembly X-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-titanium mb-2">Original Reference ID <span className="text-titanium/50 text-xs font-normal">(Optional)</span></label>
                  <input 
                    type="text" 
                    value={originalRefId}
                    onChange={(e) => setOriginalRefId(e.target.value)}
                    className="w-full bg-darkbg border border-titanium/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-metalaccent focus:ring-1 focus:ring-metalaccent transition-colors"
                    placeholder="e.g. REF-9921"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-titanium mb-2">Internal Manufacturing Number <span className="text-titanium/50 text-xs font-normal">(Optional)</span></label>
                  <input 
                    type="text" 
                    value={internalMfgNo}
                    onChange={(e) => setInternalMfgNo(e.target.value)}
                    className="w-full bg-darkbg border border-titanium/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-metalaccent focus:ring-1 focus:ring-metalaccent transition-colors"
                    placeholder="e.g. IMN-2023-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-titanium mb-2">Evaluation Request Date</label>
                  <input 
                    type="date" 
                    value={evaluationDate}
                    onChange={(e) => setEvaluationDate(e.target.value)}
                    className="w-full bg-darkbg border border-titanium/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-metalaccent focus:ring-1 focus:ring-metalaccent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-titanium mb-2">Quantity of Parts Requested</label>
                  <input 
                    type="number" 
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full bg-darkbg border border-titanium/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-metalaccent focus:ring-1 focus:ring-metalaccent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-titanium mb-2">Requested Material</label>
                  <input 
                    type="text" 
                    value={requestedMaterial}
                    onChange={(e) => setRequestedMaterial(e.target.value)}
                    className="w-full bg-darkbg border border-titanium/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-metalaccent focus:ring-1 focus:ring-metalaccent transition-colors"
                    placeholder="e.g. Stainless Steel 304"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-titanium mb-2">Alternative Proposed Materials</label>
                  <input 
                    type="text" 
                    value={alternativeMaterials}
                    onChange={(e) => setAlternativeMaterials(e.target.value)}
                    className="w-full bg-darkbg border border-titanium/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-metalaccent focus:ring-1 focus:ring-metalaccent transition-colors"
                    placeholder="e.g. Aluminum 6061, Mild Steel"
                  />
                </div>
              </div>
              
              <div className="flex items-center mt-4 pt-2 border-t border-titanium/10">
                <input 
                  type="checkbox" 
                  id="inventoryCheck"
                  checked={inInventory}
                  onChange={(e) => setInInventory(e.target.checked)}
                  className="w-5 h-5 bg-darkbg border border-titanium rounded text-metalaccent focus:ring-metalaccent focus:ring-offset-darkbg"
                />
                <label htmlFor="inventoryCheck" className="ml-3 text-sm font-medium text-steel">
                  Raw Material in Inventory
                </label>
              </div>
            </div>
          </div>

          {/* Required Tools */}
          <div className="bg-darkbg/50 p-6 rounded-lg border border-titanium/10">
            <h3 className="text-lg font-semibold text-steel mb-4 uppercase tracking-wide">2. Required Tools / Processes</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.keys(tools).map((tool) => (
                <div key={tool} className="flex items-center p-3 rounded border border-titanium/20 bg-darkbg/80 hover:border-metalaccent/50 transition-colors">
                  <input 
                    type="checkbox" 
                    id={`tool-${tool}`}
                    checked={tools[tool]}
                    onChange={() => handleToolChange(tool)}
                    className="w-4 h-4 bg-darkbg border border-titanium rounded text-metalaccent focus:ring-metalaccent focus:ring-offset-darkbg"
                  />
                  <label htmlFor={`tool-${tool}`} className="ml-3 text-sm font-medium text-steel uppercase tracking-wider">
                    {tool === 'pressbrake' ? 'Press Brake' : tool}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Bill of Materials */}
          <div className="bg-darkbg/50 p-6 rounded-lg border border-titanium/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-steel uppercase tracking-wide">3. Supplements BOM</h3>
              <button 
                type="button"
                onClick={handleAddBomItem}
                className="text-xs bg-lead/30 hover:bg-lead/50 text-white px-3 py-1.5 rounded transition-colors uppercase tracking-wider border border-titanium/30"
              >
                + Add Item
              </button>
            </div>
            
            <div className="space-y-3">
              {bomItems.map((item, index) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-8 text-center text-titanium text-sm">{index + 1}.</div>
                  <input 
                    type="text" 
                    value={item.name}
                    onChange={(e) => handleBomChange(item.id, 'name', e.target.value)}
                    className="flex-1 bg-darkbg border border-titanium/30 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-metalaccent"
                    placeholder="Item description (e.g. M4x10 Hex Screw)"
                  />
                  <input 
                    type="number" 
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleBomChange(item.id, 'quantity', parseInt(e.target.value) || 1)}
                    className="w-24 bg-darkbg border border-titanium/30 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-metalaccent"
                    placeholder="Qty"
                  />
                  <button 
                    type="button"
                    onClick={() => handleRemoveBomItem(item.id)}
                    className="text-red-400 hover:text-red-300 p-2"
                    title="Remove item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
              {bomItems.length === 0 && (
                <div className="text-titanium text-sm italic text-center py-4">No supplements added.</div>
              )}
            </div>
          </div>

          {/* Action Area */}
          <div className="pt-6 mt-6 border-t border-titanium/20 flex justify-end">
            <button 
              type="button"
              onClick={handleGenerateQuote}
              className="bg-metalaccent hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105 uppercase tracking-wider text-sm flex items-center gap-2"
            >
              Generate Preliminary Quote (Hito A)
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReceptionModule;
