'use client';
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import PaymentModal from './PaymentModal';
import { toast } from 'react-hot-toast';

export default function FeesStatus() {
  const [showModal, setShowModal] = useState(false);
  const [currentFees, setCurrentFees] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [studentProfile, setStudentProfile] = useState(null);
  const [ready, setReady] = useState(false);
  const [selectedFeeAmount, setSelectedFeeAmount] = useState(null);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Profile to get Email
        const profileRes = await api.get('/profile');
        setStudentProfile(profileRes.data);
console.log(profileRes.data)
        // 2. Fetch Fees Status
        const feesRes = await api.get('/feeStatus');
        const allFees = feesRes.data.fees || [];
        
        // Filter into Current (unpaid/overdue) and History (paid)
        const current = allFees.filter(f => f.status !== 'paid');
        const history = allFees.filter(f => f.status === 'paid');
        
        setCurrentFees(current);
        setPaymentHistory(history);
        
      } catch (err) {
        console.error("Error fetching fee data:", err);
        setError('Failed to fetch fee status. Please try again later.');
        toast.error('Could not load fee data');
      } finally {
        setLoading(false);
      }
    };

    if (ready) {
      fetchData();
    }
  }, [ready]);

  if (!ready) return null;

  return (
    <div className="w-full min-h-screen bg-white pt-2 pb-6 sm:pb-10 sm:px-2.5 dark:bg-white overflow-hidden">
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black border-l-4 border-[#4F8CCF] pl-2 mb-4 sm:mb-6">
        Fees Status
      </h2>

      {/* Current Fees Status Card */}
      <div className="bg-white rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.2)] focus:outline-none overflow-hidden w-full max-w-2xl min-h-[400px] mb-6 sm:mb-8">
        <div className="bg-[#A4B494] px-6 sm:px-8 py-4 sm:py-5">
          <h3 className="text-lg sm:text-xl font-bold text-black">Current Fees Status</h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-80 text-gray-600">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A4B494]"></div>
            <span className="ml-3">Loading fees...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-80 text-red-600 px-6 text-center">{error}</div>
        ) : currentFees.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-80 text-gray-500">
            <p className="text-lg font-medium">All dues cleared!</p>
            <p className="text-sm">No pending fees at the moment.</p>
          </div>
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
                    {new Date(fee.dueDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-black">Amount:</span>
                  <span className="font-medium text-black text-xl font-bold">₹ {fee.amount?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-black">Status:</span>
                  <span className={`font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider ${
                    fee.status === 'overdue' ? 'bg-red-100 text-red-700' :
                    fee.status === 'unpaid' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
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
                  className="bg-[#A4B494] hover:bg-[#8fa082] px-12 py-3 rounded-xl text-black font-bold shadow-lg transition-all active:scale-95"
                >
                  Pay Now
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Payment History Table */}
      <div className="bg-white rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.1)] w-full max-w-7xl overflow-hidden">
        <div className="p-5 sm:p-8">
          <h3 className="text-lg sm:text-xl font-bold mb-6 text-black flex items-center gap-2">
            Payment History
          </h3>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left p-4 font-bold text-gray-600">Date</th>
                  <th className="text-left p-4 font-bold text-gray-600">Fee Type</th>
                  <th className="text-left p-4 font-bold text-gray-600">Amount (₹)</th>
                  <th className="text-left p-4 font-bold text-gray-600">Reference</th>
                  <th className="text-left p-4 font-bold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-10 text-gray-400">No payment records found</td>
                  </tr>
                ) : (
                  paymentHistory.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 text-gray-700 font-medium">
                        {new Date(item.updatedAt || item.dueDate).toLocaleDateString('en-IN')}
                      </td>
                      <td className="p-4 text-gray-700">{item.feeType}</td>
                      <td className="p-4 text-gray-900 font-bold">₹{item.amount?.toLocaleString('en-IN')}</td>
                      <td className="p-4 text-gray-500 text-sm">{studentProfile?.email}</td>
                      <td className="p-4">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                          Paid
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="sm:hidden space-y-4">
            {paymentHistory.length === 0 ? (
              <p className="text-center py-10 text-gray-400">No payment records found</p>
            ) : (
              paymentHistory.map((item, idx) => (
                <div key={idx} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Date</p>
                      <p className="text-sm font-bold text-gray-900">{new Date(item.updatedAt || item.dueDate).toLocaleDateString('en-IN')}</p>
                    </div>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-[10px] font-bold uppercase">
                      Paid
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Type</p>
                      <p className="text-sm font-medium">{item.feeType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Amount</p>
                      <p className="text-sm font-black text-gray-900">₹{item.amount?.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
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