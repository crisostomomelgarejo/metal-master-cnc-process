import React, { useState, useEffect } from 'react';
import { 
  generateReceiptOrder, 
  generatePurchaseOrder, 
  generateManufacturingOrder 
} from '../utils/pdfGenerator';

const DocumentViewerModule = () => {
  const [pieces, setPieces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPiece, setSelectedPiece] = useState(null);

  useEffect(() => {
    // Fetch pieces from the API
    const fetchPieces = async () => {
      try {
        const response = await fetch('/api/piezas');
        if (response.ok) {
          const data = await response.json();
          setPieces(data);
        } else {
          // Mock data if API is not available
          setPieces([
            { id: 'PZ-001', nombre: 'Axis Shaft', estado: 'Recepción', complejidad: 'Alta', tiempo_estimado: 4, material: 'Titanium' },
            { id: 'PZ-002', nombre: 'Mounting Bracket', estado: 'Compra', complejidad: 'Baja', tiempo_estimado: 1.5, material: 'Aluminum 6061' },
            { id: 'PZ-003', nombre: 'Engine Casing', estado: 'Fabricación', complejidad: 'Media', tiempo_estimado: 6, material: 'Steel' },
            { id: 'PZ-004', nombre: 'Control Valve', estado: 'Recepción', complejidad: 'Alta', tiempo_estimado: 3.5, material: 'Stainless Steel' },
            { id: 'PZ-005', nombre: 'Rotor Blade', estado: 'Fabricación', complejidad: 'Alta', tiempo_estimado: 8, material: 'Titanium Alloy' },
          ]);
        }
      } catch (error) {
        console.error('Error fetching pieces:', error);
        // Fallback to mock data for demo purposes
        setPieces([
          { id: 'PZ-001', nombre: 'Axis Shaft', estado: 'Recepción', complejidad: 'Alta', tiempo_estimado: 4, material: 'Titanium' },
          { id: 'PZ-002', nombre: 'Mounting Bracket', estado: 'Compra', complejidad: 'Baja', tiempo_estimado: 1.5, material: 'Aluminum 6061' },
          { id: 'PZ-003', nombre: 'Engine Casing', estado: 'Fabricación', complejidad: 'Media', tiempo_estimado: 6, material: 'Steel' },
          { id: 'PZ-004', nombre: 'Control Valve', estado: 'Recepción', complejidad: 'Alta', tiempo_estimado: 3.5, material: 'Stainless Steel' },
          { id: 'PZ-005', nombre: 'Rotor Blade', estado: 'Fabricación', complejidad: 'Alta', tiempo_estimado: 8, material: 'Titanium Alloy' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPieces();
  }, []);

  const openModal = (piece) => setSelectedPiece(piece);
  const closeModal = () => setSelectedPiece(null);

  const getPiecesByStatus = (status) => {
    return pieces.filter((p) => p.estado === status);
  };

  const KanbanColumn = ({ title, status, piecesList }) => (
    <div className="flex-1 flex flex-col bg-darkbg border border-titanium/20 rounded-xl overflow-hidden">
      <div className="bg-lead/20 p-4 border-b border-titanium/20">
        <h3 className="text-lg font-bold text-white uppercase tracking-wider">{title}</h3>
        <p className="text-xs text-titanium mt-1">{piecesList.length} items</p>
      </div>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
        {piecesList.map((piece) => (
          <div 
            key={piece.id} 
            onClick={() => openModal(piece)}
            className="bg-lead/10 border border-titanium/30 p-4 rounded-lg cursor-pointer hover:bg-lead/30 hover:border-metalaccent/50 transition-all shadow-md group"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-mono text-metalaccent px-2 py-1 bg-metalaccent/10 rounded">{piece.id}</span>
              <span className="text-xs text-titanium bg-darkbg px-2 py-1 rounded">{piece.complejidad}</span>
            </div>
            <h4 className="text-white font-medium group-hover:text-metalaccent transition-colors">{piece.nombre}</h4>
            <div className="mt-3 text-sm text-titanium flex justify-between">
              <span>{piece.material || 'N/A'}</span>
              <span>{piece.tiempo_estimado}h</span>
            </div>
          </div>
        ))}
        {piecesList.length === 0 && (
          <div className="text-center py-8 text-titanium/50 italic text-sm">
            No items in this queue
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-metalaccent"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Document Viewer</h2>
        <p className="text-titanium text-sm mt-1">Export PDF documents organized by production stage</p>
      </header>

      <div className="flex-1 flex gap-6 overflow-hidden">
        <KanbanColumn 
          title="Recepción" 
          status="Recepción" 
          piecesList={getPiecesByStatus('Recepción')} 
        />
        <KanbanColumn 
          title="Compra" 
          status="Compra" 
          piecesList={getPiecesByStatus('Compra')} 
        />
        <KanbanColumn 
          title="Fabricación" 
          status="Fabricación" 
          piecesList={getPiecesByStatus('Fabricación')} 
        />
      </div>

      {/* Piece Details Modal */}
      {selectedPiece && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-darkbg border border-titanium/30 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
            <div className="p-6 border-b border-titanium/30 flex justify-between items-center bg-lead/10">
              <div>
                <h3 className="text-xl font-bold text-white">{selectedPiece.nombre}</h3>
                <p className="text-sm text-metalaccent font-mono mt-1">{selectedPiece.id}</p>
              </div>
              <button 
                onClick={closeModal}
                className="text-titanium hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="p-6 flex-1 bg-[#0a0f1a]">
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-darkbg p-3 rounded border border-titanium/20">
                  <span className="block text-xs text-titanium uppercase mb-1">Status</span>
                  <span className="text-steel font-medium">{selectedPiece.estado}</span>
                </div>
                <div className="bg-darkbg p-3 rounded border border-titanium/20">
                  <span className="block text-xs text-titanium uppercase mb-1">Complexity</span>
                  <span className="text-steel font-medium">{selectedPiece.complejidad}</span>
                </div>
                <div className="bg-darkbg p-3 rounded border border-titanium/20">
                  <span className="block text-xs text-titanium uppercase mb-1">Est. Time</span>
                  <span className="text-steel font-medium">{selectedPiece.tiempo_estimado} hrs</span>
                </div>
                <div className="bg-darkbg p-3 rounded border border-titanium/20">
                  <span className="block text-xs text-titanium uppercase mb-1">Material</span>
                  <span className="text-steel font-medium">{selectedPiece.material || 'Not specified'}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Generate Documents</h4>
                
                <button 
                  onClick={() => generateReceiptOrder(selectedPiece)}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-titanium/30 text-steel hover:text-white hover:border-metalaccent hover:bg-metalaccent/10 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-titanium group-hover:text-metalaccent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span className="font-medium">Export Receipt Order</span>
                  </div>
                  <span className="text-xs text-titanium opacity-0 group-hover:opacity-100 transition-opacity">General Details</span>
                </button>

                <button 
                  onClick={() => generatePurchaseOrder(selectedPiece)}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-titanium/30 text-steel hover:text-white hover:border-metalaccent hover:bg-metalaccent/10 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-titanium group-hover:text-metalaccent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z"></path>
                    </svg>
                    <span className="font-medium">Export Purchase Order</span>
                  </div>
                  <span className="text-xs text-titanium opacity-0 group-hover:opacity-100 transition-opacity">Materials & BOM</span>
                </button>

                <button 
                  onClick={() => generateManufacturingOrder(selectedPiece)}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-titanium/30 text-steel hover:text-white hover:border-metalaccent hover:bg-metalaccent/10 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-titanium group-hover:text-metalaccent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span className="font-medium">Export Manufacturing Decision</span>
                  </div>
                  <span className="text-xs text-titanium opacity-0 group-hover:opacity-100 transition-opacity">With Signatures</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentViewerModule;
