import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from './pages/Login.jsx';
import Footer from './component/Footer.jsx';
import Registered from './pages/Registered.jsx';
import MainLayout from './layout/MainLayout.jsx';
import AuthProvider from './provider/AuthProvider.jsx';
import Dashboard from './layout/Dashboard.jsx';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import MyProfile from './routes/MyProfile.jsx';

import UpdateProfile from './component/UpdateProfile.jsx';

import PrivateRoute from './routes/PrivateRoute.jsx';
import AdminRoutes from './routes/AdminRoutes.jsx';
import EmployeeRoute from './routes/EmployeeRoute.jsx';

import ManageTask from './routes/ManageTask.jsx';
import DashboardHome from './routes/DashboardHome.jsx';

import ErrorPage from './component/ErrorPage.jsx';
import Loading from './component/loading.jsx';

import AddTaskExecutives from './routes/AddTaskExecutives.jsx';
import UpdateTask from './routes/UpdateTask.jsx';
import MyTask from './routes/MyTask.jsx';
import AddaLead from './routes/AddaLead.jsx';
import MyAddedLead from './routes/MyAddedLead.jsx';
import AddFollowUp from './routes/AddFollowUp.jsx';
import MyFollowUp from './routes/MyFollowUp.jsx';
import RaiseTicket from './routes/RaiseTicket.jsx';
import MyAddedTicket from './routes/MyAddedTicket.jsx';
import ManageLead from './routes/ManageLead.jsx';
import ManageFollowUp from './routes/ManageFollowUp.jsx';
import ManageTicket from './routes/ManageTicket.jsx';
import ActivityLog from './routes/ActivityLog.jsx';
import DashboardE from './routes/DashboardE.jsx';
import AddUserAdmin from './routes/AddUserAdmin.jsx';
import ManageLeadsAdmin from './routes/ManageLeadsAdmin.jsx';
import AdminAnalytics from './routes/AdminAnalytics.jsx';
import EnhancedTicketManagement from './routes/EnhancedTicketManagement.jsx';
import ExecutiveAnalytics from './routes/ExecutiveAnalytics.jsx';
import DashboardDefault from './routes/DashboardDefault.jsx';
import CreateFirstAdmin from './routes/CreateFirstAdmin.jsx';
import AdminTest from './routes/AdminTest.jsx';
import FirebaseTest from './component/FirebaseTest.jsx';

