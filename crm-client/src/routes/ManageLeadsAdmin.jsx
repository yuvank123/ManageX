import React, { useState, useEffect, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Context } from "../provider/AuthProvider";
import Loading from "../component/loading.jsx";

const ManageLeadsAdmin = () => {
  const { user } = useContext(Context);
  const [filterEmail, setFilterEmail] = useState('');
  const [filterProduct, setFilterProduct] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterMinDate, setFilterMinDate] = useState('');
  const [filterMaxDate, setFilterMaxDate] = useState('');

  const fetchAllLeads = async () => {
    try {
      const config = {
        withCredentials: true,
        params: { // Pass filter parameters in the request config
          executiveEmail: filterEmail || undefined,
          product: filterProduct || undefined,
          status: filterStatus || undefined,
          minExpectedClosureDate: filterMinDate || undefined,
          maxExpectedClosureDate: filterMaxDate || undefined,
        },
      };
      const response = await axios.get('http://localhost:3000/admin/leads', config);
      return response.data;
    } catch (error) {
      console.error("Error fetching leads:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch leads");
    }
  };

  const { data: leads = [], isLoading, error, refetch } = useQuery({
    queryKey: ['allLeads', user?.email, filterEmail, filterProduct, filterStatus, filterMinDate, filterMaxDate], // Include all filters in the query key
    queryFn: fetchAllLeads,
    enabled: !!user?.email,
  });

  // Client-side filtering is removed as filtering is now done on the server
  // const filteredLeads = leads.filter(lead => 
  //   lead.myEmail.toLowerCase().includes(filterEmail.toLowerCase())
  // );

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">Error: {error.message}</div>;
  }

  return (
    <motion.div
      className="max-w-7xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-200"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        All Leads (Admin View)
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Executive Email Filter */}
        <div>
          <label htmlFor="filterEmail" className="block text-gray-700 text-sm font-bold mb-2">
            Executive Email:
          </label>
          <input
            type="email"
            id="filterEmail"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline placeholder-gray-700"
            placeholder="Filter by executive email"
            value={filterEmail}
            onChange={(e) => setFilterEmail(e.target.value)}
          />
        </div>

        {/* Product Filter */}
        <div>
          <label htmlFor="filterProduct" className="block text-gray-700 text-sm font-bold mb-2">
            Product Interest:
          </label>
          <select
            id="filterProduct"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={filterProduct}
            onChange={(e) => setFilterProduct(e.target.value)}
          >
            <option value="">All Products</option>
            <option value="Health Insurance">Health Insurance</option>
            <option value="Life Insurance">Life Insurance</option>
            <option value="Car Insurance">Car Insurance</option>
            <option value="Home Loan">Home Loan</option>
            <option value="Personal Loan">Personal Loan</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Investment Plan">Investment Plan</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="filterStatus" className="block text-gray-700 text-sm font-bold mb-2">
            Lead Status:
          </label>
          <select
            id="filterStatus"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="In Process">In Process</option>
            <option value="Follow-Up">Follow-Up</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Min Expected Closure Date */}
        <div>
          <label htmlFor="filterMinDate" className="block text-gray-700 text-sm font-bold mb-2">
            Min. Closure Date:
          </label>
          <input
            type="date"
            id="filterMinDate"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-gray-800"
            value={filterMinDate}
            onChange={(e) => setFilterMinDate(e.target.value)}
          />
        </div>

        {/* Max Expected Closure Date */}
        <div>
          <label htmlFor="filterMaxDate" className="block text-gray-700 text-sm font-bold mb-2">
            Max. Closure Date:
          </label>
          <input
            type="date"
            id="filterMaxDate"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-gray-800"
            value={filterMaxDate}
            onChange={(e) => setFilterMaxDate(e.target.value)}
          />
        </div>
      </div>

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
              <th className="py-3 px-4 border">Expected Closure</th>
              <th className="py-3 px-4 border">Executive Email</th>
              <th className="py-3 px-4 border">Notes</th>
            </tr>
          </thead>
          <tbody>
            {leads.length > 0 ? (
              leads.map((lead, index) => (
                <tr key={lead._id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4 border text-gray-800">{index + 1}</td>
                  <td className="py-3 px-4 border text-gray-800">{lead.name}</td>
                  <td className="py-3 px-4 border text-gray-800">{lead.phone}</td>
                  <td className="py-3 px-4 border text-gray-800">{lead.email}</td>
                  <td className="py-3 px-4 border text-gray-800">{lead.product}</td>
                  <td className="py-3 px-4 border text-gray-800">{lead.status}</td>
                  <td className="py-3 px-4 border text-gray-800">{lead.expectedDate}</td>
                  <td className="py-3 px-4 border text-gray-800">{lead.myEmail}</td>
                  <td className="py-3 px-4 border text-gray-800">{lead.notes}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-500">
                  No leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ManageLeadsAdmin; 