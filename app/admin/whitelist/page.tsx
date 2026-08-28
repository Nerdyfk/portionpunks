'use client';

import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Search,
  Download,
  CheckCircle2,
  XCircle,
  Trash2,
  RefreshCw,
  Plus,
  Save,
  PauseCircle,
  PlayCircle,
  ExternalLink,
} from 'lucide-react';

interface WhitelistEntry {
  id: string;
  walletAddress: string;
  email: string | null;
  twitterHandle: string | null;
  status: string;
  ipAddress: string | null;
  createdAt: string;
}

interface WhitelistTask {
  id: string;
  title: string;
  url: string;
  proofPlaceholder: string;
  required: boolean;
}

export default function WhitelistAdminPage() {
  const [entries, setEntries] = useState<WhitelistEntry[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [tasks, setTasks] = useState<WhitelistTask[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ENTRIES' | 'TASKS'>('ENTRIES');

  const fetchBoardData = () => {
    setLoading(true);
    fetch('/api/admin/whitelist')
      .then((res) => res.json())
      .then((data) => {
        if (data.entries) setEntries(data.entries);
        if (data.isLive !== undefined) setIsLive(data.isLive);
        if (data.tasks) setTasks(data.tasks);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBoardData();
  }, []);

  const handleToggleLive = async () => {
    const newStatus = !isLive;
    try {
      const res = await fetch('/api/admin/whitelist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'TOGGLE_LIVE', isLive: newStatus }),
      });
      if (res.ok) {
        setIsLive(newStatus);
        setActionMessage(newStatus ? 'Whitelist Status: LIVE' : 'Whitelist Status: PAUSED');
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch (err) {}
  };

  const handleSaveTasks = async () => {
    try {
      const res = await fetch('/api/admin/whitelist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'SAVE_TASKS', tasks }),
      });
      if (res.ok) {
        setActionMessage('Whitelist Tasks updated & saved successfully!');
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch (err) {}
  };

  const handleAddTask = () => {
    setTasks([
      ...tasks,
      {
        id: `task_${Date.now()}`,
        title: 'New Social Task',
        url: 'https://x.com/potionpunks',
        proofPlaceholder: 'Enter proof link or username',
        required: true,
      },
    ]);
  };

  const handleTaskChange = (idx: number, field: keyof WhitelistTask, val: any) => {
    const updated = [...tasks];
    updated[idx] = { ...updated[idx], [field]: val };
    setTasks(updated);
  };

  const handleRemoveTask = (idx: number) => {
    setTasks(tasks.filter((_, i) => i !== idx));
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/whitelist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UPDATE_STATUS', id, status: newStatus }),
      });
      if (res.ok) {
        setActionMessage(`Updated status to ${newStatus}`);
        setEntries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
        );
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch (err) {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this Whitelist submission?')) return;
    try {
      const res = await fetch('/api/admin/whitelist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'DELETE', id }),
      });
      if (res.ok) {
        setActionMessage('Submission deleted.');
        setEntries((prev) => prev.filter((e) => e.id !== id));
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch (err) {}
  };

  const exportCSV = () => {
    const headers = ['ID', 'Wallet Address', 'Email', 'Task Proofs / Handle', 'Status', 'Registered Date'];
    const rows = filteredEntries.map((e) => [
      e.id,
      e.walletAddress,
      e.email || '',
      e.twitterHandle || '',
      e.status,
      new Date(e.createdAt).toLocaleString(),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `portion_punks_whitelist_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredEntries = entries.filter((e) => {
    const matchesSearch =
      e.walletAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.twitterHandle && e.twitterHandle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.email && e.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'ALL' || e.status.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  const totalCount = entries.length;
  const approvedCount = entries.filter((e) => e.status === 'APPROVED' || e.status === 'PENDING').length;
  const pendingCount = entries.filter((e) => e.status === 'PENDING').length;

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header with Whitelist LIVE / PAUSE Switch */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-smoke-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-pixel-display text-neon-green mb-1">
            <UserCheck className="w-4 h-4" />
            <span>WHITELIST BOARD CONTROL PANEL</span>
          </div>
          <h1 className="font-pixel-heading text-2xl text-white font-bold tracking-tight">
            WHITELIST & TASKS MANAGER
          </h1>
          <p className="text-xs text-smoke-400 font-sans mt-1">
            Toggle Whitelist status, configure required social tasks, review task proofs, and approve entries.
          </p>
        </div>

        {/* Live / Pause Control Button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleToggleLive}
            className={`px-4 py-2.5 font-pixel-display text-xs font-bold border-2 rounded-sm transition-all flex items-center space-x-2 shadow-pixel-black ${
              isLive
                ? 'bg-neon-green/20 text-neon-green border-neon-green hover:bg-neon-green/30'
                : 'bg-amber-500/20 text-amber-400 border-amber-500 hover:bg-amber-500/30'
            }`}
          >
            {isLive ? <PlayCircle className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}
            <span>STATUS: {isLive ? 'LIVE (OPEN)' : 'PAUSED'}</span>
          </button>

          <button
            onClick={exportCSV}
            disabled={filteredEntries.length === 0}
            className="px-4 py-2.5 bg-charcoal-850 hover:bg-charcoal-800 text-white font-pixel-display text-xs border border-smoke-700 transition-all flex items-center space-x-2 rounded-sm disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-neon-green" />
            <span>EXPORT CSV ({filteredEntries.length})</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 bg-neon-green/10 border border-neon-green/40 text-neon-green text-xs font-pixel-display rounded-sm animate-fadeIn">
          {actionMessage}
        </div>
      )}

      {/* Tabs: Registrations vs Tasks Config */}
      <div className="flex items-center space-x-4 border-b border-smoke-800 pb-2">
        <button
          onClick={() => setActiveTab('ENTRIES')}
          className={`font-pixel-display text-xs px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'ENTRIES'
              ? 'text-neon-green border-neon-green font-bold'
              : 'text-smoke-400 border-transparent hover:text-white'
          }`}
        >
          REGISTRATIONS ({entries.length})
        </button>

        <button
          onClick={() => setActiveTab('TASKS')}
          className={`font-pixel-display text-xs px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'TASKS'
              ? 'text-neon-green border-neon-green font-bold'
              : 'text-smoke-400 border-transparent hover:text-white'
          }`}
        >
          WHITELIST TASKS CONFIG ({tasks.length})
        </button>
      </div>

      {activeTab === 'TASKS' ? (
        /* WHITELIST TASK CREATOR & CONTROLLER SECTION */
        <div className="space-y-6 max-w-4xl">
          <div className="flex justify-between items-center bg-charcoal-900 border-2 border-smoke-800 p-5 rounded-sm">
            <div>
              <h3 className="font-pixel-heading text-sm text-white">CONFIGURE REQUIRED WHITELIST TASKS</h3>
              <p className="text-xs text-smoke-400 font-sans mt-0.5">
                Tasks created here dynamically display in the public Whitelist modal with proof submission boxes.
              </p>
            </div>

            <button
              onClick={handleSaveTasks}
              className="px-5 py-2.5 bg-neon-green text-charcoal-950 font-pixel-display text-xs font-bold border border-black shadow-pixel-black hover:bg-neon-darkgreen transition-all flex items-center space-x-2 rounded-sm"
            >
              <Save className="w-4 h-4" />
              <span>SAVE TASKS</span>
            </button>
          </div>

          <div className="space-y-4">
            {tasks.map((task, idx) => (
              <div key={task.id || idx} className="bg-charcoal-900 border-2 border-smoke-800 p-5 rounded-sm space-y-3 relative">
                <div className="flex justify-between items-center border-b border-smoke-850 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-pixel-display text-xs text-neon-green">
                      TASK #{idx + 1}
                    </span>
                    <span className={`text-[9px] font-pixel-display px-2 py-0.5 border rounded-sm ${
                      task.required
                        ? 'bg-[#332811] text-[#f59e0b] border-[#947629]'
                        : 'bg-charcoal-850 text-smoke-400 border-smoke-700'
                    }`}>
                      {task.required ? 'REQUIRED' : 'OPTIONAL'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveTask(idx)}
                    className="text-red-400 hover:text-red-300 p-1"
                    title="Remove Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-pixel-display text-smoke-300 mb-1">
                      TASK TITLE
                    </label>
                    <input
                      type="text"
                      value={task.title}
                      onChange={(e) => handleTaskChange(idx, 'title', e.target.value)}
                      placeholder="e.g. Follow @potionpunks on X"
                      className="w-full bg-charcoal-850 border border-smoke-700 text-white text-xs px-3 py-2 focus:outline-none focus:border-neon-green rounded-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-pixel-display text-smoke-300 mb-1">
                      TASK TARGET URL LINK
                    </label>
                    <input
                      type="text"
                      value={task.url}
                      onChange={(e) => handleTaskChange(idx, 'url', e.target.value)}
                      placeholder="https://x.com/potionpunks"
                      className="w-full bg-charcoal-850 border border-smoke-700 text-white text-xs px-3 py-2 focus:outline-none focus:border-neon-green rounded-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-pixel-display text-smoke-300 mb-1">
                    USER PROOF SUBMISSION PLACEHOLDER
                  </label>
                  <input
                    type="text"
                    value={task.proofPlaceholder}
                    onChange={(e) => handleTaskChange(idx, 'proofPlaceholder', e.target.value)}
                    placeholder="e.g. Enter Tweet proof URL or @username"
                    className="w-full bg-charcoal-850 border border-smoke-700 text-white text-xs px-3 py-2 focus:outline-none focus:border-neon-green rounded-sm"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-smoke-850">
                  <span className="text-[11px] font-pixel-display text-smoke-300">
                    TASK REQUIREMENT TYPE
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleTaskChange(idx, 'required', true)}
                      className={`px-3 py-1.5 text-[10px] font-pixel-display border rounded-sm transition-all ${
                        task.required
                          ? 'bg-[#332811] text-[#f59e0b] border-[#947629] font-bold'
                          : 'bg-charcoal-850 text-smoke-400 border-smoke-700 hover:text-white'
                      }`}
                    >
                      REQUIRED TASK
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTaskChange(idx, 'required', false)}
                      className={`px-3 py-1.5 text-[10px] font-pixel-display border rounded-sm transition-all ${
                        !task.required
                          ? 'bg-charcoal-800 text-smoke-200 border-smoke-600 font-bold'
                          : 'bg-charcoal-850 text-smoke-400 border-smoke-700 hover:text-white'
                      }`}
                    >
                      OPTIONAL TASK
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddTask}
            className="w-full py-3.5 bg-charcoal-850 hover:bg-charcoal-800 border-2 border-dashed border-smoke-700 text-smoke-300 font-pixel-display text-xs flex items-center justify-center space-x-2 rounded-sm transition-colors"
          >
            <Plus className="w-4 h-4 text-neon-green" />
            <span>ADD NEW WHITELIST TASK</span>
          </button>
        </div>
      ) : (
        /* REGISTRATIONS TABLE SECTION */
        <div className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-charcoal-900 border-2 border-smoke-800 p-5 rounded-sm">
              <div className="text-xs font-pixel-display text-smoke-400 mb-1">TOTAL ENTRIES</div>
              <div className="font-pixel-heading text-2xl text-white font-bold">{totalCount}</div>
            </div>

            <div className="bg-charcoal-900 border-2 border-smoke-800 p-5 rounded-sm">
              <div className="text-xs font-pixel-display text-smoke-400 mb-1">APPROVED / RESERVED</div>
              <div className="font-pixel-heading text-2xl text-neon-green font-bold">{approvedCount}</div>
            </div>

            <div className="bg-charcoal-900 border-2 border-smoke-800 p-5 rounded-sm">
              <div className="text-xs font-pixel-display text-smoke-400 mb-1">PENDING VERIFICATION</div>
              <div className="font-pixel-heading text-2xl text-amber-400 font-bold">{pendingCount}</div>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="bg-charcoal-900 border border-smoke-800 p-4 rounded-sm flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-smoke-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Wallet Address (0x...) or Task Proof..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-charcoal-850 border border-smoke-700 text-white placeholder-smoke-500 text-xs pl-10 pr-3.5 py-2.5 focus:outline-none focus:border-neon-green rounded-sm"
              />
            </div>

            <div className="flex items-center space-x-2">
              {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-2 text-[10px] font-pixel-display border rounded-sm transition-colors ${
                    statusFilter === st
                      ? 'bg-neon-green/20 text-neon-green border-neon-green'
                      : 'bg-charcoal-850 text-smoke-400 border-smoke-700 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Whitelist Entries Table */}
          <div className="bg-charcoal-900 border-2 border-smoke-800 rounded-sm overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-charcoal-950 border-b border-smoke-800 text-smoke-400 font-pixel-display text-[10px]">
                    <th className="p-4">WALLET ADDRESS</th>
                    <th className="p-4">USER TASK PROOFS</th>
                    <th className="p-4">EMAIL</th>
                    <th className="p-4">STATUS</th>
                    <th className="p-4">DATE REGISTERED</th>
                    <th className="p-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-smoke-850">
                  {filteredEntries.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-smoke-400 font-pixel-display text-xs">
                        {loading ? 'LOADING WHITELIST SUBMISSIONS...' : 'NO WHITELIST SUBMISSIONS FOUND.'}
                      </td>
                    </tr>
                  ) : (
                    filteredEntries.map((e) => (
                      <tr key={e.id} className="hover:bg-charcoal-850/50 transition-colors">
                        
                        {/* Wallet Address */}
                        <td className="p-4 font-mono text-neon-green font-bold">
                          {e.walletAddress}
                        </td>

                        {/* Submitted Task Proofs */}
                        <td className="p-4 font-mono text-xs text-white max-w-xs truncate">
                          {e.twitterHandle ? (
                            <span className="text-smoke-200 bg-charcoal-850 px-2 py-1 rounded-sm border border-smoke-750">
                              {e.twitterHandle}
                            </span>
                          ) : (
                            <span className="text-smoke-600">—</span>
                          )}
                        </td>

                        {/* Email */}
                        <td className="p-4 font-sans text-smoke-300">
                          {e.email || <span className="text-smoke-600">—</span>}
                        </td>

                        {/* Status Badge */}
                        <td className="p-4">
                          {e.status === 'APPROVED' ? (
                            <span className="px-2 py-0.5 text-[9px] font-pixel-display bg-neon-green/20 text-neon-green border border-neon-green/40 rounded-sm">
                              APPROVED
                            </span>
                          ) : e.status === 'REJECTED' ? (
                            <span className="px-2 py-0.5 text-[9px] font-pixel-display bg-red-500/20 text-red-400 border border-red-500/40 rounded-sm">
                              REJECTED
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-[9px] font-pixel-display bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-sm">
                              PENDING
                            </span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="p-4 text-smoke-400 font-mono text-[11px]">
                          {new Date(e.createdAt).toLocaleString()}
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {e.status !== 'APPROVED' && (
                              <button
                                onClick={() => handleUpdateStatus(e.id, 'APPROVED')}
                                className="p-1.5 bg-neon-green/10 hover:bg-neon-green/20 text-neon-green border border-neon-green/30 rounded-sm transition-colors"
                                title="Approve Submission"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {e.status !== 'REJECTED' && (
                              <button
                                onClick={() => handleUpdateStatus(e.id, 'REJECTED')}
                                className="p-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-sm transition-colors"
                                title="Reject Submission"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              onClick={() => handleDelete(e.id)}
                              className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-sm transition-colors"
                              title="Delete Submission"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
