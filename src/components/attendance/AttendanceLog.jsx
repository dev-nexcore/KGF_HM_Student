'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { 
  Calendar, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Download, 
  Filter, 
  Search,
  ArrowRight,
  TrendingUp,
  Map
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function AttendanceLog() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMonth, setFilterMonth] = useState("all");

  useEffect(() => {
    const id = localStorage.getItem('studentId');
    if (id) setStudentId(id);
  }, []);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!studentId) return;
      try {
        setLoading(true);
        const res = await api.get(`/attendance-log/${studentId}`);
        if (res.data?.attendanceLog) {
          const sorted = [...res.data.attendanceLog].sort((a, b) => new Date(b.checkInDate) - new Date(a.checkInDate));
          setLogs(sorted);
          setFilteredLogs(sorted);
        }
      } catch (err) {
        toast.error("Failed to load attendance records");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [studentId]);

  useEffect(() => {
    let result = logs;
    if (searchTerm) {
      result = result.filter(log => 
        new Date(log.checkInDate).toLocaleDateString().includes(searchTerm) ||
        (log.checkOutDate && new Date(log.checkOutDate).toLocaleDateString().includes(searchTerm))
      );
    }
    if (filterMonth !== "all") {
      result = result.filter(log => new Date(log.checkInDate).getMonth().toString() === filterMonth);
    }
    setFilteredLogs(result);
  }, [searchTerm, filterMonth, logs]);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Attendance & Movement Report", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated for Student ID: ${studentId}`, 14, 28);
    doc.text(`Date: ${new Date().toLocaleString()}`, 14, 33);

    const rows = filteredLogs.map(log => [
      new Date(log.checkInDate).toLocaleDateString('en-GB'),
      new Date(log.checkInDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      log.checkOutDate ? new Date(log.checkOutDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'STILL IN',
      log.checkOutDate ? 'Completed' : 'Active'
    ]);

    autoTable(doc, {
      head: [['Date', 'Check-In', 'Check-Out', 'Status']],
      body: rows,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [122, 139, 94], fontStyle: 'bold' },
    });

    doc.save(`KGF_Attendance_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 animate-pulse">
      <div className="w-12 h-12 border-4 border-[#7A8B5E] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-[10px] font-black text-[#7A8B5E] uppercase tracking-widest">Scanning Records...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* ── Header & Stats ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-6 bg-[#7A8B5E] rounded-full"></div>
            <h2 className="text-2xl font-black text-[#1A1F16] tracking-tight uppercase italic">Movement Analytics</h2>
          </div>
          <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest">Tracking your secure entry and exit points</p>
        </div>
        
        <div className="bg-white rounded-[32px] p-6 shadow-2xl shadow-[#7A8B5E]/5 border border-[#7A8B5E]/5 flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-[#7A8B5E]/10 text-[#7A8B5E] flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Total Logs</p>
            <p className="text-2xl font-black text-[#1A1F16]">{logs.length}</p>
          </div>
        </div>
      </div>

      {/* ── Filters & Controls ── */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative group flex-1 sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A8B5E] opacity-50 group-focus-within:opacity-100 transition-opacity" size={16} />
            <input 
              type="text" 
              placeholder="Search by date..."
              className="w-full pl-12 pr-6 py-3.5 rounded-2xl bg-white border border-[#7A8B5E]/10 focus:border-[#7A8B5E]/30 outline-none text-xs font-bold transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-6 py-3.5 rounded-2xl bg-white border border-[#7A8B5E]/10 text-[10px] font-black uppercase tracking-widest text-[#7A8B5E] outline-none shadow-sm"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
          >
            <option value="all">All Time</option>
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
              <option key={i} value={i.toString()}>{m}</option>
            ))}
          </select>
        </div>

        <button 
          onClick={exportPDF}
          className="w-full lg:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-[#1A1F16] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-black/10 hover:bg-[#2A3324] transition-all"
        >
          <Download size={16} /> Export Dossier
        </button>
      </div>

      {/* ── Log Table ── */}
      <div className="bg-white rounded-[40px] shadow-2xl shadow-[#7A8B5E]/5 border border-[#7A8B5E]/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8FAF5]/50 border-b border-[#7A8B5E]/5">
                <th className="px-8 py-6 text-left text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em]">Timestamp</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em]">Check-In Details</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em]">Check-Out Details</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#7A8B5E]/5">
              {filteredLogs.map((log, idx) => (
                <tr key={idx} className="group hover:bg-[#F8FAF5]/30 transition-all">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#F8FAF5] text-[#7A8B5E] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-[#1A1F16]">
                          {new Date(log.checkInDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                        <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest opacity-60">Activity Date</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-[#7A8B5E] font-black text-xs uppercase tracking-tight">
                        <Clock size={14} />
                        {new Date(log.checkInDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-[#6B7280] opacity-60">
                        <Map size={12} /> {log.checkInLocation?.lat?.toFixed(3)}, {log.checkInLocation?.lng?.toFixed(3)}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {log.checkOutDate ? (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-[#C5A059] font-black text-xs uppercase tracking-tight">
                          <Clock size={14} />
                          {new Date(log.checkOutDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-[#6B7280] opacity-60">
                          <Map size={12} /> {log.checkOutLocation?.lat?.toFixed(3)}, {log.checkOutLocation?.lng?.toFixed(3)}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                        <span className="text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full">Stationary Inside</span>
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      log.checkOutDate ? 'bg-gray-50 text-gray-500 border-gray-100' : 'bg-green-50 text-green-600 border-green-100'
                    }`}>
                      {log.checkOutDate ? <XCircle size={12} /> : <CheckCircle size={12} />}
                      {log.checkOutDate ? 'Archived' : 'Active'}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center">
                    <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest opacity-40 italic">No movement dossiers found matching your criteria</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
