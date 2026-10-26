import React, { useState, useEffect } from 'react';
import { 
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
  ArrowRight,
  Send,
  Zap,
  Code
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

interface SupabaseSettingsViewProps {
  bookings: BookingRecord[];
  onBookingsSynced: (bookings: BookingRecord[]) => void;
  onSendTestBooking: () => Promise<void>;
  isModal?: boolean;
  onClose?: () => void;
}

export const SupabaseSettingsView: React.FC<SupabaseSettingsViewProps> = ({
  bookings,
  onBookingsSynced,
  onSendTestBooking,
  isModal = false,
  onClose
}) => {
  const [config, setConfig] = useState<SupabaseConfig>(() => getSupabaseConfig());
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [testPushing, setTestPushing] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; rowCount?: number } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'sql'>('config');

  useEffect(() => {
    setConfig(getSupabaseConfig());
  }, []);

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
      for (const b of bookings) {
        await saveBookingToSupabase(b);
      }
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

  const handleTriggerTestBooking = async () => {
    triggerHaptic();
    setTestPushing(true);
    try {
      await onSendTestBooking();
      setTestResult({
        success: true,
        message: 'Test booking successfully pushed to Supabase! Check your Bookings Feed for the real-time notification.'
      });
    } catch (e) {
      setTestResult({
        success: false,
        message: `Failed to push test booking: ${e instanceof Error ? e.message : String(e)}`
      });
    } finally {
      setTestPushing(false);
    }
  };

  const isConnected = Boolean(config.url && config.anonKey);

  return (
    <div className={`p-4 space-y-4 animate-fade-in ${isModal ? '' : 'pb-24'} text-slate-100`}>
      {/* Header Banner */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-base shadow-inner">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Supabase PostgreSQL</h2>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  isConnected ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {isConnected ? 'Configured' : 'Credentials Needed'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pushes client inquiries & plan bookings directly to this dashboard in real-time.
              </p>
            </div>
          </div>
          {isModal && onClose && (
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
              ✕
            </button>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={() => {
              triggerHaptic();
              setActiveTab('config');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'config'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Connection Config</span>
          </button>
          <button
            onClick={() => {
              triggerHaptic();
              setActiveTab('sql');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'sql'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>SQL Schema Migration</span>
          </button>
        </div>
      </div>

      {/* Test Result Banner */}
      {testResult && (
        <div className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 ${
          testResult.success
            ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
            : 'bg-rose-950/40 border-rose-800/80 text-rose-300'
        }`}>
          {testResult.success ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <span className="font-semibold block">{testResult.success ? 'Success' : 'Connection Issue'}</span>
            <span className="text-[11px] opacity-90">{testResult.message}</span>
          </div>
        </div>
      )}

      {/* Tab: Config */}
      {activeTab === 'config' ? (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Supabase Project URL</span>
            </label>
            <input
              type="url"
              value={config.url}
              onChange={(e) => setConfig({ ...config, url: e.target.value })}
              placeholder="https://your-project-id.supabase.co"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-slate-500 block">
              Found in Supabase Dashboard → Project Settings → API → Project URL
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-emerald-400" />
              <span>Supabase Anon (Public) API Key</span>
            </label>
            <input
              type="text"
              value={config.anonKey}
              onChange={(e) => setConfig({ ...config, anonKey: e.target.value })}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-slate-500 block">
              Found in Supabase Dashboard → Project Settings → API → Project API Keys (anon public)
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-950/40 active:scale-95 transition-all"
            >
              Save Credentials
            </button>

            <button
              onClick={() => handleTest()}
              disabled={testing || !config.url || !config.anonKey}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-1.5 disabled:opacity-40"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Testing...' : 'Test Connection'}</span>
            </button>

            <button
              onClick={handleTriggerTestBooking}
              disabled={testPushing || !isConnected}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md disabled:opacity-40 ml-auto"
              title="Pushes a live test booking to Supabase so you can verify the realtime push reception"
            >
              <Send className={`w-3.5 h-3.5 ${testPushing ? 'animate-spin' : ''}`} />
              <span>{testPushing ? 'Pushing...' : 'Test Realtime Push'}</span>
            </button>
          </div>

          {/* Quick sync existing */}
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-white block">Sync Local Records to Supabase</span>
              <span className="text-[11px] text-slate-400">
                Push all {bookings.length} inquiries currently in this app up to your Supabase table.
              </span>
            </div>
            <button
              onClick={handleSyncToSupabase}
              disabled={syncing || !isConnected}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-semibold disabled:opacity-40"
            >
              {syncing ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>
        </div>
      ) : (
        /* Tab: SQL Schema */
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">PostgreSQL Table Setup SQL</h3>
              <p className="text-xs text-slate-400">
                Run this once in your Supabase SQL Editor to create the table, RLS, and realtime listener.
              </p>
            </div>
            <button
              onClick={handleCopySql}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md hover:bg-emerald-400"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
            </button>
          </div>

          <pre className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-72 leading-relaxed">
            {SUPABASE_SETUP_SQL}
          </pre>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-1">
            <span className="font-bold text-slate-200 block">How to run in Supabase:</span>
            <ol className="list-decimal list-inside space-y-0.5 text-[11px]">
              <li>Log into your Supabase project dashboard at <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-cyan-400 underline">supabase.com</a></li>
              <li>Click <strong>SQL Editor</strong> on the left sidebar</li>
              <li>Click <strong>New Query</strong>, paste the script above, and click <strong>Run</strong></li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};
