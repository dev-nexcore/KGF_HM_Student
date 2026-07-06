"use client";

import api from "@/lib/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const LoginForm = () => {
  const [step, setStep] = useState(1);
  const [studentId, setStudentId] = useState("");
  const [otp, setOtp] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!studentId) {
      setErrorMsg("Please enter your Student ID");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    try {
      const res = await api.post("/send-otp", { studentId });
      toast.success(res.data?.message || "OTP sent successfully");
      setMaskedEmail(res.data?.email || "your registered email");
      setStep(2);
      setResendTimer(60);
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) {
      setErrorMsg("Please enter OTP");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    try {
      const res = await api.post("/login", { studentId, otp });
      toast.success("Login successful!");

      sessionStorage.clear();
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("studentId", res.data.student.studentId);

      router.push("/dashboard");
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Login failed");
    } finally { 
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await api.post("/send-otp", { studentId });
      toast.success(res.data?.message || "OTP resent successfully");
      setMaskedEmail(res.data?.email || "your registered email");
      setResendTimer(60);
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setOtp("");
    setErrorMsg("");
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#A4B494] overflow-hidden">
      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-row w-full h-full bg-white shadow-2xl overflow-hidden">
        {/* Left Panel */}
        <div
          className={`w-1/2 bg-[#9AAA87] flex flex-col items-center justify-center text-center px-6 py-10 lg:px-16 lg:py-0 rounded-none lg:rounded-r-[100px] shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-1000 ease-out ${
            mounted
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0"
          }`}
        >
          <h2
            className={`text-3xl sm:text-4xl font-bold text-black mb-12 transition-all duration-700 delay-300 ease-out ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            Welcome Back!
          </h2>

          <div
            className={`transition-all duration-700 delay-500 ease-out transform ${
              mounted
                ? "scale-100 opacity-100 rotate-0"
                : "scale-75 opacity-0 rotate-12"
            }`}
          >
            <img
              src="logo.png"
              alt="Logo"
              className="w-[210px] h-[190px] bg-white p-4 rounded-lg mb-14 object-contain hover:scale-110 transition-transform duration-300 ease-in-out shadow-lg"
            />
          </div>

          <p
            className={`text-black text-lg font-semibold max-w-lg transition-all duration-700 delay-700 ease-out ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            "Manage Your Hostel Smarter – Everything You Need in One Platform."
          </p>
        </div>

        {/* Right Panel */}
        <div
          className={`w-1/2 flex flex-col justify-center items-center px-6 py-10 sm:px-10 lg:px-16 bg-white transition-all duration-1000 ease-out ${
            mounted ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
        >
          <h2
            className={`text-4xl font-bold text-black mb-16 transition-all duration-700 delay-200 ease-out ${
              mounted ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
            }`}
          >
            Student Login
          </h2>

          <div
            className={`w-full max-w-sm transition-all duration-700 delay-400 ease-out ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
            }`}
          >
            {step === 1 ? (
              // Step 1: Enter Student ID
              <form onSubmit={handleSendOTP} className="space-y-6 w-full">
                <div>
                  <label className="block text-lg font-bold mb-2">Student ID</label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Enter Your Student ID"
                    required
                    className="w-full px-5 py-3 text-gray-800 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9AAA87] placeholder:font-medium transition-all duration-300 ease-in-out transform focus:scale-[1.02] hover:shadow-lg"
                    style={{
                      boxShadow: "0px 4px 10px 0px #00000040",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: "500",
                    }}
                  />
                </div>

                {errorMsg && (
                  <div className="text-red-600 text-sm font-semibold text-center animate-fadeInUp">
                    {errorMsg}
                  </div>
                )}

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-[200px] cursor-pointer bg-[#BEC5AD] text-black font-bold py-3 rounded-xl hover:bg-[#c1cca4] transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg active:scale-95 disabled:scale-100 disabled:opacity-70"
                    style={{ boxShadow: "0px 4px 10px 0px #00000040" }}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </div>
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                </div>
              </form>
            ) : (
              // Step 2: Enter OTP
              <form onSubmit={handleVerifyOTP} className="space-y-6 w-full">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">
                    OTP sent to Registered Email: <span className="font-semibold">{maskedEmail}</span>
                  </p>
                </div>

                <div>
                  <label className="block text-lg font-bold mb-2">Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    required
                    maxLength={6}
                    className="w-full px-5 py-3 text-gray-800 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9AAA87] placeholder:font-medium text-center text-xl tracking-widest transition-all duration-300 ease-in-out transform focus:scale-[1.02] hover:shadow-lg"
                    style={{
                      boxShadow: "0px 4px 10px 0px #00000040",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: "500",
                    }}
                  />
                </div>

                {errorMsg && (
                  <div className="text-red-600 text-sm font-semibold text-center animate-fadeInUp">
                    {errorMsg}
                  </div>
                )}

                <div className="flex flex-col items-center space-y-3">
                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-[200px] cursor-pointer bg-[#BEC5AD] text-black font-bold py-3 rounded-xl hover:bg-[#c1cca4] transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg active:scale-95 disabled:scale-100 disabled:opacity-70"
                    style={{ boxShadow: "0px 4px 10px 0px #00000040" }}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      "Verify & Login"
                    )}
                  </button>

                  <div className="flex items-center space-x-4 mt-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="text-gray-600 text-sm font-medium hover:underline transition-colors duration-200"
                    >
                      ← Back
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={resendTimer > 0 || loading}
                      className="text-gray-600 text-sm font-medium hover:underline transition-colors duration-200 disabled:text-gray-400 disabled:no-underline"
                    >
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col w-full min-h-screen bg-white">
        {/* Top Section (Green) */}
        <div
          className={`flex flex-col items-center justify-center bg-[#A4B494] px-6 py-12 text-center transition-all duration-1000 ease-out ${
            mounted ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
          }`}
        >
          <h2 className="text-3xl font-bold text-black mb-6">Welcome Back!</h2>
          <div className="bg-white p-4 rounded-2xl mb-6 shadow-md">
            <img
              src="logo.png"
              alt="Logo"
              className="w-[140px] h-[140px] object-contain"
            />
          </div>
          <p className="text-black text-[15px] font-semibold max-w-[280px] leading-snug">
            "Manage Your Hostel Smarter – Everything You Need in One Platform."
          </p>
        </div>

        {/* Bottom Section (White) */}
        <div
          className={`flex flex-col items-center justify-start bg-white px-6 py-10 transition-all duration-1000 ease-out flex-grow ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <h2 className="text-2xl font-bold text-black mb-8">Student Login</h2>

          <div className="w-full max-w-sm">
            {step === 1 ? (
              // Step 1: Enter Student ID (Mobile)
              <form onSubmit={handleSendOTP} className="space-y-6 w-full">
                <div>
                  <label className="block text-[15px] font-bold mb-2 text-black">
                    Student ID
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Enter Student ID"
                    required
                    className="w-full px-4 py-3 text-gray-800 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#A4B494] focus:ring-1 focus:ring-[#A4B494] placeholder:text-gray-400 transition-all shadow-sm"
                  />
                </div>

                {errorMsg && (
                  <div className="text-red-600 text-sm font-semibold text-center animate-fadeInUp">
                    {errorMsg}
                  </div>
                )}

                <div className="flex justify-center pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#BEC5AD] text-black font-bold py-3.5 rounded-xl hover:bg-[#A4B494] transition-all disabled:opacity-70 shadow-sm"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </div>
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                </div>
              </form>
            ) : (
              // Step 2: Enter OTP (Mobile)
              <form onSubmit={handleVerifyOTP} className="space-y-6 w-full">
                <div className="text-center mb-2">
                  <p className="text-sm text-gray-600">
                    OTP sent to Registered Email: <br /><span className="font-semibold text-black">{maskedEmail}</span>
                  </p>
                </div>

                <div>
                  <label className="block text-[15px] font-bold mb-2 text-black">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    required
                    maxLength={6}
                    className="w-full px-4 py-3 text-xl text-gray-800 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#A4B494] focus:ring-1 focus:ring-[#A4B494] text-center tracking-widest transition-all shadow-sm"
                  />
                </div>

                {errorMsg && (
                  <div className="text-red-600 text-sm font-semibold text-center animate-fadeInUp">
                    {errorMsg}
                  </div>
                )}

                <div className="flex flex-col items-center space-y-4 pt-2">
                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full bg-[#BEC5AD] text-black font-bold py-3.5 rounded-xl hover:bg-[#A4B494] transition-all disabled:opacity-70 shadow-sm"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      "Verify & Login"
                    )}
                  </button>

                  <div className="flex items-center justify-between w-full text-sm mt-4 px-1">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="text-gray-600 font-medium hover:underline"
                    >
                      ← Back
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={resendTimer > 0 || loading}
                      className="text-black font-bold hover:underline disabled:text-gray-400"
                    >
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LoginForm;