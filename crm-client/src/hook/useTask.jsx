import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import API_BASE_URL from '../config/api';

const useTask = () => {
  const fetchTasks = async () => {
    const response = await axios.get(`${API_BASE_URL}/api/tasks`);
    return response.data;
  };

  const { data: task = [], isLoading: taskLoading } = useQuery({
    queryKey: ["task"],
    queryFn: fetchTasks,
  });
  return [task, taskLoading];
};

export default useTask;