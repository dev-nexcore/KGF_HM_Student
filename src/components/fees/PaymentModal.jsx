'use client';
import React, { useRef, useEffect } from 'react';

export default function PaymentModal({ isOpen, onClose }) {
  const modalRef = useRef();

  // Close when clicked outside the modal box
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-lg p-10 w-full max-w-xl"
      >
        {/* Heading with underline */}
        <h2 className="text-2xl font-bold text-black mb-2">Fees Payment</h2>
        <div className="w-16 h-1 bg-[#a1b294] mb-6"></div>

        {/* Payment Details */}
        <p className="text-base font-bold text-black mb-2">Payment Details</p>
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-[#828282] font-semibold">Amount Due:</p>
          <p className="text-sm text-[#828282] font-semibold">INR 7,000</p>
        </div>

        {/* Select Payment Method */}
        <p className="text-lg font-semibold text-black mb-4">
          Select Payment Method:
        </p>

        <div className="flex flex-col gap-5 mb-6 text-base text-black font-normal">
          {/* UPI */}
          <label className="flex items-center gap-4">
            <input type="radio" name="payment" className="accent-blue-600 w-5 h-5" defaultChecked />
            <span>UPI</span>
          </label>

          {/* Net Banking */}
          <label className="flex items-center gap-4">
            <input type="radio" name="payment" className="accent-blue-600 w-5 h-5" />
            <span>Net Banking</span>
          </label>

          {/* Credit or Debit Card with Logos */}
          <label className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <input type="radio" name="payment" className="accent-blue-600 w-5 h-5" />
              <span>Credit or Debit Card</span>
            </div>
           <div className="flex items-center gap-2">
  <img src="/payment-icons/visa.png" alt="Visa" className="h-5" />
  <img src="/payment-icons/mastercard.png" alt="MasterCard" className="h-5" />
  <img src="/payment-icons/amex.png" alt="Amex" className="h-5" />
  <img src="/payment-icons/diners.png" alt="Diners Club" className="h-5" />
  <img src="/payment-icons/maestro.png" alt="Maestro" className="h-5" />
  <img src="/payment-icons/rupay.png" alt="RuPay" className="h-5" />
</div>

          </label>
        </div>

        {/* Proceed Button */}
       <div className="flex justify-center">
  <button className="bg-[#a1b294] text-black font-medium py-2 px-4 text-sm rounded-lg shadow w-40">
    Proceed To Pay
  </button>
</div>


      </div>
    </div>
  );
}
