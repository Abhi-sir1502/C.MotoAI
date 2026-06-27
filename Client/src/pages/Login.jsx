import axios from 'axios';
import toast from "react-hot-toast";
import React from 'react';
import { GiCometSpark } from "react-icons/gi";
import {
  HiOutlineBolt,
  HiOutlineMicrophone,
  HiOutlineCodeBracket,
  HiOutlineSparkles
} from "react-icons/hi2";
import { FcGoogle } from "react-icons/fc";
import logo from "../assets/logo.jpeg";
import { signInWithPopup } from 'firebase/auth'; // 👈 Popup standard import
import { provider, auth } from '../utils/firebase';
import { useNavigate } from 'react-router-dom';

const ServerUrl = "http://localhost:8000";

function Login({ setUser }) {
  const navigate = useNavigate();
  
  const feature = [
    { icon: <HiOutlineMicrophone />, title: "Voice AI", desc: "Natural real-time voice conversations" },
    { icon: <HiOutlineSparkles />, title: "Smart Navigation", desc: "Navigate pages using voice commands." },
    { icon: <HiOutlineCodeBracket />, title: "Easy Embed", desc: "Add assistant using one script tag" },
    { icon: <HiOutlineBolt />, title: "Fast responses", desc: "Optimized Gemini AI responses." },
  ];

  // ⚡ Popup login flow handles yahan ho raha hai
  const handleLogin = async () => {
    try {
      console.log("Google Login Initiated via Popup");
      
      // 1. Firebase Popup open hoga
      const result = await signInWithPopup(auth, provider);
      
      const displayName = result.user.displayName;
      const email = result.user.email;
      console.log("Login Success Firebase:", result.user);

      // 2. Backend ko jhatpat data bheja jaayega
      const res = await axios.post(ServerUrl + "/api/auth/google", {
        name: displayName,
        email: email
      }, {
        withCredentials: true // Cookies secure transmission ke liye
      });

      console.log("Backend Response:", res.data);
      
      // 3. State update aur redirection bina page reload ke
      setUser(res.data);
      toast.success("Login Successfully")
      navigate("/");

    } catch (error) {
      toast.error("Login Failed....")
      if (error.response) {
        console.error("Backend Ne Error Diya:", error.response.data);
      } else {
        console.error("Firebase Auth Error:", error.message);
      }
    }
  };

  return (
    <div className='relative min-h-screen overflow-hidden bg-[#070712]'>
      {/* dot grid texture */}
      <div className='absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:28px_28px]' />

      {/* glow orbs */}
      <div className='absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-purple-600/30 blur-[120px] animate-pulse' />
      <div className='absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full bg-emerald-500/20 blur-[120px] animate-pulse' />

      <div className='relative max-w-7xl mx-auto px-6 pt-6 pb-20 lg:pt-8'>

        {/* top brand bar */}
        <div className='flex items-center gap-3 mb-8'>
          <div className='w-9 h-9 rounded-xl bg-white flex items-center justify-center overflow-hidden shadow-md'>
            <img src={logo} alt="logo" className='w-full h-full object-contain p-1' />
          </div>
          <span className='text-white font-semibold text-lg tracking-tight'>MotoAI</span>
        </div>

        <div className='grid md:grid-cols-2 gap-16 items-center'>

          {/* left */}
          <div>
            <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full
              border border-white/10 bg-white/5 backdrop-blur-sm
              text-purple-300 text-sm font-medium'>
              <GiCometSpark className='text-emerald-400' />
              AI Voice Assistant Platform
            </div>

            <h1 className='mt-8 text-5xl lg:text-7xl font-black leading-[1.05] text-white tracking-tight'>
              Build AI Assistants
              <span className='block text-transparent bg-clip-text bg-gradient-to-r
                from-purple-400 via-fuchsia-400 to-emerald-400'>
                For Any Website
              </span>
            </h1>

            <p className='mt-6 text-white/60 leading-8 max-w-xl text-lg'>
              Create customizable AI voice assistants that talk, guide users,
              and integrate into any website instantly.
            </p>

            <div className='mt-10 flex flex-wrap items-center gap-4'>
              <button onClick={handleLogin} className='h-14 px-7 rounded-2xl bg-gradient-to-r from-purple-500 to-emerald-500
                shadow-[0_20px_60px_rgba(139,92,246,0.35)] hover:shadow-[0_25px_70px_rgba(139,92,246,0.5)]
                hover:-translate-y-0.5 transition-all duration-300 cursor-pointer
                flex items-center gap-3 text-white font-semibold'>
                <div className='bg-white p-1.5 rounded-full flex items-center justify-center shadow-sm'>
                  <FcGoogle className='text-xl' />
                </div>
                Continue with Google
              </button>

              <span className='text-sm text-white/40'>Free plan • 200 AI responses</span>
            </div>

            {/* trust row */}
            <div className='mt-12 flex items-center gap-3'>
              <div className='flex -space-x-3'>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className='w-9 h-9 rounded-full border-2 border-[#070712]
                    bg-gradient-to-br from-purple-400 to-emerald-400' />
                ))}
              </div>
              <p className='text-sm text-white/50'>
                Trusted by <span className='text-white font-medium'>500+</span> developers worldwide
              </p>
            </div>
          </div>

          {/* right card */}
          <div className='relative'>
            <div className='absolute inset-0 bg-gradient-to-r from-purple-500/30 to-emerald-500/30 blur-[100px]' />

            <div className='relative rounded-[32px] border border-white/10 bg-white/[0.04]
              backdrop-blur-xl p-8 shadow-2xl'>

              <div className='flex items-center justify-between mb-2'>
                <h2 className='text-2xl font-bold text-white'>Features</h2>
                <span className='flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10
                  text-emerald-400 text-xs font-medium'>
                  <span className='w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse' />
                  Live
                </span>
              </div>

              <div className='mt-6 space-y-4'>
                {feature.map(({ icon, title, desc }, index) => (
                  <div key={index} className='group flex gap-4 rounded-2xl border border-white/5
                    bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10
                    transition-all duration-300 p-4'>
                    <div className='min-w-[48px] h-[48px] rounded-xl bg-gradient-to-br
                      from-purple-500 to-emerald-500 text-white text-xl flex items-center
                      justify-center shadow-[0_8px_24px_rgba(139,92,246,0.3)]
                      group-hover:scale-105 transition-transform'>
                      {icon}
                    </div>
                    <div>
                      <h3 className='text-white text-base font-semibold'>{title}</h3>
                      <p className='mt-1 text-sm leading-6 text-white/50'>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;