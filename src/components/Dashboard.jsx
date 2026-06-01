import React from 'react';

const Dashboard = () => {
  const kpis = [
    { label: 'Total Quotes', value: '142' },
    { label: 'Active Parts', value: '87' },
    { label: 'Pending Approvals', value: '12' },
    { label: 'Machine Utilization', value: '94%' },
  ];

  const recentParts = [
    { id: 'P-1002', name: 'Titanium Bracket', status: 'Machining', date: '2026-06-01' },
    { id: 'P-1003', name: 'Steel Shaft', status: 'Quality Control', date: '2026-05-31' },
    { id: 'P-1004', name: 'Aluminum Housing', status: 'Pending', date: '2026-05-30' },
    { id: 'P-1005', name: 'Brass Fitting', status: 'Completed', date: '2026-05-28' },
  ];

  return (
    <div className="p-8 space-y-8 h-full overflow-y-auto">
      <header>
        <h1 className="text-3xl font-bold text-white uppercase tracking-widest">Dashboard</h1>
        <p className="text-titanium mt-2">Overview of current operations</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-lead/10 border border-titanium/30 p-6 rounded-xl shadow-lg backdrop-blur-sm">
            <h3 className="text-titanium text-sm uppercase tracking-wider mb-2">{kpi.label}</h3>
            <p className="text-3xl font-bold text-white">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Parts Table */}
      <div className="bg-lead/10 border border-titanium/30 rounded-xl shadow-lg backdrop-blur-sm overflow-hidden">
        <div className="p-6 border-b border-titanium/30 bg-black/20">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Recent Parts</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-steel">
            <thead className="bg-darkbg/50 text-titanium uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Part ID</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-titanium/20">
              {recentParts.map((part, idx) => (
                <tr key={idx} className="hover:bg-lead/20 transition-colors">
                  <td className="px-6 py-4 font-mono text-metalaccent">{part.id}</td>
                  <td className="px-6 py-4">{part.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-black/30 border border-titanium/30 rounded-md text-xs uppercase tracking-wider">
                      {part.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-titanium">{part.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
