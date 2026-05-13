'use client';

import api from '@/lib/api';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { 
  FileText, 
  Calendar, 
  Send, 
  History, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  MoreVertical
} from 'lucide-react';

export default function LeavesPage() {
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [otherLeaveType, setOtherLeaveType] = useState("");
  const [loading, setLoading] = useState(false);
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem('studentId');
    if (id) setStudentId(id);
  }, []);

  const fetchLeaveHistory = async () => {
    try {
      const res = await api.get(`/leaves`);
      setLeaveHistory(res.data.leaves || []);
    } catch (err) {
      console.error('Error fetching leave history:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!leaveType || !startDate || !endDate || !reason) return toast.error('Please fill all mandatory fields');

    setLoading(true);
    const loadingToast = toast.loading("Submitting your application...");
    try {
      await api.post('/leave', {
        studentId,
        leaveType,
        otherLeaveType: leaveType === 'Others' ? otherLeaveType : '',
        startDate,
        endDate,
        reason,
      });
      toast.success('Leave application submitted for approval', { id: loadingToast });
      setLeaveType('');
      setStartDate('');
      setEndDate('');
      setReason('');
      fetchLeaveHistory();
    } catch (err) {
      toast.error('Failed to submit application', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) fetchLeaveHistory();
  }, [studentId]);

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Toaster position="top-right" />
      
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-6 bg-[#7A8B5E] rounded-full"></div>
            <h2 className="text-2xl font-black text-[#1A1F16] tracking-tight uppercase italic">Leave Management</h2>
          </div>
          <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest">Apply for gate pass or vacation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
        
        {/* ── Leave Application Form ── */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-[40px] shadow-2xl shadow-[#7A8B5E]/5 border border-[#7A8B5E]/5 overflow-hidden">
            <div className="bg-[#1A1F16] p-8 text-white">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3 italic">
                <FileText size={18} className="text-[#7A8B5E]" /> New Application
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Type of Leave</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-[#F8FAF5] border-2 border-transparent focus:border-[#7A8B5E]/20 focus:bg-white outline-none font-bold text-[#1A1F16] transition-all text-sm"
                >
                  <option value="">Select Category</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Vacation">Vacation</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              {leaveType === 'Others' && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                  <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Specify Reason</label>
                  <input
                    value={otherLeaveType}
                    type="text"
                    onChange={(e) => setOtherLeaveType(e.target.value)}
                    placeholder="Briefly describe..."
                    className="w-full px-6 py-4 rounded-2xl bg-[#F8FAF5] border-2 border-transparent focus:border-[#7A8B5E]/20 focus:bg-white outline-none font-bold text-[#1A1F16] transition-all text-sm"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-[#F8FAF5] border-2 border-transparent focus:border-[#7A8B5E]/20 focus:bg-white outline-none font-bold text-[#1A1F16] transition-all text-sm uppercase tracking-tight"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-[#F8FAF5] border-2 border-transparent focus:border-[#7A8B5E]/20 focus:bg-white outline-none font-bold text-[#1A1F16] transition-all text-sm uppercase tracking-tight"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">Detailed Reason</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  placeholder="Provide context for your request..."
                  className="w-full px-6 py-4 rounded-2xl bg-[#F8FAF5] border-2 border-transparent focus:border-[#7A8B5E]/20 focus:bg-white outline-none font-bold text-[#1A1F16] transition-all text-sm resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1A1F16] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-black/20 flex items-center justify-center gap-3 hover:bg-[#2A3324] transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Processing...' : <>Submit Request <Send size={16} /></>}
              </button>
            </form>
          </div>
        </div>

        {/* ── Leave History ── */}
        <div className="xl:col-span-3 space-y-6">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-sm font-black text-[#6B7280] uppercase tracking-[0.2em] flex items-center gap-3 italic">
              <History size={18} className="text-[#7A8B5E]" /> Archive & Status
            </h3>
            <div className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#7A8B5E]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#7A8B5E]/30"></div>
            </div>
          </div>

          <div className="space-y-4">
            {leaveHistory.length === 0 ? (
              <div className="bg-white rounded-[40px] p-20 text-center border border-[#7A8B5E]/5 shadow-2xl shadow-[#7A8B5E]/5">
                <AlertCircle className="mx-auto text-[#7A8B5E] opacity-20 mb-4" size={48} />
                <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em]">No previous dossiers found</p>
              </div>
            ) : (
              leaveHistory.map((leave, idx) => (
                <div key={idx} className="bg-white rounded-[32px] p-8 shadow-2xl shadow-[#7A8B5E]/5 border border-[#7A8B5E]/5 group hover:border-[#7A8B5E]/20 transition-all animate-in fade-in slide-in-from-right-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                        leave.status === 'approved' ? 'bg-green-50 text-green-600 shadow-green-500/10' :
                        leave.status === 'rejected' ? 'bg-red-50 text-red-600 shadow-red-500/10' :
                        'bg-blue-50 text-blue-600 shadow-blue-500/10'
                      }`}>
                        {leave.status === 'approved' ? <CheckCircle size={24} /> :
                         leave.status === 'rejected' ? <XCircle size={24} /> :
                         <Clock size={24} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-sm font-black text-[#1A1F16] uppercase italic">
                            {leave.leaveType === 'Others' && leave.otherLeaveType ? `Other (${leave.otherLeaveType})` : leave.leaveType}
                          </h4>
                          <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                            leave.status === 'approved' ? 'bg-green-50 text-green-600 border-green-100' :
                            leave.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                            'bg-blue-50 text-blue-600 border-blue-100'
                          }`}>
                            {leave.status}
                          </span>
                        </div>
                        <p className="text-[11px] font-bold text-[#6B7280] italic max-w-md line-clamp-1">{leave.reason}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-0 border-gray-100">
                      <div className="text-right flex-1 sm:flex-none">
                        <p className="text-[10px] font-black text-[#1A1F16] tracking-tight uppercase">
                          {new Date(leave.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} - {new Date(leave.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                        </p>
                        <p className="text-[8px] font-black text-[#6B7280] uppercase tracking-[0.2em] opacity-60">Timeline</p>
                      </div>
                      <button className="p-3 rounded-xl bg-[#F8FAF5] text-[#1A1F16] hover:bg-[#7A8B5E] hover:text-white transition-all">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}