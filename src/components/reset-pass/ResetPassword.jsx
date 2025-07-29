'use client';
import React from 'react';

export default function ResetPassword() {
  return (
    <div className="min-h-screen bg-[#A4B494] flex items-center justify-center px-4">
      {/* Wide white card */}
      <div className="bg-white rounded-3xl shadow-xl p-10 sm:p-12 w-full max-w-4xl">
        {/* Inner container to center form elements */}
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-10 text-[#000000]">
            Reset Password
          </h1>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-[#000000]">OTP</label>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full px-4 py-3 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.2)] focus:outline-none text-sm text-[#000000]"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-[#000000]">New Password</label>
            <input
              type="password"
              placeholder="Enter New Password"
              className="w-full px-4 py-3 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.2)] focus:outline-none text-sm text-[#000000]"
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold mb-2 text-[#000000]">Confirm New Password</label>
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full px-4 py-3 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.2)] focus:outline-none text-sm text-[#000000]"
            />
          </div>

          <div className="flex justify-center mb-6">
            <button className="bg-[#BEC5AD] text-black font-semibold py-2 px-6 rounded-xl shadow-md hover:brightness-95 transition duration-200">
              Reset Password
            </button>
          </div>

          <p className="text-center text-sm text-[#545454] hover:underline cursor-pointer">
            Back To Login
          </p>
        </div>
      </div>
    </div>
  );
}
