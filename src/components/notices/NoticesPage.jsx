'use client';

import React from 'react';

const NoticePage = () => {
  return (
    <div className="bg-white text-black p-8 overflow-hidden">
      <h1 className="text-3xl font-bold border-l-4 border-red-600 pl-3 mb-8">Notices</h1>

      {/* Hotel Fee Notice */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-lg font-bold">Hotel Fee Deadline</h2>
          <p className="text-sm font-semibold text-gray-700">23-03-2025</p>
        </div>
        <div className="shadow-[0_4px_15px_rgba(0,0,0,0.2)] focus:outline-none rounded-md p-4">
          <p>
            Students are requested to complete the payment on or before the due date to avoid late fines or cancellation of hostel admission.
            For payment-related queries, please contact the hostel office during working hours.
          </p>
        </div>
      </div>

      {/* Maintenance Notice */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-lg font-bold">Maintenance Schedule</h2>
          <p className="text-sm font-semibold text-gray-700">23-03-2025</p>
        </div>
        <div className="bg-white shadow-[0_4px_15px_rgba(0,0,0,0.2)] focus:outline-none rounded-md p-4">
          <p><span className="text-black-600"> Heads up! 🚨</span> Scheduled maintenance will take place.</p>
          <p className="mt-1">
            <span className="text-black-600">⚠️ Temporary disruption in:</span> [Water / Electricity / Wi-Fi]
          </p>
          <p className="mt-1">Please plan accordingly. We appreciate your cooperation!</p>
        </div>
      </div>
    </div>
  );
};

export default NoticePage;
