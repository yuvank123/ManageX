import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react';
import auth from '../component/firebase.init';
import axios from 'axios';




export let Context= createContext()

const AuthProvider = ({children}) => {

    let [user,setUser]=useState(null)
    const [loading,setLoading] = useState(true);

    let [darkmode,setdarkmode]=useState(true)

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    const provider = new GoogleAuthProvider();
    let googleSign=()=>{
 
        return signInWithPopup(auth, provider)
    }
    
       
    
    
        let createRegistered=(email,password)=>{
         
              return createUserWithEmailAndPassword(auth,email,password)
        }
    
        let loginSetup =(email,password)=>{
          
             return signInWithEmailAndPassword(auth,email,password)
        }
    
        let signOuts=()=>{
          
            return signOut(auth)
        }
        let updateUserProfile = (user, profileUpdates) => {
            return updateProfile(user, profileUpdates);
          };
    
          useEffect(()=>{
            let unsubscribe= onAuthStateChanged(auth, (currentUser) => {
                
                //   console.log(currentUser)
                  setUser(currentUser)
                  // setLoading(false)

                  if(currentUser){
                    let user={email:currentUser?.email}
        
                    axios.post("http://localhost:3000/jwt",user,{withCredentials:true})
                    .then(res=>{
                      // console.log(res.data)
                      setLoading(false)
                    })
                    .catch(error => {
                      console.error("JWT Error:", error);
                      setLoading(false); // Set loading to false even if JWT fails
                    })
                   }
        
                   else{
                    axios.post("http://localhost:3000/logout",{},{withCredentials:true})
                    .then(res=>{
                      setLoading(false)
                    })
                    .catch(error => {
                      console.error("Logout Error:", error);
                      setLoading(false); // Set loading to false even if logout fails
                    })
                   }
                
                return ()=>{
                    unsubscribe()
                }
                
              });
          },[])

          

  // Toggle Theme Function
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Apply Theme to <html> class
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Add timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, []);

  let handleMode=()=>{
    setdarkmode(!darkmode)
  }

  

    
        let val= {
             createRegistered,
             loginSetup,
             signOuts,
             googleSign,
             updateUserProfile,
             user,
             loading,
             theme,
             toggleTheme,
             handleMode,
             darkmode
    
        }
    

    return (
        <div>
             <Context.Provider value={val}>
                   {children}
            </Context.Provider>
        </div>
    );
};

export default AuthProvider;