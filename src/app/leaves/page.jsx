// 'use client';

// import LeavesPage from '@/components/leaves/LeavesPage';
// import Sidebar from '@/components/layout/sidebar';
// import Navbar from '@/components/layout/navbar';

// export default function Leaves() {
//   return (
//     <div className="flex min-h-screen bg-white overflow-hidden">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main content area */}
//       <div className="flex-1 flex flex-col">
//         {/* Navbar */}
//         <Navbar />

//         {/* Leaves Page Content */}
//         <main className="p-6 overflow-auto">
//           <LeavesPage />
//         </main>
//       </div>
//     </div>
//   );
// }



'use client';

import LeavesPage from '@/components/leaves/LeavesPage';
import Sidebar from '@/components/layout/sidebar';
import Navbar from '@/components/layout/navbar';

export default function Leaves() {
  return (
    <div className="flex min-h-screen bg-white">

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1 md:ml-55">

        {/* Navbar */}
        <Navbar />

        {/* Leaves Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <LeavesPage />
        </main>

      </div>
    </div>
  );
}