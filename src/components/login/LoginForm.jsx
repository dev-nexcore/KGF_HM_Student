"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { Lock, User, ArrowRight, ShieldCheck, GraduationCap } from 'lucide-react';
import logoImg from "../../../public/logo.png";

export default function StudentLogin() {
  const [studentId, setStudentId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!studentId.trim()) return toast.error("Please enter your Student ID");
    
    setIsLoading(true);
    const loadingToast = toast.loading("Verifying identity...");
    try {
      const response = await api.post("/login", { studentId: studentId.trim() });
      const { token, student } = response.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("studentId", student.studentId);
      localStorage.setItem("studentInfo", JSON.stringify(student));
      
      toast.success(`Welcome back, ${student.firstName || 'Student'}!`, { id: loadingToast });
      router.push("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Please check your Student ID.", { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#F8FAF5] flex items-center justify-center p-4 font-sans selection:bg-[#7A8B5E]/20">
      <Toaster position="top-center" />
      
      <div className="w-full max-w-5xl bg-white rounded-[48px] shadow-2xl shadow-[#7A8B5E]/10 overflow-hidden flex flex-col md:flex-row border border-[#7A8B5E]/5 animate-in fade-in zoom-in duration-700">
        
        {/* ── Left Side: Visual Branding ── */}
        <div className="w-full md:w-[45%] bg-[#7A8B5E] p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="bg-white p-4 rounded-[28px] inline-block shadow-xl mb-8 transform -rotate-3">
              <Image 
                src={logoImg} 
                alt="KGF Logo" 
                width={64}
                height={64}
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-4xl font-black tracking-tight leading-none mb-4 uppercase italic">
              Student <br />
              <span className="text-[#F8FAF5]/80">Portal</span>
            </h1>
            <div className="h-1 w-12 bg-[#C5A059] rounded-full"></div>
          </div>

          <div className="relative z-10">
            <p className="text-lg font-medium leading-relaxed opacity-90 max-w-xs italic font-serif">
              "Excellence in living, <br />
              Focus in learning."
            </p>
            <div className="mt-8 flex items-center gap-4 text-xs font-black uppercase tracking-widest opacity-60">
              <ShieldCheck size={16} />
              <span>Secure Student Access</span>
            </div>
          </div>
        </div>

        {/* ── Right Side: Login Form ── */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center bg-white relative">
          <div className="max-w-sm mx-auto w-full">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-black text-[#1A1F16] mb-2 tracking-tight uppercase italic">Access Panel</h2>
              <p className="text-[#6B7280] font-bold text-xs uppercase tracking-widest">Identify yourself to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="group relative">
                  <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em] ml-1 mb-2 block transition-colors group-focus-within:text-[#7A8B5E]">
                    University / Student ID
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A8B5E] opacity-50 group-focus-within:opacity-100 transition-opacity">
                      <GraduationCap size={20} />
                    </div>
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="e.g. STU-2024-001"
                      className="w-full pl-12 pr-6 py-4 rounded-[20px] bg-[#F8FAF5] border-2 border-transparent focus:border-[#7A8B5E]/20 focus:bg-white outline-none font-bold text-[#1A1F16] transition-all placeholder:text-gray-300 shadow-inner"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1A1F16] text-white py-5 rounded-[20px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-black/20 flex items-center justify-center gap-3 hover:bg-[#2A3324] transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="pt-6 border-t border-gray-100 mt-8 flex items-center justify-between">
                <button 
                  type="button"
                  onClick={() => router.push('/forget')}
                  className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest hover:text-[#7A8B5E] transition-colors"
                >
                  Need Help?
                </button>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#7A8B5E]/20"></div>
                  <div className="w-2 h-2 rounded-full bg-[#C5A059]/20"></div>
                  <div className="w-2 h-2 rounded-full bg-[#7A8B5E]/20"></div>
                </div>
              </div>
            </form>
          </div>
          
          {/* Subtle branding at bottom */}
          <div className="absolute bottom-8 right-8 hidden lg:block opacity-10">
            <h3 className="text-4xl font-black uppercase italic tracking-tighter text-[#7A8B5E]">KGF HM</h3>
          </div>
        </div>
      </div>
    </div>
  );
}