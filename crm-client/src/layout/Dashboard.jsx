import React, { useContext, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Context } from '../provider/AuthProvider';
import useAdmin from '../hook/useAdmin';
import useEmployee from '../hook/useEmployee';
import Loading from '../component/loading';
import { FaChartLine, FaHome, FaUser, FaBookReader, FaChartBar } from "react-icons/fa";
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
import bg from "../assets/bg1.jpg"



const Dashboard = () => {


  
  

 


  const {  signOuts,darkmode } = useContext(Context);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   
  

  let nav= useNavigate()

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleLogout = () => {
    signOuts();

    nav("/login")
    
  };

  let [isAdmin,adminLoading]= useAdmin()
  let [isemployee,employeeLoading]=useEmployee()
  console.log(isAdmin)

  if(adminLoading){
    return <Loading></Loading>
  }

  
 

 

 


  
  return (
    <div>

<div className="flex min-h-screen bg-gray-100 josefin-sans-font">
      
      
      {/* Sidebar */}
      <div
        className={`fixed overflow-y-scroll inset-y-0 left-0 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative w-64 bg-[#2D3748] text-white p-5 space-y-4 flex flex-col transition-transform duration-300 ease-in-out z-50`}
      >

        
        {
          isAdmin && <h2 className="text-3xl font-semibold text-center text-yellow-400">Admin Panel</h2>
          
        }

        {
          isemployee &&  <h2 className="text-2xl font-semibold text-center text-yellow-400">Executive Panel</h2>
        }
        {
        !isAdmin && !isemployee && (
        <h2 className="text-3xl font-semibold text-center text-yellow-400">User Panel</h2>
         )}

        {/* {
          isAdmin ?(
            <h2 className="text-3xl font-semibold text-center text-yellow-400">Admin Panel</h2>
          ) : (
            <h2 className="text-3xl font-semibold text-center text-yellow-400">User Panel</h2>
          )
        } */}
        <hr />
        
        
        <nav className="flex flex-col space-y-3 text-lg">


          {
            isAdmin && <Link to="/dashboard/A" onClick={closeSidebar} className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-700 transition">
            <FaHome className="text-yellow-400" />
            <span>Dashboard Home</span>
          </Link>
          }

          {
            isemployee && <Link to="/dashboard/E" onClick={closeSidebar} className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-700 transition">
            <FaHome className="text-yellow-400" />
            <span>Dashboard Home</span>
          </Link>
          }
          
        

          
       
         

          {isAdmin &&   <>
              
              
              
              
              
 

              
              <Link to="/dashboard/addtask" onClick={closeSidebar} className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-700 transition">
              <MdAddTask className="text-blue-400" />
                <span>Add Task</span>
              </Link>
              <Link to="/dashboard/managetask" onClick={closeSidebar} className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-700 transition">
                <SiManageiq  className="text-blue-400" />
                <span>Manage Task</span>
              </Link>
              <Link to="/dashboard/manageLead" onClick={closeSidebar} className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-700 transition">
              <MdBookmarkAdded className="text-blue-400" />
                <span>Manage Lead</span>
              </Link>
              <Link to="/dashboard/manageFollowUp" onClick={closeSidebar} className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-700 transition">
                <IoIosPersonAdd  className="text-blue-400" />
                <span>Manage FollowUp</span>
              </Link>
               <Link to="/dashboard/manageTicket" onClick={closeSidebar} className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-700 transition">
              <MdAttribution className="text-blue-400" />
                <span>Manage Ticket</span>
              </Link>

              <Link to="/dashboard/enhanced-ticket-management" onClick={closeSidebar} className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-700 transition">
                <FaChartBar className="text-blue-400" />
                <span>Enhanced Ticket Management</span>
              </Link>

              <Link to="/dashboard/admin-manage-leads" onClick={closeSidebar} className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-700 transition">
                <FaBookReader className="text-blue-400" />
                <span>Manage All Leads</span>
              </Link>
             
              
              <Link to="/dashboard/activityLog" onClick={closeSidebar} className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-700 transition">
                <MdFindInPage  className="text-blue-400" />
                <span>Activity Log</span>
              </Link>
             
              <Link to="/dashboard/add-user" onClick={closeSidebar} className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-700 transition">
                <IoIosPersonAdd className="text-blue-400" />
                <span>Add User</span>
              </Link>
              
              
            </>}

            {isemployee &&  <>
                
              <Link to="/dashboard/mytask" onClick={closeSidebar} className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-700 transition">
                <MdTaskAlt className="text-blue-400" />
                <span>My Task</span>
              </Link>

              <Link to="/dashboard/addalead" onClick={closeSidebar} className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-700 transition">
                <MdOutlineBrowserUpdated className="text-blue-400" />
                <span>Add a Lead</span>
              </Link>
              <Link to="/dashboard/mylead" onClick={closeSidebar} className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-700 transition">
                <MdOutlineBrowserUpdated className="text-blue-400" />
                <span>My Added Lead</span>
              </Link>
              <Link to="/dashboard/addFollowUp" onClick={closeSidebar} className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-700 transition">
                <MdOutlineBrowserUpdated className="text-blue-400" />
                <span>Add Followup</span>
              </Link>
               <Link to="/dashboard/myfollowUps" onClick={closeSidebar} className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-700 transition">
                <MdOutlineBrowserUpdated className="text-blue-400" />
                <span>My Followup</span>
              </Link>
              <Link to="/dashboard/addraiseticket" onClick={closeSidebar} className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-700 transition">
                <MdOutlineBrowserUpdated className="text-blue-400" />
                <span>Raise Ticket</span>
              </Link>
              <Link to="/dashboard/myaddedticket" onClick={closeSidebar} className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-700 transition">
                <MdOutlineBrowserUpdated className="text-blue-400" />
                <span>My Added Ticket</span>
              </Link>
             
              

            </>}

          {/* Common Links */}
          <Link to="/dashboard/myprofile" onClick={closeSidebar} className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-700 transition">
            <FaUser className="text-purple-400" />
            <span>My Profile</span>
          </Link>
          <Link to="/" onClick={closeSidebar} className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-700 transition">
            <IoHomeSharp className="text-purple-400" />
            <span>Home</span>
          </Link>
          
          {/* Role-based Analytics Link */}
          {isAdmin && (
            <Link to="/dashboard/analytics" onClick={closeSidebar} className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-700 transition">
              <FaChartBar className="text-blue-400" />
              <span>Admin Analytics</span>
            </Link>
          )}
          
          {isemployee && (
            <Link to="/dashboard/executive-analytics" onClick={closeSidebar} className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-700 transition">
              <FaChartBar className="text-blue-400" />
              <span>My Analytics</span>
            </Link>
          )}
          
          <button onClick={handleLogout} className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-700 transition">
            <IoLogOut className="text-purple-400" />
            <span>Logout</span>
          </button>
          
          
        </nav>
      </div>
      

      {/* Main Content */}
      <div className={`flex-1   `}style={{ backgroundImage: `url(${bg})` }}>
        {/* Mobile Menu Button */}
        <button onClick={toggleSidebar} className="md:hidden mb-4 p-2 bg-gray-900 text-white rounded-md">
          {isSidebarOpen ? "Close Menu" : "Open Menu"}
        </button>
        

        {/* <h1 className={`text-4xl font-bold  font-stretch-extra-condensed  text-center  text-black  md:text-5xl lg:text-6xl bg-[#EDF2F7]  bg-clip-text drop-shadow-lg`}>
           DASHBOARD
          </h1> */}
          
          

        <div className=" w-full p-2 rounded-lg min-h-screen ">
          <Outlet />
        </div>
        
        
      </div>
      
    </div>
    </div>
  )
}

export default Dashboard