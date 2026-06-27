// 🔥 CORS Configuration ko dynamic banao
app.use((req, res, next) => {
  // Agar request assistant widget ke liye hai, toh origin dynamic allow karo
  if (req.path.startsWith('/api/assistant')) {
    const origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    return next();
  }
  
  // Dashboard aur baaki routes ke liye purana fixed CORS setup
  cors({
    origin: ["https://motoai.onrender.com"], 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })(req, res, next);
});