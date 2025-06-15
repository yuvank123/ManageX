import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2";
import { Context } from "../provider/AuthProvider";

const RaiseTicket = () => {
  const { user } = useContext(Context);

  const [formData, setFormData] = useState({
    customerEmail: "",
    category: "KYC Issue",
    priority: "Low",
    message: "",
    status: "Open", // Default status
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
    const ticketData = {
      ...formData,
      executiveEmail: user?.email,
      date: new Date().toISOString(),
    };

    try {
      await axios.post("http://localhost:3000/api/tickets", ticketData);
      Swal.fire("Success!", "Ticket submitted to admin!", "success");
      setFormData({
        customerEmail: "",
        category: "KYC Issue",
        priority: "Low",
        message: "",
        status: "Open",
      });
    } catch (error) {
      Swal.fire("Error!", "Failed to submit ticket", "error");
    }
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto p-6 mt-10 bg-white shadow-xl rounded-xl"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
        Raise a Ticket
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1 font-medium">Customer Email</label>
          <input
            type="email"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-4 py-2 text-gray-800 placeholder-gray-500"
            placeholder="Enter customer email"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1 font-medium">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2 text-gray-800"
          >
            <option value="KYC Issue">KYC Issue</option>
            <option value="Escalation">Escalation</option>
            <option value="Product Query">Product Query</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-1 font-medium">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2 text-gray-800"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-1 font-medium">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="4"
            className="w-full border border-gray-300 rounded px-4 py-2 text-gray-800 placeholder-gray-500"
            placeholder="Describe the issue in detail"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded transition"
        >
          Submit Ticket
        </button>
      </form>
    </motion.div>
  );
};

export default RaiseTicket;
