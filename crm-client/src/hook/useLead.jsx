import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import API_BASE_URL from '../config/api';

const useLead = () => {
  const fetchLeads = async () => {
    const response = await axios.get(`${API_BASE_URL}/manageLead`);
    return response.data;
  };

  const { data: lead = [], isLoading: leadLoading } = useQuery({
    queryKey: ["lead"],
    queryFn: fetchLeads,
  });
  return [lead, leadLoading];
};

export default useLead;