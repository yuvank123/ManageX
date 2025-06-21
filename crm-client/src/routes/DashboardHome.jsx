import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import useAdminCount from '../hook/useAdminCount.jsx';
import useUser from '../hook/useUser.jsx';
import useTask from '../hook/useTask.jsx';
import useEmployeeCount from '../hook/useEmployeeCount.jsx';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import useLead from '../hook/useLead.jsx';
import { FaUsers, FaShieldAlt, FaBriefcase, FaTasks, FaChartLine, FaArrowUp, FaCalendarAlt, FaClock } from 'react-icons/fa';
import API_BASE_URL from '../config/api';

const fetchUsers = async () => {
  const response = await axios.get(`${API_BASE_URL}/paymentDetails`);
  return response.data;
};

// Register Chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const DashboardHome = () => {
  let [employee] = useEmployeeCount();
  let [admin] = useAdminCount();
  let [users] = useUser();
  let [task] = useTask();
  let [lead] = useLead();

  const { data: paymentSalary = [] } = useQuery({
    queryKey: ["paymentSalary"],
    queryFn: fetchUsers,
  });

  let salaryArray = paymentSalary.map(salary => salary.price);
  let totalSalary = 0;
  for (let salary of salaryArray) {
    totalSalary += parseInt(salary, 10);
  }

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const dashboardData = [
    {
      title: 'Total Users',
      value: users.length,
      icon: FaUsers,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Total Admins',
      value: admin.length,
      icon: FaShieldAlt,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Total Employees',
      value: employee.length,
      icon: FaBriefcase,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Total Tasks',
      value: task.length,
      icon: FaTasks,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Total Leads',
      value: lead.length,
      icon: FaChartLine,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700',
      change: '+20%',
      changeType: 'positive'
    },
  ];

  // Prepare data for the user role doughnut chart
  const roleCounts = users.reduce(
    (acc, user) => {
      if (user.role === 'admin') acc.admin += 1;
      else if (user.role === 'employee') acc.employee += 1;
      return acc;
    },
    { admin: 0, employee: 0 }
  );

  const userChartData = {
    labels: ['Admins', 'Employees'],
    datasets: [
      {
        data: [roleCounts.admin, roleCounts.employee],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(168, 85, 247, 1)',
        ],
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const userChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: '600'
          }
        }
      },
      title: {
        display: true,
        text: 'User Distribution',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: 20
      },
    },
    cutout: '60%',
  };

  // Prepare data for the task status bar chart
  const taskStatusCounts = task.reduce(
    (acc, task) => {
      if (task.status === 'complete') acc.complete += 1;
      else if (task.status === 'pending') acc.pending += 1;
      return acc;
    },
    { complete: 0, pending: 0 }
  );

  const taskChartData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        label: 'Tasks',
        data: [taskStatusCounts.complete, taskStatusCounts.pending],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(234, 179, 8, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(234, 179, 8, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const taskChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          font: {
            size: 12,
            weight: '600'
          }
        }
      },
      title: {
        display: true,
        text: 'Task Status Overview',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: 20
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
    },
  };

  // Line chart data for trends
  const trendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Leads',
        data: [65, 78, 90, 85, 95, 110],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Tasks',
        data: [45, 52, 68, 75, 82, 88],
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const trendChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          font: {
            size: 12,
            weight: '600'
          }
        }
      },
      title: {
        display: true,
        text: 'Monthly Trends',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: 20
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
    },
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const mainContent = document.querySelector('main.flex-1');
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  }, []);

  return (
    <div className="min-h-screen">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-2 p-6 pt-10">
        {dashboardData.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${card.color} shadow-lg`}>
                    <IconComponent className="text-white text-xl" />
                  </div>
                  <div className={`text-sm font-semibold ${card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    {card.change}
                  </div>
                </div>
                <div>
                  <h3 className="text-slate-600 text-sm font-medium mb-1">{card.title}</h3>
                  <p className="text-3xl font-bold text-slate-800 mb-2">{card.value}</p>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${card.bgColor} ${card.textColor}`}>
                    <FaArrowUp className="mr-1" />
                    Active
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-8 p-6">
        {/* User Distribution Chart */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6 flex justify-center items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="h-80">
            <Doughnut data={userChartData} options={userChartOptions} />
          </div>
        </motion.div>

        {/* Task Status Chart */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="h-80">
            <Bar data={taskChartData} options={taskChartOptions} />
          </div>
        </motion.div>
      </div>

      {/* Trends Chart */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg border border-slate-200/50 m-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="h-80 ml-[15%]">
          <Line data={trendData} options={trendChartOptions} />
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <FaCalendarAlt className="text-2xl" />
            <span className="text-blue-100 text-sm">Today</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Upcoming Tasks</h3>
          <p className="text-blue-100 mb-4">You have 5 tasks due today</p>
          {/* <button className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg text-sm font-medium">
            View All
          </button> */}
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <FaChartLine className="text-2xl" />
            <span className="text-green-100 text-sm">This Week</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Performance</h3>
          <p className="text-green-100 mb-4">85% of goals achieved</p>
          {/* <button className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg text-sm font-medium">
            View Report
          </button> */}
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <FaClock className="text-2xl" />
            <span className="text-purple-100 text-sm">Recent</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Recent Activity</h3>
          <p className="text-purple-100 mb-4">12 new leads added</p>
          {/* <button className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg text-sm font-medium">
            View Details
          </button> */}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardHome;