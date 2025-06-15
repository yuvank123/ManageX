import React, { useContext, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { Context } from "../provider/AuthProvider";

const AddFollowUp = () => {

   let {user}= useContext(Context)
  const [formData, setFormData] = useState({
    email: "",
    followUpDate: "",
    time: "",
    remarks: "",
    status: "Pending",
    myEmail:user?.email
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email || !formData.followUpDate || !formData.time) {
      return Swal.fire("Error", "Please fill all required fields", "error");
    }

    try {
      const res = await axios.post("http://localhost:3000/api/followups", formData);
      if (res.data.insertedId) {
        Swal.fire("Success", "Follow-up added successfully!", "success");
        setFormData({
          email: "",
          followUpDate: "",
          time: "",
          remarks: "",
          status: "Pending",
        });
      }
    } catch (err) {
      Swal.fire("Error", "Failed to add follow-up", "error");
    }
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">Add Follow-Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Lead Email */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Lead Email <span className="text-red-500">*</span></label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-500"
            placeholder="Enter lead email"
          />
        </div>

        {/* Follow-up Date */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Follow-up Date <span className="text-red-500">*</span></label>
          <input
            type="date"
            name="followUpDate"
            value={formData.followUpDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
          />
        </div>

        {/* Time */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Time <span className="text-red-500">*</span></label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
          />
        </div>

        {/* Remarks */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Remarks</label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-500"
            placeholder="Write valid info or notes"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
          >
            <option value="Pending">Pending</option>
            <option value="Done">Done</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Submit Follow-Up
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddFollowUp;
