'use client';

import React from 'react';

export default function Complaints() {
  return (
    <div className="py-6">
      {/* Page Heading */}
      <h3 className="text-xl sm:text-2xl font-bold border-l-4 border-red-500 pl-3 mb-5 text-black">
        Complaints
      </h3>

      {/* Complaint Form Card */}
      <div className="w-full max-w-full lg:w-3/4 rounded-[16px] shadow-[0_12px_32px_rgba(0,0,0,0.2)] overflow-hidden mb-10 bg-white ml-0 mr-auto">
        {/* Header */}
        <div className="bg-[#A4AE97] p-4 rounded-t-[16px]">
          <h4 className="text-base sm:text-lg font-bold text-black">File a Complaint</h4>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-6">
          <form className="w-full flex flex-col gap-5">
            {/* Complaint Type */}
            <div className="w-full">
              <label htmlFor="complaintType" className="block text-black font-semibold mb-1 text-sm sm:text-base">
                Complaint type
              </label>
              <select
                id="complaintType"
                name="type"
                required
                className="w-full px-4 py-2 rounded-md shadow-[0_6px_20px_rgba(0,0,0,0.2)] bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#A4AE97] text-sm"
              >
                <option value="">Select Complaint Type</option>
                <option>Noise Disturbance</option>
                <option>Maintenance issue</option>
                <option>Damages fee</option>
              </select>
            </div>

            {/* Subject */}
            <div className="w-full">
              <label htmlFor="subject" className="block text-black font-semibold mb-1 text-sm sm:text-base">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                placeholder="Enter The Subject"
                className="w-full px-4 py-2 rounded-md shadow-[0_6px_20px_rgba(0,0,0,0.2)] placeholder:text-gray-400 text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#A4AE97] text-sm"
              />
            </div>

            {/* Description */}
            <div className="w-full flex flex-col sm:flex-row items-start gap-1 sm:gap-2">
              <label
                htmlFor="description"
                className="sm:w-[120px] text-black font-semibold text-sm sm:text-base pt-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                
                className="w-full sm:flex-1 px-4 py-2 rounded-md shadow-[0_6px_20px_rgba(0,0,0,0.2)] text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#A4AE97] text-sm"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="w-full flex justify-center">
              <button
                type="submit"
                className="bg-[#A4AE97] text-black px-6 py-2 rounded-md shadow-[0_6px_20px_rgba(0,0,0,0.25)] font-semibold hover:bg-[#9aa78f] transition w-full sm:w-auto text-sm"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Complaint History Table */}
      <div className="bg-white rounded-[16px] shadow-[0_6px_20px_rgba(0,0,0,0.25)] w-full overflow-x-auto p-4 sm:p-6">
        <h4 className="text-lg sm:text-xl font-extrabold mb-4 text-black">Complaint History</h4>
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
              <tr className="text-black bg-white">
                <td className="px-4 py-4">Noise Disturbance</td>
                <td className="px-4 py-4">Noisy Neighbour in Room 305</td>
                <td className="px-4 py-4">23-03-2025</td>
                <td className="px-4 py-4">
                  <span className="bg-[#39FF14] text-black py-1 px-4 rounded-[4px] font-bold block w-max">
                    Approved
                  </span>
                </td>
              </tr>
              <tr className="text-black bg-white">
                <td className="px-4 py-4">Maintenance issue</td>
                <td className="px-4 py-4">Broken Shower Head - 2nd floor</td>
                <td className="px-4 py-4">23-03-2025</td>
                <td className="px-4 py-4">
                  <span className="bg-red-500 text-white py-1 px-4 rounded-[4px] font-bold block w-max">
                    Rejected
                  </span>
                </td>
              </tr>
              <tr className="text-black bg-white">
                <td className="px-4 py-4">Damages fee</td>
                <td className="px-4 py-4">Internet Connectivity issues</td>
                <td className="px-4 py-4">23-03-2025</td>
                <td className="px-4 py-4">
                  <span className="bg-yellow-400 text-white py-1 px-4 rounded-[4px] font-bold block w-max">
                    Rejected
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}