import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import ReceptionModule from './components/ReceptionModule';
import McMasterModule from './components/McMasterModule';
import FusionTimesModule from './components/FusionTimesModule';

function App() {
  const [view, setView] = useState('login');

  if (view === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-darkbg text-steel p-4">
        <div className="bg-lead bg-opacity-20 backdrop-blur-md border border-titanium border-opacity-30 p-8 rounded-xl shadow-2xl w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white tracking-widest uppercase mb-2">Metal Master</h1>
            <p className="text-titanium text-sm">Industrial Portal Access</p>
          </div>
          
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-titanium mb-1">Operator ID</label>
              <input 
                type="text" 
                className="w-full bg-darkbg border border-titanium rounded-lg px-4 py-2 text-steel focus:outline-none focus:border-metalaccent focus:ring-1 focus:ring-metalaccent transition-colors"
                placeholder="Enter ID..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-titanium mb-1">Access Code</label>
              <input 
                type="password" 
                className="w-full bg-darkbg border border-titanium rounded-lg px-4 py-2 text-steel focus:outline-none focus:border-metalaccent focus:ring-1 focus:ring-metalaccent transition-colors"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="button"
              onClick={() => setView('dashboard')}
              className="w-full bg-metalaccent hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors uppercase tracking-wider shadow-lg"
            >
              Authenticate
            </button>
          </form>
          
          <div className="mt-6 text-center text-xs text-titanium">
            System v2.4.1 • Secure Connection
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080d19] text-steel flex overflow-hidden">
      <Sidebar currentView={view} setView={setView} />
      <main className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#0f172a] to-[#040811] z-0"></div>
        <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50 z-0"></div>
        <div className="relative z-10 h-full">
          {view === 'dashboard' && <Dashboard />}
          {view === 'admin' && <AdminPanel />}
          {view === 'reception' && <ReceptionModule />}
          {view === 'mcmaster' && <McMasterModule />}
          {view === 'fusion' && <FusionTimesModule />}
        </div>
      </main>
    </div>
  );
}

export default App;
