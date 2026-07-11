'use client';
import api from '@/lib/api';
import React, { useEffect, useState, useRef } from 'react';
import { FiEdit, FiUpload, FiTrash2, FiUser, FiMail, FiPhone, FiHome, FiHash, FiMapPin, FiCalendar, FiAlertCircle, FiFileText, FiExternalLink } from 'react-icons/fi';
import { toast, Toaster } from "react-hot-toast";
import Image from 'next/image';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    contactNumber: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Profile
        const res = await api.get(`/profile`);
        const data = res.data;
        setProfile(data);
        console.log(data)
        setFormData({
          studentName: `${data.firstName} ${data.lastName}`.trim(),
          email: data.email || '',
          contactNumber: data.contactNumber || '',
        });
      } catch (err) {
        console.error('Failed to fetch profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    try {
      const [firstName, ...rest] = formData.studentName.split(" ");
      const lastName = rest.join(" ") || "";

      await api.put(`/profile`, {
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
      toast.error("Failed to update profile");
    }
  };

  const handleImageUpload = async (e) => {
    const studentId = localStorage.getItem("studentId");
    const file = e.target.files[0];
    if (!file || !studentId) return;

    const uploadData = new FormData();
    uploadData.append("profileImage", file);

    try {
      toast.loading("Uploading image...", { id: 'upload' });
      const res = await api.post(`/upload-profile-image/${studentId}`, uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const newImageUrl = `${res.data.imageUrl}?t=${Date.now()}`;
      setProfile(prev => ({ ...prev, profileImage: newImageUrl }));
      localStorage.setItem("profileImage", newImageUrl);
      window.dispatchEvent(new Event("profileUpdated"));
      toast.success("Image updated", { id: 'upload' });
    } catch (err) {
      console.error('Image upload failed:', err);
      toast.error("Upload failed", { id: 'upload' });
    }
  };

  const handleImageDelete = async () => {
    const studentId = localStorage.getItem("studentId");
    if (!studentId) return;

    try {
      await api.delete(`/delete-profile-image/${studentId}`);
      setProfile(prev => ({ ...prev, profileImage: null }));
      toast.success("Image removed");
    } catch (err) {
      console.error('Image delete failed:', err);
      toast.error("Failed to remove image");
    }
  };

  return (
    <div className="bg-[#ffffff] px-6 sm:px-8 lg:px-2.5 py-2 min-h-screen font-sans w-full">
      <Toaster position="top-center" />

      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F8CCF]"></div>
        </div>
      ) : profile ? (
        <div className="max-w-7xl mx-auto w-full">
          {/* Page Title */}
          <div className="flex items-center justify-between mb-6 mt-2">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-black border-l-4 border-[#4F8CCF] pl-2">
              Student Profile
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.2)] overflow-hidden sticky top-6">
              <div className="bg-[#AAB491] px-6 py-3">
                 <h2 className="text-lg font-semibold text-black text-center">My Identity</h2>
              </div>
              <div className="p-8 flex flex-col items-center text-center">
                <div className="relative group mb-6">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-gray-100 shadow-md bg-gray-50">
                    {profile.profileImage ? (
                      <Image
                        src={profile.profileImage}
                        alt="Profile"
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-5xl">
                        <FiUser />
                      </div>
                    )}
                  </div>

                  {/* Photo Actions Overlay */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    <label className="w-8 h-8 bg-white text-[#4F8CCF] rounded-full flex items-center justify-center shadow border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                      <FiUpload size={14} />
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                    {profile.profileImage && (
                      <button 
                        onClick={handleImageDelete}
                        className="w-8 h-8 bg-white text-red-500 rounded-full flex items-center justify-center shadow border border-gray-200 hover:bg-red-50 transition-colors"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 leading-tight">
                  {profile.firstName} {profile.lastName}
                </h2>
                <div className="mt-2 inline-block px-3 py-1 bg-gray-100 rounded-md text-xs font-semibold text-gray-600 uppercase">
                  ID: {profile.studentId}
                </div>

                <div className="mt-6 w-full grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Room</p>
                    <p className="text-base font-bold text-gray-800">{profile.roomNo || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Bed</p>
                    <p className="text-base font-bold text-gray-800">{profile.bedAllotment || 'N/A'}</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowModal(true)}
                  className="mt-6 w-full bg-[#4F8DCF] hover:bg-[#3e72a8] text-white px-4 py-2.5 rounded-md font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm text-sm"
                >
                  <FiEdit /> Edit Details
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-8 space-y-6">

            {/* Information Grid */}
            <div className="bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.2)] overflow-hidden">
              <div className="bg-[#AAB491] px-6 py-3 rounded-t-lg">
                <h2 className="text-lg font-semibold text-black flex items-center gap-2">
                  <FiUser /> Personal Information
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem icon={<FiMail />} label="Email Address" value={profile.email} />
                <InfoItem icon={<FiPhone />} label="Phone Number" value={profile.contactNumber} />
                <InfoItem icon={<FiCalendar />} label="Admission Date" value={new Date(profile.admissionDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} />
                <InfoItem icon={<FiMapPin />} label="Floor Level" value={profile.floor || 'N/A'} />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.2)] overflow-hidden border border-red-100">
              <div className="bg-red-50 border-b border-red-100 px-6 py-3">
                <h2 className="text-lg font-semibold text-red-800 flex items-center gap-2">
                  <FiAlertCircle /> Emergency Contact
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-red-50/20">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-500 mb-1 tracking-wider">Name</p>
                  <p className="text-base font-bold text-gray-800">{profile.emergencyContactName || 'Not Set'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-500 mb-1 tracking-wider">Mobile Number</p>
                  <p className="text-base font-bold text-gray-800">{profile.emergencyContactNumber || 'Not Set'}</p>
                </div>
              </div>
            </div>

            {/* Academic Documents */}
            <div className="bg-white rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.2)] overflow-hidden">
              <div className="bg-[#AAB491] px-6 py-3 rounded-t-lg">
                <h2 className="text-lg font-semibold text-black flex items-center gap-2">
                  <FiFileText /> Verification Documents
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DocumentItem 
                  label="Aadhar Card" 
                  url={profile.documents?.aadharCard} 
                />
                <DocumentItem 
                  label="PAN Card" 
                  url={profile.documents?.panCard} 
                />
                <DocumentItem 
                  label="College ID Card" 
                  url={profile.documents?.studentIdCard} 
                />
                <DocumentItem 
                  label="Admission Fees Receipt" 
                  url={profile.documents?.feesReceipt} 
                />
              </div>
            </div>
          </div>
        </div>
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">Profile data not found</div>
      )}

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden relative z-10">
            <div className="bg-[#AAB491] px-6 py-4">
              <h2 className="text-xl font-semibold text-black">Edit Profile</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-500 mb-6 text-sm">Update your contact details below.</p>

              <div className="space-y-4">
                <InputGroup label="Full Name" name="studentName" value={formData.studentName} onChange={handleInputChange} icon={<FiUser />} />
                <InputGroup label="Email" name="email" value={formData.email} onChange={handleInputChange} type="email" icon={<FiMail />} />
                <InputGroup label="Phone" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} icon={<FiPhone />} />
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 rounded-md bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors">Cancel</button>
                <button onClick={handleUpdate} className="flex-1 px-4 py-2 rounded-md bg-[#4F8DCF] text-white font-medium hover:bg-[#3e72a8] transition-colors shadow">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DocumentItem({ label, url }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#AAB491] transition-all group">
      <div className="flex items-center gap-3">
        <div className="text-gray-400">
          <FiFileText size={20} />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-800">{label}</p>
          <p className="text-[10px] text-gray-500">{url ? 'Document Uploaded' : 'Not Uploaded'}</p>
        </div>
      </div>
      
      {url && (
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-8 h-8 bg-white text-gray-500 rounded flex items-center justify-center border border-gray-200 hover:text-[#4F8DCF] hover:shadow-sm transition-all"
        >
          <FiExternalLink size={14} />
        </a>
      )}
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-[#4F8DCF]">
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-gray-800 break-all">{value || 'N/A'}</p>
      </div>
    </div>
  );
}

function InputGroup({ label, name, value, onChange, icon, type = "text" }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-white border border-gray-300 rounded-md pl-10 pr-3 py-2 text-sm text-gray-800 focus:border-[#AAB491] focus:ring-1 focus:ring-[#AAB491] outline-none transition-all"
        />
      </div>
    </div>
  );
}
