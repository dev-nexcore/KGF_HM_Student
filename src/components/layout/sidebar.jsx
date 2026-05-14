"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Wallet, 
  FileSpreadsheet, 
  Bell, 
  MessageSquare, 
  LogOut, 
  X, 
  Menu,
  UserCircle
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";
import logoImg from "../../../public/logo.png";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const router = useRouter();
  const pathname = usePathname();
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("studentId");
    localStorage.removeItem("studentInfo");
    toast.success("Signed out safely");
    router.push("/");
  };

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Attendance", icon: CalendarCheck, href: "/attendance" },
    { name: "Fees Status", icon: Wallet, href: "/fees-status" },
    { name: "Leaves", icon: FileSpreadsheet, href: "/leaves" },
    { name: "Notices", icon: Bell, href: "/notices" },
    { name: "Complaints", icon: MessageSquare, href: "/complaints" },
    { name: "My Profile", icon: UserCircle, href: "/profile" },
  ];

  return (
    <>
      {/* ── Mobile Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#1A1F16]/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar Container ── */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 bg-[#F8FAF5] border-r border-[#7A8B5E]/10 transition-transform duration-500 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-8">
          
          {/* Logo Section */}
          <div className="flex items-center gap-4 mb-12 px-2">
            <div className="bg-[#7A8B5E] p-2.5 rounded-2xl shadow-lg shadow-[#7A8B5E]/20">
              <Image 
                src={logoImg} 
                alt="KGF Logo" 
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-lg font-black text-[#1A1F16] tracking-tighter leading-none uppercase italic">KGF <span className="text-[#7A8B5E]">Portal</span></h1>
              <p className="text-[10px] font-black text-[#7A8B5E] uppercase tracking-widest mt-1 opacity-60">Student Access</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname.replace(/\/$/, "") === item.href.replace(/\/$/, "");
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                    isActive 
                      ? "bg-[#7A8B5E] text-white shadow-xl shadow-[#7A8B5E]/20" 
                      : "text-[#1A1F16]/60 hover:bg-[#7A8B5E]/5 hover:text-[#7A8B5E]"
                  }`}
                >
                  <Icon size={20} className={isActive ? "animate-pulse" : ""} />
                  <span className={`text-xs font-black uppercase tracking-widest ${isActive ? "opacity-100" : "opacity-80"}`}>
                    {item.name}
                  </span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-ping"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="mt-auto space-y-4 pt-8 border-t border-[#7A8B5E]/10">
            <button
              onClick={() => setShowLogoutConfirmation(true)}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[#6B7280] hover:bg-red-50 hover:text-red-600 transition-all duration-300 group"
            >
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-black uppercase tracking-widest">Sign Out</span>
            </button>
            
            <div className="bg-[#7A8B5E]/5 rounded-3xl p-5 border border-[#7A8B5E]/10">
              <p className="text-[10px] font-black text-[#7A8B5E] uppercase tracking-widest mb-1">Support</p>
              <p className="text-[11px] font-bold text-[#1A1F16]/60 leading-relaxed">
                Need help? Contact the warden or admin office.
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Logout Modal ── */}
      {showLogoutConfirmation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1A1F16]/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] p-10 max-w-sm w-full shadow-2xl border border-[#7A8B5E]/10 text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
              <LogOut size={32} />
            </div>
            <h3 className="text-2xl font-black text-[#1A1F16] mb-3 uppercase italic">Sign Out?</h3>
            <p className="text-[#6B7280] font-bold text-sm mb-8 leading-relaxed">
              Are you sure you want to end your current session?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirmation(false)}
                className="flex-1 px-6 py-4 rounded-2xl bg-[#F8FAF5] text-[#1A1F16] font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="flex-1 px-6 py-4 rounded-2xl bg-red-500 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all"
              >
                Yes, Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}