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
    <div className="flex min-h-screen bg-white overflow-x-hidden">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex flex-col flex-1 md:ml-55 min-w-0 overflow-x-hidden">

        {/* Navbar */}
        <Header />

        {/* Page Content */}
        <div className="flex-1 w-full overflow-y-auto p-4 lg:p-8">
          <Complaints />
        </div>

      </main>

    </div>
  );
}