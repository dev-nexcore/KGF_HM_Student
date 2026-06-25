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
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const clearFilters = () => {
    setSearchQuery('');
    setFilterStatus('all');
    setDateFilter('');
    setCurrentPage(1);
  };
  
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
    if (!leaveType || !startDate || !endDate || !reason) return toast.error('All fields are required');

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (start < today) return toast.error("Start date cannot be in the past");
    if (end < start) return toast.error("End date cannot be before start date");

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
      toast.error(err.response?.data?.message || 'Failed to apply for leave');
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

    const start = new Date(editStartDate);
    const end = new Date(editEndDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (start < today) return toast.error("Start date cannot be in the past");
    if (end < start) return toast.error("End date cannot be before start date");

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
  const pendingLeaves = leaveHistory.filter(leave => ['pending', 'parent_approved', 'warden_approved', 'warden_rejected'].includes(leave.status)).length;
  const approvedLeaves = leaveHistory.filter(leave => leave.status === 'approved').length;
  const rejectedLeaves = leaveHistory.filter(leave => leave.status === 'rejected').length;

  // Filter leave history based on selected status
  const filteredLeaveHistory = leaveHistory.filter(leave => {
    let matchStatus = false;
    if (filterStatus === 'all') matchStatus = true;
    else if (filterStatus === 'pending') matchStatus = ['pending', 'parent_approved', 'warden_approved', 'warden_rejected'].includes(leave.status);
    else matchStatus = leave.status === filterStatus;
    
    let matchSearch = true;
    if (searchQuery) {
       matchSearch = (leave.leaveType || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                     (leave.otherLeaveType || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                     (leave.reason || '').toLowerCase().includes(searchQuery.toLowerCase());
    }

    let matchDate = true;
    if (dateFilter) {
      const filterD = new Date(dateFilter);
      const filterEnd = new Date(dateFilter);
      filterEnd.setHours(23, 59, 59, 999);
      
      const reqStart = leave.startDate ? new Date(leave.startDate) : new Date(0);
      const reqEnd = leave.endDate ? new Date(leave.endDate) : reqStart;
      
      matchDate = (filterD <= reqEnd) && (filterEnd >= reqStart);
    }
    
    return matchStatus && matchSearch && matchDate;
  });

  const totalPages = Math.ceil(filteredLeaveHistory.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredLeaveHistory.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
      <div className="bg-white min-h-[400px] sm:min-h-[450px] rounded-lg sm:rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.25)] px-6 sm:px-8 md:px-10 py-6 sm:py-8 md:py-10 w-full mb-10">
        
        {/* ── FILTER BAR ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 bg-gray-50/60">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            <h2 className="text-sm font-semibold text-gray-600 tracking-wide uppercase">Filter Leave Requests</h2>
          </div>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Search</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  placeholder="Leave Type or Reason"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</label>
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                  className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 pr-8 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="parent_approved">Parent Approved</option>
                  <option value="parent_rejected">Parent Rejected</option>
                  <option value="warden_approved">Warden Approved</option>
                  <option value="warden_rejected">Warden Rejected</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={dateFilter}
                  onClick={(e) => e.target.showPicker && e.target.showPicker()}
                  onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 pr-8 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer [color-scheme:light] [&::-webkit-calendar-picker-indicator]:hidden"
                />
                <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
            </div>

            {/* Clear */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-transparent uppercase tracking-wider select-none">Action</label>
              <button
                onClick={clearFilters}
                className="flex items-center justify-center gap-2 w-full bg-red-50 text-red-500 border border-red-200 hover:border-red-500 text-sm font-semibold rounded-lg px-4 py-2.5 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filters
              </button>
            </div>
          </div>
        </div>

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
                paginatedData.map((leave, index) => (
                  <tr key={leave._id} className="bg-white border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-5 text-base font-medium">{startIndex + index + 1}</td>
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
                        className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                          leave.status === 'approved'
                            ? 'bg-green-500 text-white'
                            : leave.status === 'rejected'
                            ? 'bg-red-500 text-white'
                            : leave.status === 'parent_approved'
                            ? 'bg-purple-500 text-white'
                            : leave.status === 'parent_rejected'
                            ? 'bg-pink-500 text-white'
                            : (leave.status === 'warden_approved' || leave.status === 'warden_rejected')
                            ? 'bg-indigo-500 text-white'
                            : 'bg-[#4F8DCF] text-white'
                        }`}
                      >
                        {leave.status === 'parent_approved' 
                          ? 'Parent Approved' 
                          : (leave.status === 'warden_approved' || leave.status === 'warden_rejected')
                          ? 'Pending Admin'
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
            paginatedData.map((leave, index) => (
              <div key={leave._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-semibold text-gray-600">Sr No:</span>
                    <span className="text-base font-medium text-gray-800">{startIndex + index + 1}</span>
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
                      className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                        leave.status === 'approved'
                          ? 'bg-green-500 text-white'
                          : leave.status === 'rejected'
                          ? 'bg-red-500 text-white'
                          : leave.status === 'parent_approved'
                          ? 'bg-purple-500 text-white'
                          : leave.status === 'parent_rejected'
                          ? 'bg-pink-500 text-white'
                          : (leave.status === 'warden_approved' || leave.status === 'warden_rejected')
                          ? 'bg-indigo-500 text-white'
                          : 'bg-[#4F8DCF] text-white'
                      }`}
                    >
                      {leave.status === 'parent_approved' 
                        ? 'Parent Approved' 
                        : (leave.status === 'warden_approved' || leave.status === 'warden_rejected')
                        ? 'Pending Admin'
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-100">
            <div className="text-sm text-gray-600 font-medium bg-gray-50 px-4 py-2 rounded-full">
              Showing {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredLeaveHistory.length)} of {filteredLeaveHistory.length} requests
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                  currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-[#4F8CCF] hover:text-[#4F8CCF] hover:shadow-sm'
                }`}
              >
                Previous
              </button>
              
              <div className="flex flex-wrap items-center justify-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg font-medium text-sm transition-all duration-200 ${
                      currentPage === i + 1
                        ? 'bg-[#4F8CCF] text-white shadow-md'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-[#4F8CCF] hover:text-[#4F8CCF]'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                  currentPage === totalPages 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-[#4F8CCF] hover:text-[#4F8CCF] hover:shadow-sm'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
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
