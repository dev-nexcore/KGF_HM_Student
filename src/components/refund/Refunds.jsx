'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function Refunds() {
  const [refundType, setRefundType] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [refunds, setRefunds] = useState([]);

  const [studentId, setStudentId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setStudentId(localStorage.getItem('studentId'));
    }
  }, []);

  useEffect(() => {
    if (!studentId) return;

    const fetchRefunds = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/refunds/${studentId}`);
        setRefunds(res.data?.refunds || []);
      } catch (error) {
        console.error('Error fetching refund history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRefunds();
  }, [studentId]);

  // Submit refund form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!refundType || !amount || !reason || !studentId) return;

    try {
      await api.post('/refund', {
        studentId,
        refundType,
        amount,
        reason,
      });

      // Re-fetch history after successful submission
      const res = await api.get(`/refunds/${studentId}`);
      setRefunds(res.data?.refunds || []);

      // Clear form
      setRefundType('');
      setAmount('');
      setReason('');
    } catch (err) {
      console.error('Error submitting refund:', err);
    }
  };

  const getStatusClasses = (status) => {
    if (status === 'Approved') return 'bg-green-500 text-black';
    if (status === 'Rejected') return 'bg-red-500 text-white';
    return 'bg-yellow-400 text-white';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString();
  };

  return (
    <div className="bg-white text-black p-4 sm:p-6 md:p-8 overflow-hidden min-h-screen">

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold border-l-4 border-red-600 pl-3 mb-6 sm:mb-8 mt-[-7px] -ml-2 text-[#2c2c2c]">
        Refunds
      </h1>

      {/* Refund Application Form */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.25)] mb-6 sm:mb-10 w-full max-w-3xl">

        {/* Header */}
        <div className="bg-[#A4B494] rounded-t-lg sm:rounded-t-xl px-6 py-3 font-bold text-base md:text-lg">
          Refund Application Form
        </div>

        <form className="space-y-4 px-6 py-6" onSubmit={handleSubmit}>
          {/* Refund Type */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-800">
              Refund Type
            </label>
            <select
              value={refundType}
              onChange={(e) => setRefundType(e.target.value)}
              className="w-full px-4 py-2 rounded-md shadow-md border border-gray-300 text-sm"
              required
            >
              <option value="">Choose Refund Type</option>
              <option>Mess fee Overpayment</option>
              <option>Security Deposit</option>
              <option>Damages fee</option>
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-800">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter the Amount"
              className="w-full px-4 py-2 rounded-md shadow-md border border-gray-300 text-sm placeholder:text-gray-400"
              required
              min="0"
            />
          </div>

          {/* Reason */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
            <label className="text-xs sm:text-sm font-semibold sm:pt-2 whitespace-nowrap">
              Reason For Refund:
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full px-3 sm:px-4 py-2 rounded-lg shadow-md h-16 sm:h-20 resize-none border border-gray-300 text-xs"
              placeholder="Enter the reason for refund"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-2">
            <button
              type="submit"
              className="bg-[#A4AE97] text-black px-4 sm:px-6 md:px-8 py-1.5 sm:py-2 rounded-md shadow hover:opacity-90 text-xs sm:text-sm font-medium w-full sm:w-auto"
              disabled={!studentId}
              title={!studentId ? 'Student not identified' : 'Submit'}
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* Refund History */}
      <div className="bg-white min-h-[280px] sm:minh-[340px] rounded-lg sm:rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.25)] px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 w-full max-w-6xl lg:mx-0 lg:ml-0">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">
          Refund History
        </h3>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm text-gray-800 min-w-full">
            <thead className="bg-gray-200 text-center">
              <tr>
                <th className="p-3 font-semibold">Refund Type</th>
                <th className="p-3 font-semibold">Requested Date</th>
                <th className="p-3 font-semibold">Amount</th>
                <th className="p-3 font-semibold">Reason</th>
                <th className="p-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center">Loading...</td>
                </tr>
              ) : refunds.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-600">No refund requests yet.</td>
                </tr>
              ) : (
                refunds.map((refund, idx) => (
                  <tr key={idx} className="bg-white hover:bg-gray-50">
                    <td className="p-3 text-center">{refund.refundType}</td>
                    <td className="p-3 text-center">{formatDate(refund.requestedAt)}</td>
                    <td className="p-3 text-center">₹{refund.amount}</td>
                    <td className="p-3 text-center">{refund.reason}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusClasses(refund.status)}`}>
                        {refund.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden space-y-1">
          {loading ? (
            <div className="text-center text-gray-600 text-sm py-2">Loading...</div>
          ) : refunds.length === 0 ? (
            <div className="text-center text-gray-600 text-sm py-2">No refund requests yet.</div>
          ) : (
            refunds.map((refund, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
                <div className="flex justify-center items-center mb-2 space-x-2">
                  <h4 className="font-semibold text-gray-800 text-xs">{refund.refundType}</h4>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${getStatusClasses(refund.status)}`}>
                    {refund.status}
                  </span>
                </div>
                <div className="space-y-1.5 text-[10px]">
                  <div className="flex justify-center space-x-1">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium text-gray-800">{formatDate(refund.requestedAt)}</span>
                  </div>
                  <div className="flex justify-center space-x-1">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium text-gray-800">₹{refund.amount}</span>
                  </div>
                  <div className="flex justify-center space-x-1">
                    <span className="text-gray-600">Reason:</span>
                    <span className="font-medium text-gray-800">{refund.reason}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
