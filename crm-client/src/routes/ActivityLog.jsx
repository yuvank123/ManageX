import React, { useContext } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Loading from '../component/loading.jsx';
import { Context } from '../provider/AuthProvider';

const ActivityLog = () => {
  const { user } = useContext(Context);

  // Fetch activity logs
  const fetchActivityLogs = async () => {
    try {
      const config = {
        withCredentials: true,
      };
      const response = await axios.get('http://localhost:3000/admin/activity-logs', config);
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
      className="max-w-6xl mx-auto mt-10 p-4 bg-white rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold text-center text-indigo-400 dark:text-indigo-300 mb-6">
        Activity Logs
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border border-gray-200 dark:border-gray-600">
          <thead className="bg-gray-100 text-gray-700 font-semibold dark:bg-gray-700 dark:text-gray-200">
            <tr>
              <th className="py-3 px-4 border dark:border-gray-600">Timestamp</th>
              <th className="py-3 px-4 border dark:border-gray-600">User Email</th>
              <th className="py-3 px-4 border dark:border-gray-600">Action</th>
              <th className="py-3 px-4 border dark:border-gray-600">Details</th>
            </tr>
          </thead>
          <tbody>
            {activityLogs.length > 0 ? (
              activityLogs.map((log, index) => (
                <tr key={log._id || index} className="hover:bg-gray-50 transition dark:hover:bg-gray-700">
                  <td className="py-3 px-4 border text-gray-800 dark:text-gray-200">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="py-3 px-4 border text-gray-800 dark:text-gray-200">{log.userEmail}</td>
                  <td className="py-3 px-4 border text-gray-800 dark:text-gray-200">{log.action}</td>
                  <td className="py-3 px-4 border text-gray-800 dark:text-gray-200">{JSON.stringify(log.details)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500 dark:text-gray-400">
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
