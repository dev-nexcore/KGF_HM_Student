"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import api, { API_URL } from "@/lib/api";
import { Bell, Menu, Search, User, Compass } from "lucide-react";

export default function Navbar({ setSidebarOpen }) {
  const [studentName, setStudentName] = useState("...");
  const [studentProfile, setStudentProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const studentId = decoded.studentId;

        const res = await api.get(`/profile/${studentId}`);
        setStudentName(res.data.firstName || "Student");
        
        let profileImg = res.data.profileImage;
        if (profileImg && !profileImg.startsWith('http')) {
          profileImg = `${API_URL}${profileImg}`;
        }
        setStudentProfile(profileImg);
      } catch (err) {
        console.error("Failed to fetch student data:", err);
      }
    };

    fetchStudentData();
  }, []);

  const getPageTitle = () => {
    const path = pathname.split('/').pop();
    if (!path || path === 'dashboard') return 'Overview';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <nav className="sticky top-0 z-30 w-full bg-[#F8FAF5]/80 backdrop-blur-xl border-b border-[#7A8B5E]/5 px-4 sm:px-8 py-4 flex items-center justify-between">
      
      {/* ── Left Section: Mobile Toggle & Page Title ── */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2.5 rounded-xl bg-white border border-[#7A8B5E]/10 text-[#7A8B5E] shadow-sm active:scale-95 transition-transform"
        >
          <Menu size={20} />
        </button>
        
        <div className="hidden sm:block">
          <div className="flex items-center gap-2 mb-0.5">
            <Compass size={14} className="text-[#7A8B5E]" />
            <span className="text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em] opacity-60">University System</span>
          </div>
          <h2 className="text-xl font-black text-[#1A1F16] tracking-tight uppercase italic">{getPageTitle()}</h2>
        </div>
      </div>

      {/* ── Center Section: Search (Desktop) ── */}
      <div className="hidden md:flex flex-1 max-w-md mx-8 relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A8B5E] opacity-50 group-focus-within:opacity-100 transition-opacity">
          <Search size={16} />
        </div>
        <input 
          type="text" 
          placeholder="Search records, notices..."
          className="w-full pl-12 pr-6 py-3 rounded-2xl bg-[#7A8B5E]/5 border border-transparent focus:border-[#7A8B5E]/20 focus:bg-white outline-none text-xs font-bold transition-all"
        />
      </div>

      {/* ── Right Section: Actions & Profile ── */}
      <div className="flex items-center gap-3 sm:gap-6">
        
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="p-3 rounded-2xl bg-white border border-[#7A8B5E]/10 text-[#7A8B5E] shadow-sm hover:shadow-md transition-all relative"
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#C5A059] border-2 border-white rounded-full"></span>
            )}
          </button>
          
          {showNotifDropdown && (
            <div className="absolute right-0 mt-4 w-80 bg-white rounded-[32px] shadow-2xl border border-[#7A8B5E]/10 p-6 animate-in slide-in-from-top-2 duration-300">
              <h4 className="text-xs font-black text-[#1A1F16] uppercase tracking-widest mb-4">Latest Alerts</h4>
              <div className="space-y-4">
                <p className="text-[11px] font-bold text-[#6B7280] italic">No new notifications today.</p>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <Link href="/profile" className="flex items-center gap-4 group">
          <div className="hidden sm:block text-right">
            <p className="text-[10px] font-black text-[#7A8B5E] uppercase tracking-widest leading-none mb-1">Active</p>
            <p className="text-sm font-black text-[#1A1F16] tracking-tight">{studentName}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl border-2 border-white shadow-lg shadow-[#7A8B5E]/20 overflow-hidden bg-[#7A8B5E]/10 transition-transform group-hover:scale-105">
            {studentProfile ? (
              <Image 
                src={studentProfile} 
                alt="Profile" 
                width={48} 
                height={48} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#7A8B5E]">
                <User size={24} />
              </div>
            )}
          </div>
        </Link>
      </div>
    </nav>
  );
}
