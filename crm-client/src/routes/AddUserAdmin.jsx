import React, { useState, useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { Context } from "../provider/AuthProvider";

const AddUserAdmin = () => {
  const { user } = useContext(Context); // Get user from auth context, assuming it contains token if needed for axios headers
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'executives', // Default role
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // You might need to send the JWT token in headers if your API requires it
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`, // Adjust based on your auth hook output
          'Content-Type': 'application/json',
        },
      };

      const res = await axios.post('http://localhost:3000/admin/add-user', formData, config);

      if (res.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'User Added!',
          text: `User ${formData.email} added successfully with role ${formData.role}!`,
          showConfirmButton: false,
          timer: 2500,
        });
        setFormData({ name: '', email: '', phone: '', password: '', role: 'executives' }); // Reset form
      }
    } catch (error) {
      console.error('Error adding user:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Add User',
        text: error.response?.data?.message || 'An unexpected error occurred. Please try again.',
      });
    }
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-200"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Add New User
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            placeholder="Enter user's full name"
            autocomplete="off"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            placeholder="user@example.com"
            autocomplete="off"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            placeholder="e.g., +91-9876543210"
            autocomplete="off"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Temporary Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            placeholder="Set a temporary password"
            autocomplete="new-password"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          >
            <option value="executives">Insurance Executive</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        <motion.button
          type="submit"
          className="w-full py-2 mt-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Add User
        </motion.button>
      </form>
    </motion.div>
  );
};

export default AddUserAdmin; 