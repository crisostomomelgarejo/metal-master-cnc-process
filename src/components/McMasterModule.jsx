import React from 'react';

const McMasterModule = () => {
  return (
    <div className="p-8 space-y-8 h-full overflow-y-auto">
      <header className="border-b border-titanium/20 pb-6">
        <h1 className="text-3xl font-bold text-white uppercase tracking-widest flex items-center gap-3">
          <span className="w-8 h-8 rounded bg-metalaccent/20 border border-metalaccent/50 flex items-center justify-center text-metalaccent text-lg">M</span>
          McMaster-Carr Sync
        </h1>
        <p className="text-titanium mt-2 text-sm uppercase tracking-wide">Automated Part Procurement & Inventory Link</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder Card */}
        <div className="bg-lead/10 border border-titanium/30 rounded-xl shadow-lg backdrop-blur-sm p-6 relative overflow-hidden group hover:border-metalaccent/50 transition-colors">
          <div className="absolute top-0 left-0 w-1 h-full bg-metalaccent"></div>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium text-white uppercase tracking-wider">Sync Status</h3>
            <span className="px-2 py-1 text-xs font-semibold rounded bg-green-500/20 text-green-400 border border-green-500/30 uppercase tracking-widest">Active</span>
          </div>
          <p className="text-titanium text-sm mb-4">Connection to McMaster API established. Listening for BOM updates.</p>
          <div className="flex gap-2">
            <button className="bg-darkbg border border-titanium/30 hover:border-metalaccent text-white text-xs font-semibold py-2 px-4 rounded transition-colors uppercase tracking-wider">Configure</button>
            <button className="bg-metalaccent/20 border border-metalaccent hover:bg-metalaccent text-metalaccent hover:text-white text-xs font-semibold py-2 px-4 rounded transition-colors uppercase tracking-wider">Force Sync</button>
          </div>
        </div>

        {/* Placeholder Card */}
        <div className="bg-lead/10 border border-titanium/30 rounded-xl shadow-lg backdrop-blur-sm p-6 relative overflow-hidden group hover:border-titanium/60 transition-colors">
          <div className="absolute top-0 left-0 w-1 h-full bg-titanium/50"></div>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium text-white uppercase tracking-wider">Pending Orders</h3>
            <span className="text-2xl font-bold text-steel">0</span>
          </div>
          <p className="text-titanium text-sm mb-4">No automated orders currently awaiting approval.</p>
          <button className="w-full bg-darkbg border border-titanium/30 hover:border-titanium/60 text-white text-xs font-semibold py-2 px-4 rounded transition-colors uppercase tracking-wider">View History</button>
        </div>
      </div>
      
      <div className="bg-lead/10 border border-titanium/30 rounded-xl shadow-lg backdrop-blur-sm p-8 max-w-full">
        <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-metalaccent"></span>
          Recent Synchronization Logs
        </h2>
        
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between bg-darkbg/50 p-4 rounded-lg border border-titanium/10">
              <div className="flex items-center gap-4">
                <span className="text-xs text-titanium font-mono">2026-06-01 08:{15 + i * 12}:00</span>
                <span className="text-sm text-steel">Checked BOM inventory delta</span>
              </div>
              <span className="text-xs font-mono text-green-400">SUCCESS</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default McMasterModule;
