import { useQuery } from '@tanstack/react-query';
import React, { useContext } from 'react';
import { Context } from '../provider/AuthProvider';
import { apiClient } from '../config/api';

const useEmployee = () => {
  let { user } = useContext(Context);

  const fetchUsers = async () => {
    const response = await apiClient.get(`/users/executive/${user?.email}`);
    return response.data?.executive; // Return true if user is an executive
  };

  const { data: isemployee = false, isLoading: employeeLoading } = useQuery({
    queryKey: [user?.email, "isEmployee"], // The unique key for this query
    queryFn: fetchUsers, // Function to fetch the data
    enabled: !!user?.email, // Only run if user email exists
  });

  return [isemployee, employeeLoading];
};

export default useEmployee;