"use client";

import api from "@/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";

export default function Login() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState(""); // ✅ Make sure this line is here
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/login", { studentId, password });

      toast.success("Login successful!");

      // ✅ Store both token and studentId correctly
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("studentId", res.data.student.studentId);

      router.push("/dashboard");
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      const msg = data?.message || err.message || "Login failed.";

      console.error("Login failed:", { status, data, msg });
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Panel */}
      <div className="w-full md:w-1/2 min-h-[50vh] md:min-h-full bg-[#A4AE97] p-8 flex flex-col items-center justify-center md:rounded-r-[100px]">
        <h2 className="text-4xl font-extrabold mb-16 text-black text-center">
          Welcome Back!
        </h2>

        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center justify-center w-60 h-60 md:w-72 md:h-72">
            <img
              src="logo.png"
              alt="Kokan Global Foundation"
              className="w-60 h-60 md:w-68 md:h-68 object-cover rounded-[20px] shadow-lg"
            />
          </div>
        </div>

        <p className="text-center font-semibold text-[15px] text-black mt-6 px-4 leading-6">
          "Manage Your Hostel Smarter – Everything You Need in <br /> One Platform."
        </p>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-1/2 min-h-[50vh] md:min-h-full bg-white flex flex-col items-center justify-center px-6 md:px-12 py-8 md:py-0">
        <h2 className="text-4xl font-extrabold mb-16 text-black text-center">
          Student Login
        </h2>
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
          <div>
            <label
              className="block text-[18px] font-semibold text-black mb-2"
              htmlFor="userId"
            >
              User ID
            </label>
            <input
              type="text"
              id="userId"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Enter Your User ID"
              className="w-full p-3 rounded-[13px] border border-gray-200 focus:outline-none focus:ring focus:ring-gray-400 shadow-[0_6px_20px_rgba(0,0,0,0.25)] placeholder:text-gray-400 text-black"
            />
          </div>
          <div>
            <label
              className="block text-[18px] font-semibold text-black mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Your Password"
                className="w-full p-3 pr-12 rounded-[13px] border border-gray-200 focus:outline-none focus:ring focus:ring-gray-400 shadow-[0_6px_20px_rgba(0,0,0,0.25)] placeholder:text-gray-400 text-black"
              />

              <div
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <p onClick={() => router.push('/forget')} className="text-sm text-blue-500 hover:underline">
              Forget Password?
            </p>
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-[13px] bg-[#A4AE97] text-black font-semibold text-[20px] shadow hover:shadow-md transition"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
