"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";
import { Bell, Menu } from "lucide-react";

export default function Navbar() {
  const [studentName, setStudentName] = useState("...");
  const [studentProfile, setStudentProfile] = useState("null");
  const [hasUnseen, setHasUnseen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("studentId");
      setStudentId(id);
      
      const handleProfileUpdate = () => {
        const storedImage = localStorage.getItem("profileImage");
        if (storedImage) {
          setStudentProfile(storedImage);
        }
      };
      window.addEventListener("profileUpdated", handleProfileUpdate);
      return () => window.removeEventListener("profileUpdated", handleProfileUpdate);
    }
  }, []);

  useEffect(() => {
    const fetchStudentName = async () => {
      try {
        const token = localStorage.getItem("token");
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const studentId = decoded.studentId;

        const res = await api.get(`/profile/${studentId}`);
        setStudentName(res.data.firstName || "Student");
        setStudentProfile(res.data.profileImage);
      } catch (err) {
        console.error("Failed to fetch student name:", err);
        setStudentName("Student");
        setStudentProfile(null);
      }
    };

    fetchStudentName();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications");
        setNotifications(res.data.notifications);
      } catch (err) {
        console.error("🔴 Notification fetch error:", err);
      }
    };

    fetchNotifications();
  }, []);

  const markAsSeen = async (type, id) => {
    try {
      await api.post("/notifications/mark-seen", { type });
      setHasUnseen(false);
      setNotifications((prev) => prev.filter((notif) => notif._id !== id));
    } catch (err) {
      console.error("Failed to mark notifications as seen:", err);
    }
  };

  return (
    <nav className="relative z-[99] flex items-center justify-between px-3 sm:px-4 md:px-6 py-4 bg-[#BEC5AD] h-20 min-h-[80px]">
      {/* Mobile Menu Button */}
      <button
        onClick={() => window.dispatchEvent(new Event("toggleSidebar"))}
        className="md:hidden p-2 text-black flex-shrink-0"
        aria-label="Toggle sidebar"
      >
        <Menu size={24} />
      </button>
      
      {/* Left Menu Spacer for Desktop */}
      <div className="hidden md:block w-12 sm:w-14"></div>
      
      {/* Center Text */}
      <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex flex-col items-center justify-center md:items-start md:justify-start min-w-0 w-full max-w-[calc(100%-180px)] sm:max-w-[calc(100%-220px)] md:max-w-none">
        <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-black leading-tight text-center md:text-left truncate w-full">
          Welcome Back, {studentName}
        </h1>
        <p className="italic text-black text-[10px] sm:text-xs md:text-sm mt-0.5 text-center md:text-left">
          - have a great day
        </p>
      </div>

      {/* Right Icons aligned on same line */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0 ml-auto">
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }}
            className="relative"
            aria-label="Toggle notifications"
          >
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 sm:w-4.5 sm:h-4.5 text-[9px] sm:text-[10px] font-bold text-white bg-red-500 rounded-full">
                {notifications.length}
              </span>
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-[-10px] sm:right-0 mt-2 w-[300px] sm:w-80 bg-white rounded-xl shadow-xl z-[100] pb-2">
              <div className="bg-[#A4B494] text-black px-4 py-3 rounded-t-xl flex justify-between items-center">
                <div>
                  <p className="font-semibold text-sm">Notifications</p>
                  <p className="text-xs">Stay updated</p>
                </div>
                <button
                  onClick={() => setShowDropdown(false)}
                  className="text-black hover:text-gray-700"
                  aria-label="Close Notifications"
                >
                  ✕
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notif, i) => (
                    <Link
                      href={notif.link}
                      key={notif._id || i}
                      className="block px-3 sm:px-4 py-3 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 border-b"
                      onClick={(e) => {
                        e.preventDefault();
                        markAsSeen(notif.type, notif._id);
                        setShowDropdown(false);
                        router.push(notif.link);
                      }}
                    >
                      {notif.message}
                    </Link>
                  ))
                ) : (
                  <div className="flex flex-col items-center py-6">
                    <Image
                      src="/student/photos/bell1.png"
                      width={35}
                      height={35}
                      alt="bell"
                      className="mb-2"
                    />
                    <p className="font-semibold text-sm">All caught up!</p>
                    <p className="text-xs text-gray-500">No new notifications to show</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <Link href="/profile" aria-label="Go to profile">
          {studentProfile ? (
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-white border border-gray-300 cursor-pointer">
              <Image
                src={
                  studentProfile && studentProfile !== "null"
                    ? studentProfile
                    : "/student/default-icon.jpg"
                }
                alt="Profile"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-gray-300 cursor-pointer" />
          )}
        </Link>
      </div>
    </nav>
  );
}
