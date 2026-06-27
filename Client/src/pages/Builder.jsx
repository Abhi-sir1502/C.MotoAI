import React, { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FiPlus, FiTrash2, FiCopy } from "react-icons/fi"
import { ServerUrl } from '../App'

const CLIENT_URL = window.location.origin;

const THEMES = ["light", "dark", "glass", "neon"];
const TONES = ["friendly", "professional", "sales"];

function Builder({ user, setUser }) {

  const [editAssistant, setEditAssistant] = useState(!user?.isSetupComplete)

  const [assistantName, setAssistantName] = useState(user?.assistantName || "");
  const [businessName, setBusinessName] = useState(user?.businessName || "");
  const [businessType, setBusinessType] = useState(user?.businessType || "");
  const [businessDescription, setBusinessDescription] = useState(user?.businessDescription || "");

  const [theme, setTheme] = useState(user?.theme || "dark")
  const [tone, setTone] = useState(user?.tone || "friendly")
  const [geminiApikey, setGeminiApiKey] = useState(user?.geminiApikey || "")

  const [pages, setPages] = useState(user?.pages || []);
  const [pageName, setPageName] = useState("");
  const [pagePath, setPagePath] = useState("");
  const [pageKeywords, setPageKeywords] = useState("");

  const [loading, setLoading] = useState(false)

  const addPage = () => {
    if (!pageName || !pagePath) return;

    const newPage = {
      name: pageName,
      path: pagePath,
      keywords: pageKeywords.split(",").map((k) => k.trim())
    }
    setPages([...pages, newPage])

    setPageName("")
    setPagePath("")
    setPageKeywords("")
  }

  const removePage = (index) => {
    const updatedPages = pages.filter((_, i) => i !== index)
    setPages(updatedPages)
  }

  const saveAssistant = async () => {
    setLoading(true)
    try {
      const data = {
        assistantName,
        businessName,
        businessType,
        businessDescription,
        tone,
        theme,
        geminiApikey,
        pages,
      }
      const res = await axios.post(ServerUrl + "/api/user/save-assistant", data, { withCredentials: true })
      console.log(res.data)
      setUser(res.data.user)
      setEditAssistant(false)
      toast.success("Assistant Saved Successfully")
    } catch (error) {
      toast.error("Failed to save assistant")
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const remainingMessages = Math.max(0, (user?.requestLimit || 0) - (user?.totalMessages || 0));

  const remainingDays = user?.proExpiresAt
    ? Math.max(0, Math.ceil((new Date(user.proExpiresAt) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0;

  const embedCode = `<script src="${CLIENT_URL}/assistant.js" data-user-id="${user?._id}"></script>`;

  return (
    <div className='min-h-screen bg-[#070712] px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='mb-8'>
          <h2 className='text-3xl font-bold text-white'>
            Assistant Builder
          </h2>
          <p className='text-white/40 mt-1'>Customize your virtual Assistant</p>
        </div>

        {user?.isSetupComplete && !editAssistant && (
          <div className='bg-white/[0.03] border border-white/10 rounded-3xl p-6 mb-6'>

            <p className='text-sm text-white/40'>Assistant</p>
            <h2 className='text-3xl font-bold text-white mt-1'>{user?.assistantName}</h2>
            <p className='text-white/50 mt-3 leading-7'>
              Your assistant is ready to use on your website.
            </p>

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6'>

              <div className='rounded-2xl border border-white/10 bg-white/[0.03] p-4'>
                <p className='text-sm text-white/40'>Current Plan</p>
                <h2 className='text-xl font-bold text-white mt-1 capitalize'>{user?.plan}</h2>
              </div>

              <div className='rounded-2xl border border-white/10 bg-white/[0.03] p-4'>
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

              <div className='rounded-2xl border border-white/10 bg-white/[0.03] p-4'>
                <p className='text-sm text-white/40'>
                  {user?.plan === "free" ? "Messages Left" : "Plan Expiry"}
                </p>
                <h2 className='text-xl font-bold text-white mt-1 capitalize'>
                  {user?.plan === "free" ? remainingMessages : `${remainingDays} Days`}
                </h2>
              </div>
            </div>

            <div className='mt-7'>
              <div className='mt-4 rounded-2xl bg-amber-500/10 border border-amber-400/20 p-4'>
                <p className='text-sm font-semibold text-amber-300'>
                  Where to paste this script?
                </p>
                <p className='text-sm text-amber-200/80 mt-2 leading-6'>
                  Paste this script before the closing{" "}
                  <span className='font-semibold'>{"</body>"}</span>{" "}
                  tag of your website HTML file.
                  <br /><br />
                  Example:
                </p>

                <pre className='mt-3 bg-[#0b1020] text-emerald-400 rounded-xl p-3 text-xs font-mono overflow-x-auto'>
{`<body>

Your Website Content

<script src="${CLIENT_URL}/assistant.js"
    data-user-id="${user?._id}"></script>

</body>`}
                </pre>
              </div>

              <p className='text-sm font-medium text-white mb-3 mt-3'>Embed Code</p>
            </div>

            <div className='relative'>
              <textarea readOnly value={embedCode} className='w-full h-20 bg-[#0b1020]
                text-emerald-400 rounded-2xl p-4 text-sm font-mono resize-none outline-none border border-white/10' />
              <button onClick={() => {
                navigator.clipboard.writeText(embedCode);
                toast.success("Copied to clipboard!")
              }} className='absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20
                flex items-center justify-center text-white transition-colors'>
                <FiCopy size={16} />
              </button>
            </div>

            <button onClick={() => setEditAssistant(true)} className='mt-6 h-12 px-6 rounded-2xl
              bg-gradient-to-r from-purple-500 to-emerald-500 text-white font-medium
              shadow-[0_8px_24px_rgba(139,92,246,0.3)] hover:-translate-y-0.5 transition-all'>
              Edit Assistant
            </button>
          </div>
        )}

        {editAssistant && (
          <div className='space-y-6'>

            <div className='bg-white/[0.03] border border-white/10 rounded-3xl p-6'>
              <h2 className='text-lg font-semibold mb-5 text-white'>Basic Information</h2>

              <div className='space-y-4'>
                <input type="text"
                  onChange={(e) => setAssistantName(e.target.value)}
                  value={assistantName}
                  placeholder='Assistant Name'
                  className='w-full bg-white/5 border border-white/10 text-white placeholder-white/30
                    rounded-2xl px-4 py-3 outline-none focus:border-purple-400/50' />

                <input type="text"
                  onChange={(e) => setBusinessName(e.target.value)}
                  value={businessName}
                  placeholder='Business Name'
                  className='w-full bg-white/5 border border-white/10 text-white placeholder-white/30
                    rounded-2xl px-4 py-3 outline-none focus:border-purple-400/50' />

                <input type="text"
                  onChange={(e) => setBusinessType(e.target.value)}
                  value={businessType}
                  placeholder='Business Type'
                  className='w-full bg-white/5 border border-white/10 text-white placeholder-white/30
                    rounded-2xl px-4 py-3 outline-none focus:border-purple-400/50' />

                <textarea
                  rows={4}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  value={businessDescription}
                  placeholder='Business Description'
                  className='w-full bg-white/5 border border-white/10 text-white placeholder-white/30
                    rounded-2xl px-4 py-3 resize-none outline-none focus:border-purple-400/50' />
              </div>
            </div>

            <div className='bg-white/[0.03] border border-white/10 rounded-3xl p-6'>
              <h2 className='text-lg font-semibold mb-5 text-white'>Appearance</h2>

              <div>
                <label className='text-sm text-white/50 mb-3 block'>Theme</label>
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                  {THEMES.map((item) => (
                    <button key={item}
                      onClick={() => setTheme(item)}
                      className={
                        "py-3 rounded-2xl border-2 capitalize text-sm transition-all " +
                        (theme === item
                          ? "border-purple-400 bg-purple-500/10 text-purple-300"
                          : "border-white/10 text-white/50 hover:border-white/20")
                      }>
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className='mt-6'>
                <label className='text-sm text-white/50 mb-3 block'>Assistant Tone</label>
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                  {TONES.map((item) => (
                    <button key={item}
                      onClick={() => setTone(item)}
                      className={
                        "py-3 rounded-2xl border-2 capitalize text-sm transition-all " +
                        (tone === item
                          ? "border-purple-400 bg-purple-500/10 text-purple-300"
                          : "border-white/10 text-white/50 hover:border-white/20")
                      }>
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className='bg-white/[0.03] border border-white/10 rounded-3xl p-6'>
              <div className='flex items-center justify-between mb-5 gap-4 flex-wrap'>
                <div>
                  <h2 className='text-lg font-semibold text-white'>Gemini API KEY</h2>
                  <p className='text-sm text-white/40 mt-1'>
                    Add your Gemini API key to power your assistant
                  </p>
                </div>

                <a href="https://aistudio.google.com/app/apikey"
                  target='_blank'
                  rel='noopener noreferrer'
                  className='px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-emerald-500
                    text-white text-sm font-medium hover:scale-[1.02] transition-all cursor-pointer'>
                  Get API KEY
                </a>
              </div>

              <input type='password'
                placeholder='AIza....'
                onChange={(e) => setGeminiApiKey(e.target.value)}
                value={geminiApikey}
                className='w-full bg-white/5 border border-white/10 text-white placeholder-white/30
                  rounded-2xl px-4 py-3 outline-none focus:border-purple-400/50' />

              <p className='text-xs text-white/30 mt-3 leading-6'>
                Your API key is securely stored and only used for generating AI responses.
              </p>
            </div>

            <div className='bg-white/[0.03] border border-white/10 rounded-3xl p-6'>
              <div className='flex items-center justify-between mb-5 flex-wrap'>
                <div>
                  <h2 className='text-lg font-semibold text-white'>Navigation Pages</h2>
                  <p className='text-sm text-white/40'>Assistant can redirect users</p>
                </div>
                <button onClick={addPage} className='flex items-center gap-2 px-4 py-2
                  rounded-xl bg-gradient-to-r from-purple-500 to-emerald-500 text-white text-sm'>
                  <FiPlus /> Add
                </button>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                <input type='text' placeholder='Page Name'
                  className='bg-white/5 border border-white/10 text-white placeholder-white/30
                    rounded-2xl px-4 py-3 outline-none'
                  onChange={(e) => setPageName(e.target.value)}
                  value={pageName} />

                <input type='text' placeholder='/pricing'
                  className='bg-white/5 border border-white/10 text-white placeholder-white/30
                    rounded-2xl px-4 py-3 outline-none'
                  onChange={(e) => setPagePath(e.target.value)}
                  value={pagePath} />

                <input type='text' placeholder='Pricing, plan'
                  className='bg-white/5 border border-white/10 text-white placeholder-white/30
                    rounded-2xl px-4 py-3 outline-none'
                  onChange={(e) => setPageKeywords(e.target.value)}
                  value={pageKeywords} />
              </div>

              <div className='mt-5 space-y-3'>
                {pages.map((page, index) => (
                  <div key={index}
                    className='flex items-center justify-between border border-white/10 rounded-2xl p-4'>
                    <div>
                      <p className='font-medium text-white'>{page.name}</p>
                      <p className='text-sm text-white/40'>{page.path}</p>
                      <p className='text-sm text-white/40'>{page.keywords}</p>
                    </div>
                    <button onClick={() => removePage(index)} className='text-red-400 hover:text-red-300'>
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={saveAssistant} disabled={loading || !assistantName  ||
            !businessName || !businessType || !businessDescription || !geminiApikey}
              className='w-full h-14 rounded-2xl bg-gradient-to-r from-purple-500 to-emerald-500
                text-white font-semibold disabled:opacity-60  disabled:cursor-not-allowed
                shadow-[0_8px_24px_rgba(139,92,246,0.3)]
                hover:-translate-y-0.5 transition-all'>
              {loading ? "Saving..." : user?.isSetupComplete ? "Update Assistant" : "Save Assistant"}
            </button>

          </div>
        )}
      </div>
    </div>
  )
}

export default Builder