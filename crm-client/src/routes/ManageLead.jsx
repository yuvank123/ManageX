import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ This is required separately
import { API_BASE_URL } from '../config/api.js';

const ManageLead = () => {

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/manageLead`);
      return response.data;
    } catch (error) {
      console.error("Error fetching leads:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch leads");
    }
  };

  const { data: alllead = [], isLoading:allleadLoading,refetch } = useQuery({
    queryKey: ["alllead"], // The unique key for this query
    queryFn: fetchLeads, // Function to fetch the data
  });

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/leads/${id}`, {
        status: newStatus,
      });
      refetch()
      Swal.fire("Updated", "Lead status updated!", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This lead will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_BASE_URL}/api/leads/${id}`);
          refetch()
          Swal.fire("Deleted!", "Lead has been deleted.", "success");
        } catch (err) {
          Swal.fire("Error", "Failed to delete lead", "error");
        }
      }
    });
  };

  const [searchText, setSearchText] = useState("");

  // Filtered data based on search
  const filteredLeads = alllead.filter((lead) =>
    [lead.name, lead.email, lead.product]
      .some(field =>
        field?.toLowerCase().includes(searchText.toLowerCase()))
  );

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.text("Lead Data", 14, 15); // Move text down to prevent overlap

    const tableData = filteredLeads.map((lead, index) => [
      index + 1,
      lead.name || "-",
      lead.phone || "-",
      lead.email || "-",
      lead.product || "-",
      lead.status || "-",
      lead.expectedDate || "-",
      lead.notes || "-"
    ]);

    autoTable(doc, {
      head: [["#", "Name", "Phone", "Email", "Product", "Status", "Expected Date", "Notes"]],
      body: tableData,
      startY: 20,
      theme: "grid",
      styles: { fontSize: 10 },
    });

    doc.save("lead_data.pdf");
  };

  const queryClient = useQueryClient();

  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, updatedData }) => {
      await axios.patch(`${API_BASE_URL}/api/leads/${id}`, updatedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['leads']);
    },
  });

  const deleteLeadMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${API_BASE_URL}/api/leads/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['leads']);
    },
  });

  return (
    <div>
      <motion.div
        className="max-w-6xl mx-auto mt-10 p-4 bg-white rounded-xl shadow-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Manage Leads
        </h2>

        {/* 🔍 Search + Download Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-3">
          <input
            type="text"
            placeholder="Search by name, email, product..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full sm:w-1/2 placeholder-gray-500 border border-gray-500 px-4 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleDownloadPDF}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
          >
            Download PDF
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-gray-200">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="py-3 px-4 border">#</th>
                <th className="py-3 px-4 border">Customer Name</th>
                <th className="py-3 px-4 border">Phone</th>
                <th className="py-3 px-4 border">Email</th>
                <th className="py-3 px-4 border">Product</th>
                <th className="py-3 px-4 border">Status</th>
                <th className="py-3 px-4 border">Expected Date</th>
                <th className="py-3 px-4 border">Notes</th>
                <th className="py-3 px-4 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead, index) => (
                <tr key={lead._id} className="hover:bg-gray-50 transition text-gray-800">
                  <td className="py-3 px-4 border text-gray-800">{index + 1}</td>
                  <td className="py-3 px-4 border text-gray-800">{lead.customerName || lead.name}</td>
                  <td className="py-3 px-4 border text-gray-800">{lead.phone}</td>
                  <td className="py-3 px-4 border text-gray-800">{lead.email}</td>
                  <td className="py-3 px-4 border text-gray-800">{lead.product}</td>
                  <td className="py-3 px-4 border">
                    <select
                      value={lead.status}
                      onChange={(e) =>
                        handleStatusChange(lead._id, e.target.value)
                      }
                      className="border rounded px-2 py-1 text-gray-800"
                    >
                      <option value="New">New</option>
                      <option value="In Process">In Process</option>
                      <option value="Follow-Up">Follow-Up</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 border text-red-600">{lead.expectedDate}</td>
                  <td className="py-3 px-4 border text-gray-800">{lead.notes}</td>
                  <td className="py-3 px-4 border text-center space-x-2">
                    <button
                      onClick={() => handleDelete(lead._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center text-gray-500 py-4">
                    No leads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

export default ManageLead