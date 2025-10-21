"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { FiUpload, FiX, FiFile, FiImage, FiVideo } from "react-icons/fi";

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

  const getStatusClasses = (status) => {
    if (status === "Approved" || status === "Resolved")
      return "bg-green-500 text-white";
    if (status === "Rejected") return "bg-red-500 text-white";
    if (status === "Pending") return "bg-[#4F8DCF] text-white";
    return "bg-[#4F8DCF] text-white";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString();
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
      <div className="bg-white rounded-lg sm:rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.25)] px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8 w-full">
        <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold mb-3 sm:mb-4 md:mb-6 text-gray-800">
          Complaint History
        </h3>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-gray-800 min-w-full">
            <thead className="bg-gray-200 text-center">
              <tr>
                <th className="p-2 sm:p-3 font-semibold text-xs sm:text-sm">
                  Complaint Type
                </th>
                <th className="p-2 sm:p-3 font-semibold text-xs sm:text-sm">
                  Subject
                </th>
                <th className="p-2 sm:p-3 font-semibold text-xs sm:text-sm">
                  Filed Date
                </th>
                <th className="p-2 sm:p-3 font-semibold text-xs sm:text-sm">
                  Description
                </th>
                <th className="p-2 sm:p-3 font-semibold text-xs sm:text-sm">
                  Attachments
                </th>
                <th className="p-2 sm:p-3 font-semibold text-xs sm:text-sm">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-4 sm:py-6 text-gray-500 text-xs sm:text-sm"
                  >
                    Loading...
                  </td>
                </tr>
              ) : complaints.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-4 sm:py-6 text-gray-500 text-xs sm:text-sm"
                  >
                    No complaints found.
                  </td>
                </tr>
              ) : (
                complaints.map((complaint, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-2 sm:p-3 text-xs sm:text-sm font-medium text-center">
                      {complaint.complaintType === "Others" &&
                      complaint.otherComplaintType
                        ? `Other (${complaint.otherComplaintType})`
                        : complaint.complaintType}
                      {complaint.complaintType === "Maintenance issue" &&
                        complaint.floorNumber && (
                          <div className="text-xs text-gray-500 mt-1">
                            Floor: {complaint.floorNumber}
                          </div>
                        )}
                    </td>
                    <td className="p-2 sm:p-3 text-xs sm:text-sm text-center">
                      {complaint.subject}
                    </td>
                    <td className="p-2 sm:p-3 text-xs sm:text-sm text-center">
                      {formatDate(complaint.createdAt)}
                    </td>
                    <td className="p-2 sm:p-3 text-xs sm:text-sm max-w-xs truncate text-center">
                      {complaint.description}
                      {complaint.maintenanceItems &&
                        complaint.maintenanceItems.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            Items: {complaint.maintenanceItems.join(", ")}
                          </div>
                        )}
                    </td>
                    <td className="p-2 sm:p-3 text-xs sm:text-sm text-center">
                      {complaint.hasAttachments ? (
                        <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          <FiFile className="w-3 h-3 mr-1" />
                          {complaint.attachmentCount} file
                          {complaint.attachmentCount > 1 ? "s" : ""}
                        </span>
                      ) : (
                        <span className="text-gray-400">No files</span>
                      )}
                    </td>
                    <td className="p-2 sm:p-3 text-center">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap ${getStatusClasses(
                          complaint.status
                        )}`}
                      >
                        {complaint.status
                          ? complaint.status
                              .split(" ")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")
                          : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Cards View */}
        <div className="lg:hidden space-y-2 sm:space-y-3 md:space-y-4">
          {loading ? (
            <div className="text-center py-4 sm:py-6 text-gray-500 text-xs sm:text-sm">
              Loading...
            </div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-4 sm:py-6 text-gray-500 text-xs sm:text-sm">
              No complaints found.
            </div>
          ) : (
            complaints.map((complaint, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-2.5 sm:p-3 md:p-4 border border-gray-200"
              >
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs sm:text-xs md:text-sm font-semibold text-gray-600 flex-shrink-0">
                      Complaint Type:
                    </span>
                    <span className="text-xs sm:text-xs md:text-sm font-medium text-gray-800 text-right flex-1">
                      {complaint.complaintType === "Others" &&
                      complaint.otherComplaintType
                        ? `Other (${complaint.otherComplaintType})`
                        : complaint.complaintType}
                    </span>
                  </div>

                  {complaint.complaintType === "Maintenance issue" &&
                    complaint.floorNumber && (
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs sm:text-xs md:text-sm font-semibold text-gray-600 flex-shrink-0">
                          Floor:
                        </span>
                        <span className="text-xs sm:text-xs md:text-sm text-gray-800">
                          {complaint.floorNumber}
                        </span>
                      </div>
                    )}

                  {complaint.maintenanceItems &&
                    complaint.maintenanceItems.length > 0 && (
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs sm:text-xs md:text-sm font-semibold text-gray-600 flex-shrink-0">
                          Items:
                        </span>
                        <span className="text-xs sm:text-xs md:text-sm text-gray-800 text-right flex-1 break-words">
                          {complaint.maintenanceItems.join(", ")}
                        </span>
                      </div>
                    )}

                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs sm:text-xs md:text-sm font-semibold text-gray-600 flex-shrink-0">
                      Subject:
                    </span>
                    <span className="text-xs sm:text-xs md:text-sm text-gray-800 text-right flex-1 break-words">
                      {complaint.subject}
                    </span>
                  </div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs sm:text-xs md:text-sm font-semibold text-gray-600 flex-shrink-0">
                      Date:
                    </span>
                    <span className="text-xs sm:text-xs md:text-sm text-gray-800 flex-shrink-0">
                      {formatDate(complaint.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs sm:text-xs md:text-sm font-semibold text-gray-600 flex-shrink-0">
                      Description:
                    </span>
                    <span className="text-xs sm:text-xs md:text-sm text-gray-800 text-right flex-1 break-words">
                      {complaint.description}
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-xs sm:text-xs md:text-sm font-semibold text-gray-600 flex-shrink-0">
                      Attachments:
                    </span>
                    {complaint.hasAttachments ? (
                      <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex-shrink-0">
                        <FiFile className="w-3 h-3 mr-1" />
                        {complaint.attachmentCount} file
                        {complaint.attachmentCount > 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs flex-shrink-0">
                        No files
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-xs sm:text-xs md:text-sm font-semibold text-gray-600 flex-shrink-0">
                      Status:
                    </span>
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium flex-shrink-0 ${getStatusClasses(
                        complaint.status
                      )}`}
                    >
                      {complaint.status
                        ? complaint.status.charAt(0).toUpperCase() +
                          complaint.status.slice(1)
                        : "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
