import React, { useContext, useState, useEffect, useRef } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Context } from '../provider/AuthProvider';
import useAdmin from '../hooks/useAdmin';
import useEmployee from '../hooks/useEmployee';
import Loading from '../component/loading';
import { FaChartLine, FaHome, FaUser, FaBookReader, FaChartBar, FaBars, FaTimes, FaBell, FaSearch, FaCog } from "react-icons/fa";
import { IoHomeSharp } from "react-icons/io5";
import { IoLogOut } from "react-icons/io5";
import { FaRegStopCircle } from "react-icons/fa";
import { MdFindInPage } from "react-icons/md";
import { MdAttribution } from "react-icons/md";
import { MdTaskAlt } from "react-icons/md";
import { MdOutlineBrowserUpdated } from "react-icons/md";
import { IoIosPersonAdd } from "react-icons/io";
import { MdManageAccounts } from "react-icons/md";
import { MdBookmarkAdded } from "react-icons/md";
import { MdAddTask } from "react-icons/md";
import { SiManageiq } from "react-icons/si";
import { RiSecurePaymentLine } from "react-icons/ri";
import Toogle from '../component/Toogle';
import NotificationCenter from '../routes/NotificationCenter';

const Dashboard = () => {
  const { signOuts, darkmode, user } = useContext(Context);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  
  let nav = useNavigate();

  const mainContentRef = useRef(null);

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleLogout = () => {
    signOuts();
    nav("/login");
  };

  // Enhanced scroll to top function
  const scrollToTop = () => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Enhanced handleNavigationClick
  const handleNavigationClick = () => {
    closeSidebar();
    scrollToTop();
  };

  let [isAdmin, adminLoading] = useAdmin();
  let [isemployee, employeeLoading] = useEmployee();

  if (adminLoading || employeeLoading) {
    return <Loading />;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-white/90 backdrop-blur-xl text-slate-800 shadow-2xl border-r border-slate-200/50 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200/50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <div>
                <h2 className="font-bold text-xl text-white">
                  {isAdmin ? 'Admin Panel' : isemployee ? 'Executive Panel' : 'User Panel'}
                </h2>
                <p className="text-blue-100 text-sm">Enterprise CRM</p>
              </div>
            </div>
            <button
              onClick={closeSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <FaTimes className="text-white" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
            {/* Dashboard Home */}
            {(isAdmin || isemployee) && (
              <Link
                to={isAdmin ? "/dashboard/A" : "/dashboard/E"}
                onClick={handleNavigationClick}
                className="flex items-center space-x-4 p-4 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 group border border-transparent hover:shadow-md"
              >
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-200 shadow-lg">
                  <FaChartLine className="text-white text-lg" />
                </div>
                <div>
                  <span className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">Dashboard Overview</span>
                  <p className="text-slate-500 text-sm">Analytics & Reports</p>
                </div>
              </Link>
            )}

            {/* Admin Menu Items */}
            {isAdmin && (
              <>
                <div className="pt-6 pb-3">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-4">Administration</h3>
                </div>
                <Link
                  to="/dashboard/addtask"
                  onClick={handleNavigationClick}
                  className="flex items-center space-x-4 p-4 rounded-xl hover:bg-green-50 hover:border-green-200 transition-all duration-200 group border border-transparent hover:shadow-md"
                >
                  <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl group-hover:from-green-600 group-hover:to-green-700 transition-all duration-200 shadow-lg">
                    <MdAddTask className="text-white text-lg" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 group-hover:text-green-700 transition-colors">Add Task</span>
                    <p className="text-slate-500 text-sm">Create new tasks</p>
                  </div>
                </Link>
                <Link
                  to="/dashboard/managetask"
                  onClick={handleNavigationClick}
                  className="flex items-center space-x-4 p-4 rounded-xl hover:bg-purple-50 hover:border-purple-200 transition-all duration-200 group border border-transparent hover:shadow-md"
                >
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl group-hover:from-purple-600 group-hover:to-purple-700 transition-all duration-200 shadow-lg">
                    <SiManageiq className="text-white text-lg" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 group-hover:text-purple-700 transition-colors">Manage Task</span>
                    <p className="text-slate-500 text-sm">Task management</p>
                  </div>
                </Link>
                <Link
                  to="/dashboard/manageLead"
                  onClick={handleNavigationClick}
                  className="flex items-center space-x-4 p-4 rounded-xl hover:bg-orange-50 hover:border-orange-200 transition-all duration-200 group border border-transparent hover:shadow-md"
                >
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl group-hover:from-orange-600 group-hover:to-orange-700 transition-all duration-200 shadow-lg">
                    <MdBookmarkAdded className="text-white text-lg" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 group-hover:text-orange-700 transition-colors">Manage Lead</span>
                    <p className="text-slate-500 text-sm">Lead management</p>
                  </div>
                </Link>
                <Link
                  to="/dashboard/manageFollowUp"
                  onClick={handleNavigationClick}
                  className="flex items-center space-x-4 p-4 rounded-xl hover:bg-teal-50 hover:border-teal-200 transition-all duration-200 group border border-transparent hover:shadow-md"
                >
                  <div className="p-3 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl group-hover:from-teal-600 group-hover:to-teal-700 transition-all duration-200 shadow-lg">
                    <IoIosPersonAdd className="text-white text-lg" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 group-hover:text-teal-700 transition-colors">Manage FollowUp</span>
                    <p className="text-slate-500 text-sm">Follow-up tracking</p>
                  </div>
                </Link>
                <Link
                  to="/dashboard/manageTicket"
                  onClick={handleNavigationClick}
                  className="flex items-center space-x-4 p-4 rounded-xl hover:bg-red-50 hover:border-red-200 transition-all duration-200 group border border-transparent hover:shadow-md"
                >
                  <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl group-hover:from-red-600 group-hover:to-red-700 transition-all duration-200 shadow-lg">
                    <MdAttribution className="text-white text-lg" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 group-hover:text-red-700 transition-colors">Manage Ticket</span>
                    <p className="text-slate-500 text-sm">Ticket management</p>
                  </div>
                </Link>
                <Link
                  to="/dashboard/enhanced-ticket-management"
                  onClick={handleNavigationClick}
                  className="flex items-center space-x-4 p-4 rounded-xl hover:bg-pink-50 hover:border-pink-200 transition-all duration-200 group border border-transparent hover:shadow-md"
                >
                  <div className="p-3 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl group-hover:from-pink-600 group-hover:to-pink-700 transition-all duration-200 shadow-lg">
                    <FaChartBar className="text-white text-lg" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 group-hover:text-pink-700 transition-colors">Enhanced Tickets</span>
                    <p className="text-slate-500 text-sm">Advanced ticket system</p>
                  </div>
                </Link>
                <Link
                  to="/dashboard/admin-manage-leads"
                  onClick={handleNavigationClick}
                  className="flex items-center space-x-4 p-4 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-200 group border border-transparent hover:shadow-md"
                >
                  <div className="p-3 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl group-hover:from-indigo-600 group-hover:to-indigo-700 transition-all duration-200 shadow-lg">
                    <FaBookReader className="text-white text-lg" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">Manage All Leads</span>
                    <p className="text-slate-500 text-sm">Complete lead overview</p>
                  </div>
                </Link>
                <Link
                  to="/dashboard/activityLog"
                  onClick={handleNavigationClick}
                  className="flex items-center space-x-4 p-4 rounded-xl hover:bg-cyan-50 hover:border-cyan-200 transition-all duration-200 group border border-transparent hover:shadow-md"
                >
                  <div className="p-3 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl group-hover:from-cyan-600 group-hover:to-cyan-700 transition-all duration-200 shadow-lg">
                    <MdFindInPage className="text-white text-lg" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 group-hover:text-cyan-700 transition-colors">Activity Log</span>
                    <p className="text-slate-500 text-sm">System activity tracking</p>
                  </div>
                </Link>
                <Link
                  to="/dashboard/add-user"
                  onClick={handleNavigationClick}
                  className="flex items-center space-x-4 p-4 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 transition-all duration-200 group border border-transparent hover:shadow-md"
                >
                  <div className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl group-hover:from-emerald-600 group-hover:to-emerald-700 transition-all duration-200 shadow-lg">
                    <IoIosPersonAdd className="text-white text-lg" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">Add User</span>
                    <p className="text-slate-500 text-sm">User management</p>
                  </div>
                </Link>
                <Link
                  to="/dashboard/analytics"
                  onClick={handleNavigationClick}
                  className="flex items-center space-x-4 p-4 rounded-xl hover:bg-violet-50 hover:border-violet-200 transition-all duration-200 group border border-transparent hover:shadow-md"
                >
                  <div className="p-3 bg-gradient-to-r from-violet-500 to-violet-600 rounded-xl group-hover:from-violet-600 group-hover:to-violet-700 transition-all duration-200 shadow-lg">
                    <FaChartBar className="text-white text-lg" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 group-hover:text-violet-700 transition-colors">Admin Analytics</span>
                    <p className="text-slate-500 text-sm">Advanced analytics</p>
                  </div>
                </Link>
              </>
            )}

            {/* Executive Menu Items */}
            {isemployee && (
              <>
                <div className="pt-6 pb-3">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-4">Executive Tools</h3>
                </div>
                <Link
                  to="/dashboard/mytask"
                  onClick={handleNavigationClick}
                  className="flex items-center space-x-4 p-4 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 group border border-transparent hover:shadow-md"
                >
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-200 shadow-lg">
                    <MdTaskAlt className="text-white text-lg" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">My Task</span>
                    <p className="text-slate-500 text-sm">Personal task management</p>
                  </div>
                </Link>
                <Link
                  to="/dashboard/addalead"
                  onClick={handleNavigationClick}
                  className="flex items-center space-x-4 p-4 rounded-xl hover:bg-green-50 hover:border-green-200 transition-all duration-200 group border border-transparent hover:shadow-md"
                >
                  <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl group-hover:from-green-600 group-hover:to-green-700 transition-all duration-200 shadow-lg">
                    <MdOutlineBrowserUpdated className="text-white text-lg" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 group-hover:text-green-700 transition-colors">Add a Lead</span>
                    <p className="text-slate-500 text-sm">Create new leads</p>
                  </div>
                </Link>
                <Link
                  to="/dashboard/mylead"
                  onClick={handleNavigationClick}
                  className="flex items-center space-x-4 p-4 rounded-xl hover:bg-orange-50 hover:border-orange-200 transition-all duration-200 group border border-transparent hover:shadow-md"
                >
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl group-hover:from-orange-600 group-hover:to-orange-700 transition-all duration-200 shadow-lg">
                    <MdOutlineBrowserUpdated className="text-white text-lg" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 group-hover:text-orange-700 transition-colors">My Added Lead</span>
                    <p className="text-slate-500 text-sm">Personal lead management</p>
                  </div>
                </Link>
                <Link
                  to="/dashboard/addFollowUp"
                  onClick={handleNavigationClick}
                  className="flex items-center space-x-4 p-4 rounded-xl hover:bg-teal-50 hover:border-teal-200 transition-all duration-200 group border border-transparent hover:shadow-md"
                >
                  <div className="p-3 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl group-hover:from-teal-600 group-hover:to-teal-700 transition-all duration-200 shadow-lg">
                    <MdOutlineBrowserUpdated className="text-white text-lg" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 group-hover:text-teal-700 transition-colors">Add Followup</span>
                    <p className="text-slate-500 text-sm">Create follow-ups</p>
                  </div>
                </Link>
                <Link
                  to="/dashboard/myfollowUps"
                  onClick={handleNavigationClick}
                  className="flex items-center space-x-4 p-4 rounded-xl hover:bg-purple-50 hover:border-purple-200 transition-all duration-200 group border border-transparent hover:shadow-md"
                >
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl group-hover:from-purple-600 group-hover:to-purple-700 transition-all duration-200 shadow-lg">
                    <MdOutlineBrowserUpdated className="text-white text-lg" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 group-hover:text-purple-700 transition-colors">My Followup</span>
                    <p className="text-slate-500 text-sm">Personal follow-up tracking</p>
                  </div>
                </Link>
                <Link
                  to="/dashboard/addraiseticket"
                  onClick={handleNavigationClick}
                  className="flex items-center space-x-4 p-4 rounded-xl hover:bg-red-50 hover:border-red-200 transition-all duration-200 group border border-transparent hover:shadow-md"
                >
                  <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl group-hover:from-red-600 group-hover:to-red-700 transition-all duration-200 shadow-lg">
                    <MdOutlineBrowserUpdated className="text-white text-lg" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 group-hover:text-red-700 transition-colors">Raise Ticket</span>
                    <p className="text-slate-500 text-sm">Create support tickets</p>
                  </div>
                </Link>
                <Link
                  to="/dashboard/myaddedticket"
                  onClick={handleNavigationClick}
                  className="flex items-center space-x-4 p-4 rounded-xl hover:bg-pink-50 hover:border-pink-200 transition-all duration-200 group border border-transparent hover:shadow-md"
                >
                  <div className="p-3 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl group-hover:from-pink-600 group-hover:to-pink-700 transition-all duration-200 shadow-lg">
                    <MdOutlineBrowserUpdated className="text-white text-lg" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 group-hover:text-pink-700 transition-colors">My Added Ticket</span>
                    <p className="text-slate-500 text-sm">Personal ticket management</p>
                  </div>
                </Link>
                <Link
                  to="/dashboard/executive-analytics"
                  onClick={handleNavigationClick}
                  className="flex items-center space-x-4 p-4 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-200 group border border-transparent hover:shadow-md"
                >
                  <div className="p-3 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl group-hover:from-indigo-600 group-hover:to-indigo-700 transition-all duration-200 shadow-lg">
                    <FaChartBar className="text-white text-lg" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">My Analytics</span>
                    <p className="text-slate-500 text-sm">Personal performance metrics</p>
                  </div>
                </Link>
              </>
            )}

            {/* Common Links */}
            <div className="pt-6 pb-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-4">Account</h3>
            </div>
            <Link
              to="/dashboard/myprofile"
              onClick={handleNavigationClick}
              className="flex items-center space-x-4 p-4 rounded-xl hover:bg-slate-50 hover:border-slate-200 transition-all duration-200 group border border-transparent hover:shadow-md"
            >
              <div className="p-3 bg-gradient-to-r from-slate-500 to-slate-600 rounded-xl group-hover:from-slate-600 group-hover:to-slate-700 transition-all duration-200 shadow-lg">
                <FaUser className="text-white text-lg" />
              </div>
              <div>
                <span className="font-semibold text-slate-800 group-hover:text-slate-700 transition-colors">My Profile</span>
                <p className="text-slate-500 text-sm">Account settings</p>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-4 p-4 rounded-xl hover:bg-red-50 hover:border-red-200 transition-all duration-200 group border border-transparent hover:shadow-md"
            >
              <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl group-hover:from-red-600 group-hover:to-red-700 transition-all duration-200 shadow-lg">
                <IoLogOut className="text-white text-lg" />
              </div>
              <div>
                <span className="font-semibold text-slate-800 group-hover:text-red-700 transition-colors">Logout</span>
                <p className="text-slate-500 text-sm">Sign out</p>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-slate-200/50 sticky top-0 z-30">
          <div className="flex items-center justify-between px-8 py-6">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-3 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <FaBars className="text-slate-600 text-xl" />
            </button>

            {/* Page Title */}
            <div className="flex-1 lg:ml-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                {isAdmin ? 'Admin Dashboard' : isemployee ? 'Executive Dashboard' : 'User Dashboard'}
              </h1>
              <p className="text-slate-600 mt-1">
                Welcome back, <span className="font-semibold text-blue-600">{user?.displayName || user?.email}</span>
              </p>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <NotificationCenter />
              
              {/* User Avatar */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
                <div className="hidden md:block">
                  <p className="font-semibold text-slate-800">{user?.displayName || 'User'}</p>
                  <p className="text-sm text-slate-500">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main ref={mainContentRef} className="flex-1 overflow-y-auto relative">
          <div className="min-h-screen">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;