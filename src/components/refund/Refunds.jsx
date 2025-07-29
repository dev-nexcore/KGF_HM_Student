'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function Refunds() {
  const [refundType, setRefundType] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [refunds, setRefunds] = useState([]);

  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setStudentId(localStorage.getItem('studentId'));
    }
  }, []);

  useEffect(() => {
    if (!studentId) return;

    const fetchRefunds = async () => {
      try {
        const res = await api.get(`/refunds/${studentId}`);
        setRefunds(res.data.refunds);
      } catch (error) {
        console.error('Error fetching refund history:', error);
      }
    };

    fetchRefunds();
  }, [studentId]);

  // Submit refund form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!refundType || !amount || !reason) return;

    try {
      await api.post('/refund', {
        studentId,
        refundType,
        amount,
        reason,
      });

      // Re-fetch history after successful submission
      const res = await api.get(`/refunds/${studentId}`);
      setRefunds(res.data.refunds);

      // Clear form
      setRefundType('');
      setAmount('');
      setReason('');
    } catch (err) {
      console.error('Error submitting refund:', err);
    }
  };

  return (
    <div className="py-4 sm:py-6 px-2 sm:px-0">
      <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold border-l-4 border-red-500 pl-2 sm:pl-3 mb-3 sm:mb-4 lg:mb-5 text-black">
        Refunds
      </h3>

      {/* Refund Form */}
      <div className="w-full max-w-full lg:w-2/4 rounded-[16px] shadow-[0_12px_32px_rgba(0,0,0,0.2)] overflow-hidden mb-6 sm:mb-8 lg:mb-10 bg-white ml-0 mr-auto">
        {/* Header */}
        <div className="bg-[#A4B494] p-2 sm:p-3 lg:p-4 rounded-t-[16px]">
          <h4 className="text-xs sm:text-sm lg:text-base xl:text-lg font-bold text-black">Request a Refund</h4>
        </div>

        {/* Form Body */}
        <div className="p-2 sm:p-3 lg:p-4 xl:p-6">
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 sm:gap-4 lg:gap-5">
            {/* Refund Type */}
            <div className="w-full">
              <label className="block text-black font-semibold mb-1 text-xs sm:text-sm lg:text-base">
                Refund type
              </label>
              <select value={refundType} onChange={(e) => setRefundType(e.target.value)} className="w-full px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-md shadow-[0_6px_20px_rgba(0,0,0,0.2)] bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#A4AE97] text-xs sm:text-sm min-h-[36px] sm:min-h-[40px]">
                <option value="">Choose Refund Type</option>
                <option>Mess fee Overpayment</option>
                <option>Security Deposit</option>
                <option>Damages fee</option>
              </select>
            </div>

            {/* Amount */}
            <div className="w-full">
              <label className="block text-black font-semibold mb-1 text-xs sm:text-sm lg:text-base">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter the Amount"
                className="w-full px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-md shadow-[0_6px_20px_rgba(0,0,0,0.2)] placeholder:text-gray-400 text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#A4AE97] text-xs sm:text-sm min-h-[36px] sm:min-h-[40px]"
              />
            </div>

            {/* Reason For Refund */}
            <div className="w-full flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2 lg:gap-4">
              <label
                htmlFor="reason"
                className="sm:w-[120px] lg:w-[160px] text-black font-semibold sm:pt-2 text-xs sm:text-sm lg:text-base"
              >
                Reason For Refund
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full sm:flex-1 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-md shadow-[0_6px_20px_rgba(0,0,0,0.2)] text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#A4AE97] text-xs sm:text-sm min-h-[60px] sm:min-h-[80px] resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="w-full flex justify-center">
              <button
                type="submit"
                className="bg-[#A4AE97] text-black px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 rounded-md shadow-[0_6px_20px_rgba(0,0,0,0.25)] font-semibold hover:bg-[#9aa78f] transition w-full sm:w-auto text-xs sm:text-sm min-w-[80px] sm:min-w-[100px] lg:min-w-[120px]"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Refund History */}
      <div className="bg-white rounded-[16px] shadow-[0_6px_20px_rgba(0,0,0,0.25)] w-full">
        <div className="overflow-x-auto p-2 sm:p-3 lg:p-4 xl:p-6">
          <h4 className="text-sm sm:text-base lg:text-lg xl:text-xl font-extrabold mb-2 sm:mb-3 lg:mb-4 text-black">
            Refund History
          </h4>

          {/* Mobile Card View */}
          <div className="block sm:hidden space-y-2">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <h5 className="font-semibold text-black text-xs">Mess fee Overpayment</h5>
                <span className="bg-[#39FF14] text-black py-0.5 px-1.5 rounded-[4px] font-bold text-[10px]">
                  Approved
                </span>
              </div>
              <div className="text-[10px] text-gray-600 space-y-1">
                <div><span className="font-medium">Date:</span> 23-03-2025</div>
                <div><span className="font-medium">Amount:</span> 50</div>
                <div><span className="font-medium">Reason:</span> Incorrect Calculation</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <h5 className="font-semibold text-black text-xs">Security Deposit</h5>
                <span className="bg-red-500 text-white py-0.5 px-1.5 rounded-[4px] font-bold text-[10px]">
                  Rejected
                </span>
              </div>
              <div className="text-[10px] text-gray-600 space-y-1">
                <div><span className="font-medium">Date:</span> 23-03-2025</div>
                <div><span className="font-medium">Amount:</span> 250</div>
                <div><span className="font-medium">Reason:</span> Upon Successful Check-out</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <h5 className="font-semibold text-black text-xs">Damages fee</h5>
                <span className="bg-yellow-400 text-white py-0.5 px-1.5 rounded-[4px] font-bold text-[10px]">
                  Rejected
                </span>
              </div>
              <div className="text-[10px] text-gray-600 space-y-1">
                <div><span className="font-medium">Date:</span> 23-03-2025</div>
                <div><span className="font-medium">Amount:</span> 750</div>
                <div><span className="font-medium">Reason:</span> Dispute over Room inspection</div>
              </div>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block">
            <div className="min-w-[600px]">
              <table className="w-full text-[10px] sm:text-xs lg:text-sm">
                <thead>
                  <tr className="bg-[#e0e0e0] text-black">
                    <th className="px-1 sm:px-2 lg:px-4 py-1.5 sm:py-2 lg:py-3 text-left">Refund Type</th>
                    <th className="px-1 py-1.5 sm:py-2 lg:py-3 text-left">Requested Date</th>
                    <th className="px-1 py-1.5 sm:py-2 lg:py-3 text-left">Amount</th>
                    <th className="px-1 sm:px-2 lg:px-12 py-1.5 sm:py-2 lg:py-3 text-left">Reason</th>
                    <th className="px-1 sm:px-2 lg:px-10 py-1.5 sm:py-2 lg:py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {refunds.map((refund, index) => (
                    <tr key={index}>
                      <td>{refund.refundType}</td>
                      <td>{new Date(refund.requestedAt).toLocaleDateString()}</td>
                      <td>{refund.amount}</td>
                      <td>{refund.reason}</td>
                      <td>
                        <span className={`rounded-[4px] py-0.5 px-2 font-bold text-xs ${refund.status === 'Approved'
                          ? 'bg-[#39FF14] text-black'
                          : refund.status === 'Rejected'
                            ? 'bg-red-500 text-white'
                            : 'bg-yellow-400 text-white'
                          }`}>
                          {refund.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
