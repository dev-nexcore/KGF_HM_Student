'use client';
import React from 'react';
import Image from 'next/image';
import { FiEdit } from 'react-icons/fi';

export default function Profile() {
  return (
    <div className="pt-2 px-2 md:pt-1 md:px-2">


      {/* Page Heading */}
     <div className="flex items-center mb-6">

<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold border-l-4 border-red-600 pl-3 mb-6 sm:mb-8 text-[#2c2c2c]">
        Fees Status
      </h1>
</div>


      {/* Cards Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Profile Card */}
          <div className="bg-[#BEC5AD] rounded-lg p-6 w-full lg:w-[35%] flex flex-col items-center justify-center shadow min-h-[330px] lg:min-h-[480px]">
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
  <button className="flex items-center justify-center md:justify-start gap-2 bg-[#BEC5AD] text-black px-6 py-2 rounded-xl shadow font-medium font-semibold w-full md:w-auto">
    <Image src="/icons/edit-icon.png" alt="Edit Icon" width={16} height={16} />
    Edit Profile
  </button>
</div>


    </div>
  );
}
