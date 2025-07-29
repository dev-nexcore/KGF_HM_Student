'use client';
import React, { useRef, useEffect } from 'react';

export default function PaymentModal({ isOpen, onClose, amount }) {
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
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-lg p-6 sm:p-8 md:p-10 w-full max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Heading with underline */}
        <h2 className="text-xl sm:text-2xl font-bold text-black mb-2">Fees Payment</h2>
        <div className="w-12 sm:w-16 h-1 bg-[#a1b294] mb-4 sm:mb-6"></div>

        {/* Payment Details */}
        <p className="text-sm sm:text-base font-bold text-black mb-2">Payment Details</p>
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <p className="text-xs sm:text-sm text-[#828282] font-semibold">Amount Due:</p>
          <p className="text-xs sm:text-sm text-[#828282] font-semibold">
            INR {amount?.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Select Payment Method */}
        <p className="text-base sm:text-lg font-semibold text-black mb-3 sm:mb-4">
          Select Payment Method:
        </p>

        <div className="flex flex-col gap-3 sm:gap-5 mb-4 sm:mb-6 text-sm sm:text-base text-black font-normal">
          {/* UPI */}
          <label className="flex items-center gap-3 sm:gap-4 cursor-pointer">
            <input
              type="radio"
              name="payment"
              className="accent-blue-600 w-4 h-4 sm:w-5 sm:h-5"
              defaultChecked
            />
            <span>UPI</span>
          </label>

          {/* Net Banking */}
          <label className="flex items-center gap-3 sm:gap-4 cursor-pointer">
            <input
              type="radio"
              name="payment"
              className="accent-blue-600 w-4 h-4 sm:w-5 sm:h-5"
            />
            <span>Net Banking</span>
          </label>

          {/* Credit or Debit Card with Logos */}
          <label className="flex items-center justify-between gap-2 sm:gap-3 cursor-pointer">
            <div className="flex items-center gap-3 sm:gap-4">
              <input
                type="radio"
                name="payment"
                className="accent-blue-600 w-4 h-4 sm:w-5 sm:h-5"
              />
              <span>Credit or Debit Card</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              <img src="/payment-icons/visa.png" alt="Visa" className="h-3 sm:h-4 md:h-5" />
              <img src="/payment-icons/mastercard.png" alt="MasterCard" className="h-3 sm:h-4 md:h-5" />
              <img src="/payment-icons/amex.png" alt="Amex" className="h-3 sm:h-4 md:h-5" />
              <img src="/payment-icons/diners.png" alt="Diners Club" className="h-3 sm:h-4 md:h-5" />
              <img src="/payment-icons/maestro.png" alt="Maestro" className="h-3 sm:h-4 md:h-5" />
              <img src="/payment-icons/rupay.png" alt="RuPay" className="h-3 sm:h-4 md:h-5" />
            </div>
          </label>
        </div>

        {/* Proceed Button */}
        <div className="flex justify-center">
          <button className="bg-[#a1b294] text-black font-medium py-2 sm:py-3 px-6 sm:px-8 text-xs sm:text-sm rounded-lg shadow w-full sm:w-48 md:w-40 hover:bg-[#8fa082] transition-colors">
            Proceed To Pay
          </button>
        </div>
      </div>
    </div>
  );
}
