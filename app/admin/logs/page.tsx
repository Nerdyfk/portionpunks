'use client';

import React, { useState, useEffect } from 'react';
import { History, ShieldAlert } from 'lucide-react';

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/logs')
      .then((r) => r.json())
      .then((data) => {
        if (data.logs) setLogs(data.logs);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-charcoal-900 border-2 border-smoke-800 p-6 rounded-sm">
        <h1 className="font-pixel-heading text-lg text-white font-bold flex items-center space-x-2">
          <History className="w-5 h-5 text-neon-green" />
          <span>ADMIN ACTIVITY AUDIT LOGS</span>
        </h1>
        <p className="text-xs text-smoke-400 font-sans mt-1">
          Historical activity records of all administrator modifications, log-ins, and content changes.
        </p>
      </div>

      <div className="bg-charcoal-900 border-2 border-smoke-800 rounded-sm overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 text-center font-pixel-display text-xs text-neon-green animate-pulse">
            LOADING AUDIT LOGS...
          </div>
        ) : logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-charcoal-850 font-pixel-display text-[10px] text-smoke-400 border-b border-smoke-800">
                <tr>
                  <th className="p-3.5">ACTION</th>
                  <th className="p-3.5">RESOURCE</th>
                  <th className="p-3.5">ADMIN USER</th>
                  <th className="p-3.5">DETAILS</th>
                  <th className="p-3.5">IP ADDRESS</th>
                  <th className="p-3.5 text-right">TIMESTAMP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-smoke-850">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-charcoal-850/50">
                    <td className="p-3.5 font-pixel-display text-neon-green">{log.action}</td>
                    <td className="p-3.5 font-mono text-white">{log.resource}</td>
                    <td className="p-3.5 font-mono text-smoke-300">{log.userEmail}</td>
                    <td className="p-3.5 text-white max-w-xs truncate">{log.details}</td>
                    <td className="p-3.5 font-mono text-smoke-400">{log.ipAddress || '127.0.0.1'}</td>
                    <td className="p-3.5 text-right font-mono text-smoke-400">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs font-pixel-display text-smoke-400">
            No activity logs found.
          </div>
        )}
      </div>
    </div>
  );
}
