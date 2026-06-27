import React from 'react'
import { useNavigate } from 'react-router-dom'
import AssistantPreview from '../Components/AssistantPreview'
import logo from "../assets/logo.jpeg"

const STEPS = [
  {
    step: "01",
    title: "Sign up free",
    desc: "Continue with Google and create your assistant instantly.",
  },
  {
    step: "02",
    title: "Customize assistant",
    desc: "Set your business name, tone, voice and theme.",
  },
  {
    step: "03",
    title: "Train your assistant",
    desc: "Add business details and personalize responses.",
  },
  {
    step: "04",
    title: "Embed anywhere",
    desc: "Copy one script tag and add it to your website.",
  },
];

function Home({ user }) {
  const navigate = useNavigate()
  return (
    <div className='min-h-screen bg-[#070712] overflow-hidden'>

      <section className='relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-20'>

        <div className='absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:28px_28px]' />

        <div className='absolute top-0 left-1/4 w-[400px] h-[400px] bg-purple-600/30 blur-[120px] rounded-full animate-pulse' />
        <div className='absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/20 blur-[120px] rounded-full animate-pulse' />

        <div className='relative max-w-6xl mx-auto'>

          <div className='flex justify-center'>
            <span className='inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10
              bg-white/5 backdrop-blur-sm text-purple-300 text-xs sm:text-sm font-medium'>
              <span className='w-2 h-2 bg-emerald-400 rounded-full animate-pulse' />
              Voice AI for modern websites
            </span>
          </div>

          <div className='text-center mt-10 sm:mt-12'>
            <h1 className='max-w-5xl mx-auto text-[42px] leading-[52px] sm:text-6xl sm:leading-[72px]
              lg:text-7xl lg:leading-[88px] font-black tracking-tight text-white'>
              Add a{" "}
              <span className='inline-block px-2'>
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-emerald-400'>
                  Virtual Assistant
                </span>
              </span>
              <br className='hidden sm:block' />
              to your website
            </h1>

            <p className='max-w-2xl mx-auto mt-7 text-sm sm:text-lg lg:text-xl text-white/50 leading-relaxed'>
              Create a smart voice-enabled assistant that talks to visitors,
              answer questions and helps users navigate your website instantly.
            </p>

            <div className='flex flex-col sm:flex-row items-center justify-center gap-4 mt-10'>
              <button onClick={() => navigate("/builder")} className='w-full sm:w-auto px-8 py-4 rounded-2xl
                bg-gradient-to-r from-purple-500 to-emerald-500 text-white font-semibold text-sm sm:text-base
                shadow-[0_20px_60px_rgba(139,92,246,0.35)] hover:shadow-[0_25px_70px_rgba(139,92,246,0.5)]
                hover:-translate-y-0.5 transition-all duration-300 cursor-pointer'>
                Build Your Assistant
              </button>
            </div>

            <p className='mt-5 text-xs sm:text-sm text-white/40'>
              Free plan • 200 AI responses included
            </p>
          </div>

          <AssistantPreview />

        </div>
      </section>

      <section className='relative px-4 sm:px-6 lg:px-8 py-20 bg-[#0b0b1a] border-t border-white/5'>
        <div className='max-w-6xl mx-auto'>

          <div className='text-center mb-14'>
            <h2 className='text-3xl sm:text-4xl font-bold text-white'>
              Get Started in Minutes
            </h2>
            <p className='text-white/40 mt-3 text-sm sm:text-base'>
              Simple setup. No complicated integration.
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6'>
            {STEPS.map((s, i) => (
              <div key={i} className='group bg-white/[0.03] hover:bg-white/[0.06] border border-white/10
                hover:border-white/20 rounded-[20px] p-7 transition-all
                hover:shadow-[0_15px_50px_rgba(139,92,246,0.15)]'>
                <span className='text-4xl font-black text-transparent bg-clip-text
                  bg-gradient-to-r from-purple-400 to-emerald-400'>
                  {s.step}
                </span>
                <h3 className='mt-5 text-lg font-semibold text-white'>{s.title}</h3>
                <p className='mt-3 text-sm text-white/50 leading-relaxed'>{s.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      <footer className='bg-[#070712] border-t border-white/5 px-6 py-10'>
        <div className='max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left'>

          <div>
            <div onClick={() => navigate("/")} className="flex items-center gap-2.5 cursor-pointer group justify-center sm:justify-start">
              <div className='w-9 h-9 rounded-xl bg-white flex items-center justify-center overflow-hidden
                shadow-[0_8px_24px_rgba(139,92,246,0.3)] group-hover:scale-105 transition-transform'>
                <img src={logo} alt="logo" className='w-full h-full object-contain p-1' />
              </div>
              <h1 className="font-bold text-xl text-white leading-none tracking-tight">
                Moto<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400">AI</span>
              </h1>
            </div>
            <p className='text-white/40 text-sm mt-2'>Voice AI assistant for websites</p>
          </div>

          <p className='text-white/30 text-sm'>
            © {new Date().getFullYear()} MotoAI. All rights reserved.
          </p>

        </div>
      </footer>

    </div>
  )
}

export default Home