'use client';

import React, { useRef, useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  CreditCard, 
  X,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function PaymentModal({ isOpen, onClose, amount }) {
  const modalRef = useRef();
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) onClose();
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handlePayment = async () => {
    if (!amount) return;
    setLoading(true);
    try {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder", 
        amount: parseFloat(amount.toString().replace(/,/g, '')) * 100,
        currency: "INR",
        name: "KGF Hostel Management",
        description: "Monthly Fee Settlement",
        handler: function (response) {
          toast.success("Transaction Verified: " + response.razorpay_payment_id);
          onClose();
        },
        prefill: {
          name: "Resident Student",
          email: "student@kgf.com",
        },
        theme: { color: "#7A8B5E" }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', (res) => toast.error("Transaction Failed: " + res.error.description));
      rzp1.open();
    } catch (error) {
      toast.error("Gateway handshake failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#1A1F16]/60 backdrop-blur-md z-[9999] p-4 animate-in fade-in duration-300">
      <div
        ref={modalRef}
        className="bg-white rounded-[48px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border border-[#7A8B5E]/10"
      >
        {/* Header */}
        <div className="bg-[#1A1F16] p-10 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 text-white/40 hover:text-white transition-all hover:rotate-90"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-4 bg-[#7A8B5E] rounded-full"></div>
            <h2 className="text-xl font-black uppercase italic tracking-tight">Secure Ledger</h2>
          </div>
          <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Transaction Gateway Integration</p>
        </div>

        <div className="p-10">
          {/* Amount Display */}
          <div className="bg-[#F8FAF5] rounded-[32px] p-8 mb-8 flex justify-between items-center border border-[#7A8B5E]/10">
            <div>
              <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest mb-1">Total Settlement</p>
              <p className="text-3xl font-black text-[#1A1F16]">₹ {amount?.toLocaleString('en-IN')}</p>
            </div>
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#7A8B5E] shadow-sm">
              <ShieldCheck size={28} />
            </div>
          </div>

          <p className="text-[10px] font-black text-[#1A1F16] mb-4 uppercase tracking-[0.2em] italic ml-1">Payment Protocol</p>
          
          <div className="space-y-4 mb-10">
            <PaymentOption 
              active={paymentMethod === 'razorpay'} 
              onClick={() => setPaymentMethod('razorpay')}
              icon={<Smartphone size={20} />}
              title="Digital Gateway"
              desc="UPI, Cards, Netbanking"
            />
            <PaymentOption 
              active={paymentMethod === 'offline'} 
              onClick={() => setPaymentMethod('offline')}
              icon={<CreditCard size={20} />}
              title="Manual Settlement"
              desc="Bank Deposit Verification"
            />
          </div>

          <button 
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-[#7A8B5E] text-white py-6 rounded-[24px] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-[#7A8B5E]/20 flex items-center justify-center gap-3 hover:bg-[#6A7B4E] transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Verifying..." : <>Authorize Payment <ArrowRight size={16} /></>}
          </button>
          
          <div className="flex items-center justify-center gap-2 mt-6 opacity-30">
            <Lock size={10} />
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">256-bit Encrypted Tunnel</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentOption({ active, onClick, icon, title, desc }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-6 rounded-[24px] border-2 transition-all ${
        active ? 'border-[#7A8B5E] bg-[#F8FAF5]' : 'border-[#F8FAF5] hover:border-[#7A8B5E]/20'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${active ? 'bg-[#7A8B5E] text-white' : 'bg-white text-[#6B7280]'}`}>
          {icon}
        </div>
        <div className="text-left">
          <p className={`text-xs font-black uppercase tracking-tight ${active ? 'text-[#1A1F16]' : 'text-[#6B7280]'}`}>{title}</p>
          <p className="text-[10px] font-bold text-[#6B7280] italic opacity-60">{desc}</p>
        </div>
      </div>
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${active ? 'border-[#7A8B5E] bg-white' : 'border-[#7A8B5E]/10'}`}>
        {active && <div className="w-3 h-3 bg-[#7A8B5E] rounded-full" />}
      </div>
    </button>
  );
}
