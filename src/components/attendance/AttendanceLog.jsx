'use client';
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { FiClock, FiCalendar, FiMapPin, FiCamera, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export default function AttendanceLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState(null);

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
        if (res.data && res.data.attendanceLog) {
          // Sort by date descending
          const sortedLogs = [...res.data.attendanceLog].sort((a, b) => 
            new Date(b.checkInDate) - new Date(a.checkInDate)
          );
          setLogs(sortedLogs);
        }
      } catch (err) {
        console.error("Error fetching attendance logs:", err);
        toast.error("Failed to load attendance logs");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [studentId]);

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="w-full min-h-screen bg-white pt-2 pb-10 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-black border-l-4 border-[#4F8CCF] pl-3 mb-8">
          Attendance & Movement Log
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4F8CCF] mb-4"></div>
            <p className="text-gray-500">Fetching logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
            <FiCalendar className="mx-auto text-4xl text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No attendance records found yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="p-4 font-bold text-gray-600 text-sm">Date</th>
                    <th className="p-4 font-bold text-gray-600 text-sm">Check-In</th>
                    <th className="p-4 font-bold text-gray-600 text-sm">Check-Out</th>
                    <th className="p-4 font-bold text-gray-600 text-sm">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {logs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="text-gray-400" />
                          <span className="font-semibold text-gray-800">
                            {new Date(log.checkInDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-blue-600">
                            {new Date(log.checkInDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                          </span>
                          <span className="text-[10px] text-gray-400 flex items-center gap-1">
                            <FiMapPin /> {log.checkInLocation?.lat?.toFixed(4)}, {log.checkInLocation?.lng?.toFixed(4)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        {log.checkOutDate ? (
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-orange-600">
                              {new Date(log.checkOutDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                            </span>
                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                              <FiMapPin /> {log.checkOutLocation?.lat?.toFixed(4)}, {log.checkOutLocation?.lng?.toFixed(4)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded">Currently Inside</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          log.checkOutDate ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'
                        }`}>
                          {log.checkOutDate ? <FiXCircle /> : <FiCheckCircle />}
                          {log.checkOutDate ? 'Completed' : 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View - Card Layout */}
            <div className="md:hidden space-y-4">
              {logs.map((log, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-black text-gray-800 flex items-center gap-2">
                      <FiCalendar className="text-blue-500" />
                      {new Date(log.checkInDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      log.checkOutDate ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'
                    }`}>
                      {log.checkOutDate ? 'Out' : 'In'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50/50 p-3 rounded-xl">
                      <p className="text-[10px] font-bold text-blue-500 uppercase mb-1">Check-In</p>
                      <p className="text-sm font-black text-blue-700">
                        {new Date(log.checkInDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                      </p>
                    </div>
                    <div className={`${log.checkOutDate ? 'bg-orange-50/50' : 'bg-green-50/50'} p-3 rounded-xl`}>
                      <p className={`text-[10px] font-bold uppercase mb-1 ${log.checkOutDate ? 'text-orange-500' : 'text-green-500'}`}>
                        Check-Out
                      </p>
                      <p className={`text-sm font-black ${log.checkOutDate ? 'text-orange-700' : 'text-green-700'}`}>
                        {log.checkOutDate 
                          ? new Date(log.checkOutDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
                          : 'Active'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
