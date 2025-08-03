'use client';

import api from '@/lib/api';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

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
      const res = await api.get(`/leaves`);
      setLeaveHistory(res.data.leaves);
    } catch (err) {
      console.error('Error fetching leave history:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!leaveType || !startDate || !endDate || !reason) return alert('All fields are required');
    
      console.log("Token from localStorage:", localStorage.getItem("token"));

    setLoading(true);
    try {
      await api.post('/leave', {
        leaveType,
        startDate,
        endDate,
        reason,
      });
      toast.success('Applied for leave');
      setLeaveType('');
      setStartDate('');
      setEndDate('');
      setReason('');
      fetchLeaveHistory();
    } catch (err) {
      console.error('Apply leave error:', err);
      toast.error('Failed to apply for leave');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchLeaveHistory();
    }
  }, [studentId]);


  useEffect(() => {
    const markSeen = async () => {
      try {
        await api.post('/notifications/mark-seen', { type: 'leave' });
      } catch (err) {
        console.error("Failed to mark notices seen", err);
      }
    };
    markSeen();
  }, []);

  return (
    <div className="w-full bg-white pt-1 pb-6 sm:pb-10 px-3 sm:px-4 text-black">
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black border-l-4 border-[#4F8CCF] pl-2 mb-4 sm:mb-6">
        Leaves
      </h2>

      {/* Leave Application Form */}
      <div className="mt-[-10px] ml-0.5">
        <div className="bg-white rounded-lg sm:rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.25)] mb-6 sm:mb-10 w-full ">
          <div className="bg-[#A4B494] rounded-t-lg sm:rounded-t-xl px-6 sm:px-8 md:px-10 py-4 sm:py-5 font-semibold text-base sm:text-lg md:text-xl">
            Leave Application Form
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 sm:space-y-6 md:space-y-8 px-6 sm:px-8 md:px-10 py-6 sm:py-8 md:py-10"
          >
            <div>
              <label className="block mb-2 text-sm sm:text-base font-semibold text-gray-800">
                Leave Type
              </label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full px-4 py-3 rounded-md shadow-md border border-gray-300 text-sm sm:text-base"
              >
                <option value="">Select Leave Type</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Vacation">Vacation</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
                <label className="text-sm sm:text-base font-semibold whitespace-nowrap">
                  Start Date:
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 rounded-md shadow-md border border-gray-300 text-sm sm:text-base"
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
                <label className="text-sm sm:text-base font-semibold whitespace-nowrap">
                  End Date:
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 rounded-md shadow-md border border-gray-300 text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
              <label className="text-sm sm:text-base font-semibold sm:pt-2 whitespace-nowrap">
                Reason For Leave:
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={8}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-md h-full sm:h-full resize-none border border-gray-300 text-sm sm:text-base md:text-lg"
                required
              />
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#BEC5AD] text-black px-6 sm:px-8 py-2.5 sm:py-3 rounded-md shadow hover:opacity-90 text-sm sm:text-base font-medium w-full sm:w-auto"
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Leave History */}
      <div className="bg-white min-h-[400px] sm:min-h-[450px] rounded-lg sm:rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.25)] px-6 sm:px-8 md:px-10 py-6 sm:py-8 md:py-10 w-full">
        <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-6 sm:mb-8 text-gray-800">
          Leave History
        </h3>

        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-base text-gray-800 min-w-full">
            <thead className="bg-gray-200 text-left">
              <tr>
                <th className="p-5 font-semibold text-lg">Leave Type</th>
                <th className="p-5 font-semibold text-lg">Reason</th>
                <th className="p-5 font-semibold text-lg">Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveHistory.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-8 text-gray-500 text-base">
                    No leave records found.
                  </td>
                </tr>
              ) : (
                leaveHistory.map((leave, index) => (
                  <tr key={index} className="bg-white border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-5 text-base font-medium">{leave.leaveType}</td>
                    <td className="p-5 text-base">{leave.reason}</td>
                    <td className="p-5">
                      <span
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          leave.status === 'approved'
                            ? 'bg-green-500 text-white'
                            : leave.status === 'rejected'
                            ? 'bg-red-500 text-white' 
                            : 'bg-[#4F8DCF] text-white'
                        }`}
                      > 
                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
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
          {leaveHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-base">
              No leave records found.
            </div>
          ) : (
            leaveHistory.map((leave, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-semibold text-gray-600">Leave Type:</span>
                    <span className="text-base font-medium text-gray-800">{leave.leaveType}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-semibold text-gray-600">Reason:</span>
                    <span className="text-base text-gray-800 text-right max-w-[60%]">{leave.reason}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-600">Status:</span>
                    <span
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        leave.status === 'approved'
                          ? 'bg-green-500 text-white'
                          : leave.status === 'rejected'
                          ? 'bg-red-500 text-white' 
                          : 'bg-[#4F8DCF] text-white'
                      }`}
                    > 
                      {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}