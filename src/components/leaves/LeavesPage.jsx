'use client';

import api from '@/lib/api';
import React, { useEffect, useState } from 'react';

export default function LeavesPage() {
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const studentId = typeof window !== 'undefined' ? localStorage.getItem('studentId') : null;

  const fetchLeaveHistory = async () => {
    try {
      const res = await api.get(`/leaves/${studentId}`);
      setLeaveHistory(res.data.leaves);
    } catch (err) {
      console.error('Error fetching leave history:', err);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!leaveType || !startDate || !endDate || !reason) return alert('All fields are required');

    setLoading(true);
    try {
      await api.post('/leave', {
        studentId,
        leaveType,
        startDate,
        endDate,
        reason,
      });
      alert('Leave applied successfully');
      setLeaveType('');
      setStartDate('');
      setEndDate('');
      setReason('');
      fetchLeaveHistory();
    } catch (err) {
      console.error('Apply leave error:', err);
      alert('Failed to apply for leave');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchLeaveHistory();
    }
  }, [studentId]);

  return (
    <div className="w-full bg-white pt-1 pb-6 sm:pb-10 px-3 sm:px-4 text-black">
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black border-l-4 border-red-600 pl-2 mb-4 sm:mb-6">
        Leaves
      </h2>

      {/* Leave Application Form */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.25)] mb-6 sm:mb-10 w-full max-w-xl lg:mx-0 lg:ml-0">
        {/* Header */}
        <div className="bg-[#A4B494] rounded-t-lg sm:rounded-t-xl px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 font-semibold text-sm sm:text-base md:text-lg">
          Leave Application Form
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-5 px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
          <div>
            <label className="block mb-1 text-xs sm:text-sm font-semibold text-gray-800">Leave Type</label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 rounded-md shadow-md border border-gray-300 text-xs sm:text-sm"
            >
              <option value="">Select Leave Type</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Vacation">Vacation</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 flex-1">
              <label className="text-xs sm:text-sm font-semibold whitespace-nowrap">Start Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full sm:w-auto px-2 sm:px-3 py-1.5 sm:py-2 rounded-md shadow-md border border-gray-300 text-xs sm:text-sm"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 flex-1">
              <label className="text-xs sm:text-sm font-semibold whitespace-nowrap">End Date:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full sm:w-auto px-2 sm:px-3 py-1.5 sm:py-2 rounded-md shadow-md border border-gray-300 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
            <label className="text-xs sm:text-sm font-semibold sm:pt-2 whitespace-nowrap">Reason For Leave:</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 rounded-lg shadow-md h-16 sm:h-20 resize-none border border-gray-300 text-xs"
            />
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#BEC5AD] text-black px-4 sm:px-6 md:px-8 py-1.5 sm:py-2 rounded-md shadow hover:opacity-90 text-xs sm:text-sm font-medium w-full sm:w-auto"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>

      {/* Leave History */}
      <div className="bg-white min-h-[280px] sm:min-h-[340px] rounded-lg sm:rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.25)] px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 w-full max-w-6xl lg:mx-0 lg:ml-0">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">
          Leave History
        </h3>

        {/* Desktop Table - Unchanged */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm text-gray-800 min-w-full">
            <thead className="bg-gray-200 text-left">
              <tr>
                <th className="p-3 font-semibold">Leave Type</th>
                <th className="p-3 font-semibold">Start Date</th>
                <th className="p-3 font-semibold">End Date</th>
                <th className="p-3 font-semibold">Reason</th>
                <th className="p-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveHistory.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No leave records found.
                  </td>
                </tr>
              ) : (
                leaveHistory.map((leave, index) => (
                  <tr key={index} className="bg-white border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3">{leave.leaveType}</td>
                    <td className="p-3">{new Date(leave.startDate).toLocaleDateString()}</td>
                    <td className="p-3">{new Date(leave.endDate).toLocaleDateString()}</td>
                    <td className="p-3">{leave.reason}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${leave.status === 'approved' ? 'bg-green-500 text-white' :
                        leave.status === 'rejected' ? 'bg-red-500 text-white' :
                          'bg-yellow-400 text-black'
                        }`}>
                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards - Optimized */}
        {leaveHistory.map((leave, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-gray-800 text-xs">{leave.leaveType}</h4>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${leave.status === 'approved' ? 'bg-green-500 text-white' :
                  leave.status === 'rejected' ? 'bg-red-500 text-white' :
                    'bg-yellow-400 text-black'
                }`}>
                {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
              </span>
            </div>
            <div className="space-y-1.5 text-[10px]">
              <div className="flex justify-between"><span className="text-gray-600">Start Date:</span><span className="font-medium text-gray-800">{new Date(leave.startDate).toLocaleDateString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">End Date:</span><span className="font-medium text-gray-800">{new Date(leave.endDate).toLocaleDateString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Reason:</span><span className="font-medium text-gray-800">{leave.reason}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
