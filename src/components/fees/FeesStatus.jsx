'use client';
import React, { useState, useEffect } from 'react';
import PaymentModal from './PaymentModal';

export default function FeesStatus() {
  const [showModal, setShowModal] = useState(false);
  const [isClient, setIsClient] = useState(false); // To ensure client-side rendering

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Prevent hydration error

  const paymentHistory = [
    { date: '23-03-2025', amount: '6,000', email: 'xyz@gmail.com', status: 'Paid' },
    { date: '31-03-2025', amount: '6,000', email: 'xyz@gmail.com', status: 'Paid' },
    { date: '15-04-2025', amount: '6,000', email: 'xyz@gmail.com', status: 'Paid' },
    { date: '26-04-2025', amount: '6,000', email: 'xyz@gmail.com', status: 'Paid' },
  ];

  return (
<div className="w-full min-h-screen bg-white px-4 py-4 dark:bg-white">
  <div className="max-w-6xl mx-auto w-full">




        {/* Fees Section Title */}
        <div className="flex items-center mb-4">
          <div className="w-1 h-5 bg-red-600 mr-2 rounded"></div>
          <h2 className="text-lg font-semibold text-[#2c2c2c]">Fees Status</h2>
        </div>
{/* Current Fees Status Card */}
<div className="bg-white rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.2)] focus:outline-none overflow-hidden max-w-md mb-8">
  <div className="bg-[#A4B494] px-6 py-4">
    <h3 className="text-lg font-bold text-black">Current Fees Status</h3>
  </div>

  <div className="px-8 py-6">
    <div className="flex justify-between mb-4">
      <span className="font-semibold text-black">Hostel Fees:</span>
      <span className="font-bold text-black">₹ 3000</span>
    </div>
    <div className="flex justify-between mb-4">
      <span className="font-semibold text-black">Due Date:</span>
      <span className="font-bold text-black">18th July 2025</span>
    </div>
    <div className="flex justify-between mb-4">
      <span className="font-semibold text-black">Amount :</span>
      <span className="font-bold text-black">₹ 3000</span>
    </div>
    <div className="flex justify-between mb-6">
      <span className="font-semibold text-black">Status:</span>
      <span className="font-bold text-red-600">Overdue</span>
    </div>
    <div className="flex justify-center">
      <button
        onClick={() => setShowModal(true)}
        className="bg-[#BEC5AD] px-6 py-2 rounded-md text-black font-semibold shadow-md"
      >
        Pay Now
      </button>
    </div>
  </div>
</div>


{/* Payment History Table */}
<div className="bg-white rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.2)] focus:outline-none p-6 max-w-4xl ml-0">
  <h3 className="text-md font-semibold mb-4 text-[#2c2c2c]">Payment History</h3>
  <div className="overflow-x-auto">
    <table className="w-full text-sm text-center border-separate border-spacing-y-2">
      <thead>
        <tr className="bg-gray-200 rounded-md h-12 text-gray-700">
          <th className="px-4 py-3 rounded-tl-md">Date</th>
          <th className="px-4 py-3">Amount (INR)</th>
          <th className="px-4 py-3">Email ID</th>
          <th className="px-4 py-3 rounded-tr-md">Status</th>
        </tr>
      </thead>
      <tbody>
        {paymentHistory.map((item, idx) => (
          <tr key={idx} className="text-gray-800">
            <td className="py-2 px-4">{item.date}</td>
            <td className="py-2 px-4">{item.amount}</td>
            <td className="py-2 px-4">{item.email}</td>
            <td className="py-2 px-4 text-green-600 font-medium">{item.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


      </div>

      {/* Payment Modal */}
      <PaymentModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
