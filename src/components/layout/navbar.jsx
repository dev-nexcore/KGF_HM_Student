'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';

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
    if (typeof window !== 'undefined') {
      const id = localStorage.getItem('studentId');
      setStudentId(id);
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
        const res = await api.get('/notifications');
        const allNotifications = res.data.notifications || [];

        const seenIds = JSON.parse(localStorage.getItem('seenNotificationIds') || '[]');
        const unseenNotifications = allNotifications.filter(
          (n) => !seenIds.includes(n.id)
        );

        setNotifications(unseenNotifications);
        setHasUnseen(unseenNotifications.length > 0);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    fetchNotifications();
  }, []);


  const markAsSeen = async (type) => {
    try {
      await api.post('/notifications/mark-seen', { type }); // now sends body
      setHasUnseen(false);
    } catch (err) {
      console.error("Failed to mark notifications as seen:", err);
    }
  };


  return (
    <nav className="flex items-center justify-between px-4 sm:px-6 py-4 bg-[#BEC5AD] h-20 min-h-[80px]">
      {/* Left Text */}
      <div className="pl-13 sm:pl-6 md:pl-10 lg:pl-0 flex-1 min-w-0">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 truncate">
          Welcome Back, {studentName}
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 truncate">
          - have a great day
        </p>
      </div>

      {/* Right Icons aligned on same line */}
      <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
        <div className="relative">
          <button
            onClick={() => setShowDropdown(prev => !prev)}
            className="relative"
            aria-label="Notifications"
          >
            <Image
              src="/icons/notifications.png"
              alt="Notifications"
              width={22}
              height={22}
              className="cursor-pointer"
            />
            {hasUnseen && (
              <span className="absolute top-0 right-0 inline-block w-2.5 h-2.5 bg-red-500 rounded-full"></span>
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-72 max-h-96 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-md z-50">
              {notifications.length > 0 ? (
                notifications.map((notif, i) => (
                  <Link
                    href={notif.link}
                    key={i}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b"
                    onClick={() => {
                      markAsSeen(notif.type, notif.id);
                      router.push(notif.link); // or use Link if prefetching
                      setShowDropdown(false);
                    }}
                  >
                    {notif.message}
                  </Link>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">No notifications</div>
              )}
            </div>
          )}
        </div>
        <Link href="/profile" aria-label="Go to profile">
          {studentProfile ? (
            <Image
              src={
                studentProfile && studentProfile !== "null"
                  ? `http://localhost:5000/${studentProfile}`
                  : '/default-profile.jpg'
              }
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full object-cover w-8 h-8 sm:w-10 sm:h-10 border border-gray-300"
            />
          ) : (
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-gray-300 cursor-pointer" />
          )}
        </Link>
      </div>
    </nav>
  );
}
