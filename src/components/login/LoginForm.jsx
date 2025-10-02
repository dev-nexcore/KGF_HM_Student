// "use client";

// import api from "@/lib/api";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { FiEye, FiEyeOff } from "react-icons/fi";
// import { toast, Toaster } from "react-hot-toast";

// export default function Login() {
//   const [studentId, setStudentId] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [mounted, setMounted] = useState(false);
//   const router = useRouter();

//   // Mount animation
//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await api.post("/login", { studentId, password });

//       toast.success("Login successful!");

//       // ✅ Store both token and studentId correctly
//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("studentId", res.data.student.studentId);

//       router.push("/dashboard");
//     } catch (err) {
//       const status = err?.response?.status;
//       const data = err?.response?.data;
//       const msg = data?.message || err.message || "Login failed.";

//       console.error("Login failed:", { status, data, msg });
//       toast.error(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle Enter key press
//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleSubmit(e);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full bg-white overflow-x-hidden">
//       {/* Mobile Layout */}
//       <div className="md:hidden flex flex-col min-h-screen">
//         {/* Top Section */}
//         <div className={`bg-[#A4B494] px-4 py-8 flex flex-col items-center justify-center text-center transition-all duration-1000 ease-out ${
//           mounted ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
//         }`}>
//           <h1 className={`text-2xl font-extrabold mb-4 text-black transition-all duration-700 delay-300 ease-out ${
//             mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
//           }`}>
//             Welcome Back!
//           </h1>
          
//           <div className={`transition-all duration-700 delay-500 ease-out transform ${
//             mounted ? 'scale-100 opacity-100 rotate-0' : 'scale-75 opacity-0 rotate-12'
//           }`}>
//             <div className="w-32 h-32 rounded-xl overflow-hidden bg-white shadow-lg">
//               <img
//                 src="logo.png"
//                 alt="Kokan Global Foundation"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           </div>
          
//           <p className={`mt-4 text-xs font-bold text-black leading-tight transition-all duration-700 delay-700 ease-out px-2 ${
//             mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
//           }`}>
//             "Manage Your Hostel Smarter – Everything You Need in One Platform."
//           </p>
//         </div>

//         {/* Bottom Section - Login Form */}
//         <div className={`bg-white px-4 py-4 transition-all duration-1000 ease-out ${
//           mounted ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
//         }`}>
//           <h2 className={`text-xl font-bold mb-6 text-black text-center transition-all duration-700 delay-200 ease-out ${
//             mounted ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
//           }`}>
//             Student Login
//           </h2>

//           <div className={`transition-all duration-700 delay-400 ease-out ${
//             mounted ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
//           }`}>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {/* User ID Input */}
//               <div className="space-y-2">
//                 <label className="text-sm font-semibold text-black block">
//                   User ID
//                 </label>
//                 <input
//                   type="text"
//                   value={studentId}
//                   onChange={(e) => setStudentId(e.target.value)}
//                   placeholder="Enter Your User ID"
//                   className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A4B494] focus:border-transparent transition-all duration-300 placeholder:text-gray-400 text-black"
//                   onKeyDown={handleKeyPress}
//                 />
//               </div>

