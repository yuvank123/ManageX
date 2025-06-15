import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../provider/AuthProvider';
import useAdmin from '../hook/useAdmin';
import useEmployee from '../hook/useEmployee';
import Loading from '../component/loading';

const DashboardDefault = () => {
  const { user } = useContext(Context);
  const [isAdmin, adminLoading] = useAdmin();
  const [isEmployee, employeeLoading] = useEmployee();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for role checks to complete
    if (!adminLoading && !employeeLoading) {
      if (isAdmin) {
        navigate('/dashboard/A');
      } else if (isEmployee) {
        navigate('/dashboard/E');
      } else {
        // If user is neither admin nor employee, redirect to home
        navigate('/');
      }
    }
  }, [isAdmin, isEmployee, adminLoading, employeeLoading, navigate]);

  // Show loading while checking roles
  if (adminLoading || employeeLoading) {
    return <Loading />;
  }

  return <Loading />;
};

export default DashboardDefault; 