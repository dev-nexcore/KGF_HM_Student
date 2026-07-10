// // complaints/page.jsx
// import Header from "@/components/layout/navbar";
// import Complaints from "@/components/complaints/Complaints";
// import Sidebar from "@/components/layout/sidebar";

// export default function ComplaintsPage() {
//   return (
//     <div className="flex min-h-screen bg-white w-full overflow-x-hidden">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main Content */}
//       <main className="flex flex-col flex-1 min-w-0 overflow-x-hidden">
//         <Header />
//         <div className="w-full overflow-x-hidden">
//           <Complaints />
//         </div>
//       </main>
//     </div>
//   );
// }



// complaints/page.jsx
import Header from "@/components/layout/navbar";
import Complaints from "@/components/complaints/Complaints";
import Sidebar from "@/components/layout/sidebar";

export default function ComplaintsPage() {
  return (
    <div className="flex min-h-screen bg-white">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Navbar */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 w-full p-4 lg:p-8">
          <Complaints />
        </main>

      </div>

    </div>
  );
}
