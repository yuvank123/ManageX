import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../provider/AuthProvider';
import AnimatedNavbar from './AnimatedNavbar';

const Navbar = () => {


  const { user, signOuts } = useContext(Context); 
  let nav=useNavigate()
  const handleLogout = () => {
    signOuts();

    nav("/login")
    
  };


  
  

  return (
   <AnimatedNavbar user={user} handleLogout={handleLogout} />
  )
}

export default Navbar