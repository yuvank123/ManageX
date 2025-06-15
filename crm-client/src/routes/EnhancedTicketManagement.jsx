import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Context } from '../provider/AuthProvider';
import { useContext } from 'react';
import Loading from '../component/loading.jsx';
import { 
  FaTicketAlt, 
  FaClock, 
  FaExclamationTriangle,
  FaCheckCircle,
  FaUserTie,
  FaChartBar,
  FaEdit,
  FaEye
} from 'react-icons/fa';
import Swal from 'sweetalert2';

const EnhancedTicketManagement = () => {
  const { user } = useContext(Context);
  const queryClient = useQueryClient();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  // Fetch all tickets
  const fetchAllTickets = async () => {
    const response = await axios.get('http://localhost:3000/alltickets', {
      withCredentials: true,
    });
    return response.data;
  };

  // Fetch ticket TAT analytics
  const fetchTicketTAT = async () => {
    const response = await axios.get('http://localhost:3000/admin/ticket-tat', {
      withCredentials: true,
    });
    return response.data;
  };

  // Fetch high priority tickets
  const fetchHighPriorityTickets = async () => {
    const response = await axios.get('http://localhost:3000/admin/high-priority-tickets', {
      withCredentials: true,
    });
    return response.data;
  };

  const { data: allTickets = [], isLoading: ticketsLoading } = useQuery({
    queryKey: ['allTickets'],
    queryFn: fetchAllTickets,
  });

  const { data: tatAnalytics, isLoading: tatLoading } = useQuery({
    queryKey: ['ticketTAT', user?.email],
    queryFn: fetchTicketTAT,
    enabled: !!user?.email,
  });

  const { data: highPriorityTickets = [], isLoading: highPriorityLoading } = useQuery({
    queryKey: ['highPriorityTickets', user?.email],
    queryFn: fetchHighPriorityTickets,
    enabled: !!user?.email,
  });

  // Assign ticket mutation
  const assignTicketMutation = useMutation({
    mutationFn: async ({ ticketId, assignmentData }) => {
      const response = await axios.patch(
        `http://localhost:3000/admin/tickets/${ticketId}/assign`,
        assignmentData,
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['allTickets']);
      queryClient.invalidateQueries(['highPriorityTickets']);
      setShowAssignmentModal(false);
      setSelectedTicket(null);
      Swal.fire('Success', 'Ticket assigned successfully!', 'success');
    },
    onError: (error) => {
      Swal.fire('Error', error.response?.data?.message || 'Failed to assign ticket', 'error');
    },
  });

  const handleAssignTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowAssignmentModal(true);
  };

  const handleAssignmentSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const assignmentData = {
      assignedTo: formData.get('assignedTo'),
      priority: formData.get('priority'),
      department: formData.get('department'),
    };

    assignTicketMutation.mutate({
      ticketId: selectedTicket._id,
      assignmentData,
    });
  };

  const isLoading = ticketsLoading || tatLoading || highPriorityLoading;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <motion.div
      className="max-w-7xl mx-auto p-6 rounded-2xl shadow-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-6">Enhanced Ticket Management</h2>

      {/* TAT Analytics Cards */}
      {tatAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Tickets</p>
                <p className="text-3xl font-bold text-blue-600">{tatAnalytics.totalTickets}</p>
              </div>
              <FaTicketAlt className="text-4xl text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Resolved</p>
                <p className="text-3xl font-bold text-green-600">{tatAnalytics.resolvedTickets}</p>
              </div>
              <FaCheckCircle className="text-4xl text-green-500" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg TAT (Days)</p>
                <p className="text-3xl font-bold text-orange-600">{tatAnalytics.avgTAT}</p>
              </div>
              <FaClock className="text-4xl text-orange-500" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Overdue</p>
                <p className="text-3xl font-bold text-red-600">{tatAnalytics.overdueTickets}</p>
              </div>
              <FaExclamationTriangle className="text-4xl text-red-500" />
            </div>
          </motion.div>
        </div>
      )}

      {/* High Priority Tickets Alert */}
      {highPriorityTickets.length > 0 && (
        <motion.div
          className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl shadow"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center mb-2">
            <FaExclamationTriangle className="text-red-500 mr-2 text-xl" />
            <span className="font-semibold text-red-800 text-lg">
              High Priority Tickets: {highPriorityTickets.length}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="text-red-900">
                  <th className="py-2 px-3">Subject</th>
                  <th className="py-2 px-3">Executive</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Created</th>
                  <th className="py-2 px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {highPriorityTickets.map((ticket, idx) => (
                  <tr key={ticket._id || idx} className="bg-red-100">
                    <td className="py-2 px-3">{ticket.subject}</td>
                    <td className="py-2 px-3">{ticket.executiveEmail}</td>
                    <td className="py-2 px-3">{ticket.status}</td>
                    <td className="py-2 px-3">
                      {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => handleAssignTicket(ticket)}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                      >
                        Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* All Tickets Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">All Tickets</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 font-semibold">
              <tr>
                <th className="py-3 px-4 border">Subject</th>
                <th className="py-3 px-4 border">Executive</th>
                <th className="py-3 px-4 border">Status</th>
                <th className="py-3 px-4 border">Priority</th>
                <th className="py-3 px-4 border">Department</th>
                <th className="py-3 px-4 border">Created</th>
                <th className="py-3 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allTickets.map((ticket, index) => (
                <tr key={ticket._id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4 border text-gray-800">{ticket.subject}</td>
                  <td className="py-3 px-4 border text-gray-800">{ticket.executiveEmail}</td>
                  <td className="py-3 px-4 border">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ticket.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                      ticket.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 border">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ticket.priority === 'High' ? 'bg-red-100 text-red-800' :
                      ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {ticket.priority || 'Not Set'}
                    </span>
                  </td>
                  <td className="py-3 px-4 border text-gray-800">{ticket.department || 'Not Assigned'}</td>
                  <td className="py-3 px-4 border text-gray-800">
                    {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="py-3 px-4 border">
                    <button
                      onClick={() => handleAssignTicket(ticket)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 mr-2"
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignmentModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Assign Ticket: {selectedTicket.subject}
            </h3>
            <form onSubmit={handleAssignmentSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Assign To:
                </label>
                <input
                  type="text"
                  name="assignedTo"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter assignee name"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Priority:
                </label>
                <select
                  name="priority"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Department:
                </label>
                <select
                  name="department"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Department</option>
                  <option value="Technical">Technical</option>
                  <option value="Sales">Sales</option>
                  <option value="Support">Support</option>
                  <option value="Finance">Finance</option>
                  <option value="HR">HR</option>
                </select>
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                  disabled={assignTicketMutation.isLoading}
                >
                  {assignTicketMutation.isLoading ? 'Assigning...' : 'Assign Ticket'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAssignmentModal(false);
                    setSelectedTicket(null);
                  }}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default EnhancedTicketManagement;
