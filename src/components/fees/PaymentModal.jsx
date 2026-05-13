'use client';
import React, { useRef, useEffect, useState } from 'react';
import { FiShield, FiLock, FiCreditCard, FiSmartphone, FiMonitor } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export default function PaymentModal({ isOpen, onClose, amount }) {
  const modalRef = useRef();
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);

  // Close when clicked outside the modal box
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handlePayment = async () => {
    if (!amount) return;
    
    setLoading(true);
    try {
      // Razorpay Integration Logic
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder", 
        amount: parseFloat(amount.toString().replace(/,/g, '')) * 100, // amount in the smallest currency unit
        currency: "INR",
        name: "KGF Hostel Management",
        description: "Monthly Fee Payment",
        image: "/logo.png",
        handler: function (response) {
          toast.success("Payment Successful! ID: " + response.razorpay_payment_id);
          onClose();
        },
        prefill: {
          name: "Student User",
          email: "student@kgf.com",
          contact: "9999999999"
        },
        notes: {
          address: "KGF Hostel"
        },
        theme: {
          color: "#A4B494",
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        toast.error("Payment Failed: " + response.error.description);
      });
      rzp1.open();
    } catch (error) {
      console.error("Payment Error:", error);
      toast.error("Could not initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[9999] p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200"
      >
        {/* Header */}
        <div className="bg-[#A4B494] p-6 text-black relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-black/60 hover:text-black transition-colors"
          >
            ✕
          </button>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FiShield className="text-black/70" /> Secure Checkout
          </h2>
          <p className="text-sm opacity-80 mt-1">Hostel Fee Payment Portal</p>
        </div>

        <div className="p-6 sm:p-8">
          {/* Amount Display */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6 flex justify-between items-center border border-gray-100">
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Payable</p>
              <p className="text-2xl font-black text-gray-900">₹ {amount?.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-green-100 text-green-700 p-2 rounded-lg">
              <FiLock size={20} />
            </div>
          </div>

          {/* Payment Methods */}
          <p className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">Select Payment Method</p>
          
          <div className="space-y-3 mb-8">
            <button 
              onClick={() => setPaymentMethod('razorpay')}
              className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                paymentMethod === 'razorpay' 
                ? 'border-[#A4B494] bg-[#A4B494]/5' 
                : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${paymentMethod === 'razorpay' ? 'bg-[#A4B494] text-white' : 'bg-gray-100 text-gray-400'}`}>
                  <FiSmartphone />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-900">Razorpay Secure</p>
                  <p className="text-[10px] text-gray-500">UPI, Cards, Netbanking</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === 'razorpay' ? 'border-[#A4B494]' : 'border-gray-300'
              }`}>
                {paymentMethod === 'razorpay' && <div className="w-2.5 h-2.5 bg-[#A4B494] rounded-full" />}
              </div>
            </button>

            <button 
              onClick={() => setPaymentMethod('offline')}
              className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                paymentMethod === 'offline' 
                ? 'border-[#A4B494] bg-[#A4B494]/5' 
                : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${paymentMethod === 'offline' ? 'bg-[#A4B494] text-white' : 'bg-gray-100 text-gray-400'}`}>
                  <FiCreditCard />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-900">Offline Receipt</p>
                  <p className="text-[10px] text-gray-500">Upload Bank Slip</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === 'offline' ? 'border-[#A4B494]' : 'border-gray-300'
              }`}>
                {paymentMethod === 'offline' && <div className="w-2.5 h-2.5 bg-[#A4B494] rounded-full" />}
              </div>
            </button>
          </div>

          {/* Footer Branding */}
          <div className="flex items-center justify-center gap-4 mb-6 grayscale opacity-40">
            <img src="/payment-icons/visa.png" alt="Visa" className="h-4" />
            <img src="/payment-icons/mastercard.png" alt="MasterCard" className="h-4" />
            <img src="/payment-icons/rupay.png" alt="RuPay" className="h-4" />
            <div className="h-4 w-[1px] bg-gray-300" />
            <span className="text-[10px] font-bold">RAZORPAY SECURE</span>
          </div>

          {/* Action Button */}
          <button 
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-[#A4B494] hover:bg-[#8fa082] text-black font-bold py-4 rounded-xl shadow-lg shadow-[#A4B494]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              "Processing..."
            ) : (
              <>
                <FiLock /> Proceed to Pay ₹{amount?.toLocaleString('en-IN')}
              </>
            )}
          </button>
          
          <p className="text-center text-[10px] text-gray-400 mt-4">
            By proceeding, you agree to our Terms & Conditions. Your payment is encrypted and secure.
          </p>
        </div>
      </div>
    </div>
  );
}
