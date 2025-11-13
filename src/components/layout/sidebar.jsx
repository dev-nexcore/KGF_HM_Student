"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("studentId");
    localStorage.removeItem("forgotPasswordEmail");
    toast.success("Logged out successfully");
    router.push("/");
    setShowLogoutConfirmation(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirmation(false);
  };

  const navItems = [
    { name: "Dashboard", icon: "dashboard.png", href: "/dashboard" },
    {
      name: "Fees Status",
      icon: "account_balance_wallet.png",
      href: "/fees-status",
    },
    { name: "Leaves", icon: "calendar.png", href: "/leaves" },
    { name: "Notices", icon: "filter_frames.png", href: "/notices" },
    { name: "Complaints", icon: "chat_bubble.png", href: "/complaints" },
  ];

  const getLinkClass = (href) =>
    `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 py-2 sm:py-3 transition-all duration-200 rounded-l-full text-xs sm:text-sm md:text-base
     ${
       pathname === href
         ? "bg-white text-black font-bold shadow ml-1 sm:ml-2"
         : "hover:underline text-black"
     }`;

  return (
    <div className="bg-[#BEC5AD]">
      {/* Hamburger menu (Mobile) */}
      <button
        className="md:hidden fixed top-2 left-2 z-50 p-2 bg-[#A4B494] rounded-md shadow text-black"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 left-0 z-40 w-56 sm:w-48 md:w-60 h-full bg-[#A4B494] py-6 sm:py-8 md:pl-5 sm:pl-0 flex flex-col justify-between
        rounded-tr-3xl shadow transform transition-transform duration-300
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static`}
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
          <div className="flex justify-start mb-4 sm:mb-6 px-3 sm:px-4 md:ml-8.5 ml-2">
            <div className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-full overflow-hidden border-2 border-white shadow">
              <img
                src="/student/logo.png"
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Nav Links */}
          <ul className="space-y-1 text-sm sm:text-base md:text-base font-semibold">
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
                    <span className="hidden sm:inline">{name}</span>
                    <span className="sm:hidden text-xs">
                      {name.split(" ")[0]}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Logout */}
        <div className="mt-0">
          <hr className="border-t border-black my-3 mr-4" />
          <div className="flex justify-start mb-1 px-3 sm:px-4 md:ml-8.5 ml-2">
            <button
              onClick={handleLogoutClick}
              className="flex items-center gap-2 text-black text-xs sm:text-sm hover:underline font-bold cursor-pointer"
            >
              <Image
                src="/icons/logout.png"
                alt="Logout"
                width={18}
                height={18}
              />
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">Out</span>
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

      {/* Logout Confirmation Modal */}
      {showLogoutConfirmation && (
        <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              Confirm Logout
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleLogoutCancel}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
