import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const ManageTicket = () => {
  const fetchUsers = async () => {
    const response = await axios.get(`http://localhost:3000/alltickets`);
    return response.data;
  };

  const { data: allticket = [], isLoading: allticketLoading, refetch } = useQuery({
    queryKey: ["allticket"],
    queryFn: fetchUsers,
  });

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:3000/api/tickets/${id}`, {
        status: newStatus,
      });
      refetch();
      Swal.fire("Updated", "Ticket status updated!", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This ticket will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3000/api/tickets/${id}`);
          refetch();
          Swal.fire('Deleted!', 'Ticket has been deleted.', 'success');
        } catch (err) {
          Swal.fire('Error', 'Failed to delete ticket', 'error');
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
        <h2 className="text-2xl font-bold text-center text-indigo-400 mb-6">
          Manage Tickets
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-gray-200">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="py-3 px-4 border">#</th>
                <th className="py-3 px-4 border">Customer Email</th>
                <th className="py-3 px-4 border">Category</th>
                <th className="py-3 px-4 border">Priority</th>
                <th className="py-3 px-4 border">Message</th>
                <th className="py-3 px-4 border">Status</th>
                <th className="py-3 px-4 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allticket.map((ticket, index) => (
                <tr key={ticket._id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4 border text-gray-800">{index + 1}</td>
                  <td className="py-3 px-4 border text-gray-800">{ticket.customerEmail}</td>
                  <td className="py-3 px-4 border text-gray-800">{ticket.category}</td>
                  <td className="py-3 px-4 border text-gray-800">{ticket.priority}</td>
                  <td className="py-3 px-4 border text-gray-800">{ticket.message}</td>
                  <td className="py-3 px-4 border">
                    <select
                      value={ticket.status}
                      onChange={(e) =>
                        handleStatusChange(ticket._id, e.target.value)
                      }
                      className="border rounded px-2 py-1 text-gray-800"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 border text-center">
                    <button
                      onClick={() => handleDelete(ticket._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {allticket.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500 py-4">
                    No tickets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default ManageTicket;
