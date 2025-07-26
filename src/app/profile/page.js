'use client';
import React, { useState } from 'react';
import Sidebar from '@/components/layout/sidebar';
import Navbar from '@/components/layout/navbar';
import Profile from '@/components/profile/Profile';

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
       {/* Sidebar */}
               <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
         
               {/* Main Content */}
               <div className="flex flex-col flex-1">
                 {/* Navbar */}
                 <Navbar />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 bg-[#ffffff]">
          <Profile />
        </div>
      </div>
    </div>
  );
}
