'use client';

import React, { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function ForgetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await api.post('/forgot-password', { email });
      setMessage(res.data.message);
      localStorage.setItem('forgotPasswordEmail', email);
      router.push('/reset-password');
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#a1ad92] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-4xl px-16 py-14 min-h-[500px] flex flex-col justify-center">
        <h1 className="text-3xl font-bold text-center mb-10 text-black">Forget Password</h1>

        <form className="space-y-6 max-w-md mx-auto w-full" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2 text-left text-black">
              Email ID
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              id="email"
              type="email"
              placeholder="Enter Your Email ID"
              className="w-full px-4 py-3 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.2)] focus:outline-none text-[#000000]"
            />
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          {message && <p className="text-green-600 text-sm text-center">{message}</p>}

          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#b8bfa5] text-black font-semibold px-15 py-1.5 rounded-lg shadow-md hover:opacity-90 transition-all duration-200"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p
           className="text-sm text-gray-700 hover:underline cursor-pointer"
           onClick={() => router.push('/')} 
          >
            Back To Login
          </p>
        </div>
      </div>
    </div>
  );
}
