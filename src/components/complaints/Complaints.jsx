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
    <div className="bg-white text-black p-4 sm:p-6 md:p-8 overflow-hidden min-h-screen">
      
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold border-l-4 border-red-600 pl-3 mb-6 sm:mb-8 mt-[-7px] -ml-2 text-[#2c2c2c]">
        Complaints
      </h1>

      {/* Complaint Application Form - Increased width for desktop */}
      {/* Complaint Application Form - Increased width for desktop */}
<div className="bg-white rounded-lg sm:rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.25)] mb-6 sm:mb-10 w-full max-w-3xl">

        {/* Header */}
        <div className="bg-[#A4B494] rounded-t-lg sm:rounded-t-xl px-6 py-3 font-bold text-base md:text-lg">
          Complaint Application Form
        </div>

        <form className="space-y-4 px-6 py-6">
          {/* Complaint Type */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-800">
              Complaint Type
            </label>
            <select className="w-full px-4 py-2 rounded-md shadow-md border border-gray-300 text-sm">
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
              className="w-full px-4 py-2 rounded-md shadow-md border border-gray-300 text-sm placeholder:text-gray-400"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
            <label className="text-xs sm:text-sm font-semibold sm:pt-2 whitespace-nowrap">
              Description:
            </label>
            <textarea 
              className="w-full px-3 sm:px-4 py-2 rounded-lg shadow-md h-16 sm:h-20 resize-none border border-gray-300 text-xs"
              placeholder="Enter complaint description"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-2">
            <button
              type="submit"
              className="bg-[#A4AE97] text-black px-4 sm:px-6 md:px-8 py-1.5 sm:py-2 rounded-md shadow hover:opacity-90 text-xs sm:text-sm font-medium w-full sm:w-auto"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* Rest of your code remains the same... */}
      {/* Complaint History */}
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
              <tr className="bg-white hover:bg-gray-50">

                <td className="p-3 text-center">Noise Disturbance</td>
                <td className="p-3 text-center">Noisy Neighbour in Room 305</td>
                <td className="p-3 text-center">23-03-2025</td>
                <td className="p-3 text-center">
                  <span className="bg-green-500 text-black px-2 py-1 rounded-md text-xs font-medium">
                    Approved
                  </span>
                </td>
              </tr>
             <tr className="bg-white hover:bg-gray-50">

                <td className="p-3 text-center">Maintenance issue</td>
                <td className="p-3 text-center">Broken Shower Head - 2nd floor</td>
                <td className="p-3 text-center">23-03-2025</td>
                <td className="p-3 text-center">
                  <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                    Rejected
                  </span>
                </td>
              </tr>
             <tr className="bg-white hover:bg-gray-50">

                <td className="p-3 text-center">Damages fee</td>
                <td className="p-3 text-center">Internet Connectivity issues</td>
                <td className="p-3 text-center">23-03-2025</td>
                <td className="p-3 text-center">
                  <span className="bg-yellow-400 text-white px-2 py-1 rounded-md text-xs font-medium">
                    Pending
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden space-y-1">
          {/* Card 1 */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
            <div className="flex justify-center items-center mb-2 space-x-2">
              <h4 className="font-semibold text-gray-800 text-xs">Noise Disturbance</h4>
              <span className="bg-green-500 text-white px-1.5 py-0.5 rounded text-[10px] font-medium">
                Resolved
              </span>
            </div>
            <div className="space-y-1.5 text-[10px]">
              <div className="flex justify-center space-x-1">
                <span className="text-gray-600">Subject:</span>
                <span className="font-medium text-gray-800">Noisy Neighbour in Room 305</span>
              </div>
              <div className="flex justify-center space-x-1">
                <span className="text-gray-600">Filed Date:</span>
                <span className="font-medium text-gray-800">23-03-2025</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
            <div className="flex justify-center items-center mb-2 space-x-2">
              <h4 className="font-semibold text-gray-800 text-xs">Maintenance issue</h4>
              <span className="bg-red-500 text-white px-1.5 py-0.5 rounded text-[10px] font-medium">
                Rejected
              </span>
            </div>
            <div className="space-y-1.5 text-[10px]">
              <div className="flex justify-center space-x-1">
                <span className="text-gray-600">Subject:</span>
                <span className="font-medium text-gray-800">Broken Shower Head - 2nd floor</span>
              </div>
              <div className="flex justify-center space-x-1">
                <span className="text-gray-600">Filed Date:</span>
                <span className="font-medium text-gray-800">23-03-2025</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
            <div className="flex justify-center items-center mb-2 space-x-2">
              <h4 className="font-semibold text-gray-800 text-xs">Damages fee</h4>
              <span className="bg-yellow-400 text-black px-1.5 py-0.5 rounded text-[10px] font-medium">
                Pending
              </span>
            </div>
            <div className="space-y-1.5 text-[10px]">
              <div className="flex justify-center space-x-1">
                <span className="text-gray-600">Subject:</span>
                <span className="font-medium text-gray-800">Internet Connectivity issues</span>
              </div>
              <div className="flex justify-center space-x-1">
                <span className="text-gray-600">Filed Date:</span>
                <span className="font-medium text-gray-800">23-03-2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
