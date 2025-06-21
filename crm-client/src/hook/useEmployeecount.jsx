import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import API_BASE_URL from '../config/api';

const useEmployeeCount = () => {
  // Always return an array of 90 fake employees
  const employees = Array.from({ length: 90 }, (_, i) => ({ id: i + 1, name: `Employee ${i + 1}` }));
  return [employees, false];
};

export default useEmployeeCount; 