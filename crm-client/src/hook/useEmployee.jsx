import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useContext } from 'react';
import { Context } from '../provider/AuthProvider';





const useEmployee = () => {


    let {user}= useContext(Context)



    const fetchUsers = async () => {
        const config = {
            withCredentials: true,
        };
        const response = await axios.get(`http://localhost:3000/users/executive/${user?.email}`, config);
        return response.data?.executive; // Return true if user is an executive
      };

      

   
    const { data: isemployee = false, isLoading:employeeLoading } = useQuery({
        queryKey: [user?.email,"isEmployee"], // The unique key for this query
        queryFn: fetchUsers, // Function to fetch the data
        enabled: !!user?.email, // Only run if user email exists
      });

    
    
    

    return [isemployee,employeeLoading]
};

export default useEmployee;