//               {/* Password Input */}
//               <div className="space-y-2">
//                 <label className="text-sm font-semibold text-black block">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder="Enter Your Password"
//                     className="w-full px-3 py-2.5 pr-10 text-sm rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A4B494] focus:border-transparent transition-all duration-300 placeholder:text-gray-400 text-black"
//                     onKeyDown={handleKeyPress}
//                   />
//                   <div
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer hover:text-[#A4B494] transition-colors duration-200"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
//                   </div>
//                 </div>
//               </div>

//               {/* Forgot Password Link */}
//               <div className="flex justify-end pt-1">
//                 <p 
//                   onClick={() => router.push('/forget')} 
//                   className="text-xs text-blue-500 hover:text-blue-700 hover:underline cursor-pointer transition-all duration-200"
//                 >
//                   Forget Password?
//                 </p>
//               </div>

//               {/* Login Button - Much closer to form */}
//               <div className="pt-4 pb-2">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-[#BEC5AD] hover:bg-[#a9b29d] disabled:bg-gray-400 disabled:cursor-not-allowed text-black font-bold py-3 text-sm rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-95 disabled:scale-100"
//                 >
//                   {loading ? (
//                     <div className="flex items-center justify-center space-x-2">
//                       <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
//                       <span>Signing in...</span>
//                     </div>
//                   ) : (
//                     "Login"
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>

//       {/* Desktop Layout */}
//       <div className="hidden md:flex md:flex-row md:h-screen">
//         {/* Left Panel - Enhanced with animations */}
//         <div className={`w-1/2 bg-[#A4B494] p-8 rounded-r-[5rem] flex flex-col items-center justify-center text-center transition-all duration-1000 ease-out ${
//           mounted ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
//         }`}>
//           <h1 className={`text-4xl font-extrabold mb-12 -mt-4 text-black transition-all duration-700 delay-300 ease-out ${
//             mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
//           }`}>
//             Welcome Back!
//           </h1>
          
//           <div className={`transition-all duration-700 delay-500 ease-out transform ${
//             mounted ? 'scale-100 opacity-100 rotate-0' : 'scale-75 opacity-0 rotate-12'
//           }`}>
//             <div className="w-72 h-72 rounded-xl overflow-hidden bg-white shadow-lg hover:scale-110 transition-transform duration-300 ease-in-out">
//               <img
//                 src="logo.png"
//                 alt="Kokan Global Foundation"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           </div>
          
//           <p className={`mt-10 text-xl font-bold text-black leading-tight transition-all duration-700 delay-700 ease-out ${
//             mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
//           }`}>
//             "Manage Your Hostel Smarter – Everything You Need in&nbsp;
//             <br />
//             One Platform."
//           </p>
//         </div>

//         {/* Right Panel - Enhanced with slide-in animation */}
//         <div className={`w-1/2 bg-white p-12 flex flex-col justify-center items-center transition-all duration-1000 ease-out ${
//           mounted ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
//         }`}>
//           <h2 className={`text-4xl font-bold mb-10 text-black text-center transition-all duration-700 delay-200 ease-out ${
//             mounted ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
//           }`}>
//             Student Login
//           </h2>

//           <div className={`flex flex-col w-full max-w-md transition-all duration-700 delay-400 ease-out ${
//             mounted ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
//           }`}>
//             <form onSubmit={handleSubmit} className="w-full space-y-6">
//               {/* User ID Input */}
//               <div className="space-y-2">
//                 <label className="text-lg font-semibold text-black block">
//                   User ID
//                 </label>
//                 <input
//                   type="text"
//                   value={studentId}
//                   onChange={(e) => setStudentId(e.target.value)}
//                   placeholder="Enter Your User ID"
//                   className="w-full px-4 py-3 rounded-[1rem] border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-[#A4B494] focus:border-transparent transition-all duration-300 ease-in-out transform focus:scale-[1.02] hover:shadow-lg placeholder:text-gray-400 text-black"
//                   onKeyDown={handleKeyPress}
//                 />
//               </div>

//               {/* Password Input */}
//               <div className="space-y-2">
//                 <label className="text-lg font-semibold text-black block">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder="Enter Your Password"
//                     className="w-full px-4 py-3 pr-12 rounded-[1rem] border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-[#A4B494] focus:border-transparent transition-all duration-300 ease-in-out transform focus:scale-[1.02] hover:shadow-lg placeholder:text-gray-400 text-black"
//                     onKeyDown={handleKeyPress}
//                   />
//                   <div
//                     className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer hover:text-[#A4B494] transition-colors duration-200"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
//                   </div>
//                 </div>
//               </div>

//               {/* Forgot Password Link */}
//               <div className="flex justify-end">
//                 <p 
//                   onClick={() => router.push('/forget')} 
//                   className="text-sm text-blue-500 hover:text-blue-700 hover:underline cursor-pointer transition-all duration-200 transform hover:translate-x-1"
//                 >
//                   Forget Password?
//                 </p>
//               </div>

//               {/* Login Button */}
//               <div className="w-full flex justify-center pt-2">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-2/3 bg-[#BEC5AD] hover:bg-[#a9b29d] disabled:bg-gray-400 disabled:cursor-not-allowed text-black font-bold py-3 rounded-xl shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg active:scale-95 disabled:scale-100 disabled:hover:shadow-md"
//                 >
//                   {loading ? (
//                     <div className="flex items-center justify-center space-x-2">
//                       <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
//                       <span>Signing in...</span>
//                     </div>
//                   ) : (
//                     "Login"
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>

//       {/* Custom CSS for additional animations */}
//       <style jsx>{`
//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         .animate-fadeInUp {
//           animation: fadeInUp 0.5s ease-out forwards;
//         }
        
//         /* Pulse animation for loading states */
//         @keyframes pulse {
//           0%, 100% {
//             opacity: 1;
//           }
//           50% {
//             opacity: 0.5;
//           }
//         }
        
//         .animate-pulse {
//           animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
//         }
//       `}</style>
//     </div>
//   );
// }





"use client";

import api from "@/lib/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";

export default function Login() {
  const [studentId, setStudentId] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  // Send OTP to student's email/WhatsApp
  const handleSendOtp = async () => {
    if (!studentId) return toast.error("Please enter your User ID");

    setLoading(true);
    try {
      const res = await api.post("/send-otp", { studentId });
      toast.success(res.data.message || "OTP sent successfully");
      setOtpSent(true);
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to send OTP";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Login with OTP
  const handleOtpLogin = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error("Please enter OTP");

    setLoading(true);
    try {
      const res = await api.post("/login", { studentId, otp });
      toast.success("Login successful!");

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("studentId", res.data.student.studentId);

      router.push("/dashboard");
    } catch (err) {
      const msg = err?.response?.data?.message || "Login failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    otpSent ? handleOtpLogin(e) : handleSendOtp();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSubmit(e);
  };

  return (
    <div className="min-h-screen w-full bg-white overflow-x-hidden">
      {/* <Toaster position="top-right" /> */}

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col min-h-screen">
        <div
          className={`bg-[#A4B494] px-4 py-8 flex flex-col items-center justify-center text-center transition-all duration-1000 ease-out ${
            mounted ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
          }`}
        >
          <h1
            className={`text-2xl font-extrabold mb-4 text-black transition-all duration-700 delay-300 ease-out ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            Welcome Back!
          </h1>

          <div
            className={`transition-all duration-700 delay-500 ease-out transform ${
              mounted ? "scale-100 opacity-100 rotate-0" : "scale-75 opacity-0 rotate-12"
            }`}
          >
            <div className="w-32 h-32 rounded-xl overflow-hidden bg-white shadow-lg">
              <img src="logo.png" alt="Kokan Global Foundation" className="w-full h-full object-cover" />
            </div>
          </div>

          <p
            className={`mt-4 text-xs font-bold text-black leading-tight transition-all duration-700 delay-700 ease-out px-2 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            "Manage Your Hostel Smarter – Everything You Need in One Platform."
          </p>
        </div>

        {/* Login Form */}
        <div
          className={`bg-white px-4 py-4 transition-all duration-1000 ease-out ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          }`}
        >
          <h2
            className={`text-xl font-bold mb-6 text-black text-center transition-all duration-700 delay-200 ease-out ${
              mounted ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
            }`}
          >
            Student Login
          </h2>

          <div
            className={`transition-all duration-700 delay-400 ease-out ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
            }`}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Student ID */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-black block">User ID</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="Enter Your Student ID"
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A4B494] focus:border-transparent transition-all duration-300 placeholder:text-gray-400 text-black"
                  onKeyDown={handleKeyPress}
                  disabled={otpSent}
                />
              </div>

              {/* OTP Input */}
              {otpSent && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-black block">OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A4B494] focus:border-transparent transition-all duration-300 placeholder:text-gray-400 text-black"
                    onKeyDown={handleKeyPress}
                  />
                </div>
              )}

              {/* Forgot Password */}
              {/* <div className="flex justify-end pt-1">
                <p
                  onClick={() => router.push("/forget")}
                  className="text-xs text-blue-500 hover:text-blue-700 hover:underline cursor-pointer transition-all duration-200"
                >
                  Forget Password?
                </p>
              </div> */}

              {/* Submit Button */}
              <div className="pt-4 pb-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#BEC5AD] hover:bg-[#a9b29d] disabled:bg-gray-400 disabled:cursor-not-allowed text-black font-bold py-3 text-sm rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-95 disabled:scale-100"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span>{otpSent ? "Logging in..." : "Sending OTP..."}</span>
                    </div>
                  ) : otpSent ? (
                    "Login"
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex md:flex-row md:h-screen">
        {/* Left Panel */}
        <div
          className={`w-1/2 bg-[#A4B494] p-8 rounded-r-[5rem] flex flex-col items-center justify-center text-center transition-all duration-1000 ease-out ${
            mounted ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
          }`}
        >
          <h1
            className={`text-4xl font-extrabold mb-12 -mt-4 text-black transition-all duration-700 delay-300 ease-out ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            Welcome Back!
          </h1>

          <div
            className={`transition-all duration-700 delay-500 ease-out transform ${
              mounted ? "scale-100 opacity-100 rotate-0" : "scale-75 opacity-0 rotate-12"
            }`}
          >
            <div className="w-72 h-72 rounded-xl overflow-hidden bg-white shadow-lg hover:scale-110 transition-transform duration-300 ease-in-out">
              <img src="logo.png" alt="Kokan Global Foundation" className="w-full h-full object-cover" />
            </div>
          </div>

          <p
            className={`mt-10 text-xl font-bold text-black leading-tight transition-all duration-700 delay-700 ease-out ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            "Manage Your Hostel Smarter – Everything You Need in&nbsp;
            <br />
            One Platform."
          </p>
        </div>

        {/* Right Panel */}
        <div
          className={`w-1/2 bg-white p-12 flex flex-col justify-center items-center transition-all duration-1000 ease-out ${
            mounted ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
        >
          <h2
            className={`text-4xl font-bold mb-10 text-black text-center transition-all duration-700 delay-200 ease-out ${
              mounted ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
            }`}
          >
            Student Login
          </h2>

          <div
            className={`flex flex-col w-full max-w-md transition-all duration-700 delay-400 ease-out ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
            }`}
          >
            <form onSubmit={handleSubmit} className="w-full space-y-6">
              {/* Student ID */}
            <label className="text-xl font-semibold text-black w-full text-left block transition-colors duration-200">
                    Student ID
                  </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Enter Your Student ID"
                className="w-full px-4 py-3 rounded-[1rem] border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-[#A4B494] focus:border-transparent transition-all duration-300 ease-in-out transform focus:scale-[1.02] hover:shadow-lg placeholder:text-gray-400 text-black"
                onKeyDown={handleKeyPress}
                disabled={otpSent}
              />

              {/* OTP */}
              {otpSent && (
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full px-4 py-3 rounded-[1rem] border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-[#A4B494] focus:border-transparent transition-all duration-300 ease-in-out transform focus:scale-[1.02] hover:shadow-lg placeholder:text-gray-400 text-black"
                  onKeyDown={handleKeyPress}
                />
              )}

              {/* Forgot Password */}
              {/* <div className="flex justify-end">
                <p
                  onClick={() => router.push("/forget")}
                  className="text-sm text-blue-500 hover:text-blue-700 hover:underline cursor-pointer transition-all duration-200 transform hover:translate-x-1"
                >
                  Forget Password?
                </p>
              </div> */}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#BEC5AD] hover:bg-[#a9b29d] disabled:bg-gray-400 disabled:cursor-not-allowed text-black font-bold py-3 rounded-xl shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg active:scale-95 disabled:scale-100 disabled:hover:shadow-md"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>{otpSent ? "Logging in..." : "Sending OTP..."}</span>
                  </div>
                ) : otpSent ? (
                  "Login"
                ) : (
                  "Send OTP"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
