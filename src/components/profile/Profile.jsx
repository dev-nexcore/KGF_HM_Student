'use client';
import React from 'react';
import { FiEdit } from 'react-icons/fi';

export default function Profile() {
  return (
    <div className="pt-2 px-2 md:pt-1 md:px-2">


      {/* Page Heading */}
     <div className="flex items-center mb-6">
  <div className="w-1 h-5 bg-red-600 mr-2 rounded"></div>
  <h1 className="text-lg font-semibold text-[#2c2c2c]">Profile</h1>
</div>


      {/* Cards Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Profile Card */}
        <div className="bg-[#BEC5AD] rounded-lg p-6 w-full lg:w-[35%] flex flex-col items-center justify-center shadow min-h-[480px]">
          <div className="w-32 h-32 rounded-full bg-white mb-4" />
          <h2 className="text-lg font-bold text-black mb-1">Nouman Khan</h2>
          <p className="text-sm font-semibold text-black">Student ID: HFL-001</p>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-lg p-6 w-full lg:w-[35%] shadow text-sm text-black font-semibold min-h-[420px]">
          <div className="flex flex-col space-y-7">
            <div className="flex justify-between">
              <span>Email:</span>
              <span className="text-gray-700 font-normal">xyz@gmail.com</span>
            </div>
            <div className="flex justify-between">
              <span>Phone no:</span>
              <span className="text-gray-700 font-normal">9321625553</span>
            </div>
            <div className="flex justify-between">
              <span>Room no:</span>
              <span className="text-gray-700 font-normal">101</span>
            </div>
            <div className="flex justify-between">
              <span>Room Name:</span>
              <span className="text-gray-700 font-normal">Chinmay Gawade</span>
            </div>
            <div className="flex justify-between">
              <span>Hostel Wing:</span>
              <span className="text-gray-700 font-normal">B</span>
            </div>
            <div className="flex justify-between">
              <span>Bed Allotment:</span>
              <span className="text-gray-700 font-normal">2</span>
            </div>
            <div className="flex justify-between">
              <span>Check-in Date:</span>
              <span className="text-gray-700 font-normal">02-07-2025</span>
            </div>
          </div>
        </div>
      </div>

    {/* Edit Profile Button */}
<div className="mt-6 text-center md:text-left md:pl-85">
  <button className="flex items-center justify-center md:justify-start gap-2 bg-[#BEC5AD] text-black px-6 py-2 rounded-xl shadow font-medium w-full md:w-auto">
    <FiEdit /> Edit Profile
  </button>
</div>

    </div>
  );
}
