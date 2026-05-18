'use client';

import api from '@/lib/api';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Eye, Edit2, X } from 'lucide-react';

export default function LeavesPage() {
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [otherLeaveType, setOtherLeaveType] = useState("");
  const [loading, setLoading] = useState(false);
  
  // View Modal State
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  
  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingLeave, setEditingLeave] = useState(null);
  const [editLeaveType, setEditLeaveType] = useState('');
  const [editOtherLeaveType, setEditOtherLeaveType] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editReason, setEditReason] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  
  // Filter state
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending', 'approved', 'rejected'
  
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

    setLoading(true);
    try {
      await api.post('/leave', {
        studentId: studentId,
        leaveType,
        otherLeaveType: leaveType === 'Others' ? otherLeaveType : '',
        startDate,
        endDate,
        reason,
      });
      toast.success('Applied for leave');
      setLeaveType('');
      setStartDate('');
      setEndDate('');
      setReason('');
      setOtherLeaveType('');
      fetchLeaveHistory();
    } catch (err) {
      console.error('Apply leave error:', err);
      console.error('Error response:', err.response?.data);
      toast.error('Failed to apply for leave');
    } finally {
      setLoading(false);
    }
  };

  const handleViewClick = (leave) => {
    setSelectedLeave(leave);
    setViewModalOpen(true);
  };

  const handleEditClick = (leave) => {
    setEditingLeave(leave);
    setEditLeaveType(leave.leaveType);
    setEditOtherLeaveType(leave.otherLeaveType || '');
    setEditStartDate(new Date(leave.startDate).toISOString().split('T')[0]);
    setEditEndDate(new Date(leave.endDate).toISOString().split('T')[0]);
    setEditReason(leave.reason);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editLeaveType || !editStartDate || !editEndDate || !editReason) {
      return toast.error('All fields are required');
    }

    setEditLoading(true);
    try {
      await api.put(`/leave/${editingLeave._id}`, {
        leaveType: editLeaveType,
        otherLeaveType: editLeaveType === 'Others' ? editOtherLeaveType : '',
        startDate: editStartDate,
        endDate: editEndDate,
        reason: editReason,
      });
      toast.success('Leave updated successfully. Sent for parent approval.');
      setEditModalOpen(false);
      fetchLeaveHistory();
    } catch (err) {
      console.error('Edit leave error:', err);
      toast.error(err.response?.data?.message || 'Failed to update leave');
    } finally {
      setEditLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchLeaveHistory();
    }
  }, [studentId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Calculate statistics
  const totalLeaves = leaveHistory.length;
  const pendingLeaves = leaveHistory.filter(leave => leave.status === 'pending' || leave.status === 'parent_approved').length;
  const approvedLeaves = leaveHistory.filter(leave => leave.status === 'approved').length;
  const rejectedLeaves = leaveHistory.filter(leave => leave.status === 'rejected').length;

  // Filter leave history based on selected status
  const filteredLeaveHistory = filterStatus === 'all' 
    ? leaveHistory 
    : filterStatus === 'pending'
    ? leaveHistory.filter(leave => leave.status === 'pending' || leave.status === 'parent_approved')
    : leaveHistory.filter(leave => leave.status === filterStatus);

  return (
    <div className="w-full min-h-screen bg-white pt-6 pb-6 sm:pb-10 sm:px-6 dark:bg-white overflow-hidden">
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black border-l-4 border-[#4F8CCF] pl-2 mb-4 sm:mb-9">
        Leaves
      </h2>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Total Leaves Card */}
        <button
          onClick={() => setFilterStatus('all')}
          className={`rounded-lg shadow-md p-4 text-left transition-all hover:shadow-lg ${
            filterStatus === 'all' 
              ? 'bg-blue-100 border-2 border-blue-500' 
              : 'bg-blue-50 border-2 border-transparent hover:border-blue-300'
          }`}
        >
          <div className="flex flex-col">
            <span className="text-sm font-medium text-blue-700">Total Leaves</span>
            <span className="text-3xl font-bold mt-2 text-blue-900">{totalLeaves}</span>
          </div>
        </button>

        {/* Pending Leaves Card */}
        <button
          onClick={() => setFilterStatus('pending')}
          className={`rounded-lg shadow-md p-4 text-left transition-all hover:shadow-lg ${
            filterStatus === 'pending' 
              ? 'bg-yellow-100 border-2 border-yellow-500' 
              : 'bg-yellow-50 border-2 border-transparent hover:border-yellow-300'
          }`}
        >
          <div className="flex flex-col">
            <span className="text-sm font-medium text-yellow-700">Pending</span>
            <span className="text-3xl font-bold mt-2 text-yellow-900">{pendingLeaves}</span>
          </div>
        </button>

        {/* Approved Leaves Card */}
        <button
          onClick={() => setFilterStatus('approved')}
          className={`rounded-lg shadow-md p-4 text-left transition-all hover:shadow-lg ${
            filterStatus === 'approved' 
              ? 'bg-green-100 border-2 border-green-500' 
              : 'bg-green-50 border-2 border-transparent hover:border-green-300'
          }`}
        >
          <div className="flex flex-col">
            <span className="text-sm font-medium text-green-700">Approved</span>
            <span className="text-3xl font-bold mt-2 text-green-900">{approvedLeaves}</span>
          </div>
        </button>

        {/* Rejected Leaves Card */}
        <button
          onClick={() => setFilterStatus('rejected')}
          className={`rounded-lg shadow-md p-4 text-left transition-all hover:shadow-lg ${
            filterStatus === 'rejected' 
              ? 'bg-red-100 border-2 border-red-500' 
              : 'bg-red-50 border-2 border-transparent hover:border-red-300'
          }`}
        >
          <div className="flex flex-col">
            <span className="text-sm font-medium text-red-700">Rejected</span>
            <span className="text-3xl font-bold mt-2 text-red-900">{rejectedLeaves}</span>
          </div>
        </button>
      </div>

      {/* Leave Application Form */}
      <div className="mt-[-10px] ml-0.5">
        <div className="bg-white rounded-lg sm:rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.25)] mb-6 sm:mb-10 w-full text-black">
          <div className="bg-[#A4B494] rounded-t-lg sm:rounded-t-xl px-6 sm:px-8 md:px-10 py-4 sm:py-5 font-semibold text-base sm:text-lg md:text-xl text-white">
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
                <option value="Others">Others</option>
              </select>
              {leaveType === 'Others' && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-8 flex-1">
                  <label className="text-sm sm:text-base font-semibold whitespace-nowrap">
                    Specify:
                  </label>
                  <input
                    value={otherLeaveType}
                    type="text"
                    onChange={(e) => setOtherLeaveType(e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 rounded-md shadow-md border border-gray-300 text-sm sm:text-base"
                  />
                </div>
              )}
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
                <th className="p-5 font-semibold text-lg">Sr No</th>
                <th className="p-5 font-semibold text-lg">Leave Type</th>
                <th className="p-5 font-semibold text-lg">Start Date</th>
                <th className="p-5 font-semibold text-lg">End Date</th>
                <th className="p-5 font-semibold text-lg">Status</th>
                <th className="p-5 font-semibold text-lg">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaveHistory.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500 text-base">
                    {filterStatus === 'all' ? 'No leave records found.' : `No ${filterStatus} leaves found.`}
                  </td>
                </tr>
              ) : (
                filteredLeaveHistory.map((leave, index) => (
                  <tr key={leave._id} className="bg-white border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-5 text-base font-medium">{index + 1}</td>
                    <td className="p-5 text-base font-medium">
                      {leave.leaveType === 'Others' && leave.otherLeaveType
                        ? `Other (${leave.otherLeaveType})`
                        : leave.leaveType
                      }
                    </td>
                    <td className="p-5 text-base">{formatDate(leave.startDate)}</td>
                    <td className="p-5 text-base">{formatDate(leave.endDate)}</td>
                    <td className="p-5">
                      <span
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          leave.status === 'approved'
                            ? 'bg-green-500 text-white'
                            : leave.status === 'rejected'
                            ? 'bg-red-500 text-white'
                            : leave.status === 'parent_approved'
                            ? 'bg-purple-500 text-white'
                            : 'bg-[#4F8DCF] text-white'
                        }`}
                      >
                        {leave.status === 'parent_approved' 
                          ? 'Parent Approved' 
                          : leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleViewClick(leave)}
                          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEditClick(leave)}
                          className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                          title="Edit Leave"
                        >
                          <Edit2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="sm:hidden space-y-4">
          {filteredLeaveHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-base">
              {filterStatus === 'all' ? 'No leave records found.' : `No ${filterStatus} leaves found.`}
            </div>
          ) : (
            filteredLeaveHistory.map((leave, index) => (
              <div key={leave._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-semibold text-gray-600">Sr No:</span>
                    <span className="text-base font-medium text-gray-800">{index + 1}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-semibold text-gray-600">Leave Type:</span>
                    <span className="text-base font-medium text-gray-800">
                      {leave.leaveType === 'Others' && leave.otherLeaveType
                        ? `Other (${leave.otherLeaveType})`
                        : leave.leaveType
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-semibold text-gray-600">Start Date:</span>
                    <span className="text-base text-gray-800">{formatDate(leave.startDate)}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-semibold text-gray-600">End Date:</span>
                    <span className="text-base text-gray-800">{formatDate(leave.endDate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-600">Status:</span>
                    <span
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        leave.status === 'approved'
                          ? 'bg-green-500 text-white'
                          : leave.status === 'rejected'
                          ? 'bg-red-500 text-white'
                          : leave.status === 'parent_approved'
                          ? 'bg-purple-500 text-white'
                          : 'bg-[#4F8DCF] text-white'
                      }`}
                    >
                      {leave.status === 'parent_approved' 
                        ? 'Parent Approved' 
                        : leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleViewClick(leave)}
                      className="flex-1 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition flex items-center justify-center gap-2"
                    >
                      <Eye size={18} />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => handleEditClick(leave)}
                      className="flex-1 p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition flex items-center justify-center gap-2"
                    >
                      <Edit2 size={18} />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* View Modal */}
      {viewModalOpen && selectedLeave && (
        <div className="fixed inset-0 bg-blur backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-[#4F8CCF] text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
              <h3 className="text-xl font-semibold">Leave Details</h3>
              <button
                onClick={() => setViewModalOpen(false)}
                className="text-white hover:text-gray-200 transition"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Leave Type:</label>
                  <p className="text-base text-gray-800 mt-1">
                    {selectedLeave.leaveType === 'Others' && selectedLeave.otherLeaveType
                      ? `Other (${selectedLeave.otherLeaveType})`
                      : selectedLeave.leaveType
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Status:</label>
                  <p className="mt-1">
                    <span
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        selectedLeave.status === 'approved'
                          ? 'bg-green-500 text-white'
                          : selectedLeave.status === 'rejected'
                          ? 'bg-red-500 text-white'
                          : selectedLeave.status === 'parent_approved'
                          ? 'bg-purple-500 text-white'
                          : 'bg-[#4F8DCF] text-white'
                      }`}
                    >
                      {selectedLeave.status === 'parent_approved' 
                        ? 'Parent Approved' 
                        : selectedLeave.status.charAt(0).toUpperCase() + selectedLeave.status.slice(1)}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Start Date:</label>
                  <p className="text-base text-gray-800 mt-1">{formatDate(selectedLeave.startDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">End Date:</label>
                  <p className="text-base text-gray-800 mt-1">{formatDate(selectedLeave.endDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Applied Date:</label>
                  <p className="text-base text-gray-800 mt-1">{formatDate(selectedLeave.appliedAt)}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Reason:</label>
                <p className="text-base text-gray-800 mt-1 bg-gray-50 p-3 rounded-md border border-gray-200">
                  {selectedLeave.reason}
                </p>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end">
              <button
                onClick={() => setViewModalOpen(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && editingLeave && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-[#A4B494] text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
              <h3 className="text-xl font-semibold">Edit Leave</h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-white hover:text-gray-200 transition"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Editing this leave will reset its status to pending and require parent approval again.
                </p>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-semibold text-black">
                  Leave Type
                </label>
                <select
                  value={editLeaveType}
                  onChange={(e) => setEditLeaveType(e.target.value)}
                  className="w-full px-4 py-3 rounded-md shadow-md border border-gray-300 text-sm text-black"
                  required
                >
                  <option value="">Select Leave Type</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Vacation">Vacation</option>
                  <option value="Others">Others</option>
                </select>
                {editLeaveType === 'Others' && (
                  <div className="mt-3">
                    <label className="block mb-2 text-sm font-semibold text-black">
                      Specify:
                    </label>
                    <input
                      value={editOtherLeaveType}
                      type="text"
                      onChange={(e) => setEditOtherLeaveType(e.target.value)}
                      className="w-full px-3 py-2 rounded-md shadow-md border border-gray-300 text-sm text-black"
                      required
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-black">
                    Start Date:
                  </label>
                  <input
                    type="date"
                    value={editStartDate}
                    onChange={(e) => setEditStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-md shadow-md border border-gray-300 text-sm text-black"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-black">
                    End Date:
                  </label>
                  <input
                    type="date"
                    value={editEndDate}
                    onChange={(e) => setEditEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-md shadow-md border border-gray-300 text-sm text-black"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-black">
                  Reason For Leave:
                </label>
                <textarea
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 rounded-lg shadow-md resize-none border border-gray-300 text-sm text-black"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="flex-1 px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 px-6 py-2 bg-[#A4B494] text-black rounded-md hover:opacity-90 transition font-medium"
                >
                  {editLoading ? 'Updating...' : 'Update Leave'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
