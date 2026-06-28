// 🔄 Bulletproof CORS Middleware for both Dashboard and Assistant
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = ["https://motoai.onrender.com"];

  // 1. Agar request Assistant widget se aa rahi hai (/api/assistant)
  if (req.path.startsWith('/api/assistant')) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    return next();
  }
  
  // 2. Dashboard ke liye safe configuration (Fixes 401 Unauthorized)
  if (allowedOrigins.includes(origin) || !origin) {
    res.setHeader('Access-Control-Allow-Origin', origin || 'https://motoai.onrender.com');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-requested-with');
  }

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  return next();
});