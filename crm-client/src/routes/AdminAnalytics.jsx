import React, { useState, useEffect, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Context } from "../provider/AuthProvider";
import Loading from "../component/loading.jsx";
import { API_BASE_URL } from "../config/api.js";
import { 
  FaChartLine, 
  FaUsers, 
  FaCalendarAlt, 
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaUserTie,
  FaChartBar,
  FaDownload,
  FaBell
} from 'react-icons/fa';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('AdminAnalytics Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-4">The Admin Analytics dashboard encountered an error.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const AdminAnalytics = () => {
  const { user } = useContext(Context);
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [selectedExecutive, setSelectedExecutive] = useState('');

  const fetchPerformanceMetrics = async () => {
    try {
      const config = {
        withCredentials: true,
        params: {
          executiveEmail: selectedExecutive || undefined,
        },
      };
      const response = await axios.get(`${API_BASE_URL}/admin/performance-metrics`, config);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching performance metrics:", error);
      return [];
    }
  };

  const fetchLeadAnalytics = async () => {
    try {
      const config = {
        withCredentials: true,
        params: {
          period: selectedPeriod,
        },
      };
      const response = await axios.get(`${API_BASE_URL}/admin/lead-analytics`, config);
      return response.data || { statusDistribution: {}, productDistribution: {} };
    } catch (error) {
      console.error("Error fetching lead analytics:", error);
      return { statusDistribution: {}, productDistribution: {} };
    }
  };

  const fetchDashboardSummary = async () => {
    try {
      const config = {
        withCredentials: true,
      };
      const response = await axios.get(`${API_BASE_URL}/admin/dashboard-summary`, config);
      return response.data || { 
        today: { leads: 0, followUps: 0, openTickets: 0, overdueLeads: 0 },
        recentActivities: { leads: [], followUps: [], tickets: [] }
      };
    } catch (error) {
      console.error("Error fetching dashboard summary:", error);
      return { 
        today: { leads: 0, followUps: 0, openTickets: 0, overdueLeads: 0 },
        recentActivities: { leads: [], followUps: [], tickets: [] }
      };
    }
  };

  const fetchOverdueFollowups = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/overdue-followups`, {
        withCredentials: true,
      });
      return response.data || { overdue: [] };
    } catch (error) {
      console.error("Error fetching overdue followups:", error);
      return { overdue: [] };
    }
  };

  const fetchOverdueLeads = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/overdue-leads`, {
        withCredentials: true,
      });
      return response.data || { overdue: [], stagnant: [] };
    } catch (error) {
      console.error("Error fetching overdue leads:", error);
      return { overdue: [], stagnant: [] };
    }
  };

  const { data: performanceMetrics = [], isLoading: metricsLoading, error: metricsError } = useQuery({
    queryKey: ['performanceMetrics', user?.email, selectedExecutive],
    queryFn: fetchPerformanceMetrics,
    enabled: !!user?.email,
  });

  const { data: leadAnalytics, isLoading: analyticsLoading, error: analyticsError } = useQuery({
    queryKey: ['leadAnalytics', user?.email, selectedPeriod],
    queryFn: fetchLeadAnalytics,
    enabled: !!user?.email,
  });

  const { data: dashboardSummary, isLoading: summaryLoading, error: summaryError } = useQuery({
    queryKey: ['dashboardSummary', user?.email],
    queryFn: fetchDashboardSummary,
    enabled: !!user?.email,
  });

  const { data: overdueFollowupsData = { overdue: [] }, isLoading: overdueFollowupsLoading } = useQuery({
    queryKey: ['overdueFollowups', user?.email],
    queryFn: fetchOverdueFollowups,
    enabled: !!user?.email,
  });

  const { data: overdueLeadsData = { overdue: [], stagnant: [] }, isLoading: overdueLeadsLoading } = useQuery({
    queryKey: ['overdueLeads', user?.email],
    queryFn: fetchOverdueLeads,
    enabled: !!user?.email,
  });

  const isLoading = metricsLoading || analyticsLoading || summaryLoading || overdueFollowupsLoading || overdueLeadsLoading;
  const error = metricsError || analyticsError || summaryError;

  // Ensure all data variables are safe with proper defaults
  const safePerformanceMetrics = Array.isArray(performanceMetrics) ? performanceMetrics : [];
  const safeLeadAnalytics = leadAnalytics || { statusDistribution: {}, productDistribution: {} };
  const safeDashboardSummary = dashboardSummary || { 
    today: { leads: 0, followUps: 0, openTickets: 0, overdueLeads: 0 },
    recentActivities: { leads: [], followUps: [], tickets: [] }
  };
  const safeOverdueFollowups = overdueFollowupsData || { overdue: [] };
  const safeOverdueLeads = overdueLeadsData || { overdue: [], stagnant: [] };

  useEffect(() => {
    window.scrollTo(0, 0);
    const mainContent = document.querySelector('main.flex-1');
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">Error: {error.message}</div>;
  }

  const exportToCSV = (data, filename) => {
    if (!Array.isArray(data) || data.length === 0) {
      console.warn('No data to export');
      return;
    }
    
    try {
      const csvContent = "data:text/csv;charset=utf-8," + 
        Object.keys(data[0]).join(",") + "\n" +
        data.map(row => Object.values(row).join(",")).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${filename}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  return (
    <ErrorBoundary>
      <motion.div
        className="max-w-7xl mx-auto mt-0 p-6 space-y-6 bg-white"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-blue-700">Admin Analytics Dashboard</h2>
          <div className="flex space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
            <button
              onClick={() => exportToCSV(safePerformanceMetrics, 'performance-metrics')}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <FaDownload />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Dashboard Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg text-gray-700"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-bold text-sm">Today's Leads</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{safeDashboardSummary?.today?.leads || 0}</p>
              </div>
              <FaChartLine className="text-4xl text-blue-500 dark:text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-bold text-sm">Today's Follow-ups</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{safeDashboardSummary?.today?.followUps || 0}</p>
              </div>
              <FaCalendarAlt className="text-4xl text-green-500 dark:text-green-400" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-bold text-sm">Open Tickets</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{safeDashboardSummary?.today?.openTickets || 0}</p>
              </div>
              <FaExclamationTriangle className="text-4xl text-orange-500 dark:text-orange-400" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-bold text-sm">Overdue Leads</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">{safeDashboardSummary?.today?.overdueLeads || 0}</p>
              </div>
              <FaClock className="text-4xl text-red-500 dark:text-red-400" />
            </div>
          </motion.div>
        </div>

        {/* Performance Metrics Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl text-green-800 font-bold">Executive Performance Metrics</h3>
            <select
              value={selectedExecutive}
              onChange={(e) => setSelectedExecutive(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
            >
              <option value="">All Executives</option>
              {Array.isArray(safePerformanceMetrics) && safePerformanceMetrics.map((metric) => (
                <option key={metric?.executive?.email || 'unknown'} value={metric?.executive?.email || ''}>
                  {metric?.executive?.name || 'Unknown'} ({metric?.executive?.email || 'unknown'})
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50  text-gray-700 font-bold">
                <tr>
                  <th className="py-3 px-4 border">Executive</th>
                  <th className="py-3 px-4 border">Total Leads</th>
                  <th className="py-3 px-4 border">Closed Leads</th>
                  <th className="py-3 px-4 border">Conversion Rate</th>
                  <th className="py-3 px-4 border">Avg Time to Close</th>
                  <th className="py-3 px-4 border">Follow-ups</th>
                  <th className="py-3 px-4 border">Tickets</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(safePerformanceMetrics) && safePerformanceMetrics.map((metric, index) => (
                  <tr key={metric?.executive?.email || index} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4 border text-gray-800">
                      <div>
                        <p className="font-medium text-gray-800 ">{metric?.executive?.name || 'Unknown'}</p>
                        <p className="text-sm text-gray-600 ">{metric?.executive?.email || 'unknown@email.com'}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 border text-gray-800 ">{metric?.leads?.total || 0}</td>
                    <td className="py-3 px-4 border text-gray-800 ">{metric?.leads?.closed || 0}</td>
                    <td className="py-3 px-4 border">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        (metric?.leads?.conversionRate || 0) >= 50 ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' :
                        (metric?.leads?.conversionRate || 0) >= 25 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100' :
                        'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100'
                      }`}>
                        {metric?.leads?.conversionRate || 0}%
                      </span>
                    </td>
                    <td className="py-3 px-4 border text-gray-800 ">
                      {(metric?.leads?.avgTimeToClose || 0) > 0 ? `${metric.leads.avgTimeToClose} days` : 'N/A'}
                    </td>
                    <td className="py-3 px-4 border text-gray-800 ">
                      {metric?.followUps?.completed || 0}/{metric?.followUps?.total || 0} ({metric?.followUps?.completionRate || 0}%)
                    </td>
                    <td className="py-3 px-4 border text-gray-800">
                      {metric?.tickets?.resolved || 0}/{metric?.tickets?.total || 0} ({metric?.tickets?.resolutionRate || 0}%)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lead Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800">Lead Status Distribution</h3>
            <div className="space-y-3">
              {Object.entries(safeLeadAnalytics?.statusDistribution || {}).map(([status, count]) => (
                <div key={status} className="flex justify-between items-center">
                  <span className="text-gray-700">{status}</span>
                  <span className="font-bold text-gray-800">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Distribution */}
          <div className="bg-white rounded-xl shadow-lg border p-6">
            <h3 className="text-xl font-bold text-gray-800 ">Product Interest Distribution</h3>
            <div className="space-y-3">
              {Object.entries(safeLeadAnalytics?.productDistribution || {}).map(([product, count]) => (
                <div key={product} className="flex justify-between items-center">
                  <span className="text-gray-700">{product}</span>
                  <span className="font-bold text-gray-800">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activities (Last 7 Days)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Recent Leads</h4>
              <div className="space-y-2">
                {Array.isArray(safeDashboardSummary?.recentActivities?.leads) && safeDashboardSummary.recentActivities.leads.map((lead, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    {lead?.name || 'Unknown'} - {lead?.product || 'Unknown'}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Recent Follow-ups</h4>
              <div className="space-y-2">
                {Array.isArray(safeDashboardSummary?.recentActivities?.followUps) && safeDashboardSummary.recentActivities.followUps.map((followUp, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    {followUp?.customerName || 'Unknown'} - {followUp?.followUpDate || 'Unknown'}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Recent Tickets</h4>
              <div className="space-y-2">
                {Array.isArray(safeDashboardSummary?.recentActivities?.tickets) && safeDashboardSummary.recentActivities.tickets.map((ticket, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    {ticket?.subject || 'Unknown'} - {ticket?.status || 'Unknown'}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Overdue/Missed Follow-ups Table */}
        {safeOverdueFollowups?.overdue?.length > 0 && (
          <motion.div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-xl shadow mb-6 dark:bg-yellow-900 dark:border-yellow-700">
            <div className="flex items-center mb-2">
              <FaBell className="text-yellow-500 mr-2 text-xl dark:text-yellow-300" />
              <span className="font-semibold text-yellow-800 text-lg dark:text-yellow-200">
                Overdue/Missed Follow-ups: {safeOverdueFollowups?.overdue?.length || 0}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="text-yellow-900 dark:text-yellow-100">
                    <th className="py-2 px-3">Executive</th>
                    <th className="py-2 px-3">Customer</th>
                    <th className="py-2 px-3">Follow-up Date</th>
                    <th className="py-2 px-3">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(safeOverdueFollowups?.overdue) && safeOverdueFollowups.overdue.map((fu, idx) => (
                    <tr key={fu?._id || idx} className="bg-yellow-100 dark:bg-yellow-800">
                      <td className="py-2 px-3 text-gray-800 dark:text-gray-200">{fu?.myEmail || 'Unknown'}</td>
                      <td className="py-2 px-3 text-gray-800 dark:text-gray-200">{fu?.customerName || fu?.name || '-'}</td>
                      <td className="py-2 px-3 text-gray-800 dark:text-gray-200">{fu?.followUpDate || '-'}</td>
                      <td className="py-2 px-3 text-gray-800 dark:text-gray-200">{fu?.remarks || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Overdue/Stagnant Leads Table */}
        {(safeOverdueLeads?.overdue?.length > 0 || safeOverdueLeads?.stagnant?.length > 0) && (
          <motion.div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl shadow mb-6 dark:bg-red-900 dark:border-red-700">
            <div className="flex items-center mb-2">
              <FaExclamationTriangle className="text-red-500 mr-2 text-xl dark:text-red-300" />
              <span className="font-semibold text-red-800 text-lg dark:text-red-200">
                Overdue Leads: {safeOverdueLeads?.overdue?.length || 0} | Stagnant Leads: {safeOverdueLeads?.stagnant?.length || 0}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="text-red-900 dark:text-red-100">
                    <th className="py-2 px-3">Executive</th>
                    <th className="py-2 px-3">Customer</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Expected Closure</th>
                    <th className="py-2 px-3">Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(safeOverdueLeads?.overdue) && safeOverdueLeads.overdue.map((lead, idx) => (
                    <tr key={lead?._id || idx} className="bg-red-100 dark:bg-red-800">
                      <td className="py-2 px-3 text-gray-800 dark:text-gray-200">{lead?.myEmail || 'Unknown'}</td>
                      <td className="py-2 px-3 text-gray-800 dark:text-gray-200">{lead?.name || 'Unknown'}</td>
                      <td className="py-2 px-3 text-gray-800 dark:text-gray-200">{lead?.status || 'Unknown'}</td>
                      <td className="py-2 px-3 text-gray-800 dark:text-gray-200">{lead?.expectedDate || '-'}</td>
                      <td className="py-2 px-3 text-gray-800 dark:text-gray-200">{lead?.updatedAt ? new Date(lead.updatedAt).toLocaleDateString() : '-'}</td>
                    </tr>
                  ))}
                  {Array.isArray(safeOverdueLeads?.stagnant) && safeOverdueLeads.stagnant.map((lead, idx) => (
                    <tr key={lead?._id || idx} className="bg-red-50 dark:bg-red-700">
                      <td className="py-2 px-3 text-gray-800 dark:text-gray-200">{lead?.myEmail || 'Unknown'}</td>
                      <td className="py-2 px-3 text-gray-800 dark:text-gray-200">{lead?.name || 'Unknown'}</td>
                      <td className="py-2 px-3 text-gray-800 dark:text-gray-200">{lead?.status || 'Unknown'}</td>
                      <td className="py-2 px-3 text-gray-800 dark:text-gray-200">{lead?.expectedDate || '-'}</td>
                      <td className="py-2 px-3 text-gray-800 dark:text-gray-200">{lead?.updatedAt ? new Date(lead.updatedAt).toLocaleDateString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </motion.div>
    </ErrorBoundary>
  );
};

export default AdminAnalytics; 