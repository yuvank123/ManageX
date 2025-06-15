import React, { useState, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Context } from '../provider/AuthProvider';
import Loading from '../component/loading.jsx';
import {
  FaChartLine,
  FaUsers,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaTicketAlt,
  FaTasks,
} from 'react-icons/fa';

const ExecutiveAnalytics = () => {
  const { user } = useContext(Context);

  // Fetch executive's performance metrics
  const fetchExecutivePerformance = async () => {
    try {
      const config = {
        withCredentials: true,
      };
      // Now calling the executive-specific endpoint
      const response = await axios.get('http://localhost:3000/executive/performance-metrics', config);
      return response.data; 
    } catch (error) {
      console.error("Error fetching executive performance metrics:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch executive performance metrics");
    }
  };

  // Fetch executive's overdue follow-ups
  const fetchMyOverdueFollowups = async () => {
    const response = await axios.get('http://localhost:3000/executive/followup-reminders', {
      withCredentials: true,
    });
    return response.data;
  };

  const { data: executiveMetrics, isLoading: metricsLoading, error: metricsError } = useQuery({
    queryKey: ['executivePerformance', user?.email],
    queryFn: fetchExecutivePerformance,
    enabled: !!user?.email,
  });

  const { data: overdueFollowupsData = { pending: [] }, isLoading: overdueFollowupsLoading } = useQuery({
    queryKey: ['myOverdueFollowups', user?.email],
    queryFn: fetchMyOverdueFollowups,
    enabled: !!user?.email,
  });

  const isLoading = metricsLoading || overdueFollowupsLoading;
  const error = metricsError;

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">Error: {error.message}</div>;
  }

  return (
    <motion.div
      className="max-w-7xl mx-auto mt-10 p-6 space-y-6"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl font-bold text-blue-700 mb-6">My Performance Dashboard</h2>

      {executiveMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Leads */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Leads Added</p>
                <p className="text-3xl font-bold text-blue-600">{executiveMetrics.leads?.total || 0}</p>
              </div>
              <FaUsers className="text-4xl text-blue-500" />
            </div>
          </motion.div>

          {/* Closed Leads */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Closed Leads</p>
                <p className="text-3xl font-bold text-green-600">{executiveMetrics.leads?.closed || 0}</p>
              </div>
              <FaCheckCircle className="text-4xl text-green-500" />
            </div>
          </motion.div>

          {/* Conversion Rate */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Conversion Rate</p>
                <p className="text-3xl font-bold text-purple-600">{executiveMetrics.leads?.conversionRate || 0}%</p>
              </div>
              <FaChartLine className="text-4xl text-purple-500" />
            </div>
          </motion.div>

          {/* Total Follow-ups */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Follow-ups</p>
                <p className="text-3xl font-bold text-orange-600">{executiveMetrics.followUps?.total || 0}</p>
              </div>
              <FaCalendarAlt className="text-4xl text-orange-500" />
            </div>
          </motion.div>

          {/* Completed Follow-ups */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed Follow-ups</p>
                <p className="text-3xl font-bold text-teal-600">{executiveMetrics.followUps?.completed || 0}</p>
              </div>
              <FaCheckCircle className="text-4xl text-teal-500" />
            </div>
          </motion.div>

          {/* Total Tickets */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Tickets Raised</p>
                <p className="text-3xl font-bold text-pink-600">{executiveMetrics.tickets?.total || 0}</p>
              </div>
              <FaTicketAlt className="text-4xl text-pink-500" />
            </div>
          </motion.div>

          {/* Completed Tasks */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed Tasks</p>
                <p className="text-3xl font-bold text-green-600">{executiveMetrics.tasks?.completed || 0}</p>
              </div>
              <FaTasks className="text-4xl text-green-500" />
            </div>
          </motion.div>

          {/* Total Tasks */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Tasks Assigned</p>
                <p className="text-3xl font-bold text-blue-600">{executiveMetrics.tasks?.total || 0}</p>
              </div>
              <FaTasks className="text-4xl text-blue-500" />
            </div>
          </motion.div>

          {/* Task Completion Rate */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Task Completion Rate</p>
                <p className="text-3xl font-bold text-purple-600">{executiveMetrics.tasks?.completionRate || 0}%</p>
              </div>
              <FaChartLine className="text-4xl text-purple-500" />
            </div>
          </motion.div>
        </div>
      )}

      {/* Overdue Follow-ups */}
      {overdueFollowupsData.pending.length > 0 && (
        <motion.div
          className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl shadow mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center mb-2">
            <FaExclamationTriangle className="text-red-500 mr-2 text-xl" />
            <span className="font-semibold text-red-800 text-lg">
              Overdue/Pending Follow-ups: {overdueFollowupsData.pending.length}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="text-red-900">
                  <th className="py-2 px-3 text-black">Lead Email</th>
                  <th className="py-2 px-3 text-black">Follow-up Date</th>
                  <th className="py-2 px-3 text-black">Status</th>
                </tr>
              </thead>
              <tbody>
                {overdueFollowupsData.pending.map((followup, idx) => (
                  <tr key={followup._id || idx} className="bg-red-100">
                    <td className="py-2 px-3 text-black">{followup.email}</td>
                    <td className="py-2 px-3 text-black">{new Date(followup.followUpDate).toLocaleDateString()}</td>
                    <td className="py-2 px-3 text-black">{followup.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ExecutiveAnalytics; 