'use client';
import api from '@/lib/api';
import React, { useEffect, useState, useRef } from 'react';
import { FiEdit, FiUpload, FiTrash2 } from 'react-icons/fi';
import { toast, Toaster } from "react-hot-toast";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    contactNumber: '',
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const studentId = localStorage.getItem("studentId");
        if (!studentId) return;

        const res = await api.get(`/profile`);
        const data = res.data;

        setProfile(data);
        setFormData({
          studentName: `${data.firstName} ${data.lastName}`,
          email: data.email,
          contactNumber: data.contactNumber,
        });
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

      const [firstName, ...rest] = formData.studentName.split(" ");
      const lastName = rest.join(" ") || ""; // Handle single names

      await api.put(`/profile/${studentId}`, {
        firstName,
        lastName,
        email: formData.email,
        contactNumber: formData.contactNumber,
      });

      setProfile(prev => ({
        ...prev,
        firstName,
        lastName,
        email: formData.email,
        contactNumber: formData.contactNumber,
      }));

      setShowModal(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error('Failed to update profile:', err);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleImageUpload = async (e) => {
    const studentId = localStorage.getItem("studentId");
    const file = e.target.files[0];
    if (!file || !studentId) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const res = await api.post(`/upload-profile-image/${studentId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success("Image uploaded");
      setProfile(prev => ({
        ...prev,
        profileImage: res.data.imageUrl,
      }));
    } catch (err) {
      console.error('Image upload failed:', err);
      toast.error("Image upload failed");
    }
  };

  const handleImageDelete = async () => {
    const studentId = localStorage.getItem("studentId");
    if (!studentId) return;

    try {
      await api.delete(`/delete-profile-image/${studentId}`);
      toast.success("Image deleted");
      setProfile(prev => ({
        ...prev,
        profileImage: null,
      }));
    } catch (err) {
      console.error('Image delete failed:', err);
      toast.error("Failed to delete image");
    }
  };

  if (!profile) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="pt-2 px-2 md:pt-1 md:px-2">
      {/* Page Heading */}
      <div className="flex items-center mb-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black border-l-4 border-[#4F8CCF] pl-2 mb-4 sm:mb-6">
          Profile
        </h2>
      </div>

      {/* Cards Section - Centered on larger screens */}
      <div className="flex flex-col lg:flex-row lg:justify-center gap-6">
        {/* Profile Card */}
        <div className="bg-[#BEC5AD] rounded-lg p-6 w-full lg:w-[35%] flex flex-col items-center justify-center shadow min-h-[330px] lg:min-h-[480px]">
          <div className="relative">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover mb-4 border border-gray-300"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-white mb-4 flex items-center justify-center text-gray-500 text-sm border">
                No Image
              </div>
            )}

            {/* Upload icon */}
            <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer hover:bg-gray-100">
              <FiUpload />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {/* Delete icon, shown only if image exists */}
            {profile.profileImage && (
              <button
                onClick={handleImageDelete}
                className="absolute top-0 right-0 bg-red-100 text-red-600 p-1 rounded-full hover:bg-red-200"
              >
                <FiTrash2 />
              </button>
            )}
          </div>
          <h2 className="text-lg font-bold text-black mb-1">{profile.firstName} {profile.lastName}</h2>
          <p className="text-sm font-semibold text-black">Student ID: {profile.studentId}</p>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-lg p-6 w-full lg:w-[35%] shadow text-sm text-black font-semibold min-h-[420px]">
          <div className="flex flex-col space-y-7">
            <div className="flex justify-between"><span>Email:</span><span className="text-gray-700 font-normal">{profile.email}</span></div>
            <div className="flex justify-between"><span>Phone no:</span><span className="text-gray-700 font-normal">{profile.contactNumber}</span></div>
            <div className="flex justify-between"><span>Room no:</span><span className="text-gray-700 font-normal">{profile.roomNo}</span></div>
            <div className="flex justify-between"><span>Bed Allotment:</span><span className="text-gray-700 font-normal">{profile.bedAllotment}</span></div>
            <div className="flex justify-between"><span>Check-in Date:</span><span className="text-gray-700 font-normal">{new Date(profile.lastCheckInDate).toLocaleDateString()}</span></div>
          </div>
        </div>
      </div>

      {/* Edit Profile Button - Centered below cards */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => {
            setFormData({
              studentName: `${profile.firstName} ${profile.lastName}`.trim(),
              email: profile.email || '',
              contactNumber: profile.contactNumber || '',
            });
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 bg-[#BEC5AD] text-black px-6 py-2 rounded-xl shadow font-medium hover:cursor-pointer"
        >
          <FiEdit /> Edit Profile
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