# 🔧 SignEX Server Troubleshooting Guide

## 🚨 Common Server Errors & Solutions

### **Error: "Cannot find module"**
```bash
# Solution: Install dependencies
npm install

# If that fails, try:
rm -rf node_modules package-lock.json
npm install
```

### **Error: "Port 3000 is already in use"**
```bash
# Find what's using the port
netstat -ano | findstr :3000

# Kill the process (Windows)
taskkill /PID <process_id> /F

# Or use a different port
npm run dev:network -- -p 3001
```

### **Error: "Permission denied" or "EACCES"**
```bash
# Windows: Run as Administrator
# Or change npm default directory:
npm config set prefix ~/npm-global
npm config set cache ~/npm-cache
```

### **Error: "Module not found" or Import errors**
```bash
# Check if you're in the right directory
pwd  # Should show SignEX_Frontend

# Reinstall dependencies
npm install

# Clear Next.js cache
rm -rf .next
npm run dev
```

## 🔍 Diagnostic Commands

### **Check Project Health:**
```bash
npm run check          # Run full diagnostic
npm run diagnose       # Same as above
```

### **Test Server Startup:**
```bash
npm run test-server    # Test server with diagnostics
```

### **Get Network Information:**
```bash
npm run ip             # Show your IP addresses
npm run network-info   # Detailed network info
```

## 🛠️ Step-by-Step Fix Process

### **1. Basic Health Check**
```bash
# Check if you're in the right directory
ls -la  # Should see package.json, app/, public/, etc.

# Check Node.js version
node --version  # Should be 18+ 

# Check npm version
npm --version
```

### **2. Install Dependencies**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# If npm install fails:
npm cache clean --force
npm install
```

### **3. Test Local Server First**
```bash
# Test local development first
npm run dev

# If this works, then try network:
npm run dev:network
```

### **4. Check for Missing Files**
```bash
# Essential files that must exist:
# - package.json
# - next.config.mjs
# - app/layout.tsx
# - app/globals.css
# - public/icons/logo.svg
```

## 🌐 Network-Specific Issues

### **"Cannot access from other devices"**

**Check Network Connection:**
```bash
# Get your IP address
npm run ip

# Test if port is open
telnet YOUR_IP 3000
```

**Windows Firewall:**
1. Open Windows Defender Firewall
2. Click "Allow an app through firewall"
3. Add Node.js or allow port 3000

**Router Issues:**
- Some routers block device-to-device communication
- Try connecting both devices to mobile hotspot
- Check if router has "AP Isolation" enabled (disable it)

### **"Connection refused"**
```bash
# Make sure server is running
npm run dev:network

# Check if binding to 0.0.0.0 worked
netstat -an | findstr :3000
```

## 📱 Mobile Access Issues

### **"Page won't load on phone"**
1. **Same WiFi:** Ensure phone and computer on same network
2. **Correct URL:** Use `http://IP:3000` not `https://`
3. **Browser:** Try Chrome or Safari (not Firefox for some features)
4. **Cache:** Clear browser cache on mobile

### **"Features don't work on mobile"**
- **Microphone:** Allow microphone permissions
- **Camera:** Allow camera permissions  
- **HTTPS:** Some features require HTTPS (use ngrok for testing)

## 🔧 Advanced Troubleshooting

### **Environment Variables**
Create `.env.local` file:
```env
# Optional: Custom hostname
HOSTNAME=0.0.0.0

# Optional: Custom port  
PORT=3000

# Clerk keys (if using authentication)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret

# Stream keys (if using video)
NEXT_PUBLIC_STREAM_API_KEY=your_key
STREAM_SECRET_KEY=your_secret
```

### **Next.js Cache Issues**
```bash
# Clear all caches
rm -rf .next
rm -rf node_modules/.cache
npm run dev
```

### **TypeScript Errors**
```bash
# Check for TypeScript issues
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

## 🚀 Alternative Startup Methods

### **Method 1: Direct Next.js**
```bash
npx next dev -H 0.0.0.0 -p 3000
```

### **Method 2: Custom Port**
```bash
npm run dev:network -- -p 8080
# Access via: http://YOUR_IP:8080
```

### **Method 3: Production Mode**
```bash
npm run build
npm run start:network
```

## 📊 Performance Issues

### **Slow Loading**
- Use production mode: `npm run build && npm run start:network`
- Check network speed (use 5GHz WiFi)
- Close other applications
- Use wired connection if possible

### **Memory Issues**
```bash
# Increase Node.js memory limit
node --max-old-space-size=4096 node_modules/.bin/next dev -H 0.0.0.0 -p 3000
```

## 🆘 Emergency Recovery

### **Complete Reset:**
```bash
# 1. Stop all Node processes
taskkill /f /im node.exe

# 2. Clean everything
rm -rf node_modules package-lock.json .next

# 3. Fresh install
npm install

# 4. Start fresh
npm run dev:network
```

### **If Nothing Works:**
1. **Restart computer**
2. **Check antivirus** (temporarily disable)
3. **Try different port:** `npm run dev:network -- -p 3001`
4. **Use local only:** `npm run dev` (localhost only)
5. **Check Windows updates**

## 📞 Getting Help

### **Check Logs:**
```bash
# Server logs show detailed errors
npm run dev:network

# Look for these error patterns:
# - "Module not found" → Missing dependencies
# - "Port in use" → Kill other processes
# - "Permission denied" → Run as admin
# - "Cannot bind" → Check firewall
```

### **Common Error Messages:**
- **"EADDRINUSE"** → Port 3000 is busy
- **"ENOENT"** → Missing file or directory
- **"EACCES"** → Permission denied
- **"MODULE_NOT_FOUND"** → Missing dependency

### **Quick Commands:**
```bash
# Health check
npm run check

# Test server
npm run test-server

# Get IP
npm run ip

# Start server
npm run server
```

---

**Still having issues?** 
1. Run `npm run check` and share the output
2. Check the console for specific error messages
3. Try the emergency recovery steps above
4. Make sure you're in the correct project directory
