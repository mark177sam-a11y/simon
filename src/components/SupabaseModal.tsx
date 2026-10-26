import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  RefreshCw, 
  Key, 
  Globe, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  getSupabaseConfig, 
  saveSupabaseConfig, 
  testSupabaseConnection, 
  SUPABASE_SETUP_SQL,
  SupabaseConfig,
  saveBookingToSupabase,
  fetchSupabaseBookings
} from '../lib/supabase';
import { BookingRecord } from '../types';
import { triggerHaptic } from '../utils/calendar';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingRecord[];
  onBookingsSynced: (bookings: BookingRecord[]) => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onBookingsSynced
}) => {
  if (!isOpen) return null;

  const [config, setConfig] = useState<SupabaseConfig>(() => getSupabaseConfig());
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'sql'>('config');

  useEffect(() => {
    setConfig(getSupabaseConfig());
  }, [isOpen]);

  const handleSave = () => {
    triggerHaptic();
    saveSupabaseConfig({
      ...config,
      url: config.url.trim(),
      anonKey: config.anonKey.trim(),
      enabled: Boolean(config.url && config.anonKey)
    });
    handleTest(config.url.trim(), config.anonKey.trim());
  };

  const handleTest = async (testUrl?: string, testKey?: string) => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testSupabaseConnection(testUrl || config.url, testKey || config.anonKey);
      setTestResult(res);
    } catch (e) {
      setTestResult({
        success: false,
        message: e instanceof Error ? e.message : 'Connection failed'
      });
    } finally {
      setTesting(false);
    }
  };

  const handleCopySql = () => {
    triggerHaptic();
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSyncToSupabase = async () => {
    triggerHaptic();
    setSyncing(true);
    try {
      // Push local/firestore bookings to Supabase
      for (const b of bookings) {
        await saveBookingToSupabase(b);
      }
      // Re-fetch
      const refreshed = await fetchSupabaseBookings();
      if (refreshed.length > 0) {
        onBookingsSynced(refreshed);
      }
      setTestResult({
        success: true,
        message: `Successfully synchronized ${bookings.length} bookings to Supabase!`
      });
    } catch (e) {
      setTestResult({
        success: false,
        message: `Sync failed: ${e instanceof Error ? e.message : String(e)}`
      });
    } finally {
      setSyncing(false);
    }
  };

  const isConnected = Boolean(config.url && config.anonKey);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-sm p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-[32px] sm:rounded-[32px] max-h-[92vh] overflow-hidden flex flex-col shadow-2xl text-slate-100">
        {/* Grab handle */}
        <div className="w-full pt-3 pb-1 flex justify-center shrink-0">
          <div className="w-12 h-1.5 bg-slate-700/80 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="px-5 py-3 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm shadow-inner">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Supabase Connection</h3>
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  isConnected ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {isConnected ? 'Configured' : 'Credentials Needed'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                PostgreSQL database integration for bookings information
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-5 pt-3 pb-1 flex items-center gap-2 border-b border-slate-800/80 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('config')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'config'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Project Settings</span>
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'sql'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>SQL Schema Script</span>
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 overflow-y-auto no-scrollbar space-y-4 flex-1">
          {activeTab === 'config' ? (
            <>
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 space-y-1">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Connect your Supabase project in 30 seconds
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Enter your Supabase Project URL and Public Anon Key from your Supabase Dashboard (<span className="text-emerald-400">Project Settings → API</span>). Bookings will persist directly in your Supabase PostgreSQL database.
                </p>
              </div>

              {/* Form Fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-mono font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Supabase Project URL</span>
                  </label>
                  <input
                    type="url"
                    value={config.url}
                    onChange={(e) => setConfig({ ...config, url: e.target.value })}
                    placeholder="https://xyzprojectid.supabase.co"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Supabase Anon Public API Key</span>
                  </label>
                  <textarea
                    rows={2}
                    value={config.anonKey}
                    onChange={(e) => setConfig({ ...config, anonKey: e.target.value })}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500 resize-none"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Safe to use: client-side anon key restricted by Row Level Security (RLS).
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleSave}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/40 active:scale-95 transition-all"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Save & Connect</span>
                </button>
                <button
                  onClick={() => handleTest()}
                  disabled={testing || !config.url || !config.anonKey}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin text-emerald-400' : ''}`} />
                  <span>{testing ? 'Testing...' : 'Test'}</span>
                </button>
              </div>

              {/* Test Result Banner */}
              {testResult && (
                <div className={`p-3 rounded-2xl border text-xs flex items-start gap-2.5 ${
                  testResult.success 
                    ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-300'
                    : 'bg-rose-950/30 border-rose-800/80 text-rose-300'
                }`}>
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{testResult.success ? 'Connection Valid' : 'Connection Alert'}</p>
                    <p className="text-[11px] opacity-90 mt-0.5 leading-relaxed">{testResult.message}</p>
                  </div>
                </div>
              )}

              {/* Sync existing bookings */}
              {config.url && config.anonKey && (
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">Database Bookings Sync</h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {bookings.length} local records ready to sync
                      </p>
                    </div>
                    <button
                      onClick={handleSyncToSupabase}
                      disabled={syncing}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                      <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* SQL Tab */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">PostgreSQL Table Creation</h4>
                  <p className="text-[10px] text-slate-400">
                    Run in your Supabase Dashboard → SQL Editor
                  </p>
                </div>
                <button
                  onClick={handleCopySql}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Copy SQL</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-3.5 max-h-64 overflow-y-auto no-scrollbar font-mono text-[11px] text-slate-300 leading-relaxed">
                <pre>{SUPABASE_SETUP_SQL}</pre>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Direct link to Supabase:</span>
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Open Supabase Console</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
