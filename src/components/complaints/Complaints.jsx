"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { FiUpload, FiX, FiFile, FiImage, FiVideo, FiEye, FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const AttachmentThumbnail = ({ complaintId, attachment }) => {
  const [thumbUrl, setThumbUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let url = null;
    if (attachment.mimeType?.startsWith('image/')) {
      api.get(`/complaint/${complaintId}/attachment/${attachment._id}`, { responseType: 'blob' })
        .then(res => {
          url = URL.createObjectURL(res.data);
          setThumbUrl(url);
          setLoading(false);
        })
        .catch(err => {
          // Silently ignore 404s for thumbnails to prevent Next.js error overlay
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [complaintId, attachment._id, attachment.mimeType]);

  if (!attachment.mimeType?.startsWith('image/')) {
    return (
       <div className="h-24 w-full bg-gray-100 rounded-lg flex items-center justify-center mb-2">
         {attachment.mimeType?.startsWith('video/') ? <FiVideo className="text-gray-400 w-8 h-8" /> : <FiFile className="text-gray-400 w-8 h-8" />}
       </div>
    );
  }

  return (
    <div className="h-24 w-full bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative mb-2">
      {loading ? (
        <div className="w-5 h-5 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      ) : thumbUrl ? (
        <img src={thumbUrl} alt="Thumbnail" className="w-full h-full object-cover" />
      ) : (
        <FiImage className="text-gray-400 w-8 h-8" />
      )}
    </div>
  );
};

export default function Complaints() {
  const [complaintType, setComplaintType] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otherComplaintType, setOtherComplaintType] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Maintenance-specific fields
  const [floorNumber, setFloorNumber] = useState("");
  const [maintenanceItems, setMaintenanceItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [attachmentModal, setAttachmentModal] = useState({ show: false, url: '', type: '', filename: '' });

  // Search, Filter and Pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter complaints based on search and status
  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch = 
      complaint.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.complaintType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.otherComplaintType?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredComplaints.slice(indexOfFirstItem, indexOfLastItem);

  const maintenanceOptions = [
    "Electrical Issues",
    "Plumbing Issues",
    "Water Supply Problem",
    "Furniture Damage",
    "Door Repair",
    "Window Repair",
    "Air Conditioning",
    "Fan Issues",
    "Ventilation Problem",
    "Lighting Issues",
    "Bulb Replacement",
    "Bed Issues",
    "Mattress Problem",
    "Cupboard Issues",
    "Wardrobe Problem",
    "Study Table Issues",
    "Chair Damage",
    "Bathroom Fittings",
    "Toilet Issues",
    "Flush Problem",
    "Washbasin Issues",
    "Tap Leakage",
    "Wall Damage",
    "Paint Issues",
    "Ceiling Issues",
    "Roof Leakage",
    "Flooring Issues",
    "Tiles Damage",
    "Lock Issues",
    "Key Problem",
    "Wi-Fi Problem",
    "Internet Issues",
    "Geyser Problem",
    "Water Heater Issues",
    "Pest Control",
    "Drainage Problem",
    "Sewage Issues",
    "Curtains Issues",
    "Blinds Problem",
    "Other",
  ];

  // Get student ID from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("studentId");
      setStudentId(id);
    }
  }, []);

  // Fetch complaint history
  useEffect(() => {
    if (!studentId) return;

    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/complaints`);
        setComplaints(res.data?.complaints || []);
      } catch (err) {
        console.error("Error fetching complaint history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [studentId]);

  // Handle complaint type change
  const handleComplaintTypeChange = (e) => {
    const value = e.target.value;
    setComplaintType(value);

    // Reset maintenance fields when switching away from Maintenance issue
    if (value !== "Maintenance issue") {
      setFloorNumber("");
      setMaintenanceItems([]);
    }
  };

  // Handle maintenance item toggle
  const toggleMaintenanceItem = (item) => {
    setMaintenanceItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);

    const validFiles = files.filter((file) => {
      const isValidType = /\.(jpg|jpeg|png|gif|mp4|mov|avi|webm)$/i.test(
        file.name
      );
      const isValidSize = file.size <= 50 * 1024 * 1024;

      if (!isValidType) {
        toast.error(
          `${file.name} is not a valid file type. Only images and videos are allowed.`
        );
        return false;
      }
      if (!isValidSize) {
        toast.error(`${file.name} is too large. Maximum size is 50MB.`);
        return false;
      }
      return true;
    });

    const totalFiles = selectedFiles.length + validFiles.length;
    if (totalFiles > 5) {
      toast.error("Maximum 5 files allowed");
      return;
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  // Remove selected file
  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Get file icon based on type
  const getFileIcon = (file) => {
    if (file.type.startsWith("image/")) return <FiImage className="w-4 h-4" />;
    if (file.type.startsWith("video/")) return <FiVideo className="w-4 h-4" />;
    return <FiFile className="w-4 h-4" />;
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all required fields
    if (!complaintType) {
      toast.error("Please select a complaint type");
      return;
    }

    if (!subject.trim()) {
      toast.error("Please enter a subject");
      return;
    }

    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    if (!studentId) {
      toast.error("Student not identified. Please login again.");
      return;
    }

    // Validate "Others" type
    if (complaintType === "Others" && !otherComplaintType.trim()) {
      toast.error("Please specify the complaint type");
      return;
    }

    // Validate Maintenance fields
    if (complaintType === "Maintenance issue") {
      if (!floorNumber.trim()) {
        toast.error("Please specify the floor number");
        return;
      }
      if (maintenanceItems.length === 0) {
        toast.error("Please select at least one maintenance item");
        return;
      }
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("complaintType", complaintType);
      formData.append("subject", subject);
      formData.append("description", description);

      if (complaintType === "Others" && otherComplaintType) {
        formData.append("otherComplaintType", otherComplaintType);
      }

      // Add maintenance fields
      if (complaintType === "Maintenance issue") {
        formData.append("floorNumber", floorNumber);
        formData.append("maintenanceItems", JSON.stringify(maintenanceItems));
      }

      // Append files
      selectedFiles.forEach((file) => {
        formData.append("attachments", file);
      });

      await api.post("/complaint", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Complaint filed successfully");

      // Reset
      setComplaintType("");
      setOtherComplaintType("");
      setSubject("");
      setDescription("");
      setSelectedFiles([]);
      setFloorNumber("");
      setMaintenanceItems([]);

      // Re-fetch history
      const res = await api.get(`/complaints`);
      setComplaints(res.data?.complaints || []);
    } catch (err) {
      console.error("Error filing complaint:", err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const viewAttachment = async (complaintId, attachmentId, filename, mimeType) => {
    try {
      if (!complaintId || !attachmentId) {
        toast.error("Invalid attachment data");
        return;
      }

      console.log(`Viewing attachment: ${attachmentId} for complaint: ${complaintId}`);
      
      const response = await api.get(
        `/complaint/${complaintId}/attachment/${attachmentId}`,
        {
          responseType: 'blob'
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      let type = 'document';
      
      if (mimeType?.startsWith('image/')) type = 'image';
      else if (mimeType?.startsWith('video/')) type = 'video';
      
      setAttachmentModal({
        show: true,
        url,
        type,
        filename: filename || 'attachment'
      });
    } catch (error) {
      // Silently ignore 404s in console to prevent Next.js error overlay, but show toast
      toast.error("Failed to load the attachment. Please try again later.");
    }
  };

  const closeAttachmentModal = () => {
    if (attachmentModal.url) {
      window.URL.revokeObjectURL(attachmentModal.url);
    }
    setAttachmentModal({ show: false, url: '', type: '', filename: '' });
  };

  const getStatusClasses = (status) => {
    if (status === "pending") return "bg-orange-500 text-white";
    if (status === "in progress") return "bg-purple-500 text-white";
    if (status === "resolved") return "bg-green-500 text-white";
    if (status === "rejected") return "bg-red-500 text-white";
    return "bg-[#4F8DCF] text-white";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="w-full bg-white px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold text-black border-l-4 border-[#4F8CCF] pl-2 mb-4 sm:mb-6 md:mb-8">
        Complaints
      </h2>

      {/* Complaint Application Form */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.25)] mb-6 sm:mb-8 text-black w-full">
        <div className="bg-[#A4B494] text-white rounded-t-lg sm:rounded-t-xl px-3 sm:px-4 md:px-6 lg:px-8 py-2.5 sm:py-3 md:py-4 font-semibold text-xs sm:text-sm md:text-base lg:text-lg">
          Complaint Application Form
        </div>

        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8 space-y-3 sm:space-y-4 md:space-y-6">
          <div>
            <label className="block mb-2 text-xs sm:text-sm md:text-base font-semibold text-gray-800">
              Complaint Type
            </label>
            <select
              value={complaintType}
              onChange={handleComplaintTypeChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 rounded-md shadow-md border border-gray-300 text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Choose Complaint Type</option>
              <option value="Noise Disturbance">Noise Disturbance</option>
              <option value="Maintenance issue">Maintenance issue</option>
              <option value="Cleanliness issue">Cleanliness issue</option>
              <option value="Others">Others</option>
            </select>

            {complaintType === "Others" && (
              <div className="mt-2 sm:mt-3">
                <label className="block mb-2 text-xs sm:text-sm md:text-base font-semibold text-gray-800">
                  Specify:
                </label>
                <input
                  type="text"
                  value={otherComplaintType}
                  onChange={(e) => setOtherComplaintType(e.target.value)}
                  placeholder="Enter custom complaint type"
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 rounded-md shadow-md border border-gray-300 text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            )}

            {/* Maintenance-specific fields */}
            {complaintType === "Maintenance issue" && (
              <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                <div>
                  <label className="block mb-2 text-xs sm:text-sm md:text-base font-semibold text-gray-800">
                    Floor Number
                  </label>
                  <input
                    type="text"
                    value={floorNumber}
                    onChange={(e) => setFloorNumber(e.target.value)}
                    placeholder="Enter floor number (e.g., Ground, 1st, 2nd)"
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 rounded-md shadow-md border border-gray-300 text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-xs sm:text-sm md:text-base font-semibold text-gray-800">
                    Maintenance Items (Select all that apply)
                  </label>
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-2.5 md:gap-3">
                    {maintenanceOptions.map((item) => (
                      <label
                        key={item}
                        className="flex items-start space-x-2 p-2 sm:p-2.5 md:p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={maintenanceItems.includes(item)}
                          onChange={() => toggleMaintenanceItem(item)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0 mt-0.5"
                        />
                        <span className="text-xs sm:text-xs md:text-sm text-gray-700 break-words leading-tight">
                          {item}
                        </span>
                      </label>
                    ))}
                  </div>
                  {maintenanceItems.length > 0 && (
                    <div className="mt-2 text-xs sm:text-xs md:text-sm text-gray-600 break-words">
                      Selected: {maintenanceItems.join(", ")}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block mb-2 text-xs sm:text-sm md:text-base font-semibold text-gray-800">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter The Subject"
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 rounded-md shadow-md border border-gray-300 text-xs sm:text-sm md:text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-xs sm:text-sm md:text-base font-semibold text-gray-800">
              Description:
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 rounded-lg shadow-md resize-none border border-gray-300 text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter complaint description"
              required
            />
          </div>

          {/* File Upload Section */}
          <div>
            <label className="block mb-2 text-xs sm:text-sm md:text-base font-semibold text-gray-800">
              Attachments (Optional)
            </label>
            <div className="space-y-2 sm:space-y-3">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4 md:p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <FiUpload className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-gray-400" />
                  <div className="text-xs sm:text-sm md:text-base text-gray-600">
                    <span className="text-blue-600 hover:text-blue-700 font-medium">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </div>
                  <div className="text-xs text-gray-500">
                    Images and videos up to 50MB (Maximum 5 files)
                  </div>
                </label>
              </div>

              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs sm:text-sm font-medium text-gray-700">
                    Selected Files:
                  </h4>
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-md border gap-2"
                    >
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        {getFileIcon(file)}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="p-1 text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-[#BEC5AD] text-black px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-md shadow hover:opacity-90 text-xs sm:text-sm md:text-base font-medium w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              disabled={!studentId || loading}
              title={!studentId ? "Student not identified" : "Submit"}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>

      {/* Complaint History */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.25)] px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8 w-full mt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-800 flex items-center gap-2">
            <FiFile className="text-blue-600" />
            Complaint History
          </h3>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Bar */}
            <div className="relative group flex-1 sm:w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Search subject or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-black placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
              />
            </div>

            {/* Status Filter */}
            <div className="relative flex-shrink-0">
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-black font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="all" className="text-black">All Status</option>
                <option value="pending" className="text-black">Open Tickets</option>
                <option value="in progress" className="text-black">Inprocess Tickets</option>
                <option value="resolved" className="text-black">Resolved Section</option>
                <option value="rejected" className="text-black">Rejected</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-gray-800 min-w-full">
            <thead className="bg-gray-50 text-center">
              <tr className="border-b border-gray-200">
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Sr. No.</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Complaint Type</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Subject</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Filed Date</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Attachments</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Status</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-400 text-sm">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                      Loading history...
                    </div>
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-400 text-sm">
                    No complaints found.
                  </td>
                </tr>
              ) : (
                currentItems.map((complaint, index) => (
                  <tr key={index} className="bg-white border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-xs font-bold text-gray-900 text-center">
                      {String(indexOfFirstItem + index + 1).padStart(2, '0')}
                    </td>
                    <td className="p-4 text-sm text-center">
                      <div className="font-semibold text-gray-900">
                        {complaint.complaintType === "Others" && complaint.otherComplaintType
                          ? `Other (${complaint.otherComplaintType})`
                          : complaint.complaintType}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-center font-medium text-gray-700">
                      {complaint.subject}
                    </td>
                    <td className="p-4 text-sm text-center text-gray-500">
                      {formatDate(complaint.createdAt)}
                    </td>
                    <td className="p-4 text-center">
                      {complaint.hasAttachments ? (
                        <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-lg border border-blue-100">
                          <FiFile className="w-3 h-3 mr-1" />
                          {complaint.attachmentCount} FILE(S)
                        </span>
                      ) : (
                        <span className="text-gray-300 text-[10px] font-bold uppercase">No files</span>
                      )}
                    </td>
                    <td className="p-2 sm:p-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusClasses(complaint.status)}`}>
                        {complaint.status === "pending" ? "Open Ticket" : 
                         complaint.status === "in progress" ? "Inprocess Ticket" : 
                         complaint.status === "resolved" ? "Resolved Section" : 
                         complaint.status === "rejected" ? "Rejected" : "Open Ticket"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedComplaint(complaint);
                          setShowModal(true);
                        }}
                        className="p-2 bg-white hover:bg-blue-50 text-blue-600 rounded-xl transition-all duration-200 group flex items-center justify-center mx-auto border border-gray-200 hover:border-blue-200 shadow-sm"
                      >
                        <FiEye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-2 pb-6 border-b border-gray-100">
            <div className="text-xs sm:text-sm text-gray-500 font-medium">
              Showing <span className="text-gray-900">{indexOfFirstItem + 1}</span> to{" "}
              <span className="text-gray-900">
                {Math.min(indexOfLastItem, filteredComplaints.length)}
              </span>{" "}
              of <span className="text-gray-900">{filteredComplaints.length}</span> complaints
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition-colors text-black"
              >
                <FiChevronLeft size={16} />
              </button>
              
              <div className="flex items-center gap-1 mx-2">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNumber = i + 1;
                  if (pageNumber === 1 || pageNumber === totalPages || (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                          currentPage === pageNumber
                            ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                            : "hover:bg-blue-50 text-gray-600"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                    return <span key={pageNumber} className="text-gray-400 text-xs">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition-colors text-black"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Mobile/Tablet Cards View */}
        <div className="lg:hidden space-y-2 sm:space-y-3 md:space-y-4 mt-6">
          {loading ? (
            <div className="text-center py-12 text-gray-400 text-sm">
               <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
               Loading history...
            </div>
          ) : currentItems.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              No complaints found.
            </div>
          ) : (
            currentItems.map((complaint, index) => (
              <div key={index} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      #{String(indexOfFirstItem + index + 1).padStart(2, '0')}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusClasses(complaint.status)}`}>
                      {complaint.status === "pending" ? "Open Ticket" : 
                       complaint.status === "in progress" ? "Inprocess Ticket" : 
                       complaint.status === "resolved" ? "Resolved Section" : 
                       complaint.status === "rejected" ? "Rejected" : "Open Ticket"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Type</span>
                      <p className="text-xs font-bold text-gray-900">
                        {complaint.complaintType === "Others" && complaint.otherComplaintType
                          ? `Other (${complaint.otherComplaintType})`
                          : complaint.complaintType}
                      </p>
                    </div>
                    <div className="space-y-1 text-right">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</span>
                      <p className="text-xs text-gray-500">{formatDate(complaint.createdAt)}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Subject</span>
                    <p className="text-sm font-semibold text-gray-800 break-words">{complaint.subject}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {complaint.hasAttachments ? (
                      <span className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-lg border border-blue-100">
                        <FiFile className="w-3 h-3 mr-1" />
                        {complaint.attachmentCount} FILE(S)
                      </span>
                    ) : (
                      <span className="text-gray-300 text-[10px] font-bold uppercase">No files</span>
                    )}

                    <button
                      onClick={() => {
                        setSelectedComplaint(complaint);
                        setShowModal(true);
                      }}
                      className="flex items-center gap-1.5 text-blue-600 font-bold text-xs hover:text-blue-700 transition-colors px-3 py-1.5 bg-blue-50/50 rounded-xl"
                    >
                      <FiEye size={14} /> VIEW DETAILS
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Complaint Detail Modal */}
      {showModal && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-[#A4B494] px-6 py-4 flex justify-between items-center">
              <h3 className="text-white font-bold text-lg">Complaint Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Ticket ID</label>
                <p className="text-gray-800 font-medium">#{String(selectedComplaint._id).slice(-4).toUpperCase()}</p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Subject</label>
                <p className="text-gray-800 break-all">{selectedComplaint.subject}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Type</label>
                  <p className="text-gray-800">{selectedComplaint.displayType || selectedComplaint.complaintType}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Filed Date</label>
                  <p className="text-gray-800">{new Date(selectedComplaint.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-gray-700 text-sm whitespace-pre-wrap break-all">
                  {selectedComplaint.description}
                </div>
              </div>

              {selectedComplaint.maintenanceItems?.length > 0 && (
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Maintenance Items</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedComplaint.maintenanceItems.map((item, idx) => (
                      <span key={idx} className="bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded-full border border-blue-100">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-500 uppercase">Current Status</label>
                  <span className={`px-2 py-1 rounded-md text-xs font-bold ${getStatusClasses(selectedComplaint.status)}`}>
                    {selectedComplaint.status === "pending"
                      ? "Open Ticket"
                      : selectedComplaint.status === "in progress"
                      ? "Inprocess Ticket"
                      : selectedComplaint.status === "resolved"
                      ? "Resolved Section"
                      : selectedComplaint.status === "rejected"
                      ? "Rejected"
                      : "Open Ticket"}
                  </span>
                </div>
              </div>

              {selectedComplaint.status === "rejected" && (
                <div className="bg-red-50 p-4 rounded-lg border border-red-100 animate-in slide-in-from-top-2 duration-300">
                  <label className="text-xs font-bold text-red-600 uppercase flex items-center gap-1">
                    <FiX size={14} /> Rejection Reason
                  </label>
                  <p className="text-red-800 text-sm font-medium mt-1 break-all">
                    {selectedComplaint.adminNotes || "No reason provided by administrator."}
                  </p>
                </div>
              )}

              {selectedComplaint.attachments && selectedComplaint.attachments.length > 0 && (
                <div className="pt-4 border-t border-gray-100">
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-3">
                    Attachments ({selectedComplaint.attachments.length})
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedComplaint.attachments.map((attachment, idx) => (
                      <div key={idx} className="border rounded-xl p-3 hover:bg-gray-50 transition-all flex flex-col gap-2 shadow-sm">
                        <AttachmentThumbnail complaintId={selectedComplaint._id} attachment={attachment} />
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-700 truncate flex-1" title={attachment.originalName}>
                            {attachment.originalName || attachment.filename}
                          </span>
                        </div>
                        <button
                          onClick={() => viewAttachment(selectedComplaint._id, attachment._id, attachment.originalName, attachment.mimeType)}
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
                        >
                          <FiEye size={14} /> Open File
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Attachment Viewer Modal */}
      {attachmentModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in duration-200 border border-gray-100">
            <div className="bg-gray-900 px-4 py-3 flex justify-between items-center">
              <h3 className="text-white font-bold text-sm truncate pr-4">{attachmentModal.filename}</h3>
              <button
                onClick={closeAttachmentModal}
                className="text-white hover:bg-white/20 p-1.5 rounded-full transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="p-4 bg-gray-100 h-[calc(90vh-100px)] flex items-center justify-center overflow-auto">
              {attachmentModal.type === 'image' && (
                <img
                  src={attachmentModal.url}
                  alt={attachmentModal.filename}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                />
              )}
              {attachmentModal.type === 'video' && (
                <video
                  src={attachmentModal.url}
                  controls
                  autoPlay
                  className="max-w-full max-h-full rounded-lg shadow-lg"
                >
                  Your browser does not support the video tag.
                </video>
              )}
              {attachmentModal.type === 'document' && (
                <div className="text-center p-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <FiFile className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-900 font-bold mb-2">Preview Not Available</p>
                  <p className="text-gray-500 text-sm mb-6">This file type cannot be previewed in the browser.</p>
                  <a
                    href={attachmentModal.url}
                    download={attachmentModal.filename}
                    className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-2.5 rounded-xl hover:bg-blue-600 transition-all font-bold shadow-md shadow-blue-200"
                  >
                    <FiUpload className="rotate-180" size={18} /> Download File
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}