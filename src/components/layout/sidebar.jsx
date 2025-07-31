'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // keeping only hamburger & close icons
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Sidebar() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false); // Close on route change
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('studentId');
    router.push('/');
  };


  const navItems = [
    { name: "Dashboard", icon: "dashboard.png", href: "/dashboard" },
    { name: "Fees Status", icon: "account_balance_wallet.png", href: "/fees-status" },
    { name: "Leaves", icon: "calendar.png", href: "/leaves" },
    { name: "Notices", icon: "filter_frames.png", href: "/notices" },
    { name: "Refunds", icon: "refund.png", href: "/refunds" },
    { name: "Complaints", icon: "chat_bubble.png", href: "/complaints" },
  ];

  const getLinkClass = (href) =>
    `flex items-center gap-3 px-6 py-3 transition-all duration-200 rounded-l-full text-sm
     ${pathname === href
      ? "bg-white text-black font-bold shadow ml-2"
      : "hover:underline text-black"
    }`;

  return (
    <div className="bg-[#BEC5AD]">
      {/* Hamburger menu (Mobile) */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#A4B494] rounded-md shadow text-black"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 left-0 z-40 w-60 h-full bg-[#A4B494] py-8 pl-5 flex flex-col justify-between
        rounded-tr-4xl shadow transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static`}
      >
        {/* Close Button (Mobile Only) */}
        <button
          className="md:hidden absolute top-4 right-4 p-2 text-black"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <X size={24} />
        </button>

        <div>
          {/* Logo */}
          <div className="flex justify-start mb-6 px-4 ml-8.5">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>



          {/* Nav Links */}
          <ul className="space-y-1 text-[15px] font-semibold">
            {navItems.map(({ name, icon, href }) => (
              <li key={name}>
                <Link href={href}>
                  <div className={getLinkClass(href)}>
                    <Image
                      src={`/icons/${icon}`}
                      alt={`${name} icon`}
                      width={18}
                      height={18}
                    />
                    {name}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Logout */}
        <div className="mt-10">
          <hr className="border-t border-black my-3 mr-4" />
          <div className="flex justify-start mb-1 px-4 ml-8.5">
            <button className="flex items-center gap-2 text-black text-sm hover:underline  text-black font-bold">
              <Image
                src="/icons/logout.png"
                alt="Logout"
                width={18}
                height={18}
              />
              Logout
            </button>
          </div>
        </div>

      </aside>

      {/* Dark Overlay (Mobile only) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
