import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../provider/AuthProvider';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaUserShield, FaCog, FaChartBar, FaUsers, FaTasks, FaTicketAlt } from 'react-icons/fa';
import { API_BASE_URL } from '../config/api.js';

const AdminTest = () => {
  const { user } = useContext(Context);
  const [adminStatus, setAdminStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/admin/dashboard-summary`, {
          withCredentials: true
        });
        setAdminStatus('admin');
        setError(null);
      } catch (err) {
        if (err.response?.status === 403) {
          setAdminStatus('not-admin');
          setError('You do not have admin privileges');
        } else if (err.response?.status === 401) {
          setAdminStatus('not-authenticated');
          setError('Please log in first');
        } else {
          setAdminStatus('error');
          setError('Connection error: ' + err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      checkAdminStatus();
    } else {
      setAdminStatus('not-authenticated');
      setError('Please log in first');
      setLoading(false);
    }
  }, [user]);

  const adminFunctions = [
    {
      name: 'Dashboard Analytics',
      description: 'View comprehensive analytics and performance metrics',
      icon: <FaChartBar className="text-2xl" />,
      path: '/dashboard/analytics',
      available: adminStatus === 'admin'
    },
    {
      name: 'Add Task',
      description: 'Assign tasks to executives',
      icon: <FaTasks className="text-2xl" />,
      path: '/dashboard/addtask',
      available: adminStatus === 'admin'
    },
    {
      name: 'Manage Tasks',
      description: 'View and manage all tasks',
      icon: <FaCog className="text-2xl" />,
      path: '/dashboard/managetask',
      available: adminStatus === 'admin'
    },
    {
      name: 'Manage Leads',
      description: 'Manage all leads in the system',
      icon: <FaUsers className="text-2xl" />,
      path: '/dashboard/manageLead',
      available: adminStatus === 'admin'
    },
    {
      name: 'Manage Follow-ups',
      description: 'Track and manage follow-ups',
      icon: <FaCheckCircle className="text-2xl" />,
      path: '/dashboard/manageFollowUp',
      available: adminStatus === 'admin'
    },
    {
      name: 'Manage Tickets',
      description: 'Handle support tickets',
      icon: <FaTicketAlt className="text-2xl" />,
      path: '/dashboard/manageTicket',
      available: adminStatus === 'admin'
    },
    {
      name: 'Enhanced Ticket Management',
      description: 'Advanced ticket management system',
      icon: <FaTicketAlt className="text-2xl" />,
      path: '/dashboard/enhanced-ticket-management',
      available: adminStatus === 'admin'
    },
    {
      name: 'Activity Log',
      description: 'View system activity logs',
      icon: <FaUserShield className="text-2xl" />,
      path: '/dashboard/activityLog',
      available: adminStatus === 'admin'
    },
    {
      name: 'Add User',
      description: 'Create new users in the system',
      icon: <FaUsers className="text-2xl" />,
      path: '/dashboard/add-user',
      available: adminStatus === 'admin'
    },
    {
      name: 'Manage All Leads',
      description: 'Comprehensive lead management',
      icon: <FaUsers className="text-2xl" />,
      path: '/dashboard/admin-manage-leads',
      available: adminStatus === 'admin'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking admin status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Admin Dashboard Test
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Current User: {user?.email || 'Not logged in'}
          </p>
        </motion.div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8"
        >
          <div className="flex items-center justify-center space-x-4">
            {adminStatus === 'admin' ? (
              <>
                <FaCheckCircle className="text-4xl text-green-500" />
                <div>
                  <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">
                    Admin Access Confirmed
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    You have full admin privileges
                  </p>
                </div>
              </>
            ) : adminStatus === 'not-admin' ? (
              <>
                <FaTimesCircle className="text-4xl text-red-500" />
                <div>
                  <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
                    Not an Admin
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    You need admin privileges to access these functions
                  </p>
                </div>
              </>
            ) : adminStatus === 'not-authenticated' ? (
              <>
                <FaTimesCircle className="text-4xl text-yellow-500" />
                <div>
                  <h2 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    Not Authenticated
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Please log in first
                  </p>
                </div>
              </>
            ) : (
              <>
                <FaTimesCircle className="text-4xl text-red-500" />
                <div>
                  <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
                    Error
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {error}
                  </p>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Admin Functions Grid */}
        {adminStatus === 'admin' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Available Admin Functions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminFunctions.map((func, index) => (
                <motion.div
                  key={func.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-2 transition-all duration-200 ${
                    func.available 
                      ? 'border-green-200 dark:border-green-700 hover:border-green-300 dark:hover:border-green-600' 
                      : 'border-gray-200 dark:border-gray-700 opacity-50'
                  }`}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`p-3 rounded-lg ${
                      func.available 
                        ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                    }`}>
                      {func.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {func.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {func.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm px-2 py-1 rounded ${
                      func.available 
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                    }`}>
                      {func.available ? 'Available' : 'Not Available'}
                    </span>
                    {func.available && (
                      <a
                        href={func.path}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                      >
                        Access →
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        {adminStatus !== 'admin' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
              How to Access Admin Functions
            </h3>
            <div className="space-y-3 text-blue-800 dark:text-blue-200">
              <p>1. <strong>Log in as an admin user</strong></p>
              <p>2. <strong>Available admin credentials:</strong></p>
              <ul className="ml-6 space-y-1">
                <li>• Email: admin@abc.com</li>
                <li>• Name: Admin Test</li>
              </ul>
              <p>3. <strong>If you don't have admin access:</strong></p>
              <ul className="ml-6 space-y-1">
                <li>• Contact your system administrator</li>
                <li>• Use the "Create First Admin" feature if no admin exists</li>
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminTest; 