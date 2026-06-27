import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ServerUrl } from '../App';

function Billing({ user, setUser }) {
  const navigate = useNavigate()

  // Agar assistant setup complete nahi hai, to Builder page pe bhej do
  useEffect(() => {
    if (user && !user.isSetupComplete) {
      toast.error("Setup your assistant first");
      navigate("/builder");
    }
  }, [user, navigate])

  const remainingMessages = Math.max(0, (user?.requestLimit || 0) - (user?.totalMessages || 0));

  const remainingDays = user?.proExpiresAt
    ? Math.max(0, Math.ceil((new Date(user.proExpiresAt) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0;

  // Razorpay checkout flow: order create -> popup open -> verify on backend
  const handlePay = async () => {
    try {
      const res = await axios.post(
        ServerUrl + "/api/billing/order",
        { plan: "pro" },
        { withCredentials: true }
      )

      const order = res.data.order

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "MotoAI",
        description: "Pro Plan",
        order_id: order.id,

        handler: async (response) => {
          const verifyRes = await axios.post(
            ServerUrl + "/api/billing/verify",
            response,
            { withCredentials: true }
          )

          if (verifyRes.data.success) {
            toast.success("Payment Successful")
            setUser(verifyRes.data.user)
          } else {
            toast.error("Payment verification failed")
          }
        },
        theme: {
          color: "#7c3aed",
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()

    } catch (error) {
      toast.error("Payment Failed")
      console.log(error);
    }
  }

  return (
    <div className='min-h-screen bg-[#070712] px-4 py-10'>
      <div className='max-w-6xl mx-auto'>

        <div className='mb-8'>
          <h2 className='text-3xl font-bold text-white'>
            Billing & Subscription
          </h2>
          <p className='text-white/40 mt-1'>
            Manage your AI assistant plan and usage.
          </p>
        </div>

        {/* status cards */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6'>

          <div className='bg-white/[0.03] rounded-3xl p-6 border border-white/10'>
            <p className='text-sm text-white/40'>Current Plan</p>
            <h2 className='text-xl font-bold text-white mt-1 capitalize'>{user?.plan}</h2>
          </div>

          <div className='bg-white/[0.03] rounded-3xl p-6 border border-white/10'>
            <p className='text-sm text-white/40'>Gemini Status</p>
            <h2 className={
              "text-xl font-bold mt-1 capitalize " +
              (user?.geminiStatus === "active"
                ? "text-emerald-400"
                : user?.geminiStatus === "invalid"
                ? "text-red-400"
                : "text-amber-400")
            }>
              {user?.geminiStatus}
            </h2>
          </div>

          <div className='bg-white/[0.03] rounded-3xl p-6 border border-white/10'>
            <p className='text-sm text-white/40'>
              {user?.plan === "free" ? "Messages Left" : "Plan Expiry"}
            </p>
            <h2 className='text-xl font-bold text-white mt-1 capitalize'>
           {user?.plan === "free" ? remainingMessages : `${remainingDays} Days`}</h2>
          </div>
        </div>

        {/* plans */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-10'>

          {/* free plan */}
          <div className='bg-white/[0.03] rounded-3xl p-8 border border-white/10'>
            <h2 className='text-2xl font-bold text-white'>Free Plan</h2>
            <h3 className='text-5xl font-bold mt-5 text-white'>₹0</h3>

            <ul className='mt-6 space-y-4 text-white/60'>
              <li>200 AI messages</li>
              <li>Voice assistant</li>
              <li>Navigation support</li>
              <li>Basic customization</li>
            </ul>
          </div>

          {/* pro plan */}
          <div className='relative rounded-3xl p-8 bg-gradient-to-br from-purple-600 to-emerald-500
            text-white shadow-[0_25px_80px_rgba(139,92,246,0.35)] overflow-hidden'>

            <div className='absolute top-4 right-4 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold'>
              Most Popular
            </div>

            <h2 className='text-2xl font-bold'>Pro Plan</h2>
            <h3 className='text-5xl font-bold mt-5'>₹699</h3>
            <p className='mt-2 opacity-80'>3 Months Access</p>

            <ul className='mt-6 space-y-4 opacity-90'>
              <li>Unlimited AI messages</li>
              <li>Advanced AI assistant</li>
              <li>Priority performance</li>
              <li>Unlimited navigation</li>
              <li>Premium support</li>
            </ul>

            <button
              onClick={handlePay}
              disabled={user?.plan === "pro"}
              className={
                "mt-8 h-14 w-full rounded-2xl font-semibold transition " +
                (user?.plan === "pro"
                  ? "bg-emerald-200 text-black cursor-default"
                  : "bg-white text-[#081028] hover:scale-[1.02] cursor-pointer")
              }>
              {user?.plan === "pro" ? "Active Plan" : "Upgrade Now"}
            </button>

          </div>

        </div>
      </div>
    </div>
  )
}

export default Billing