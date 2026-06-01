import React from 'react';

const FusionTimesModule = () => {
  return (
    <div className="p-8 space-y-8 h-full overflow-y-auto">
      <header className="border-b border-titanium/20 pb-6">
        <h1 className="text-3xl font-bold text-white uppercase tracking-widest flex items-center gap-3">
          <span className="w-8 h-8 rounded bg-metalaccent/20 border border-metalaccent/50 flex items-center justify-center text-metalaccent text-lg">F</span>
          Fusion 360 Times
        </h1>
        <p className="text-titanium mt-2 text-sm uppercase tracking-wide">Machining Strategy & Estimation Analytics</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-lead/10 border border-titanium/30 rounded-xl shadow-lg backdrop-blur-sm p-8">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-6">Recent Toolpaths</h2>
          
          <div className="space-y-4">
            {[
              { name: 'OP1_Face_Rough', time: '12m 45s', status: 'Optimized' },
              { name: 'OP2_Adaptive_Clear', time: '45m 10s', status: 'Pending Review' },
              { name: 'OP3_Contour_Finish', time: '18m 30s', status: 'Optimized' }
            ].map((tp, idx) => (
              <div key={idx} className="bg-darkbg/60 border border-titanium/20 rounded-lg p-4 flex justify-between items-center group hover:border-metalaccent/30 transition-colors">
                <div>
                  <h4 className="text-white font-medium font-mono text-sm">{tp.name}</h4>
                  <span className={`text-xs uppercase tracking-wider mt-1 block ${tp.status === 'Optimized' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {tp.status}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-lg text-steel font-mono">{tp.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-lead/10 border border-titanium/30 rounded-xl shadow-lg backdrop-blur-sm p-8">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-6">Time Analysis</h2>
            <div className="flex items-end gap-4 h-32 mb-4 border-b border-titanium/20 pb-2">
              <div className="flex-1 bg-metalaccent/40 rounded-t-sm h-[60%] relative group">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-mono text-titanium opacity-0 group-hover:opacity-100 transition-opacity">60%</div>
              </div>
              <div className="flex-1 bg-titanium/40 rounded-t-sm h-[25%] relative group">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-mono text-titanium opacity-0 group-hover:opacity-100 transition-opacity">25%</div>
              </div>
              <div className="flex-1 bg-red-500/40 rounded-t-sm h-[15%] relative group">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-mono text-titanium opacity-0 group-hover:opacity-100 transition-opacity">15%</div>
              </div>
            </div>
            <div className="flex justify-between text-xs uppercase tracking-widest text-titanium">
              <span>Roughing</span>
              <span>Finishing</span>
              <span>Rapid</span>
            </div>
          </div>

          <button className="w-full bg-metalaccent/10 border-2 border-dashed border-metalaccent/50 hover:bg-metalaccent/20 hover:border-metalaccent text-metalaccent font-bold py-6 rounded-xl transition-all uppercase tracking-widest shadow-lg flex flex-col items-center justify-center gap-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload F3D / Setup Sheet
          </button>
        </div>
      </div>
    </div>
  );
};

export default FusionTimesModule;
