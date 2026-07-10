'use client';
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function FeesStatus() {
  const [currentFees, setCurrentFees] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [studentProfile, setStudentProfile] = useState(null);
  const [ready, setReady] = useState(false);

  // Search, Filter, Pagination States
  const [currentSearch, setCurrentSearch] = useState('');
  const [currentFilter, setCurrentFilter] = useState('All');
  const [currentFeesPage, setCurrentFeesPage] = useState(1);

  const [historySearch, setHistorySearch] = useState('');
  const [historyFilter, setHistoryFilter] = useState('All');
  const [historyPage, setHistoryPage] = useState(1);

  const itemsPerPage = 5;

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

  // Derived Data for Current Fees
  const filteredCurrentFees = currentFees.filter(fee => {
    const matchesSearch = fee.feeType.toLowerCase().includes(currentSearch.toLowerCase());
    const matchesFilter = currentFilter === 'All' || fee.status.toLowerCase() === currentFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });
  const paginatedCurrentFees = filteredCurrentFees.slice((currentFeesPage - 1) * itemsPerPage, currentFeesPage * itemsPerPage);
  const currentTotalPages = Math.ceil(filteredCurrentFees.length / itemsPerPage);

  // Derived Data for History Fees
  const uniqueHistoryFeeTypes = ["All", ...new Set(paymentHistory.map(f => f.feeType))];
  const filteredHistoryFees = paymentHistory.filter(fee => {
    const matchesSearch = fee.feeType.toLowerCase().includes(historySearch.toLowerCase());
    const matchesFilter = historyFilter === 'All' || fee.feeType === historyFilter;
    return matchesSearch && matchesFilter;
  });
  const paginatedHistoryFees = filteredHistoryFees.slice((historyPage - 1) * itemsPerPage, historyPage * itemsPerPage);
  const historyTotalPages = Math.ceil(filteredHistoryFees.length / itemsPerPage);

  return (
    <main className="bg-[#ffffff] px-6 sm:px-8 lg:px-2.5 py-2 min-h-screen font-sans pb-10">
      <div className="max-w-7xl mx-auto space-y-6 mt-4">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-black border-l-4 border-[#4F8CCF] pl-2">
          Fees Status
        </h2>

        {/* Current Fees Status Card */}
        <div className="bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.2)] focus:outline-none w-full">
          <div className="bg-[#AAB491] px-6 py-3 rounded-t-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="text-lg font-semibold text-black">Current Fees Status</h2>
            <div className="flex gap-3 w-full sm:w-auto">
              <input 
                type="text" 
                placeholder="Search fee type..." 
                className="px-3 py-1.5 rounded-md border border-gray-300 text-sm w-full sm:w-48 focus:outline-none focus:border-[#8b9674] text-black"
                value={currentSearch}
                onChange={(e) => { setCurrentSearch(e.target.value); setCurrentFeesPage(1); }}
              />
              <select 
                className="px-3 py-1.5 rounded-md border border-gray-300 text-sm focus:outline-none focus:border-[#8b9674] text-black"
                value={currentFilter}
                onChange={(e) => { setCurrentFilter(e.target.value); setCurrentFeesPage(1); }}
              >
                <option value="All">All Status</option>
                <option value="unpaid">Unpaid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
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
          <>
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto p-5 sm:p-8">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left p-4 font-bold text-gray-600">Fee Type</th>
                    <th className="text-left p-4 font-bold text-gray-600">Due Date</th>
                    <th className="text-left p-4 font-bold text-gray-600">Amount (₹)</th>
                    <th className="text-left p-4 font-bold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCurrentFees.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center p-8 text-gray-500">No matching fees found</td>
                    </tr>
                  ) : (
                    paginatedCurrentFees.map((fee, idx) => (
                      <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 text-gray-700">{fee.feeType}</td>
                        <td className="p-4 text-gray-700 font-medium">
                          {new Date(fee.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </td>
                        <td className="p-4 text-gray-900 font-bold">₹ {fee.amount?.toLocaleString('en-IN')}</td>
                        <td className="p-4">
                          <span className={`font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider ${
                            fee.status === 'overdue' ? 'bg-red-100 text-red-700' :
                            fee.status === 'unpaid' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {fee.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="sm:hidden space-y-4 p-5 sm:p-8">
              {paginatedCurrentFees.length === 0 ? (
                <p className="text-center p-8 text-gray-500">No matching fees found</p>
              ) : (
                paginatedCurrentFees.map((fee, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Due Date</p>
                        <p className="text-sm font-bold text-gray-900">
                          {new Date(fee.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        fee.status === 'overdue' ? 'bg-red-100 text-red-700' :
                        fee.status === 'unpaid' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {fee.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Type</p>
                        <p className="text-sm font-medium">{fee.feeType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Amount</p>
                        <p className="text-sm font-black text-gray-900">₹ {fee.amount?.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination Controls for Current Fees */}
            {currentTotalPages > 1 && (
              <div className="flex justify-end items-center space-x-2 p-5 sm:p-8 border-t border-gray-100">
                <button 
                  onClick={() => setCurrentFeesPage(p => Math.max(1, p - 1))} 
                  disabled={currentFeesPage === 1}
                  className="px-3 py-1 rounded bg-gray-100 text-gray-600 disabled:opacity-50 hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Prev
                </button>
                <span className="text-sm text-gray-600 font-medium">
                  Page {currentFeesPage} of {currentTotalPages}
                </span>
                <button 
                  onClick={() => setCurrentFeesPage(p => Math.min(currentTotalPages, p + 1))} 
                  disabled={currentFeesPage === currentTotalPages}
                  className="px-3 py-1 rounded bg-gray-100 text-gray-600 disabled:opacity-50 hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Payment History Table */}
      <div className="bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.2)] focus:outline-none w-full overflow-hidden">
        <div className="bg-[#AAB491] px-6 py-3 rounded-t-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-lg font-semibold text-black">Payment History</h2>
          <div className="flex gap-3 w-full sm:w-auto">
            <input 
              type="text" 
              placeholder="Search history..." 
              className="px-3 py-1.5 rounded-md border border-gray-300 text-sm w-full sm:w-48 focus:outline-none focus:border-[#8b9674] text-black"
              value={historySearch}
              onChange={(e) => { setHistorySearch(e.target.value); setHistoryPage(1); }}
            />
            <select 
              className="px-3 py-1.5 rounded-md border border-gray-300 text-sm focus:outline-none focus:border-[#8b9674] text-black"
              value={historyFilter}
              onChange={(e) => { setHistoryFilter(e.target.value); setHistoryPage(1); }}
            >
              {uniqueHistoryFeeTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'All' ? 'All Fee Types' : type}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="p-5 sm:p-8">

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
                ) : paginatedHistoryFees.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-10 text-gray-500">No matching history found</td>
                  </tr>
                ) : (
                  paginatedHistoryFees.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 text-gray-700 font-medium">
                        {new Date(item.updatedAt || item.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
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
            ) : paginatedHistoryFees.length === 0 ? (
              <p className="text-center py-10 text-gray-500">No matching history found</p>
            ) : (
              paginatedHistoryFees.map((item, idx) => (
                <div key={idx} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Date</p>
                      <p className="text-sm font-bold text-gray-900">{new Date(item.updatedAt || item.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
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

          {/* Pagination Controls for History */}
          {historyTotalPages > 1 && (
            <div className="flex justify-end items-center space-x-2 mt-4 pt-4 border-t border-gray-100">
              <button 
                onClick={() => setHistoryPage(p => Math.max(1, p - 1))} 
                disabled={historyPage === 1}
                className="px-3 py-1 rounded bg-gray-100 text-gray-600 disabled:opacity-50 hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Prev
              </button>
              <span className="text-sm text-gray-600 font-medium">
                Page {historyPage} of {historyTotalPages}
              </span>
              <button 
                onClick={() => setHistoryPage(p => Math.min(historyTotalPages, p + 1))} 
                disabled={historyPage === historyTotalPages}
                className="px-3 py-1 rounded bg-gray-100 text-gray-600 disabled:opacity-50 hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      </div>
    </main>
  );
}