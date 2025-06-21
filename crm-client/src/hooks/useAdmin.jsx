import { useQuery } from '@tanstack/react-query';
import React, { useContext } from 'react';
import { Context } from '../provider/AuthProvider';
import { apiClient } from '../config/api';

const useAdmin = () => {
    let {user}= useContext(Context)

    const fetchUsers = async () => {
        const response = await apiClient.get(`/users/admin/${user?.email}`);
        return response.data?.admin;
    };

    const { data: isAdmin = false, isLoading:adminLoading } = useQuery({
        queryKey: [user?.email,"isAdmin"], // The unique key for this query
        queryFn: fetchUsers, // Function to fetch the data
        enabled: !!user?.email, // Only run if user email exists
    });
    
    return [isAdmin,adminLoading]
};

export default useAdmin;