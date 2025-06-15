import React, { useState, useEffect, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Context } from "../provider/AuthProvider";
import Loading from "../component/loading.jsx";
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
      const response = await axios.get('http://localhost:3000/admin/performance-metrics', config);
      return response.data;
    } catch (error) {
      console.error("Error fetching performance metrics:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch performance metrics");
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
      const response = await axios.get('http://localhost:3000/admin/lead-analytics', config);
      return response.data;
    } catch (error) {
      console.error("Error fetching lead analytics:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch lead analytics");
    }
  };

  const fetchDashboardSummary = async () => {
    try {
      const config = {
        withCredentials: true,
      };
      const response = await axios.get('http://localhost:3000/admin/dashboard-summary', config);
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard summary:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch dashboard summary");
    }
  };

  const fetchOverdueFollowups = async () => {
    const response = await axios.get('http://localhost:3000/admin/overdue-followups', {
      withCredentials: true,
    });
    return response.data;
  };

  const fetchOverdueLeads = async () => {
    const response = await axios.get('http://localhost:3000/admin/overdue-leads', {
      withCredentials: true,
    });
    return response.data;
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

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">Error: {error.message}</div>;
  }

  const exportToCSV = (data, filename) => {
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
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto mt-10 p-6 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Admin Analytics Dashboard</h2>
        <div className="flex space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <button
            onClick={() => exportToCSV(performanceMetrics, 'performance-metrics')}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <FaDownload />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Dashboard Summary Cards */}
      {dashboardSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Today's Leads</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{dashboardSummary.today.leads}</p>
              </div>
              <FaChartLine className="text-4xl text-blue-500 dark:text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Today's Follow-ups</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{dashboardSummary.today.followUps}</p>
              </div>
              <FaCalendarAlt className="text-4xl text-green-500 dark:text-green-400" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Open Tickets</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{dashboardSummary.today.openTickets}</p>
              </div>
              <FaExclamationTriangle className="text-4xl text-orange-500 dark:text-orange-400" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Overdue Leads</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">{dashboardSummary.today.overdueLeads}</p>
              </div>
              <FaClock className="text-4xl text-red-500 dark:text-red-400" />
            </div>
          </motion.div>
        </div>
      )}

      {/* Performance Metrics Table */}
      <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Executive Performance Metrics</h3>
          <select
            value={selectedExecutive}
            onChange={(e) => setSelectedExecutive(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">All Executives</option>
            {performanceMetrics.map((metric) => (
              <option key={metric.executive.email} value={metric.executive.email}>
                {metric.executive.name} ({metric.executive.email})
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold">
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
              {performanceMetrics.map((metric, index) => (
                <tr key={metric.executive.email} className="hover:bg-gray-50 dark:hover:bg-gray-600 transition">
                  <td className="py-3 px-4 border text-gray-800 dark:text-gray-200">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">{metric.executive.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{metric.executive.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 border text-gray-800 dark:text-gray-200">{metric.leads.total}</td>
                  <td className="py-3 px-4 border text-gray-800 dark:text-gray-200">{metric.leads.closed}</td>
                  <td className="py-3 px-4 border">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      metric.leads.conversionRate >= 50 ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' :
                      metric.leads.conversionRate >= 25 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100' :
                      'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100'
                    }`}>
                      {metric.leads.conversionRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 border text-gray-800 dark:text-gray-200">
                    {metric.leads.avgTimeToClose > 0 ? `${metric.leads.avgTimeToClose} days` : 'N/A'}
                  </td>
                  <td className="py-3 px-4 border text-gray-800 dark:text-gray-200">
                    {metric.followUps.completed}/{metric.followUps.total} ({metric.followUps.completionRate}%)
                  </td>
                  <td className="py-3 px-4 border text-gray-800 dark:text-gray-200">
                    {metric.tickets.resolved}/{metric.tickets.total} ({metric.tickets.resolutionRate}%)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Analytics */}
      {leadAnalytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Lead Status Distribution</h3>
            <div className="space-y-3">
              {Object.entries(leadAnalytics.statusDistribution).map(([status, count]) => (
                <div key={status} className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">{status}</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Distribution */}
          <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Product Interest Distribution</h3>
            <div className="space-y-3">
              {Object.entries(leadAnalytics.productDistribution).map(([product, count]) => (
                <div key={product} className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">{product}</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Activities */}
      {dashboardSummary && (
        <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Recent Activities (Last 7 Days)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Recent Leads</h4>
              <div className="space-y-2">
                {dashboardSummary.recentActivities.leads.map((lead, index) => (
                  <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                    {lead.name} - {lead.product}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Recent Follow-ups</h4>
              <div className="space-y-2">
                {dashboardSummary.recentActivities.followUps.map((followUp, index) => (
                  <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                    {followUp.customerName} - {followUp.followUpDate}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Recent Tickets</h4>
              <div className="space-y-2">
                {dashboardSummary.recentActivities.tickets.map((ticket, index) => (
                  <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                    {ticket.subject} - {ticket.status}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overdue/Missed Follow-ups Table */}
      {overdueFollowupsData.overdue.length > 0 && (
        <motion.div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-xl shadow mb-6 dark:bg-yellow-900 dark:border-yellow-700">
          <div className="flex items-center mb-2">
            <FaBell className="text-yellow-500 mr-2 text-xl dark:text-yellow-300" />
            <span className="font-semibold text-yellow-800 text-lg dark:text-yellow-200">
              Overdue/Missed Follow-ups: {overdueFollowupsData.overdue.length}
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
                {overdueFollowupsData.overdue.map((fu, idx) => (
                  <tr key={fu._id || idx} className="bg-yellow-100 dark:bg-yellow-800">
                    <td className="py-2 px-3 text-gray-800 dark:text-gray-200">{fu.myEmail}</td>
                    <td className="py-2 px-3 text-gray-800 dark:text-gray-200">{fu.customerName || fu.name || '-'}</td>
                    <td className="py-2 px-3 text-gray-800 dark:text-gray-200">{fu.followUpDate}</td>
                    <td className="py-2 px-3 text-gray-800 dark:text-gray-200">{fu.remarks || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Overdue/Stagnant Leads Table */}
      {(overdueLeadsData.overdue.length > 0 || overdueLeadsData.stagnant.length > 0) && (
        <motion.div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl shadow mb-6 dark:bg-red-900 dark:border-red-700">
          <div className="flex items-center mb-2">
            <FaExclamationTriangle className="text-red-500 mr-2 text-xl dark:text-red-300" />
            <span className="font-semibold text-red-800 text-lg dark:text-red-200">
              Overdue Leads: {overdueLeadsData.overdue.length} | Stagnant Leads: {overdueLeadsData.stagnant.length}
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
                {overdueLeadsData.overdue.map((lead, idx) => (
                  <tr key={lead._id || idx} className="bg-red-100 dark:bg-red-800">
                    <td className="py-2 px-3 text-gray-800 dark:text-gray-200">{lead.myEmail}</td>
                    <td className="py-2 px-3 text-gray-800 dark:text-gray-200">{lead.name}</td>
                    <td className="py-2 px-3 text-gray-800 dark:text-gray-200">{lead.status}</td>
                    <td className="py-2 px-3 text-gray-800 dark:text-gray-200">{lead.expectedDate}</td>
                    <td className="py-2 px-3 text-gray-800 dark:text-gray-200">{lead.updatedAt ? new Date(lead.updatedAt).toLocaleDateString() : '-'}</td>
                  </tr>
                ))}
                {overdueLeadsData.stagnant.map((lead, idx) => (
                  <tr key={lead._id || idx} className="bg-red-50 dark:bg-red-700">
                    <td className="py-2 px-3 text-gray-800 dark:text-gray-200">{lead.myEmail}</td>
                    <td className="py-2 px-3 text-gray-800 dark:text-gray-200">{lead.name}</td>
                    <td className="py-2 px-3 text-gray-800 dark:text-gray-200">{lead.status}</td>
                    <td className="py-2 px-3 text-gray-800 dark:text-gray-200">{lead.expectedDate}</td>
                    <td className="py-2 px-3 text-gray-800 dark:text-gray-200">{lead.updatedAt ? new Date(lead.updatedAt).toLocaleDateString() : '-'}</td>
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

export default AdminAnalytics; 