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

    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const getStatusClasses = (status) => {
    if (status === 'Approved' || status === 'Resolved') return 'bg-green-500 text-white';
    if (status === 'Rejected') return 'bg-red-500 text-white';
    if (status === 'Pending') return 'bg-[#4F8DCF] text-white';
    return 'bg-[#4F8DCF] text-white';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString();
  };

  return (
    <div className="w-full bg-white pt-1 pb-6 sm:pb-10 px-3 sm:px-4 text-black">
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black border-l-4 border-[#4F8CCF] pl-2 mb-4 sm:mb-6">
        Complaints
      </h2>

      {/* Complaint Application Form */}
      <div className="mt-[-10px] ml-0.5">
        <div className="bg-white rounded-lg sm:rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.25)] mb-6 sm:mb-8 lg:mb-10 w-full">
          <div className="bg-[#A4B494] rounded-t-lg sm:rounded-t-xl px-4 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 font-semibold text-sm sm:text-base md:text-lg lg:text-xl">
            Complaint Application Form
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8 px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6 md:py-8 lg:py-10"
          >
            <div>
              <label className="block mb-2 text-sm sm:text-base font-semibold text-gray-800">
                Complaint Type
              </label>
              <select
                value={complaintType}
                onChange={(e) => setComplaintType(e.target.value)}
                className="w-full px-4 py-3 rounded-md shadow-md border border-gray-300 text-sm sm:text-base"
                required
              >
                <option value="">Choose Complaint Type</option>
                <option value="Noise Disturbance">Noise Disturbance</option>
                <option value="Maintenance issue">Maintenance issue</option>
                <option value="Damages fee">Damages fee</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm sm:text-base font-semibold text-gray-800">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter The Subject"
                className="w-full px-4 py-3 rounded-md shadow-md border border-gray-300 text-sm sm:text-base placeholder:text-gray-400"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
              <label className="text-sm sm:text-base font-semibold sm:pt-2 whitespace-nowrap">
                Description:
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={8}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-md h-full sm:h-full resize-none border border-gray-300 text-sm sm:text-base md:text-lg"
                placeholder="Enter complaint description"
                required
              />
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="bg-[#BEC5AD] text-black px-6 sm:px-8 py-2.5 sm:py-3 rounded-md shadow hover:opacity-90 text-sm sm:text-base font-medium w-full sm:w-auto"
                disabled={!studentId || loading}
                title={!studentId ? 'Student not identified' : 'Submit'}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Complaint History */}
      <div className="bg-white min-h-[300px] sm:min-h-[400px] md:min-h-[450px] rounded-lg sm:rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.25)] px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6 md:py-8 lg:py-10 w-full">
        <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold mb-4 sm:mb-6 lg:mb-8 text-gray-800">
          Complaint History
        </h3>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm md:text-base lg:text-lg text-gray-800 min-w-full">
            <thead className="bg-gray-200 text-left">
              <tr>
                <th className="p-3 md:p-4 lg:p-5 font-semibold text-sm md:text-base lg:text-lg">Complaint Type</th>
                <th className="p-3 md:p-4 lg:p-5 font-semibold text-sm md:text-base lg:text-lg">Subject</th>
                <th className="p-3 md:p-4 lg:p-5 font-semibold text-sm md:text-base lg:text-lg">Filed Date</th>
                <th className="p-3 md:p-4 lg:p-5 font-semibold text-sm md:text-base lg:text-lg">Description</th>
                <th className="p-3 md:p-4 lg:p-5 font-semibold text-sm md:text-base lg:text-lg">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 md:py-8 text-gray-500 text-sm md:text-base">
                    Loading...
                  </td>
                </tr>
              ) : complaints.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 md:py-8 text-gray-500 text-sm md:text-base">
                    No complaints found.
                  </td>
                </tr>
              ) : (
                complaints.map((complaint, index) => (
                  <tr key={index} className="bg-white border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3 md:p-4 lg:p-5 text-sm md:text-base lg:text-lg font-medium">{complaint.complaintType}</td>
                    <td className="p-3 md:p-4 lg:p-5 text-sm md:text-base lg:text-lg">{complaint.subject}</td>
                    <td className="p-3 md:p-4 lg:p-5 text-sm md:text-base lg:text-lg">{formatDate(complaint.createdAt)}</td>
                    <td className="p-3 md:p-4 lg:p-5 text-sm md:text-base lg:text-lg max-w-xs truncate">{complaint.description}</td>
                    <td className="p-3 md:p-4 lg:p-5">
                      <span
                        className={`px-2 md:px-3 py-1 md:py-2 rounded-md text-xs md:text-sm font-medium ${getStatusClasses(complaint.status)}`}
                      >
                        {complaint.status ? complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1) : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden space-y-3 sm:space-y-4">
          {loading ? (
            <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
              Loading...
            </div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
              No complaints found.
            </div>
          ) : (
            complaints.map((complaint, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xs sm:text-sm font-semibold text-gray-600">Complaint Type:</span>
                    <span className="text-sm sm:text-base font-medium text-gray-800">{complaint.complaintType}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs sm:text-sm font-semibold text-gray-600">Subject:</span>
                    <span className="text-sm sm:text-base text-gray-800 text-right max-w-[60%]">{complaint.subject}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs sm:text-sm font-semibold text-gray-600">Date:</span>
                    <span className="text-sm sm:text-base text-gray-800">{formatDate(complaint.createdAt)}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs sm:text-sm font-semibold text-gray-600">Description:</span>
                    <span className="text-sm sm:text-base text-gray-800 text-right max-w-[60%]">{complaint.description}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm font-semibold text-gray-600">Status:</span>
                    <span
                      className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium ${getStatusClasses(complaint.status)}`}
                    >
                      {complaint.status ? complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1) : 'Pending'}
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