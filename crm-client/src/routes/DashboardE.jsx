import React, { useState, useEffect, useContext } from 'react';
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
import axios from 'axios';
import { Context } from '../provider/AuthProvider';
import { FaUsers, FaShieldAlt, FaBriefcase, FaTasks, FaChartLine, FaArrowUp, FaCalendarAlt, FaClock } from 'react-icons/fa';
import API_BASE_URL from '../config/api';

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

const DashboardE = () => {
  const { user } = useContext(Context);
  const [resolveTicket, setResolveTicket] = useState([]);
  const [myLead, setMyLead] = useState([]);
  const [myTask, setMyTask] = useState([]);
  const [myreview, setMyreview] = useState([]);
  const [myfollowup, setMyfollowup] = useState([]);
  const [followupReminders, setFollowupReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [allTasks, setAllTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [reviewResponse, followupResponse, taskResponse, leadResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/myreview/${user?.email}`, { withCredentials: true }),
          axios.get(`${API_BASE_URL}/myfollowup/${user?.email}`, { withCredentials: true }),
          axios.get(`${API_BASE_URL}/mytask/${user?.email}`, { withCredentials: true }),
          axios.get(`${API_BASE_URL}/mylead/${user?.email}`, { withCredentials: true })
        ]);

        setMyreview(reviewResponse.data || []);
        setMyfollowup(followupResponse.data || []);
        setMyTask(taskResponse.data || []);
        setMyLead(leadResponse.data || []);

        // Fetch metrics data
        const metricsResponse = await axios.get(`${API_BASE_URL}/executive/performance-metrics`, { withCredentials: true });
        if (metricsResponse.data) {
          setAllUsers(metricsResponse.data.users || []);
          setAllTasks(Array.isArray(metricsResponse.data.tasks) ? metricsResponse.data.tasks : []);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchData();
    }
  }, [user?.email]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const mainContent = document.querySelector('main.flex-1');
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  }, []);

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  console.log(myreview.length,myfollowup.length,myTask.length)

  const dashboardData = [
    {
      title: 'My Reviews',
      value: myreview.length,
      icon: '👥',
      color: '',
    },
    {
      title: 'My Follow Up',
      value: myfollowup.length,
      icon: '🛡️',
      color: '',
    },
    {
      title: 'My Task',
      value: myTask.length,
      icon: '💼',
      color: '',
    },
    {
      title: 'My Lead',
      value: myLead.length,
      icon: '📋',
      color: '',
    },
  ];

  // Prepare data for the user role bar chart (use only the executive's own data)
  const userChartData = {
    labels: ['My Leads', 'My Tasks'],
    datasets: [
      {
        label: 'My Data',
        data: [myLead.length, myTask.length],
        backgroundColor: ['rgba(168, 85, 247, 0.6)', 'rgba(34, 197, 94, 0.6)'],
        borderColor: ['rgba(168, 85, 247, 1)', 'rgba(34, 197, 94, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const userChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'My Leads and Tasks',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Type',
        },
      },
    },
  };

  // Prepare data for the task status bar chart (use myTask)
  const myTaskStatusCounts = (Array.isArray(myTask) ? myTask : []).reduce(
    (acc, task) => {
      if (task.status === 'complete' || task.status === 'Complete') acc.complete += 1;
      else if (task.status === 'pending' || task.status === 'Pending') acc.pending += 1;
      return acc;
    },
    { complete: 0, pending: 0 }
  );

  const taskChartData = {
    labels: ['Complete', 'Pending'],
    datasets: [
      {
        label: 'My Task Status',
        data: [myTaskStatusCounts.complete, myTaskStatusCounts.pending],
        backgroundColor: ['rgba(34, 197, 94, 0.6)', 'rgba(234, 179, 8, 0.6)'],
        borderColor: ['rgba(34, 197, 94, 1)', 'rgba(234, 179, 8, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const taskChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'My Task Status Distribution',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Status',
        },
      },
    },
  };

  return (
    <div>
      <section className="py-2 min-h-screen  rounded-2xl">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
              <p className="text-indigo-600">Loading dashboard data...</p>
            </div>
          ) : (
            <>
              {/* Follow-up Reminders Alert */}
              {followupReminders.length > 0 && (
                <motion.div
                  className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded shadow flex flex-col gap-2"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center mb-2">
                    <FaClock className="text-yellow-500 mr-2 text-xl" />
                    <span className="font-semibold text-yellow-800 text-lg">
                      You have {followupReminders.length} pending/missed follow-up(s)!
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                      <thead>
                        <tr className="text-yellow-900">
                          <th className="py-2 px-3">Customer</th>
                          <th className="py-2 px-3">Follow-up Date</th>
                          <th className="py-2 px-3">Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {followupReminders.map((fu, idx) => (
                          <tr key={fu._id || idx} className="bg-yellow-50">
                            <td className="py-2 px-3">{fu.customerName || fu.name || '-'}</td>
                            <td className="py-2 px-3">{fu.followUpDate}</td>
                            <td className="py-2 px-3">{fu.remarks || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 md:pl-40 p-5">
                {dashboardData.map((card, index) => (
                  <motion.div
                    key={index}
                    className={`relative ${index === 0 ? 'bg-green-500' : index === 1 ? 'bg-orange-500' : index === 2 ? 'bg-blue-600' : index === 3 ? 'bg-red-500' : 'bg-gray-500'} text-white p-4 rounded-lg shadow-lg overflow-hidden transform transition-all hover:shadow-xl`}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="relative z-10 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{card.title}</h3>
                        <p className="text-2xl font-bold">{card.value}</p>
                      </div>
                      
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <motion.div
                  className="bg-white p-6 rounded-lg shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Bar data={userChartData} options={userChartOptions} />
                </motion.div>
                <motion.div
                  className="bg-white p-6 rounded-lg shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Bar data={taskChartData} options={taskChartOptions} />
                </motion.div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <motion.div
                  className="bg-white p-6 rounded-lg shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Doughnut data={userChartData} options={userChartOptions} />
                </motion.div>
                <motion.div
                  className="bg-white p-6 rounded-lg shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Doughnut data={taskChartData} options={taskChartOptions} />
                </motion.div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <motion.div
                  className="bg-white p-6 rounded-lg shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Line data={userChartData} options={userChartOptions} />
                </motion.div>
                <motion.div
                  className="bg-white p-6 rounded-lg shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Line data={taskChartData} options={taskChartOptions} />
                </motion.div>
              </div>
            </>
          )}
         
        </div>
      </section>
    </div>
  );
};

export default DashboardE;