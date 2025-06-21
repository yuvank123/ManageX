import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../provider/AuthProvider';
import Lottie from 'lottie-react';
import animationData from '../assets/login.json';
import { FaEye, FaEyeSlash, FaGoogle, FaEnvelope, FaLock, FaSpinner, FaBuilding, FaChartLine, FaUsers, FaShieldAlt, FaCheckCircle, FaHeadset } from 'react-icons/fa';
import SecurityFeatures from '../component/SecurityFeatures';
import SimpleLoading from '../component/SimpleLoading';
import { toast } from 'react-hot-toast';
import { apiClient } from '../config/api';
import { getRedirectResult } from 'firebase/auth';
import auth from '../component/firebase.init';
import GraphImg from '../assets/graphh.jpg';
import Loginbg from '../assets/loginbg.jpg';

const Login = () => {
  const { loginSetup, darkmode, user, googleSign, handleRedirectResult } = useContext(Context);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  console.log(user)



  // Auto-redirect if already authenticated
  useEffect(() => {
    if (user) {
      // navigate('/dashboard');
    }
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Show loading immediately when button is clicked
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      await loginSetup(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Invalid email or password. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  //   const handleGoogleLogin = async () => {
  //   setIsLoading(true);
  //   setErrors({});

  //   try {
  //     await googleSign(); // redirect starts here
  //     // DO NOT navigate here! It happens after redirect
  //   } catch (error) {
  //     console.error('Google login error:', error);
  //     setErrors({ general: 'Failed to initiate Google sign-in. Please try again.' });
  //     toast.error('Failed to initiate Google sign-in. Please try again.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleGoogleLogin = () => {
    googleSign()
      .then((result) => {
        let user = result.user
        // Redirect to dashboard after successful Google login
        navigate('/dashboard');
      })
      .catch((error) => {
        toast.error(error.message || "Failed to create account.");
      });
  }


  // Show loading screen if authentication is in progress
  if (isLoading) {
    return <SimpleLoading message="Authenticating..." />;
  }

  return (
    <div className="h-screen flex flex-col lg:flex-row relative">
      <img src={Loginbg} alt="background image" className='absolute inset-0 h-full object-cover z-[-1]'/>
      {/* Left - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center shadow-md">
              <FaBuilding className="text-2xl text-blue-700" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold text-center text-blue-700 mb-1 unbounded">Log-In</h2>
          <p className="text-center text-gray-500 text-sm mb-6">
            Welcome back! Please enter your details
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
                {errors.general}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="unbounded text-sm text-gray-600 block mb-1">
                Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-600" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`w-full pl-10 pr-4 py-2.5 text-gray-500 placeholder-gray-400 rounded-lg border-2 text-sm ${errors.email ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                    } focus:outline-none`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="unbounded text-sm font-medium text-gray-600 block mb-1">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-700" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-10 py-2.5 text-gray-500 placeholder-gray-400 rounded-lg border-2 text-sm ${errors.password ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                    } focus:outline-none`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg flex justify-center items-center space-x-2 transition-all"
            >
              {isLoading ? <FaSpinner className="animate-spin" /> : null}
              <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
            </button>

            {/* Divider */}
            <div className="flex items-center justify-center text-gray-400 gap-2 text-sm">
              <span className="w-1/5 h-px bg-gray-300" />
              <span>OR</span>
              <span className="w-1/5 h-px bg-gray-300" />
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full border border-gray-400 hover:bg-gray-100 text-gray-700 font-medium py-2.5 rounded-lg flex items-center justify-center space-x-2"
            >
              <FaGoogle className="text-red-500" />
              <span>Sign in with Google</span>
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-500 mt-2">
              Don’t have an account?{' '}
              <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                Request Access
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right - Banner */}
      <div className="hidden lg:flex lg:w-[50%] items-center justify-center bg-gradient-to-r from-blue-00 via-blue-800 to-blue-700 p-10 text-white relative overflow-hidden">
        <div className="max-w-md w-full text-center space-y-8 z-10">
          {/* Headline */}
          <h2 className="leading-11 text-[45px] font-extrabold unbounded hover:text-white transition duration-300 text-blue-50">
            Welcome back! <br />
            <span className="underline-offset-4 decoration-white decoration-2 hover:decoration-dashed">
              Sign in to your <span className='underline underline-offset-2'>ManageX</span>
            </span>
          </h2>

          {/* Subtext */}
          <p className="text-indigo-100 text-base tracking-wide hover:text-white transition duration-300">
            Streamline your productivity and stay on top of your work. Get access to your powerful CRM dashboard now.
          </p>

          {/* Glassmorphism Card */}
          <div className="rounded-3xl bg-[#F4FEFE] p-6 shadow-xl transition-all hover:scale-[1.02] duration-300">
            <img
              src={GraphImg}
              alt="Chart"
              className="w-full h-[280px] object-contain"
            />
          </div>
        </div>

        {/* Optional: Decorative background blur circle */}
        <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -z-0 top-10 right-[-80px]" />
      </div>

    </div>
  );

};

export default Login;