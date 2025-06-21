import React, { useContext } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Loading from '../component/loading.jsx';
import { Context } from '../provider/AuthProvider';
import { API_BASE_URL } from '../config/api.js';

const ActivityLog = () => {
  const { user } = useContext(Context);

  // Fetch activity logs
  const fetchActivityLogs = async () => {
    try {
      const config = {
        withCredentials: true,
      };
      const response = await axios.get(`${API_BASE_URL}/admin/activity-logs`, config);
      return response.data;
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch activity logs");
    }
  };

  const { data: activityLogs = [], isLoading, error } = useQuery({
    queryKey: ['activityLogs', user?.email],
    queryFn: fetchActivityLogs,
    enabled: !!user?.email,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">Error: {error.message}</div>;
  }

  return (
    <motion.div
      className="max-w-6xl mx-auto mt-0 p-4 bg-white"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold text-center text-indigo-400 mb-6">
        Activity Logs
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-300 text-gray-700 font-bold">
            <tr>
              <th className="py-3 px-4 border border-gray-800">Timestamp</th>
              <th className="py-3 px-4 border border-gray-800">User Email</th>
              <th className="py-3 px-4 border border-gray-800">Action</th>
              <th className="py-3 px-4 border border-gray-800">Details</th>
            </tr>
          </thead>
          <tbody>
            {activityLogs.length > 0 ? (
              activityLogs.map((log, index) => (
                <tr key={log._id || index} className="hover:bg-gray-200 transition">
                  <td className="py-3 px-4 border text-gray-800">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="py-3 px-4 border text-gray-800">{log.userEmail}</td>
                  <td className="py-3 px-4 border text-gray-800">{log.action}</td>
                  <td className="py-3 px-4 border text-gray-800">{JSON.stringify(log.details)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No activity logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ActivityLog;
