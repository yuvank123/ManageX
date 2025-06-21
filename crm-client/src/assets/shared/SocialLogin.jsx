import React, { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaGoogle } from 'react-icons/fa';
import { Context } from '../../provider/AuthProvider';
import { API_BASE_URL } from '../../config/api.js';

const SocialLogin = () => {
    let { googleSign, handleRedirectResult } = useContext(Context);
    let navigate = useNavigate();
    let location = useLocation();
    const redirectPath = location.state?.from || "/";

    // Handle redirect result when component mounts
    useEffect(() => {
        const handleGoogleRedirect = async () => {
            try {
                const result = await handleRedirectResult();
                if (result) {
                    let user = result.user;
                    toast.success("Google Sign in successfully!");
                    navigate(redirectPath);

                    let usersData = {
                        name: user?.displayName,
                        email: user?.email,
                        user_photo: user?.photoURL,
                        role: "executives"
                    };

                    try {
                        const res = await axios.post(`${API_BASE_URL}/users`, usersData);
                        if (res.data.insertedId) {
                            // User added successfully
                        }
                    } catch (error) {
                        // User already exists, which is fine
                    }
                }
            } catch (error) {
                toast.error(error.message || "Failed to sign in with Google.");
            }
        };

        handleGoogleRedirect();
    }, [handleRedirectResult, navigate, redirectPath]);

    const handleGoogle = () => {
        googleSign().catch((error) => {
            toast.error("Failed to initiate Google sign-in. Please try again.");
        });
    };

    return (
        <div>
            <button 
                onClick={handleGoogle} 
                className="btn btn-accent mt-5 items-center flex mx-auto w-full"
            >
                Login with <FaGoogle />
            </button>
        </div>
    );
};

export default SocialLogin;