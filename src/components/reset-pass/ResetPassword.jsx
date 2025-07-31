'use client';
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { FiEye, FiEyeOff } from 'react-icons/fi';




export default function ResetPassword() {
const router = useRouter();
const [email, setEmail] = useState('');
const [otp, setOtp] = useState('');
const [otpVerified, setOtpVerified] = useState(false);

// ✅ Missing password states — add these:
const [newPassword, setNewPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');

const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

const [loadingOtp, setLoadingOtp] = useState(false);
const [loadingReset, setLoadingReset] = useState(false);
const [otpError, setOtpError] = useState('');
const [resetError, setResetError] = useState('');
const [otpSuccess, setOtpSuccess] = useState('');
const [resetSuccess, setResetSuccess] = useState('');

  useEffect(() => {
    const storedEmail = localStorage.getItem('forgotPasswordEmail');
    if (storedEmail) setEmail(storedEmail);
  }, []);

  // Sanitize OTP input: digits only, max 6
  const handleOtpChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(digitsOnly);
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setOtpError('Please enter a 6-digit OTP');
      return;
    }
    setLoadingOtp(true);
    setOtpError('');
    setOtpSuccess('');
    try {
      const res = await api.post('/verify-otp', { email, otp });
      setOtpSuccess(res.data.message);
      setOtpVerified(true);
    } catch (err) {
      setOtpError(err.response?.data?.message || 'OTP verification failed');
      setOtpVerified(false);
    } finally {
      setLoadingOtp(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');

    if (!otpVerified) {
      setResetError('Please verify OTP first');
      return;
    }
    if (!newPassword || !confirmPassword) {
      setResetError('Please fill in both password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match');
      return;
    }

    // You can add client-side password validation here too

    setLoadingReset(true);
    try {
      // Send email, otp, and newPassword (no reset token)
      const res = await api.post('/reset-password', { email, otp, newPassword });
      setResetSuccess(res.data.message);
      localStorage.removeItem('forgotPasswordEmail'); // clean up
      setTimeout(() => router.push('/'), 1000);
    } catch (err) {
      setResetError(err.response?.data?.message || 'Password reset failed');
    } finally {
      setLoadingReset(false);
    }
  };

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
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={handleOtpChange}
                disabled={otpVerified}
                inputMode="numeric"
                pattern="\d*"
                maxLength={6}
                className="w-full px-4 py-3 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.2)] focus:outline-none text-sm text-[#000000]"
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={loadingOtp || otpVerified}
                className="bg-[#BEC5AD] text-black font-semibold py-2 px-4 rounded-xl shadow-md hover:brightness-95 transition duration-200"
              >
                {loadingOtp ? 'Verifying...' : otpVerified ? 'Verified' : 'Verify'}
              </button>
            </div>
            {otpError && <p className="text-red-600 text-sm mt-1">{otpError}</p>}
            {otpSuccess && <p className="text-green-600 text-sm mt-1">{otpSuccess}</p>}
          </div>

          <form onSubmit={handleResetPassword}>
           {/* New Password Field */}
<div className="mb-6 relative">
  <label className="block text-sm font-semibold mb-2 text-[#000000]">
    New Password
  </label>
  <input
    type={showNewPassword ? 'text' : 'password'}
    placeholder="Enter New Password"
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    disabled={!otpVerified}
    className="w-full px-4 py-3 pr-12 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.2)] focus:outline-none text-sm text-[#000000]"
  />
  <button
    type="button"
    onClick={() => setShowNewPassword(!showNewPassword)}
    className="absolute right-4 top-12.5 transform -translate-y-1/2"
  >
    {showNewPassword ? (
      <FiEyeOff className="text-gray-700 w-5 h-5" />
    ) : (
      <FiEye className="text-gray-700 w-5 h-5" />
    )}
  </button>
</div>

{/* Confirm New Password Field */}
<div className="mb-8 relative">
  <label className="block text-sm font-semibold mb-2 text-[#000000]">
    Confirm New Password
  </label>
  <input
    type={showConfirmPassword ? 'text' : 'password'}
    placeholder="Confirm New Password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    disabled={!otpVerified}
    className="w-full px-4 py-3 pr-12 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.2)] focus:outline-none text-sm text-[#000000]"
  />
  <button
    type="button"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    className="absolute right-4 top-12.5 transform -translate-y-1/2"
  >
    {showConfirmPassword ? (
      <FiEyeOff className="text-gray-700 w-5 h-5" />
    ) : (
      <FiEye className="text-gray-700 w-5 h-5" />
    )}
  </button>
</div>

            {(resetError || resetSuccess) && (
              <p className={`text-sm text-center mb-3 ${resetError ? 'text-red-600' : 'text-green-600'}`}>
                {resetError || resetSuccess}
              </p>
            )}

            <div className="flex justify-center mb-6">
              <button
                type="submit"
                disabled={loadingReset || !otpVerified}
                className="bg-[#BEC5AD] text-black font-semibold py-2 px-6 rounded-xl shadow-md hover:brightness-95 transition duration-200"
              >
                {loadingReset ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>

          <p
            className="text-center text-sm text-[#545454] hover:underline cursor-pointer"
            onClick={() => router.push('/')}
          >
            Back To Login
          </p>
        </div>
      </div>
    </div>
  );
}
