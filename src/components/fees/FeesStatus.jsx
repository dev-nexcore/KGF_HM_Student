'use client';
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import PaymentModal from './PaymentModal';

export default function FeesStatus() {
  const [showModal, setShowModal] = useState(false);
  const [currentFees, setCurrentFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [studentId, setStudentId] = useState(null);
  const [ready, setReady] = useState(false); // Replaces isClient
  const [selectedFeeAmount, setSelectedFeeAmount] = useState(null);

  useEffect(() => {
    // Run only on client
    const id = localStorage.getItem('studentId');
    if (id) setStudentId(id);
    setReady(true); // Now it's safe to run other logic
  }, []);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const res = await api.get(`/feeStatus/${studentId}`);
        setCurrentFees(res.data.fees || []);
      } catch (err) {
        console.error("Error fetching current fee status:", err);
        setError('Failed to fetch fee status');
      } finally {
        setLoading(false);
      }
    };

    if (ready && studentId) {
      fetchFees();
    }
  }, [ready, studentId]);

  if (!ready) return null; // Prevent premature render

  const paymentHistory = [
    { date: '23-03-2025', amount: '6,000', email: 'xyz@gmail.com', status: 'Paid' },
    { date: '31-03-2025', amount: '6,000', email: 'xyz@gmail.com', status: 'Paid' },
    { date: '15-04-2025', amount: '6,000', email: 'xyz@gmail.com', status: 'Paid' },
    { date: '26-04-2025', amount: '6,000', email: 'xyz@gmail.com', status: 'Paid' },
  ];

  return (
    <div className="w-full min-h-screen bg-white py-4 sm:py-6 px-2 sm:px-0 dark:bg-white">
      {/* Fees Section Title */}
      <div className="flex items-center mb-4 sm:mb-6">
        <div className="w-1 h-5 sm:h-6 bg-red-600 mr-2 sm:mr-3 rounded"></div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#2c2c2c]">Fees Status</h2>
      </div>

      {/* Current Fees Status Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.2)] focus:outline-none overflow-hidden w-full max-w-md mb-6 sm:mb-8">
        <div className="bg-[#A4B494] px-4 sm:px-6 py-3 sm:py-4">
          <h3 className="text-base sm:text-lg font-bold text-black">Current Fees Status</h3>
        </div>

        {loading ? (
          <div className="text-center my-4 text-gray-600">Loading current fee status...</div>
        ) : error ? (
          <div className="text-center my-4 text-red-600">{error}</div>
        ) : currentFees.length === 0 ? (
          <div className="text-center my-4 text-gray-500">No current fees found.</div>
        ) : (
          currentFees.map((fee, idx) => (
            <div key={idx} className="px-4 py-4">
              <div className="flex justify-between mb-3">
                <span className="font-semibold text-black text-sm">Fee Type:</span>
                <span className="font-bold text-black text-sm">{fee.feeType}</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="font-semibold text-black text-sm">Due Date:</span>
                <span className="font-bold text-black text-sm">
                  {new Date(fee.dueDate).toLocaleDateString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="font-semibold text-black text-sm">Amount:</span>
                <span className="font-bold text-black text-sm">₹ {fee.amount}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="font-semibold text-black text-sm">Status:</span>
                <span className={`font-bold text-sm ${fee.status === 'overdue' ? 'text-red-600' :
                  fee.status === 'unpaid' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                  {fee.status}
                </span>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setSelectedFeeAmount(fee.amount);
                    setShowModal(true);
                  }}
                  className="bg-[#BEC5AD] px-6 py-2 rounded-md text-black font-semibold shadow-md text-sm hover:bg-[#a8b096] transition-colors"
                >
                  Pay Now
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Payment History Table */}
      <div className="bg-white rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.2)] focus:outline-none p-3 sm:p-4 md:p-6 w-full max-w-4xl">
        <h3 className="text-sm sm:text-md font-semibold mb-3 sm:mb-4 text-[#2c2c2c]">Payment History</h3>

        {/* Mobile view - Cards */}
        <div className="block sm:hidden">
          {paymentHistory.map((item, idx) => (
            <div key={idx} className="bg-#D9D9D9 rounded-lg p-3 mb-3 border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-600 font-medium">Date</span>
                <span className="text-sm text-gray-800 font-medium">{item.date}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-600 font-medium">Amount (INR)</span>
                <span className="text-sm text-gray-800 font-medium">{item.amount}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-600 font-medium">Email ID</span>
                <span className="text-sm text-gray-800 font-medium break-all">{item.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600 font-medium">Status</span>
                <span className="text-sm text-green-600 font-medium">{item.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop/Tablet view - Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm text-center border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-gray-200 rounded-md h-10 sm:h-12 text-gray-700">
                <th className="px-2 sm:px-4 py-2 sm:py-3 rounded-tl-md text-xs sm:text-sm">Date</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">Amount (INR)</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">Email ID</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 rounded-tr-md text-xs sm:text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((item, idx) => (
                <tr key={idx} className="text-gray-800">
                  <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">{item.date}</td>
                  <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">{item.amount}</td>
                  <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm break-all">{item.email}</td>
                  <td className="py-2 px-2 sm:px-4 text-green-600 font-medium text-xs sm:text-sm">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedFeeAmount(null);
        }}
        amount={selectedFeeAmount}
      />
    </div>
  );
}
