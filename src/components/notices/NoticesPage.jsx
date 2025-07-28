'use client';

import React from 'react';

const NoticePage = () => {
  return (
    <div className="bg-white text-black p-4 sm:p-6 md:p-8 overflow-hidden min-h-screen">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold border-l-4 border-red-600 pl-3 mb-6 sm:mb-8">
        Notices
      </h1>

      {/* Hotel Fee Notice */}
      <div className="mb-8 sm:mb-10">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 sm:mb-1 gap-1 sm:gap-0">
          <h2 className="text-base sm:text-lg font-bold">Hotel Fee Deadline</h2>
          <p className="text-xs sm:text-sm font-semibold text-gray-700">23-03-2025</p>
        </div>
        <div className="shadow-[0_4px_15px_rgba(0,0,0,0.2)] focus:outline-none rounded-md p-3 sm:p-4 md:p-5">
          <p className="text-sm sm:text-base leading-relaxed">
            Students are requested to complete the payment on or before the due date to avoid late fines or cancellation of hostel admission.
            For payment-related queries, please contact the hostel office during working hours.
          </p>
        </div>
      </div>

      {/* Maintenance Notice */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 sm:mb-1 gap-1 sm:gap-0">
          <h2 className="text-base sm:text-lg font-bold">Maintenance Schedule</h2>
          <p className="text-xs sm:text-sm font-semibold text-gray-700">23-03-2025</p>
        </div>
        <div className="bg-white shadow-[0_4px_15px_rgba(0,0,0,0.2)] focus:outline-none rounded-md p-3 sm:p-4 md:p-5">
          <p className="text-sm sm:text-base">
            <span className="text-black font-semibold">Heads up! 🚨</span> Scheduled maintenance will take place.
          </p>
          <p className="mt-2 text-sm sm:text-base">
            <span className="text-black font-semibold">⚠️ Temporary disruption in:</span> [Water / Electricity / Wi-Fi]
          </p>
          <p className="mt-2 text-sm sm:text-base leading-relaxed">
            Please plan accordingly. We appreciate your cooperation!
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoticePage;
