'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function Complaints() {
  const [complaintType, setComplaintType] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get student ID from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const id = localStorage.getItem('studentId');
      setStudentId(id);
    }
  }, []);

  // Fetch complaint history
  useEffect(() => {
    if (!studentId) return;

    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/complaints/${studentId}`);
        setComplaints(res.data?.complaints || []);
      } catch (err) {
        console.error('Error fetching complaint history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [studentId]);

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!complaintType || !subject || !description || !studentId) return;

    try {
      await api.post('/complaint', {
        studentId,
        complaintType,
        subject,
        description,
      });

      toast.success('Complaint filed successfully');

      // Reset form
      setComplaintType('');
      setSubject('');
      setDescription('');

      // Re-fetch history
      const res = await api.get(`/complaints/${studentId}`);
      setComplaints(res.data?.complaints || []);
    } catch (err) {
      console.error('Error filing complaint:', err);
      toast.error('Something went wrong!');
    }
  };

  const getStatusClasses = (status) => {
    if (status === 'Approved' || status === 'Resolved') return 'bg-green-500 text-black';
    if (status === 'Rejected') return 'bg-red-500 text-white';
    if (status === 'Pending') return 'bg-[#4F8DCF] text-white';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString();
  };

  return (
    <div className="bg-white text-black p-4 sm:p-6 md:p-8 overflow-hidden min-h-screen">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold border-l-4 border-[#4F8DCF] pl-3 mb-6 sm:mb-8 mt-[-7px] -ml-2 text-[#2c2c2c]">
        Complaints
      </h1>

      {/* Complaint Application Form - same layout as your original */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.25)] mb-6 sm:mb-10 w-full max-w-full min-h-[500px]">
        {/* Header */}
        <div className="bg-[#A4B494] rounded-t-lg sm:rounded-t-xl px-6 py-3 font-bold text-base md:text-lg">
          Complaint Application Form
        </div>

        <form className="space-y-4 px-6 py-8" onSubmit={handleSubmit}>
          {/* Complaint Type */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-800">
              Complaint Type
            </label>
            <select
              value={complaintType}
              onChange={(e) => setComplaintType(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md shadow-md border border-gray-300 text-sm"
            >
              <option value="">Select Complaint Type</option>
              <option>Noise Disturbance</option>
              <option>Maintenance issue</option>
              <option>Damages fee</option>
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-800">
              Subject
            </label>
            <input
              type="text"
              placeholder="Enter The Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md shadow-md border border-gray-300 text-sm placeholder:text-gray-400"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
            <label className="text-xs sm:text-sm font-semibold sm:pt-0 whitespace-nowrap">
              Description:
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={10}
              required
              className="w-full px-3 sm:px-4 py-2 rounded-lg shadow-md h-full sm:h-full resize-none border border-gray-300 text-xs"
              placeholder="Enter complaint description"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-2">
            <button
              type="submit"
              className="bg-[#A4AE97] text-black px-4 sm:px-6 md:px-8 py-1.5 sm:py-2 rounded-md shadow hover:opacity-90 text-xs sm:text-sm font-medium w-full sm:w-auto"
              disabled={!studentId}
              title={!studentId ? 'Student not identified' : 'Submit'}
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* Complaint History - same structure & responsiveness as your original, now dynamic */}
      <div className="bg-white min-h-[280px] sm:min-h-[340px] rounded-lg sm:rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.25)] px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 w-full max-w-6xl lg:mx-0 lg:ml-0">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">
          Complaint History
        </h3>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm text-gray-800 min-w-full">
            <thead className="bg-gray-200 text-center">
              <tr>
                <th className="p-3 font-semibold">Complaint Type</th>
                <th className="p-3 font-semibold">Subject</th>
                <th className="p-3 font-semibold">Filed Date</th>
                <th className="p-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center">Loading...</td>
                </tr>
              ) : complaints.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-600">No complaints yet.</td>
                </tr>
              ) : (
                complaints.map((c, idx) => (
                  <tr key={idx} className="bg-white hover:bg-gray-50">
                    <td className="p-3 text-center">{c.complaintType}</td>
                    <td className="p-3 text-center">{c.subject}</td>
                    <td className="p-3 text-center">{formatDate(c.createdAt)}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusClasses(c.status)}`}>
                        {c.status || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden space-y-1">
          {loading ? (
            <div className="text-center text-gray-600 text-sm py-2">Loading...</div>
          ) : complaints.length === 0 ? (
            <div className="text-center text-gray-600 text-sm py-2">No complaints yet.</div>
          ) : (
            complaints.map((c, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
                <div className="flex justify-center items-center mb-2 space-x-2">
                  <h4 className="font-semibold text-gray-800 text-xs">{c.complaintType}</h4>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${getStatusClasses(c.status)}`}>
                    {c.status || 'Pending'}
                  </span>
                </div>
                <div className="space-y-1.5 text-[10px]">
                  <div className="flex justify-center space-x-1">
                    <span className="text-gray-600">Subject:</span>
                    <span className="font-medium text-gray-800">{c.subject}</span>
                  </div>
                  <div className="flex justify-center space-x-1">
                    <span className="text-gray-600">Filed Date:</span>
                    <span className="font-medium text-gray-800">{formatDate(c.createdAt)}</span>
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