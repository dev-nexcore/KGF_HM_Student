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
      <main className="flex flex-col flex-1">
        <Header />
        <div className="px-6 py-4">
          <Complaints />
        </div>
      </main>
    </div>
  );
}