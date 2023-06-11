import React, { useState,useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, registerWithEmailAndPassword } from '../Firebase/Firebase';
import { useNavigate,Link } from 'react-router-dom';
import Lottie from "lottie-react";
import {Box} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import animationData from "../Animaions/social_media_anim.json";
const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');
  const [name, setName] = useState('');
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const [loader,setLoader] = useState(false);
    useEffect(() => {
      if (loading) return;
      if (user) 
      {
        localStorage.setItem("user",user.uid);
        // localStorage.removeItem("userImage",);
         navigate("/home");
      }
      if(error){
        alert(error);
      }
      // eslint-disable-next-line
    }, [user, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    if(password===cpassword)
    {
    setLoader(true);
    registerWithEmailAndPassword(name,email, password);
    setLoader(false);
  }
    else{
        alert("Password and Confirm Password do not match");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen " style={{background:"url('https://img.freepik.com/free-photo/vivid-blurred-colorful-background_58702-2655.jpg?w=740&t=st=1686120077~exp=1686120677~hmac=13d448074a0639ab84fd4665f1dc3dc2f277a471e7dde7a65fca30e7a39fb06d')",
    backgroundRepeat:"no-repeat",backgroundSize:"cover"}}>
         
         <div className="flex h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 mt-10 mb-9">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {!loader?<Lottie animationData={animationData} alt="logo" 
            className="mx-auto h-20 w-auto"/>:
            <Box sx={{ display: 'flex',alignItems:'center',justifyContent:'center' }}>
            <CircularProgress />
          </Box>}
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create new account
          </h2>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Confirm Password
              </label>
              <div className="mt-2">
                <input
                  id="cpassword"
                  name="cpassword"
                  type="password"
                  value={cpassword}
                  onChange={(e) => setCPassword(e.target.value)}
                  autoComplete="password"
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
               Submit
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <Link to="/" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
