'use client';
import React from 'react';

export default function LeavesPage() {
  return (
    <div className="w-full bg-white pt-1 pb-6 sm:pb-10 px-3 sm:px-4 text-black">
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black border-l-4 border-red-600 pl-2 mb-4 sm:mb-6">
        Leaves
      </h2>

      {/* Leave Application Form */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.25)] mb-6 sm:mb-10 w-full max-w-xl mx-auto lg:mx-0 lg:ml-0">
        {/* Header */}
        <div className="bg-[#BEC5AD] rounded-t-lg sm:rounded-t-xl px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 font-semibold text-sm sm:text-base md:text-lg">
          Leave Application Form
        </div>

        <form className="space-y-3 sm:space-y-4 md:space-y-5 px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
          {/* Leave Type */}
          <div>
            <label className="block mb-1 text-xs sm:text-sm font-semibold text-gray-800">
              Leave Type
            </label>
            <select className="w-full px-3 sm:px-4 py-2 rounded-md shadow-md border border-gray-300 text-xs sm:text-sm">
              <option>Select Leave Type</option>
              <option>Sick Leave</option>
              <option>Casual Leave</option>
              <option>Vacation</option>
            </select>
          </div>

          {/* Dates */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 flex-1">
              <label className="text-xs sm:text-sm font-semibold whitespace-nowrap">Start Date:</label>
              <input
                type="date"
                className="w-full sm:w-auto px-2 sm:px-3 py-1.5 sm:py-2 rounded-md shadow-md border border-gray-300 text-xs sm:text-sm"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 flex-1">
              <label className="text-xs sm:text-sm font-semibold whitespace-nowrap">End Date:</label>
              <input
                type="date"
                className="w-full sm:w-auto px-2 sm:px-3 py-1.5 sm:py-2 rounded-md shadow-md border border-gray-300 text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Reason */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
            <label className="text-xs sm:text-sm font-semibold sm:pt-2 whitespace-nowrap">
              Reason For Leave:
            </label>
            <textarea 
              className="w-full px-3 sm:px-4 py-2 rounded-lg shadow-md h-16 sm:h-20 resize-none border border-gray-300 text-xs"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-2">
            <button
              type="submit"
              className="bg-[#BEC5AD] text-black px-4 sm:px-6 md:px-8 py-1.5 sm:py-2 rounded-md shadow hover:opacity-90 text-xs sm:text-sm font-medium w-full sm:w-auto"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* Leave History */}
      <div className="bg-white min-h-[280px] sm:min-h-[340px] rounded-lg sm:rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.25)] px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 w-full max-w-6xl mx-auto">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">
          Leave History
        </h3>

        {/* Desktop Table - Unchanged */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm text-gray-800 min-w-full">
            <thead className="bg-gray-300 text-left">
              <tr>
                <th className="p-3 font-semibold">Leave Type</th>
                <th className="p-3 font-semibold">Start Date</th>
                <th className="p-3 font-semibold">End Date</th>
                <th className="p-3 font-semibold">Reason</th>
                <th className="p-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b border-gray-100 hover:bg-gray-50">
                <td className="p-3">Vacation</td>
                <td className="p-3">23-03-2025</td>
                <td className="p-3">31-03-2025</td>
                <td className="p-3">Family Trip</td>
                <td className="p-3">
                  <span className="bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                    Approved
                  </span>
                </td>
              </tr>
              <tr className="bg-white border-b border-gray-100 hover:bg-gray-50">
                <td className="p-3">Vacation</td>
                <td className="p-3">23-03-2025</td>
                <td className="p-3">31-03-2025</td>
                <td className="p-3">Festival</td>
                <td className="p-3">
                  <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                    Rejected
                  </span>
                </td>
              </tr>
              <tr className="bg-white border-b border-gray-100 hover:bg-gray-50">
                <td className="p-3">Sick Leave</td>
                <td className="p-3">23-03-2025</td>
                <td className="p-3">31-03-2025</td>
                <td className="p-3">Fever</td>
                <td className="p-3">
                  <span className="bg-yellow-400 text-black px-2 py-1 rounded-md text-xs font-medium">
                    Pending
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile Cards - Optimized */}
        <div className="sm:hidden space-y-3">
          {/* Card 1 */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-gray-800 text-xs">Vacation</h4>
              <span className="bg-green-500 text-white px-1.5 py-0.5 rounded text-[10px] font-medium">
                Approved
              </span>
            </div>
            <div className="space-y-1.5 text-[10px]">
              <div className="flex justify-between">
                <span className="text-gray-600">Start Date:</span>
                <span className="font-medium text-gray-800">23-03-2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">End Date:</span>
                <span className="font-medium text-gray-800">31-03-2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reason:</span>
                <span className="font-medium text-gray-800">Family Trip</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-gray-800 text-xs">Vacation</h4>
              <span className="bg-red-500 text-white px-1.5 py-0.5 rounded text-[10px] font-medium">
                Rejected
              </span>
            </div>
            <div className="space-y-1.5 text-[10px]">
              <div className="flex justify-between">
                <span className="text-gray-600">Start Date:</span>
                <span className="font-medium text-gray-800">23-03-2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">End Date:</span>
                <span className="font-medium text-gray-800">31-03-2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reason:</span>
                <span className="font-medium text-gray-800">Festival</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-gray-800 text-xs">Sick Leave</h4>
              <span className="bg-yellow-400 text-black px-1.5 py-0.5 rounded text-[10px] font-medium">
                Pending
              </span>
            </div>
            <div className="space-y-1.5 text-[10px]">
              <div className="flex justify-between">
                <span className="text-gray-600">Start Date:</span>
                <span className="font-medium text-gray-800">23-03-2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">End Date:</span>
                <span className="font-medium text-gray-800">31-03-2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reason:</span>
                <span className="font-medium text-gray-800">Fever</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}