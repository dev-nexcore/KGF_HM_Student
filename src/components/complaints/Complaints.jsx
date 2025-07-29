'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast'; // optional for feedback

export default function Complaints() {
  const [complaintType, setComplaintType] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [studentId, setStudentId] = useState(null);

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
        const res = await api.get(`/complaints/${studentId}`);
        setComplaints(res.data.complaints);
      } catch (err) {
        console.error("Error fetching complaint history:", err);
      }
    };

    fetchComplaints();
  }, [studentId]);

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!complaintType || !subject || !description) return;

    try {
      await api.post('/complaint', {
        studentId,
        complaintType,
        subject,
        description
      });

      toast.success("Complaint filed successfully");

      // Reset form
      setComplaintType('');
      setSubject('');
      setDescription('');

      // Re-fetch history
      const res = await api.get(`/complaints/${studentId}`);
      setComplaints(res.data.complaints);
    } catch (err) {
      console.error("Error filing complaint:", err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="py-4 sm:py-6 px-2 sm:px-0">
      {/* Page Heading */}
      <h3 className="text-lg sm:text-xl md:text-2xl font-bold border-l-4 border-red-500 pl-3 mb-4 sm:mb-5 text-black">
        Complaints
      </h3>

      {/* Complaint Form Card */}
      <div className="w-full max-w-full lg:w-2/4 rounded-[16px] shadow-[0_12px_32px_rgba(0,0,0,0.2)] overflow-hidden mb-8 sm:mb-10 bg-white ml-0 mr-auto">
        {/* Header */}
        <div className="bg-[#A4B494] p-3 sm:p-4 rounded-t-[16px]">
          <h4 className="text-sm sm:text-base lg:text-lg font-bold text-black">File a Complaint</h4>
        </div>

        {/* Form Body */}
        <div className="p-3 sm:p-4 lg:p-6">
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 sm:gap-5">
            {/* Complaint Type */}
            <div className="w-full">
              <label htmlFor="complaintType" className="block text-black font-semibold mb-1 text-xs sm:text-sm lg:text-base">
                Complaint type
              </label>
              <select
                id="complaintType"
                name="type"
                required
                value={complaintType}
                onChange={(e) => setComplaintType(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 rounded-md shadow-[0_6px_20px_rgba(0,0,0,0.2)] bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#A4AE97] text-xs sm:text-sm"
              >
                <option value="">Select Complaint Type</option>
                <option>Noise Disturbance</option>
                <option>Maintenance issue</option>
                <option>Damages fee</option>
              </select>
            </div>

            {/* Subject */}
            <div className="w-full">
              <label htmlFor="subject" className="block text-black font-semibold mb-1 text-xs sm:text-sm lg:text-base">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                placeholder="Enter The Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 rounded-md shadow-[0_6px_20px_rgba(0,0,0,0.2)] placeholder:text-gray-400 text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#A4AE97] text-xs sm:text-sm"
              />
            </div>

            {/* Description */}
            <div className="w-full flex flex-col lg:flex-row lg:items-start gap-1 lg:gap-2">
              <label
                htmlFor="description"
                className="lg:w-[120px] text-black font-semibold text-xs sm:text-sm lg:text-base lg:pt-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full lg:flex-1 px-3 sm:px-4 py-2 rounded-md shadow-[0_6px_20px_rgba(0,0,0,0.2)] text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#A4AE97] text-xs sm:text-sm"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="w-full flex justify-center">
              <button
                type="submit"
                className="bg-[#A4AE97] text-black px-4 sm:px-6 py-2 rounded-md shadow-[0_6px_20px_rgba(0,0,0,0.25)] font-semibold hover:bg-[#9aa78f] transition w-full sm:w-auto text-xs sm:text-sm"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Complaint History */}
      <div className="bg-white rounded-[16px] shadow-[0_6px_20px_rgba(0,0,0,0.25)] w-full overflow-x-auto p-3 sm:p-4 lg:p-6">
        <h4 className="text-base sm:text-lg lg:text-xl font-extrabold mb-3 sm:mb-4 text-black">Complaint History</h4>

        {/* Desktop Table View - UNCHANGED */}
        <div className="hidden lg:block">
          <div className="min-w-[600px]">
            <table className="w-full text-sm border-separate border-spacing-y-3">
              <thead>
                <tr className="bg-[#e0e0e0] text-black">
                  <th className="px-4 py-3 text-left whitespace-nowrap">Complaint Type</th>
                  <th className="px-17 py-3 text-left whitespace-nowrap">Subject</th>
                  <th className="px-5 py-3 text-left whitespace-nowrap">Filed Date</th>
                  <th className="px-10 py-3 text-left whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c, idx) => (
                  <tr key={idx} className="text-black bg-white">
                    <td className="px-4 py-4">{c.complaintType}</td>
                    <td className="px-4 py-4">{c.subject}</td>
                    <td className="px-4 py-4">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-4">
                      <span className={`py-1 px-4 rounded-[4px] font-bold block w-max ${c.status === 'Approved' ? 'bg-[#39FF14] text-black' :
                          c.status === 'Rejected' ? 'bg-red-500 text-white' :
                            'bg-yellow-400 text-white'
                        }`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
