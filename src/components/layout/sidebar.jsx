// "use client";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { Menu, X } from "lucide-react";
// import { usePathname } from "next/navigation";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { toast } from "react-hot-toast";

// export default function Sidebar() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

//   useEffect(() => {
//     setSidebarOpen(false);
//   }, [pathname]);

//   const handleLogoutClick = () => {
//     setShowLogoutConfirmation(true);
//   };

//   const handleLogoutConfirm = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("studentId");
//     localStorage.removeItem("forgotPasswordEmail");
//     toast.success("Logged out successfully");
//     router.push("/");
//     setShowLogoutConfirmation(false);
//   };

//   const handleLogoutCancel = () => {
//     setShowLogoutConfirmation(false);
//   };

//   const navItems = [
//     { name: "Dashboard", icon: "dashboard.png", href: "/dashboard" },
//     {
//       name: "Fees Status",
//       icon: "account_balance_wallet.png",
//       href: "/fees-status",
//     },
//     { name: "Leaves", icon: "calendar.png", href: "/leaves" },
//     { name: "Notices", icon: "filter_frames.png", href: "/notices" },
//     { name: "Complaints", icon: "chat_bubble.png", href: "/complaints" },
//   ];

//   const getLinkClass = (href) =>
//     `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 py-2 sm:py-3 transition-all duration-200 rounded-l-full text-xs sm:text-sm md:text-base
//      ${
//        pathname === href
//          ? "bg-white text-black font-bold shadow ml-1 sm:ml-2"
//          : "hover:underline text-black"
//      }`;

//   return (
//     <div className="bg-[#BEC5AD]">
//       {/* Hamburger menu (Mobile) */}
//       <button
//         className="md:hidden fixed top-2 left-2 z-50 p-2 bg-[#A4B494] rounded-md shadow text-black"
//         onClick={() => setSidebarOpen(true)}
//         aria-label="Open sidebar"
//       >
//         <Menu size={24} />
//       </button>

//       {/* Sidebar Panel */}
//       <aside
//         className={`fixed top-0 left-0 z-40 w-56 sm:w-48 md:w-60 h-full bg-[#A4B494] py-6 sm:py-8 md:pl-5 sm:pl-0 flex flex-col justify-between
//         rounded-tr-3xl shadow transform transition-transform duration-300
//         ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         } md:translate-x-0 md:static`}
//       >
//         {/* Close Button (Mobile Only) */}
//         <button
//           className="md:hidden absolute top-4 right-4 p-2 text-black"
//           onClick={() => setSidebarOpen(false)}
//           aria-label="Close sidebar"
//         >
//           <X size={24} />
//         </button>

//         <div>
//           {/* Logo */}
//           <div className="flex justify-start mb-4 sm:mb-6 px-3 sm:px-4 md:ml-8.5 ml-2">
//             <div className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-full overflow-hidden border-2 border-white shadow">
//               <img
//                 src="/student/logo.png"
//                 alt="Logo"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           </div>

//           {/* Nav Links */}
//           <ul className="space-y-1 text-sm sm:text-base md:text-base font-semibold">
//             {navItems.map(({ name, icon, href }) => (
//               <li key={name}>
//                 <Link href={href}>
//                   <div className={getLinkClass(href)}>
//                     <Image
//                       src={`/student/icons/${icon}`}
//                       alt={`${name} icon`}
//                       width={18}
//                       height={18}
//                     />
//                     <span className="hidden sm:inline">{name}</span>
//                     <span className="sm:hidden text-xs">
//                       {name.split(" ")[0]}
//                     </span>
//                   </div>
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Logout */}
//         <div className="mt-0">
//           <hr className="border-t border-black my-3 mr-4" />
//           <div className="flex justify-start mb-1 px-3 sm:px-4 md:ml-8.5 ml-2">
//             <button
//               onClick={handleLogoutClick}
//               className="flex items-center gap-2 text-black text-xs sm:text-sm hover:underline font-bold cursor-pointer"
//             >
//               <Image
//                 src="/icons/logout.png"
//                 alt="Logout"
//                 width={18}
//                 height={18}
//               />
//               <span className="hidden sm:inline">Logout</span>
//               <span className="sm:hidden">Out</span>
//             </button>
//           </div>
//         </div>
//       </aside>

//       {/* Dark Overlay (Mobile only) */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"
//           onClick={() => setSidebarOpen(false)}
//           aria-hidden="true"
//         />
//       )}

