import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaFileAlt, FaComments, FaCalendarAlt, FaDownload, FaUpload, FaBell, FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';

const CustomerPortal = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock customer data - in real app, fetch from API based on customer ID
    const mockCustomerData = {
      id: 'CUST001',
      name: 'John Smith',
      email: 'john.smith@company.com',
      company: 'TechCorp Solutions',
      phone: '+1-555-0123',
      status: 'Active',
      joinDate: '2024-01-15',
      lastContact: '2024-01-20',
      assignedExecutive: 'Sarah Johnson',
      executiveEmail: 'sarah.johnson@company.com',
      executivePhone: '+1-555-0124',
      leads: [
        {
          id: 1,
          title: 'Premium Insurance Package',
          status: 'In Progress',
          value: '$50,000',
          lastUpdate: '2024-01-20',
          nextFollowUp: '2024-01-25'
        },
        {
          id: 2,
          title: 'Employee Benefits Plan',
          status: 'Under Review',
          value: '$25,000',
          lastUpdate: '2024-01-18',
          nextFollowUp: '2024-01-30'
        }
      ],
      tickets: [
        {
          id: 1,
          subject: 'Policy Update Request',
          status: 'Open',
          priority: 'Medium',
          created: '2024-01-19',
          lastUpdate: '2024-01-20'
        },
        {
          id: 2,
          subject: 'Claim Status Inquiry',
          status: 'Resolved',
          priority: 'High',
          created: '2024-01-15',
          lastUpdate: '2024-01-17'
        }
      ],
      documents: [
        {
          id: 1,
          name: 'Policy Document.pdf',
          type: 'Policy',
          uploadDate: '2024-01-15',
          size: '2.5 MB'
        },
        {
          id: 2,
          name: 'Claim Form.pdf',
          type: 'Claim',
          uploadDate: '2024-01-10',
          size: '1.8 MB'
        }
      ],
      communications: [
        {
          id: 1,
          type: 'Email',
          subject: 'Policy Renewal Reminder',
          date: '2024-01-20',
          status: 'Sent'
        },
        {
          id: 2,
          type: 'Call',
          subject: 'Follow-up on Premium Package',
          date: '2024-01-18',
          status: 'Completed'
        }
      ]
    };

    setCustomerData(mockCustomerData);
    setLoading(false);
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'completed':
      case 'resolved':
        return 'text-green-600 bg-green-100';
      case 'in progress':
      case 'under review':
        return 'text-blue-600 bg-blue-100';
      case 'open':
        return 'text-orange-600 bg-orange-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-7xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-200"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Customer Portal</h2>
          <p className="text-gray-600 mt-2">Welcome back, {customerData.name}!</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Customer ID</div>
          <div className="font-mono text-lg font-bold text-blue-600">{customerData.id}</div>
        </div>
      </div>

      {/* Customer Info Card */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Contact Information</h3>
            <div className="space-y-1 text-sm">
              <div><strong>Email:</strong> {customerData.email}</div>
              <div><strong>Phone:</strong> {customerData.phone}</div>
              <div><strong>Company:</strong> {customerData.company}</div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Account Status</h3>
            <div className="space-y-1 text-sm">
              <div><strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customerData.status)}`}>
                  {customerData.status}
                </span>
              </div>
              <div><strong>Member Since:</strong> {new Date(customerData.joinDate).toLocaleDateString()}</div>
              <div><strong>Last Contact:</strong> {new Date(customerData.lastContact).toLocaleDateString()}</div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Assigned Executive</h3>
            <div className="space-y-1 text-sm">
              <div><strong>Name:</strong> {customerData.assignedExecutive}</div>
              <div><strong>Email:</strong> {customerData.executiveEmail}</div>
              <div><strong>Phone:</strong> {customerData.executivePhone}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: <FaUser /> },
          { id: 'leads', label: 'My Leads', icon: <FaFileAlt /> },
          { id: 'tickets', label: 'Support Tickets', icon: <FaComments /> },
          { id: 'documents', label: 'Documents', icon: <FaDownload /> },
          { id: 'communications', label: 'Communications', icon: <FaCalendarAlt /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Active Leads</p>
                  <p className="text-2xl font-bold text-blue-600">{customerData.leads.length}</p>
                </div>
                <FaFileAlt className="text-3xl text-blue-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Open Tickets</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {customerData.tickets.filter(t => t.status === 'Open').length}
                  </p>
                </div>
                <FaComments className="text-3xl text-orange-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Documents</p>
                  <p className="text-2xl font-bold text-green-600">{customerData.documents.length}</p>
                </div>
                <FaDownload className="text-3xl text-green-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Communications</p>
                  <p className="text-2xl font-bold text-purple-600">{customerData.communications.length}</p>
                </div>
                <FaCalendarAlt className="text-3xl text-purple-500" />
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'leads' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">My Insurance Leads</h3>
            {customerData.leads.map((lead) => (
              <div key={lead.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">{lead.title}</h4>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span><strong>Value:</strong> {lead.value}</span>
                      <span><strong>Last Update:</strong> {new Date(lead.lastUpdate).toLocaleDateString()}</span>
                      <span><strong>Next Follow-up:</strong> {new Date(lead.nextFollowUp).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'tickets' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Support Tickets</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Create New Ticket
              </button>
            </div>
            {customerData.tickets.map((ticket) => (
              <div key={ticket.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">{ticket.subject}</h4>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span><strong>Created:</strong> {new Date(ticket.created).toLocaleDateString()}</span>
                      <span><strong>Last Update:</strong> {new Date(ticket.lastUpdate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'documents' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Documents</h3>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                <FaUpload />
                <span>Upload Document</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customerData.documents.map((doc) => (
                <div key={doc.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800">{doc.name}</h4>
                      <p className="text-sm text-gray-600">{doc.type}</p>
                      <p className="text-xs text-gray-500">{doc.size} • {new Date(doc.uploadDate).toLocaleDateString()}</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800">
                      <FaDownload />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'communications' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Communication History</h3>
            {customerData.communications.map((comm) => (
              <div key={comm.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        comm.type === 'Email' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {comm.type}
                      </span>
                      <h4 className="text-lg font-semibold text-gray-800">{comm.subject}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{new Date(comm.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(comm.status)}`}>
                    {comm.status}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CustomerPortal; 