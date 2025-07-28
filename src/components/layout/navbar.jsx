'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';

export default function Navbar() {
  const [studentName, setStudentName] = useState("...");

  useEffect(() => {
    const fetchStudentName = async () => {
      try {
        const studentId = localStorage.getItem("studentId");

        if (!studentId) return;

        const res = await api.get(`/profile/${studentId}`);
        setStudentName(res.data.studentName || "Student");
      } catch (err) {
        console.error("Failed to fetch student name:", err);
        setStudentName("Student");
      }
    };

    fetchStudentName();
  }, []);

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
        <Image
          src="/icons/notifications.png"
          alt="Notifications"
          width={20}
          height={20}
          className="cursor-pointer sm:w-[22px] sm:h-[22px]"
        />
        <Link href="/profile" aria-label="Go to profile">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-gray-300 cursor-pointer flex-shrink-0" />
        </Link>
      </div>
    </nav>
  );
}