//       {/* Logout Confirmation Modal */}
//       {showLogoutConfirmation && (
//         <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-4 sm:p-6 max-w-sm mx-4 shadow-xl">
//             <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
//               Confirm Logout
//             </h3>
//             <p className="text-sm sm:text-base text-gray-600 mb-6">
//               Are you sure you want to logout?
//             </p>
//             <div className="flex gap-3 justify-end">
//               <button
//                 onClick={handleLogoutCancel}
//                 className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleLogoutConfirm}
//                 className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors cursor-pointer"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [active, setActive] = useState("");

  // current page active
  useEffect(() => {
    setActive(pathname);
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleToggle = () => setSidebarOpen(prev => !prev);
    window.addEventListener("toggleSidebar", handleToggle);
    return () => window.removeEventListener("toggleSidebar", handleToggle);
  }, []);

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
    { name: "Attendance", icon: "calendar.png", href: "/attendance" },
    { name: "Fees Status", icon: "account_balance_wallet.png", href: "/fees-status" },
    { name: "Leaves", icon: "calendar.png", href: "/leaves" },
    { name: "Notices", icon: "filter_frames.png", href: "/notices" },
    { name: "Complaints", icon: "chat_bubble.png", href: "/complaints" },
  ];

  // const getLinkClass = (href) =>
  //   `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 py-2 sm:py-3 transition-all duration-200 rounded-l-full text-xs sm:text-sm md:text-base
  //    ${
  //      active === href
  //        ? "bg-white text-black font-bold shadow ml-1 sm:ml-2"
  //        : "hover:bg-white/40 text-black"
  //    }`;

  const getLinkClass = (href) =>
    `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 py-2 sm:py-3 transition-all duration-200 rounded-l-full text-xs sm:text-sm md:text-base
   ${pathname.startsWith(href)
      ? "bg-white text-black font-bold shadow ml-1 sm:ml-2"
      : "hover:bg-white/40 text-black"
    }`;

  return (
    <div className="bg-[#BEC5AD]">

      {/* Mobile Menu Button handled by Navbar */}

      {/* Sidebar */}
      {/* <aside
        className={`fixed top-0 left-0 z-40 w-56 sm:w-48 md:w-60 h-full bg-[#A4B494] py-6 sm:py-8 md:pl-5 sm:pl-0 flex flex-col justify-between
        rounded-tr-3xl shadow transform transition-transform duration-300
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static`}
      > */}

      <aside
        className={`fixed md:sticky top-0 left-0 z-[100] w-64 sm:w-56 md:w-64 h-[100dvh] overflow-y-auto no-scrollbar bg-[#A4B494]
py-6 sm:py-8 md:pl-5 sm:pl-0 flex flex-col md:justify-between shrink-0
rounded-tr-3xl shadow transform transition-transform duration-300
${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >

        {/* Close Button */}
        <button
          className="md:hidden absolute top-4 right-4 p-2 text-black"
          onClick={() => setSidebarOpen(false)}
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

          {/* Navigation */}
          <ul className="space-y-1 text-sm sm:text-base font-semibold">
            {navItems.map(({ name, icon, href }) => (
              <li key={name}>
                <Link href={href}>
                  <div
                    className={getLinkClass(href)}
                    onClick={() => {
                      setActive(href);
                      setSidebarOpen(false);
                    }}
                  >
                    <Image
                      src={`/student/icons/${icon}`}
                      alt={name}
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
        <div>
          <hr className="border-t border-black my-3 mr-4" />

          <div className="flex justify-start mb-1 px-3 sm:px-4 md:ml-8.5 ml-2">
            <button
              onClick={handleLogoutClick}
              className="flex items-center gap-2 text-black text-xs sm:text-sm font-bold hover:underline"
            >
              <Image
                src="/student/icons/logout.png"
                alt="Logout"
                width={18}
                height={18}
              />
              <span className="inline">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Logout Modal */}
      {showLogoutConfirmation && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] p-4" style={{ backdropFilter: 'blur(8px)' }}>
          <div
            className="max-w-md w-full p-6 rounded-2xl border shadow-2xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.2) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
            }}
          >
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, transparent 50%)',
                pointerEvents: 'none'
              }}
            />

            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mr-3"
                  style={{
                    background: 'rgba(239, 68, 68, 0.9)',
                    border: '1px solid rgba(239, 68, 68, 1)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 drop-shadow-sm">Confirm Logout</h3>
              </div>

              <p className="text-gray-800 mb-6 text-sm leading-relaxed font-medium">
                Are you sure you want to logout? You will need to sign in again to access your account.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleLogoutCancel}
                  className="px-5 py-2.5 text-gray-800 font-semibold rounded-lg transition-all duration-200"
                  style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 15px 0 rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.95)';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogoutConfirm}
                  className="px-5 py-2.5 text-white font-semibold rounded-lg transition-all duration-200"
                  style={{
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.95) 0%, rgba(220, 38, 38, 1) 100%)',
                    border: '1px solid rgba(185, 28, 28, 0.8)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 15px 0 rgba(239, 68, 68, 0.5)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, rgba(220, 38, 38, 1) 0%, rgba(185, 28, 28, 1) 100%)';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.95) 0%, rgba(220, 38, 38, 1) 100%)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}