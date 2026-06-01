import React from 'react';

const Sidebar = ({ currentView, setView }) => {
  return (
    <div className="w-64 bg-darkbg border-r border-titanium/30 h-screen flex flex-col shrink-0">
      <div className="p-6 border-b border-titanium/30">
        <h2 className="text-xl font-bold text-white tracking-widest uppercase">Metal Master</h2>
        <p className="text-titanium text-xs mt-1">Management Portal</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => setView('dashboard')}
          className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
            currentView === 'dashboard'
              ? 'bg-metalaccent/20 text-metalaccent border border-metalaccent/30'
              : 'text-titanium hover:bg-lead/20 hover:text-steel'
          }`}
        >
          <span className="font-medium uppercase tracking-wide text-sm">Dashboard</span>
        </button>
        <button
          onClick={() => setView('admin')}
          className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
            currentView === 'admin'
              ? 'bg-metalaccent/20 text-metalaccent border border-metalaccent/30'
              : 'text-titanium hover:bg-lead/20 hover:text-steel'
          }`}
        >
          <span className="font-medium uppercase tracking-wide text-sm">Admin Panel</span>
        </button>
        <button
          onClick={() => setView('reception')}
          className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
            currentView === 'reception'
              ? 'bg-metalaccent/20 text-metalaccent border border-metalaccent/30'
              : 'text-titanium hover:bg-lead/20 hover:text-steel'
          }`}
        >
          <span className="font-medium uppercase tracking-wide text-sm">Reception</span>
        </button>
        <button
          onClick={() => setView('mcmaster')}
          className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
            currentView === 'mcmaster'
              ? 'bg-metalaccent/20 text-metalaccent border border-metalaccent/30'
              : 'text-titanium hover:bg-lead/20 hover:text-steel'
          }`}
        >
          <span className="font-medium uppercase tracking-wide text-sm">McMaster Sync</span>
        </button>
        <button
          onClick={() => setView('fusion')}
          className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
            currentView === 'fusion'
              ? 'bg-metalaccent/20 text-metalaccent border border-metalaccent/30'
              : 'text-titanium hover:bg-lead/20 hover:text-steel'
          }`}
        >
          <span className="font-medium uppercase tracking-wide text-sm">Fusion Times</span>
        </button>
        <button
          onClick={() => setView('documents')}
          className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
            currentView === 'documents'
              ? 'bg-metalaccent/20 text-metalaccent border border-metalaccent/30'
              : 'text-titanium hover:bg-lead/20 hover:text-steel'
          }`}
        >
          <span className="font-medium uppercase tracking-wide text-sm">Document Viewer</span>
        </button>
      </nav>
      <div className="p-4 border-t border-titanium/30">
        <button
          onClick={() => setView('login')}
          className="w-full text-left px-4 py-2 text-sm text-titanium hover:text-white transition-colors uppercase tracking-wider"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
