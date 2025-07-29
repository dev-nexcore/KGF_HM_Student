'use client';
import React from 'react';
import Image from 'next/image';
import { FiEdit } from 'react-icons/fi';
import { toast, Toaster } from "react-hot-toast";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    contactNumber: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const studentId = localStorage.getItem("studentId");
        if (!studentId) return;
        const res = await api.get(`/profile/${studentId}`);
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    try {
      const studentId = localStorage.getItem("studentId");
      if (!studentId) {
        console.error("Student ID not found in localStorage");
        return;
      }
      await api.put(`/profile/${studentId}`, formData);
      setProfile({ ...profile, ...formData });
      setShowModal(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error('Failed to update profile:', err);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  if (!profile) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="pt-2 px-2 md:pt-1 md:px-2">
      {/* Page Heading */}
     <div className="flex items-center mb-6">

<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold border-l-4 border-red-600 pl-3 mb-6 sm:mb-8 text-[#2c2c2c]">
        Fees Status
      </h1>
</div>


      {/* Cards Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Profile Card */}
        <div className="bg-[#BEC5AD] rounded-lg p-6 w-full lg:w-[35%] flex flex-col items-center justify-center shadow min-h-[330px] lg:min-h-[480px]">
          <div className="w-32 h-32 rounded-full bg-white mb-4" />
          <h2 className="text-lg font-bold text-black mb-1">{profile.studentName}</h2>
          <p className="text-sm font-semibold text-black">Student ID: {profile.studentId}</p>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-lg p-6 w-full lg:w-[35%] shadow text-sm text-black font-semibold min-h-[420px]">
          <div className="flex flex-col space-y-7">
            <div className="flex justify-between"><span>Email:</span><span className="text-gray-700 font-normal">{profile.email}</span></div>
            <div className="flex justify-between"><span>Phone no:</span><span className="text-gray-700 font-normal">{profile.contactNumber}</span></div>
            <div className="flex justify-between"><span>Room no:</span><span className="text-gray-700 font-normal">{profile.roomNo}</span></div>
            <div className="flex justify-between"><span>Roommate:</span><span className="text-gray-700 font-normal">{profile.roommateName}</span></div>
            <div className="flex justify-between"><span>Bed Allotment:</span><span className="text-gray-700 font-normal">{profile.bedAllotment}</span></div>
            <div className="flex justify-between"><span>Check-in Date:</span><span className="text-gray-700 font-normal">{new Date(profile.lastCheckInDate).toLocaleDateString()}</span></div>
          </div>
        </div>
      </div>

   
{/* Edit Profile Button */}
<div className="mt-6 text-center md:text-left md:pl-85">
  <button className="flex items-center justify-center md:justify-start gap-2 bg-[#BEC5AD] text-black px-6 py-2 rounded-xl shadow font-medium font-semibold w-full md:w-auto">
    <Image src="/icons/edit-icon.png" alt="Edit Icon" width={16} height={16} />
    Edit Profile
  </button>
</div>


      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl w-[90%] max-w-md p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-300 text-black hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}