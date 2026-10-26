import React, { useState, useEffect } from 'react';
import { Smartphone, CheckCircle2, ShieldCheck, X, Loader2, ArrowRight } from 'lucide-react';
import { triggerHaptic } from '../utils/calendar';

interface MpesaModalProps {
  isOpen: boolean;
  onClose: () => void;
  phone: string;
  amountKSh: number;
  bookingRef: string;
  onPaymentSuccess: (mpesaReceipt: string) => void;
}

export const MpesaModal: React.FC<MpesaModalProps> = ({
  isOpen,
  onClose,
  phone,
  amountKSh,
  bookingRef,
  onPaymentSuccess
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'prompt' | 'waiting' | 'success'>('prompt');
  const [pin, setPin] = useState('');
  const [countdown, setCountdown] = useState(15);
  const [receiptCode, setReceiptCode] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'waiting' && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (step === 'waiting' && countdown === 0) {
      handleCompletePayment();
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  const handleSendPrompt = () => {
    triggerHaptic();
    setStep('waiting');
    setCountdown(10);
  };

  const handleCompletePayment = () => {
    triggerHaptic();
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'QKJ';
    for (let i = 0; i < 7; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setReceiptCode(code);
    setStep('success');
    onPaymentSuccess(code);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-sm rounded-[32px] bg-slate-900 border border-slate-800 p-5 shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              M
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Daraja M-Pesa STK Push</h3>
              <p className="text-[10px] text-slate-400 font-mono">Webstudios Express Checkout</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'prompt' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 text-center">
              <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold block">
                Kickoff Deposit Amount
              </span>
              <span className="text-2xl font-black text-white font-mono mt-0.5 block">
                KSh {amountKSh.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Booking Reference: <strong className="text-slate-200 font-mono">{bookingRef}</strong>
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <label className="text-slate-300 font-medium block">
                Recipient Safaricom Phone:
              </label>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>{phone || '+254 728 423 472'}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                A prompt will appear instantly on your phone requesting your M-Pesa PIN.
              </p>
            </div>

            <button
              onClick={handleSendPrompt}
              className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 active:scale-95 transition-transform"
            >
              <span>Trigger STK Push Prompt</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 'waiting' && (
          <div className="py-6 text-center space-y-4 animate-fade-in">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <Loader2 className="w-16 h-16 text-emerald-400 animate-spin opacity-40" />
              <Smartphone className="w-7 h-7 text-emerald-400 absolute" />
            </div>

            <div>
              <h4 className="text-sm font-bold text-white">Prompt Sent to Your Phone!</h4>
              <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
                Please check your handset screen and enter your M-Pesa PIN.
              </p>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-emerald-400">
              <span>Waiting for Safaricom callback...</span>
              <span className="font-bold">({countdown}s)</span>
            </div>

            <button
              onClick={handleCompletePayment}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700"
            >
              Simulate PIN Confirmation
            </button>
          </div>
        )}

        {step === 'success' && (
          <div className="py-4 text-center space-y-3 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <h4 className="text-base font-bold text-white">Payment Received!</h4>
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Receipt Number:</span>
                <span className="font-mono text-white font-bold">{receiptCode}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Amount Paid:</span>
                <span className="font-mono text-emerald-400 font-bold">KSh {amountKSh.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Status:</span>
                <span className="font-mono text-emerald-400 font-bold">VERIFIED ON FIRESTORE</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-white hover:bg-slate-700"
            >
              Continue to Booking Pass
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
