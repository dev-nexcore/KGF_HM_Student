'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="flex items-start justify-between px-6 py-4 bg-[#BEC5AD]">
      {/* Left Text */}
      <div className="pl-10 md:pl-0">
        <h2 className="text-xl font-semibold text-gray-800">Welcome Back, Nouman</h2>
        <p className="text-sm text-gray-600">- have a great day</p>
      </div>

      {/* Right Icons aligned on same line */}
      <div className="flex items-center gap-4">
        {/* PNG Notification Icon */}
        <Image
          src="/icons/notifications.png"  // ✅ Make sure this file exists in public/icons/
          alt="Notifications"
          width={22}
          height={22}
          className="cursor-pointer mt-1" // mt-1 aligns it better with text
        />

        {/* Profile Icon */}
        <Link href="/profile" aria-label="Go to profile">
          <div className="w-10 h-10 rounded-full bg-white border border-gray-300 cursor-pointer" />
        </Link>
      </div>
    </nav>
  );
}
