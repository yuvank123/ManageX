import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import Loading from '../component/loading.jsx';
import { API_BASE_URL } from '../config/api.js';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const ManageTask = () => {

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/tasks`);
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch tasks");
    }
  };

  const { data: task = [], isLoading:taskLoading,refetch } = useQuery({
    queryKey: ["task"], // The unique key for this query
    queryFn: fetchTasks, // Function to fetch the data
  });

  const queryClient = useQueryClient();

  const deleteTaskMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${API_BASE_URL}/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
    },
  });

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This task will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteTaskMutation.mutateAsync(id);
        refetch()
      
        Swal.fire("Deleted!", "Task has been deleted.", "success");
      
      } catch (error) {
        Swal.fire("Error!", "Failed to delete task.", "error");
      }
    }
  };

  return (
  <div>
  <motion.div
    className="max-w-6xl mx-auto mt-10 p-4 bg-white rounded-xl shadow-lg"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
      Manage All Assigned Tasks
    </h2>

    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left border border-gray-200">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-3 px-4">#</th>
            <th className="py-3 px-4">Executive Email</th>
            <th className="py-3 px-4">Title</th>
            <th className="py-3 px-4">Description</th>
            <th className="py-3 px-4">Deadline</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {task.length === 0 ? (
            <tr>
              <td colSpan="7" className="py-6 text-center text-gray-500">
                No tasks found.
              </td>
            </tr>
          ) : (
            task.map((task, index) => (
              <tr key={task._id} className="border-b hover:bg-gray-50 transition duration-150">
                <td className="py-3 px-4 font-semibold text-gray-800">{index + 1}</td>
                <td className="py-3 px-4 text-gray-800">{task.email}</td>
                <td className="py-3 px-4 text-gray-800">{task.title}</td>
                <td className="py-3 px-4 text-gray-800">{task.description}</td>
                <td className="py-3 px-4 text-gray-800">{task.deadline}</td>
                <td className="py-3 px-4 text-gray-800">
                  <span
                    className={`px-2 py-1 text-sm rounded-full ${
                      task.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-center space-x-2 flex items-center">
                  <Link
                    to={`/dashboard/updateTask/${task._id}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Update
                  </Link>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </motion.div>
</div>

  )
}

export default ManageTask