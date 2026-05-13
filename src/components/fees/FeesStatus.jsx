'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import PaymentModal from './PaymentModal';
import { toast, Toaster } from 'react-hot-toast';
import { 
  CreditCard, 
  History, 
  Calendar, 
  ArrowRight, 
  Download, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Receipt,
  Search
} from 'lucide-react';

export default function FeesStatus() {
  const [showModal, setShowModal] = useState(false);
  const [currentFees, setCurrentFees] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [studentProfile, setStudentProfile] = useState(null);
  const [selectedFeeAmount, setSelectedFeeAmount] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const profileRes = await api.get('/profile');
      setStudentProfile(profileRes.data);

      const feesRes = await api.get('/feeStatus');
      const allFees = feesRes.data.fees || [];
      
      setCurrentFees(allFees.filter(f => f.status !== 'paid'));
      setPaymentHistory(allFees.filter(f => f.status === 'paid'));
      
    } catch (err) {
      setError('System restricted: Unable to fetch ledger');
      toast.error('Ledger sync failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const exportCSV = () => {
    const headers = ["Date", "Fee Type", "Amount", "Reference", "Status"];
    const rows = paymentHistory.map(item => [
      new Date(item.updatedAt || item.dueDate).toLocaleDateString(),
      item.feeType,
      item.amount,
      studentProfile?.email || "N/A",
      "PAID"
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KGF_Receipts_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredHistory = paymentHistory.filter(item => 
    item.feeType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.updatedAt && new Date(item.updatedAt).toLocaleDateString().includes(searchTerm))
  );

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Toaster position="top-right" />
      
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-6 bg-[#7A8B5E] rounded-full"></div>
            <h2 className="text-2xl font-black text-[#1A1F16] tracking-tight uppercase italic">Financial Ledger</h2>
          </div>
          <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest">Monitor dues and transaction history</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white rounded-[32px] px-8 py-4 shadow-2xl shadow-[#7A8B5E]/5 border border-[#7A8B5E]/5 flex items-center gap-6">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black text-[#6B7280] uppercase tracking-widest">Total Paid</p>
              <p className="text-lg font-black text-[#1A1F16]">₹{paymentHistory.reduce((acc, curr) => acc + (curr.amount || 0), 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* ── Pending Dues Card ── */}
        <div className="xl:col-span-5">
          <div className="bg-white rounded-[40px] shadow-2xl shadow-[#7A8B5E]/5 border border-[#7A8B5E]/5 overflow-hidden">
            <div className="bg-[#1A1F16] p-8 text-white flex justify-between items-center">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3 italic">
                <CreditCard size={18} className="text-[#7A8B5E]" /> Outstanding Dues
              </h3>
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-[#7A8B5E]"></div>
                <div className="w-1 h-1 rounded-full bg-[#7A8B5E]/50"></div>
                <div className="w-1 h-1 rounded-full bg-[#7A8B5E]/20"></div>
              </div>
            </div>

            <div className="p-10">
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center opacity-40">
                  <div className="w-10 h-10 border-4 border-[#7A8B5E] border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-[10px] font-black uppercase tracking-widest">Querying database...</p>
                </div>
              ) : currentFees.length === 0 ? (
                <div className="py-20 text-center">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 shadow-lg shadow-green-500/10">
                    <CheckCircle size={32} />
                  </div>
                  <h4 className="text-xl font-black text-[#1A1F16] uppercase italic mb-2">Account Balanced</h4>
                  <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest">All current dues are settled</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {currentFees.map((fee, idx) => (
                    <div key={idx} className="bg-[#F8FAF5]/50 rounded-[32px] p-8 border border-[#7A8B5E]/5 relative group">
                      <div className="absolute top-8 right-8">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          fee.status === 'overdue' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          {fee.status}
                        </span>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest mb-1">Billing Period</p>
                          <h4 className="text-lg font-black text-[#1A1F16] uppercase italic">{fee.feeType}</h4>
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#7A8B5E]/5">
                          <div>
                            <p className="text-[9px] font-black text-[#6B7280] uppercase tracking-widest mb-1">Due Date</p>
                            <div className="flex items-center gap-2 text-sm font-black text-[#1A1F16]">
                              <Calendar size={14} className="text-[#7A8B5E]" />
                              {new Date(fee.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </div>
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-[#6B7280] uppercase tracking-widest mb-1">Amount</p>
                            <p className="text-2xl font-black text-[#1A1F16]">₹{fee.amount?.toLocaleString()}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedFeeAmount(fee.amount);
                            setShowModal(true);
                          }}
                          className="w-full bg-[#7A8B5E] text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-[#7A8B5E]/20 flex items-center justify-center gap-3 hover:bg-[#6A7B4E] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                          Initialize Payment <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Payment History ── */}
        <div className="xl:col-span-7 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
            <h3 className="text-sm font-black text-[#6B7280] uppercase tracking-[0.2em] flex items-center gap-3 italic">
              <History size={18} className="text-[#7A8B5E]" /> Transaction Vault
            </h3>
            
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A8B5E] opacity-50" size={14} />
                <input 
                  type="text" 
                  placeholder="Filter history..."
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-[#7A8B5E]/10 outline-none text-[10px] font-black uppercase tracking-widest transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                onClick={exportCSV}
                className="p-3 bg-white rounded-2xl border border-[#7A8B5E]/10 text-[#7A8B5E] hover:bg-[#7A8B5E] hover:text-white transition-all shadow-sm"
              >
                <Download size={18} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[40px] shadow-2xl shadow-[#7A8B5E]/5 border border-[#7A8B5E]/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F8FAF5]/50 border-b border-[#7A8B5E]/5">
                    <th className="px-8 py-6 text-left text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em]">Settled Date</th>
                    <th className="px-8 py-6 text-left text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em]">Transaction</th>
                    <th className="px-8 py-6 text-left text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em]">Amount</th>
                    <th className="px-8 py-6 text-left text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#7A8B5E]/5">
                  {filteredHistory.map((item, idx) => (
                    <tr key={idx} className="group hover:bg-[#F8FAF5]/30 transition-all">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shadow-sm">
                            <Receipt size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-[#1A1F16]">
                              {new Date(item.updatedAt || item.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </p>
                            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest opacity-60">Verified</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <h4 className="text-sm font-black text-[#1A1F16] uppercase italic mb-1">{item.feeType}</h4>
                        <p className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest truncate max-w-[150px]">ID: {item._id?.slice(-8).toUpperCase()}</p>
                      </td>
                      <td className="px-8 py-6 text-sm font-black text-[#1A1F16]">₹{item.amount?.toLocaleString()}</td>
                      <td className="px-8 py-6">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-green-50 text-green-600 border border-green-100">
                          <CheckCircle size={10} /> Paid
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredHistory.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-8 py-20 text-center">
                        <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest opacity-40 italic">No historical records found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedFeeAmount(null);
          fetchData();
        }}
        amount={selectedFeeAmount}
      />
    </div>
  );
}