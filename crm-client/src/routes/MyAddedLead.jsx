import React, { useContext } from 'react'
import { Context } from '../provider/AuthProvider';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { motion } from "framer-motion";

const MyAddedLead = () => {

    let {user}= useContext(Context)

    const fetchUsers = async () => {
        const response = await axios.get(`http://localhost:3000/myleads/${user?.email}`);
        return response.data;
      };

      

   
    const { data: mylead = [], isLoading:myleadLoading,refetch } = useQuery({
        queryKey: [user?.email,"mylead"], // The unique key for this query
        queryFn: fetchUsers, // Function to fetch the data
      });

       const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:3000/api/leads/${id}`, {
        
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
          await axios.delete(`http://localhost:3000/api/leads/${id}`);
          refetch()
          Swal.fire("Deleted!", "Lead has been deleted.", "success");
          
        } catch (err) {
          Swal.fire("Error", "Failed to delete lead", "error");
        }
      }
    });
  };

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
            {mylead.map((lead, index) => (
              <tr key={lead._id} className="hover:bg-gray-50 transition">
                <td className="py-3 px-4 border text-gray-800">{index + 1}</td>
                <td className="py-3 px-4 border text-gray-800">{lead.name}</td>
                <td className="py-3 px-4 border text-gray-800">{lead.phone}</td>
                <td className="py-3 px-4 border text-gray-800">{lead.email}</td>
                <td className="py-3 px-4 border text-gray-800">{lead.product}</td>
                <td className="py-3 px-4 border text-gray-800">
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
            {mylead.length === 0 && (
              <tr>
                <td
                  colSpan="9"
                  className="text-center text-gray-500 py-4"
                >
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

export default MyAddedLead