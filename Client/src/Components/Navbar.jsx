import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg"
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";
import { ServerUrl } from "../App";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.get(ServerUrl + "/api/auth/logout", { withCredentials: true });
      setUser(null);
      toast.success("Logout Successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
      console.log(error);
    }
  };

  return (
    <div className='sticky top-0 z-50 backdrop-blur-xl bg-[#070712]/80 border-b border-white/10'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between'>

        <div onClick={() => navigate("/")} className="flex items-center gap-2.5 cursor-pointer group">
          <div className='w-9 h-9 rounded-xl bg-white flex items-center justify-center overflow-hidden
            shadow-[0_8px_24px_rgba(139,92,246,0.3)] group-hover:scale-105 transition-transform'>
            <img src={logo} alt="logo" className='w-full h-full object-contain p-1' />
          </div>
          <h1 className="font-bold text-xl text-white leading-none tracking-tight">
            Moto<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400">AI</span>
          </h1>
        </div>

        {user && (
          <div className="hidden md:flex items-center gap-3">
            <button onClick={()=> navigate("/builder")} className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-emerald-500
              text-white text-sm font-semibold shadow-[0_8px_24px_rgba(139,92,246,0.3)]
              hover:shadow-[0_12px_32px_rgba(139,92,246,0.45)] hover:-translate-y-0.5
              transition-all duration-300 cursor-pointer">
              Builder
            </button>

            <button onClick={() => navigate("/billing")} className='px-4 py-2 rounded-xl border
              border-white/10 bg-white/5 backdrop-blur-sm text-white/80 text-sm font-medium
              hover:bg-white/10 hover:border-white/20 hover:text-white transition-all cursor-pointer'>
              Billing
            </button>

            <div className="flex items-center gap-3 px-3 py-1.5 rounded-2xl bg-white/5
              border border-white/10 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-emerald-400
                flex items-center justify-center flex-shrink-0 ring-2 ring-white/10">
                <span className="text-[#070712] text-sm font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>

              <div className='flex-1 overflow-hidden max-w-[140px]'>
                <p className='text-sm font-semibold text-white truncate'>{user.name}</p>
                <p className='text-xs text-white/40 truncate'>{user.email}</p>
              </div>

              <button onClick={handleLogout} className='ml-1 text-white/40 hover:text-red-400 transition-colors cursor-pointer'>
                <FiLogOut />
              </button>
            </div>
          </div>
        )}

        {user && (
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white/70 hover:text-white transition-colors">
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        )}
      </div>

      {menuOpen && (
        <div className='md:hidden px-4 pb-4'>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-4">

            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-emerald-400
                flex items-center justify-center flex-shrink-0 ring-2 ring-white/10">
                <span className="text-[#070712] text-sm font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className='flex-1 overflow-hidden'>
                <p className='text-sm font-semibold text-white truncate'>{user?.name}</p>
                <p className='text-xs text-white/40 truncate'>{user?.email}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-emerald-500
                text-white text-sm font-semibold shadow-[0_8px_24px_rgba(139,92,246,0.3)]"
                onClick={() => { navigate("/builder"); setMenuOpen(false); }}>
                Builder
              </button>
              <button className="w-full py-2.5 rounded-xl border border-white/10 bg-white/5
                text-white/80 text-sm font-medium"
                onClick={() => { navigate("/billing"); setMenuOpen(false); }}>
                Billing
              </button>
            </div>

            <button onClick={() => { setMenuOpen(false); handleLogout(); }}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
              bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium">
              <FiLogOut size={16} />
              LogOut
            </button>

          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar;