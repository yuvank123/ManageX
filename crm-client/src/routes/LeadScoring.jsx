import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Context } from '../provider/AuthProvider';
import { FaStar, FaFire, FaClock, FaUserTie, FaDollarSign, FaChartLine } from 'react-icons/fa';
import axios from 'axios';

const LeadScoring = () => {
  const { user } = useContext(Context);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, hot, warm, cold

  // Mock lead scoring algorithm
  const calculateLeadScore = (lead) => {
    let score = 0;
    
    // Company size factor (0-25 points)
    if (lead.companySize === 'Enterprise') score += 25;
    else if (lead.companySize === 'Large') score += 20;
    else if (lead.companySize === 'Medium') score += 15;
    else if (lead.companySize === 'Small') score += 10;
    
    // Budget factor (0-25 points)
    if (lead.budget === 'High') score += 25;
    else if (lead.budget === 'Medium') score += 15;
    else if (lead.budget === 'Low') score += 5;
    
    // Engagement factor (0-25 points)
    if (lead.engagementLevel === 'High') score += 25;
    else if (lead.engagementLevel === 'Medium') score += 15;
    else if (lead.engagementLevel === 'Low') score += 5;
    
    // Timeline factor (0-25 points)
    if (lead.timeline === 'Immediate') score += 25;
    else if (lead.timeline === 'Within 3 months') score += 20;
    else if (lead.timeline === 'Within 6 months') score += 10;
    else if (lead.timeline === 'Long term') score += 5;
    
    return score;
  };

  const getLeadPriority = (score) => {
    if (score >= 80) return { label: 'Hot Lead', color: 'text-red-600', bgColor: 'bg-red-100', icon: <FaFire /> };
    if (score >= 60) return { label: 'Warm Lead', color: 'text-orange-600', bgColor: 'bg-orange-100', icon: <FaStar /> };
    if (score >= 40) return { label: 'Cool Lead', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: <FaClock /> };
    return { label: 'Cold Lead', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: <FaUserTie /> };
  };

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockLeads = [
      {
        id: 1,
        name: 'John Smith',
        company: 'TechCorp Solutions',
        email: 'john@techcorp.com',
        phone: '+1-555-0123',
        companySize: 'Large',
        budget: 'High',
        engagementLevel: 'High',
        timeline: 'Immediate',
        lastContact: '2024-01-15',
        notes: 'Very interested in our premium package',
        assignedTo: 'executive1@company.com'
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        company: 'StartupXYZ',
        email: 'sarah@startupxyz.com',
        phone: '+1-555-0124',
        companySize: 'Small',
        budget: 'Medium',
        engagementLevel: 'Medium',
        timeline: 'Within 3 months',
        lastContact: '2024-01-10',
        notes: 'Looking for cost-effective solutions',
        assignedTo: 'executive2@company.com'
      },
      {
        id: 3,
        name: 'Mike Wilson',
        company: 'Enterprise Inc',
        email: 'mike@enterprise.com',
        phone: '+1-555-0125',
        companySize: 'Enterprise',
        budget: 'High',
        engagementLevel: 'High',
        timeline: 'Immediate',
        lastContact: '2024-01-14',
        notes: 'Decision maker, ready to proceed',
        assignedTo: 'executive1@company.com'
      },
      {
        id: 4,
        name: 'Lisa Brown',
        company: 'SmallBiz Ltd',
        email: 'lisa@smallbiz.com',
        phone: '+1-555-0126',
        companySize: 'Small',
        budget: 'Low',
        engagementLevel: 'Low',
        timeline: 'Long term',
        lastContact: '2024-01-05',
        notes: 'Not ready to commit yet',
        assignedTo: 'executive3@company.com'
      }
    ];

    // Calculate scores for each lead
    const leadsWithScores = mockLeads.map(lead => ({
      ...lead,
      score: calculateLeadScore(lead),
      priority: getLeadPriority(calculateLeadScore(lead))
    }));

    // Sort by score (highest first)
    leadsWithScores.sort((a, b) => b.score - a.score);
    
    setLeads(leadsWithScores);
    setLoading(false);
  }, []);

  const filteredLeads = leads.filter(lead => {
    if (filter === 'all') return true;
    if (filter === 'hot') return lead.score >= 80;
    if (filter === 'warm') return lead.score >= 60 && lead.score < 80;
    if (filter === 'cold') return lead.score < 40;
    return true;
  });

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-blue-600';
    return 'text-gray-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-red-100';
    if (score >= 60) return 'bg-orange-100';
    if (score >= 40) return 'bg-blue-100';
    return 'bg-gray-100';
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">AI-Powered Lead Scoring</h2>
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Leads</option>
            <option value="hot">Hot Leads (80+)</option>
            <option value="warm">Warm Leads (60-79)</option>
            <option value="cold">Cold Leads (<40)</option>
          </select>
        </div>
      </div>

      {/* Scoring Legend */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="flex items-center space-x-2 p-3 bg-red-100 rounded-lg">
          <FaFire className="text-red-600" />
          <span className="text-red-800 font-medium">Hot Lead (80-100)</span>
        </div>
        <div className="flex items-center space-x-2 p-3 bg-orange-100 rounded-lg">
          <FaStar className="text-orange-600" />
          <span className="text-orange-800 font-medium">Warm Lead (60-79)</span>
        </div>
        <div className="flex items-center space-x-2 p-3 bg-blue-100 rounded-lg">
          <FaClock className="text-blue-600" />
          <span className="text-blue-800 font-medium">Cool Lead (40-59)</span>
        </div>
        <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-lg">
          <FaUserTie className="text-gray-600" />
          <span className="text-gray-800 font-medium">Cold Lead (0-39)</span>
        </div>
      </div>

      {/* Leads Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lead
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredLeads.map((lead, index) => (
              <motion.tr
                key={lead.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                    <div className="text-sm text-gray-500">{lead.email}</div>
                    <div className="text-sm text-gray-500">{lead.phone}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{lead.company}</div>
                  <div className="text-sm text-gray-500">{lead.companySize}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(lead.score)} ${getScoreColor(lead.score)}`}>
                    {lead.score}/100
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${lead.priority.bgColor} ${lead.priority.color}`}>
                    {lead.priority.icon}
                    <span>{lead.priority.label}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(lead.lastContact).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {lead.assignedTo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">View</button>
                    <button className="text-green-600 hover:text-green-900">Contact</button>
                    <button className="text-purple-600 hover:text-purple-900">Follow-up</button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center">
            <FaFire className="text-red-600 text-2xl mr-3" />
            <div>
              <div className="text-2xl font-bold text-red-600">
                {leads.filter(l => l.score >= 80).length}
              </div>
              <div className="text-sm text-red-600">Hot Leads</div>
            </div>
          </div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center">
            <FaStar className="text-orange-600 text-2xl mr-3" />
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {leads.filter(l => l.score >= 60 && l.score < 80).length}
              </div>
              <div className="text-sm text-orange-600">Warm Leads</div>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <FaClock className="text-blue-600 text-2xl mr-3" />
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {leads.filter(l => l.score >= 40 && l.score < 60).length}
              </div>
              <div className="text-sm text-blue-600">Cool Leads</div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center">
            <FaUserTie className="text-gray-600 text-2xl mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-600">
                {leads.filter(l => l.score < 40).length}
              </div>
              <div className="text-sm text-gray-600">Cold Leads</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LeadScoring; 