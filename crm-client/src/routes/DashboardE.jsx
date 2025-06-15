import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import useAdminCount from '../hook/useAdminCount';
import useUser from '../hook/useUser';
import useTask from '../hook/useTask';
import useemployeeCount from '../hook/useemployeeCount';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import useLead from '../hook/useLead';
import { Context } from '../provider/AuthProvider';
import { FaBell } from 'react-icons/fa';

const fetchTicket = async () => {
  const response = await axios.get(`http://localhost:3000/resolveTicket`);
  return response.data;
};

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardE = () => {

  let {user}=useContext(Context)
  let [employee] = useemployeeCount();
  let [admin] = useAdminCount();
  let [users] = useUser();
  let [task] = useTask();
  let [lead] = useLead();

  const { data: myticket = [] } = useQuery({
    queryKey: ["myticket"],
    queryFn: fetchTicket,
  });

  const fetchLead = async () => {
  const response = await axios.get(`http://localhost:3000/myLead/${user?.email}`);
  return response.data;
};
const fetchTask = async () => {
  const response = await axios.get(`http://localhost:3000/myTask/${user?.email}`);
  return response.data;
};
const fetchReview = async () => {
  const response = await axios.get(`http://localhost:3000/myreview/${user?.email}`);
  return response.data;
};
const fetchFollowup = async () => {
  const response = await axios.get(`http://localhost:3000/myfollowup/${user?.email}`);
  return response.data;
};


  const { data: myLead = [] } = useQuery({
    queryKey: ["myLead"],
    queryFn: fetchLead,
  });
  const { data: myReview= [] } = useQuery({
    queryKey: ["myReview"],
    queryFn: fetchReview,
  });
  const { data: myTask = [] } = useQuery({
    queryKey: ["myTask"],
    queryFn: fetchTask,
  });
  const { data: myFollowp = [] } = useQuery({
    queryKey: ["myFollowp"],
    queryFn: fetchFollowup,
  });
  

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const dashboardData = [
    {
      title: 'My Reviews',
      value: myReview.length,
      icon: '👥',
      color: '',
    },
    {
      title: 'My Follow Up',
      value: myFollowp.length,
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
    {
      title: 'Total Executive',
      value: employee.length,
      icon: '📋',
      color: '',
    },
    
  ];

  // Prepare data for the user role bar chart
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
        label: 'User Roles',
        data: [roleCounts.admin, roleCounts.employee],
        backgroundColor: ['rgba(34, 197, 94, 0.6)', 'rgba(168, 85, 247, 0.6)'],
        borderColor: ['rgba(34, 197, 94, 1)', 'rgba(168, 85, 247, 1)'],
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
        text: 'User Distribution by Role',
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
          text: 'Role',
        },
      },
    },
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
    labels: ['Complete', 'Pending'],
    datasets: [
      {
        label: 'Task Status',
        data: [taskStatusCounts.complete, taskStatusCounts.pending],
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
        text: 'Task Status Distribution',
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

  // Fetch follow-up reminders for the executive
  const fetchReminders = async () => {
    const response = await axios.get('http://localhost:3000/executive/followup-reminders', {
      withCredentials: true,
    });
    return response.data;
  };

  const { data: remindersData = { pending: [] }, isLoading: remindersLoading } = useQuery({
    queryKey: ['followupReminders', user?.email],
    queryFn: fetchReminders,
    enabled: !!user?.email,
  });

  return (
    <div>
      <section className="py-2 min-h-screen  rounded-2xl">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-5xl font-bold text-indigo-400 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Dashboard Overview
          </motion.h2>
          {/* Follow-up Reminders Alert */}
          {remindersData.pending.length > 0 && (
            <motion.div
              className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded shadow flex flex-col gap-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center mb-2">
                <FaBell className="text-yellow-500 mr-2 text-xl" />
                <span className="font-semibold text-yellow-800 text-lg">
                  You have {remindersData.pending.length} pending/missed follow-up(s)!
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
                    {remindersData.pending.map((fu, idx) => (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
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
              className="bg-white  border-black border-2 p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Bar data={userChartData} options={userChartOptions} />
            </motion.div>
            <motion.div
              className="bg-white  border-black border-2 p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Bar data={taskChartData} options={taskChartOptions} />
            </motion.div>
          </div>
         
        </div>
      </section>
    </div>
  );
};

export default DashboardE;