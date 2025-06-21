import axios from "axios";
import React, { useContext, useState } from "react";
import { Context } from "../provider/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../config/api.js";

const MyTask = () => {
  const { user } = useContext(Context);
  const [updatedStatusMap, setUpdatedStatusMap] = useState({});

  // Fetch tasks
  const fetchUsers = async () => {
    const response = await axios.get(`${API_BASE_URL}/myTask/${user?.email}`);
    return response.data;
  };

  const {
    data: mytask = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [user?.email, "mytask"],
    queryFn: fetchUsers,
    enabled: !!user?.email,
    onSuccess: () => setUpdatedStatusMap({}), // Reset on successful fetch
  });

  // Handle status change
  const handleStatusChange = async (taskId, newStatus, deadline) => {
    const today = new Date().toISOString().split("T")[0];

    if (deadline < today) return;

    // Show status immediately in UI
    setUpdatedStatusMap((prev) => ({
      ...prev,
      [taskId]: newStatus,
    }));

    try {
      const res = await axios.patch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        status: newStatus,
      });

      if (res.data.modifiedCount > 0) {
        await refetch();
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <motion.div
      className="p-6 max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
        My Tasks
      </h2>

      {isLoading ? (
        <p className="text-center text-blue-600">Loading tasks...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4">No.</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Deadline</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {mytask.map((task, index) => {
                const isPastDeadline =
                  new Date(task.deadline) < new Date(new Date().toDateString());

                const displayStatus =
                  updatedStatusMap[task._id] || task.status;

                return (
                  <tr
                    key={task._id}
                    className="border-b hover:bg-gray-50 transition duration-150"
                  >
                    <td className="py-3 px-4 font-semibold text-gray-800">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 text-gray-800">{task.title}</td>
                    <td className="py-3 px-4 text-gray-800">
                      {task.description}
                    </td>
                    <td className="py-3 px-4 text-red-600">{task.deadline}</td>
                    <td className="py-3 px-4 text-gray-800">
                      <select
                        value={displayStatus}
                        disabled={isPastDeadline}
                        onChange={(e) =>
                          handleStatusChange(
                            task._id,
                            e.target.value,
                            task.deadline
                          )
                        }
                        className={`border px-2 py-1 rounded-md ${
                          isPastDeadline
                            ? "bg-gray-200 cursor-not-allowed"
                            : "bg-white"
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Complete">Complete</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {mytask.length === 0 && (
            <p className="text-center mt-6 text-gray-500">
              No tasks assigned yet.
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default MyTask;
