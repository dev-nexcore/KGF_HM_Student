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
        const res = await api.get(`/feeStatus`);
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
    <div className="w-full min-h-screen bg-white pt-1 pb-6 sm:pb-10 px-3 sm:px-4 dark:bg-white overflow-hidden">
      {/* Fees Section Title */}

      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black border-l-4 border-[#4F8CCF] pl-2 mb-4 sm:mb-6">
        Fees Status
      </h2>

      {/* Current Fees Status Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.2)] focus:outline-none overflow-hidden w-full max-w-2xl min-h-[400px] mb-6 sm:mb-8">
        <div className="bg-[#A4B494] px-6 sm:px-8 py-4 sm:py-5">
          <h3 className="text-lg sm:text-xl font-bold text-black">Current Fees Status</h3>
        </div>


        {loading ? (
          <div className="flex items-center justify-center h-80 text-gray-600">Loading current fee status...</div>
        ) : error ? (
          <div className="flex items-center justify-center h-80 text-red-600">{error}</div>
        ) : currentFees.length === 0 ? (
          <div className="flex items-center justify-center h-80 text-gray-500">No current fees found.</div>
        ) : (
          currentFees.map((fee, idx) => (
            <div key={idx} className="flex flex-col h-80 px-6 sm:px-8 py-6 sm:py-8">
              <div className="flex-1 flex flex-col justify-center space-y-8 text-lg">
                <div className="flex justify-between">
                  <span className="font-semibold text-black">Fee Type:</span>
                  <span className="font-medium text-black">{fee.feeType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-black">Due Date:</span>
                  <span className="font-medium text-black">
                    {new Date(fee.dueDate).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-black">Amount:</span>
                  <span className="font-medium text-black">₹ {fee.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-black">Status:</span>
                  <span className={`font-medium ${fee.status === 'overdue' ? 'text-red-600' :
                    fee.status === 'unpaid' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                    {fee.status}
                  </span>
                </div>
              </div>
              <div className="flex justify-center pb-2">
                <button
                  onClick={() => {
                    setSelectedFeeAmount(fee.amount);
                    setShowModal(true);
                  }}
                  className="bg-[#BEC5AD] px-8 py-3 rounded-md text-black font-semibold shadow-md text-base hover:bg-[#a8b096] transition-colors"
                >
                  Pay Now
                </button>
              </div>
            </div>
          ))
        )}
      </div>


      {/* Payment History Table */}
      <div className="bg-white rounded-lg shadow-md w-full max-w-7xl">
        <div className="p-5 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold mb-6 text-black">
            Payment History
          </h3>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="text-center pl-6 p-4 font-semibold text-black">Date</th>
                  <th className="text-center p-4 font-semibold text-black">Amount (₹)</th>
                  <th className="text-center p-4 font-semibold text-black">Email ID</th>
                  <th className="text-center p-4 font-semibold text-black">Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="text-center pl-6 p-4 text-gray-700">{item.date}</td>
                    <td className="text-center p-4 text-gray-700">{item.amount}</td>
                    <td className="text-center p-4 text-gray-700">{item.email}</td>
                    <td className="text-center p-4">
                      <span className="text-green-600 font-semibold">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="sm:hidden">
            {paymentHistory.map((item, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-3 text-center mb-2">
                <div className="flex justify-center items-center mb-2 space-x-2">
                  <h4 className="font-semibold text-gray-800 text-sm">{item.date}</h4>
                  <span className="text-green-600 font-semibold text-sm">
                    {item.status}
                  </span>
                </div>
                <div className="text-sm">
                  <div className="flex justify-center space-x-1 mb-1">
                    <span className="text-gray-600">Amount (₹):</span>
                    <span className="font-medium text-gray-800">{item.amount}</span>
                  </div>
                  <div className="flex justify-center space-x-1">
                    <span className="text-gray-600">Email ID:</span>
                    <span className="font-medium text-gray-800 break-words max-w-[60%]">
                      {item.email}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
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