// Simple test component
const TestComponent = () => {
  return (
    <div style={{ 
      padding: '50px', 
      textAlign: 'center', 
      fontSize: '24px',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div>
        <h1>CRM Application is Working!</h1>
        <p>If you can see this, the React app is loading correctly.</p>
        <p>Current time: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    errorElement:<ErrorPage></ErrorPage>,
    element: <Login></Login>,
  },
  {
    path:"/login",
    errorElement:<ErrorPage></ErrorPage>,
    element: <Login></Login>,
  },
  {
    path:"/test",
    errorElement:<ErrorPage></ErrorPage>,
    element: <TestComponent />,
  },
  {
    path:"/register",
    errorElement:<ErrorPage></ErrorPage>,
    element: <MainLayout></MainLayout>,
    children:[
      {
        path:"/register",
        element:<Registered></Registered>
      }
    ]
  },
  {
    path:"/create-first-admin",
    errorElement:<ErrorPage></ErrorPage>,
    element: <MainLayout></MainLayout>,
    children:[
      {
        path:"/create-first-admin",
        element:<CreateFirstAdmin></CreateFirstAdmin>
      }
    ]
  },
  {
    path:"/firebase-test",
    errorElement:<ErrorPage></ErrorPage>,
    element: <MainLayout></MainLayout>,
    children:[
      {
        path:"/firebase-test",
        element:<FirebaseTest />
      }
    ]
  },
  {
    path:"/dashboard",
    errorElement: <ErrorPage />,
    element:<PrivateRoute><Dashboard></Dashboard></PrivateRoute>,
    children:[

      {
        path:"/dashboard",
        element:<DashboardDefault></DashboardDefault>
      },

      {
        path:"/dashboard/A",
        element:<DashboardHome></DashboardHome>

      },
      {
        path:"/dashboard/E",
        element:<DashboardE></DashboardE>

      },
      {
        path:"/dashboard/addtask",
        element:<AdminRoutes><AddTaskExecutives></AddTaskExecutives></AdminRoutes>

      },
      {
        path:"/dashboard/managetask",
        element:<AdminRoutes><ManageTask></ManageTask></AdminRoutes>
      },
      {
        path:"/dashboard/updateTask/:id",
        element:<AdminRoutes><UpdateTask></UpdateTask></AdminRoutes>
      },
       {
        path:"/dashboard/manageLead",
        element:<AdminRoutes><ManageLead></ManageLead></AdminRoutes>
      },
      {
        path:"/dashboard/manageFollowUp",
        element:<AdminRoutes><ManageFollowUp></ManageFollowUp></AdminRoutes>
      },
      {
        path:"/dashboard/manageTicket",
        element:<AdminRoutes><ManageTicket></ManageTicket></AdminRoutes>
      },
      {
        path:"/dashboard/activityLog",
        element:<AdminRoutes><ActivityLog></ActivityLog></AdminRoutes>
      },
      {
        path:"/dashboard/add-user",
        element:<AdminRoutes><AddUserAdmin></AddUserAdmin></AdminRoutes>
      },
      {
        path:"/dashboard/admin-manage-leads",
        element:<AdminRoutes><ManageLeadsAdmin></ManageLeadsAdmin></AdminRoutes>
      },
      {
        path:"/dashboard/mytask",
        element:<EmployeeRoute><MyTask></MyTask></EmployeeRoute>

      },
      {
        path:"/dashboard/addalead",
        element:<EmployeeRoute><AddaLead></AddaLead></EmployeeRoute>

      },
      {
        path:"/dashboard/mylead",
        element:<EmployeeRoute><MyAddedLead></MyAddedLead></EmployeeRoute>

      },
      {
        path:"/dashboard/addFollowUp",
        element:<EmployeeRoute><AddFollowUp></AddFollowUp></EmployeeRoute>

      },
      {
        path:"/dashboard/myfollowUps",
        element:<EmployeeRoute><MyFollowUp></MyFollowUp></EmployeeRoute>

      },
      {
        path:"/dashboard/addraiseticket",
        element:<EmployeeRoute><RaiseTicket></RaiseTicket></EmployeeRoute>

      },
      {
        path:"/dashboard/myaddedticket",
        element:<EmployeeRoute><MyAddedTicket></MyAddedTicket></EmployeeRoute>

      },
      {
        path:"/dashboard/executive-analytics",
        element:<EmployeeRoute><ExecutiveAnalytics /></EmployeeRoute>
      },
      
      
      
      
     
      {
        path:"/dashboard/myprofile",
        element:<MyProfile></MyProfile>
      },
      {

        path:"/dashboard/updateprofile",
        element:<UpdateProfile></UpdateProfile>

      },
      {
        path:"/dashboard/analytics",
        element:<AdminRoutes><AdminAnalytics /></AdminRoutes>
      },
      {
        path:"/dashboard/enhanced-ticket-management",
        element:<AdminRoutes><EnhancedTicketManagement /></AdminRoutes>
      },
      {
        path:"/dashboard/admin-test",
        element:<AdminTest />
      },
    ]
  }
]);

const queryClient = new QueryClient();

const RootApp=()=>{
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastContainer />
        <RouterProvider router={router} />
        <Footer/>
      </AuthProvider>
    </QueryClientProvider>
  );
};

// Add error boundary
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error) => {
      console.error('App Error:', error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-4">Please refresh the page or try again later.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return children;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <RootApp />
    </ErrorBoundary>
  </StrictMode>
);
