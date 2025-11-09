# 🌐 SignEX Network Server Setup

Access your SignEX web app from any device on the same network (phones, tablets, other computers).

## 🚀 Quick Start

### Option 1: Use the Startup Scripts (Recommended)

**Windows Users:**
```bash
# Double-click one of these files:
start-server.bat        # Simple batch file
start-server.ps1        # PowerShell script (more features)
```

**Or manually:**
```bash
npm run server          # Starts development server on network
```

### Option 2: Manual Commands

**Development Mode:**
```bash
npm run dev:network      # Development with hot reload
```

**Production Mode:**
```bash
npm run build           # Build the app first
npm run start:network   # Start production server
```

## 📱 Accessing from Other Devices

1. **Find Your Computer's IP Address:**
   - Windows: Run `ipconfig` in Command Prompt
   - Look for "IPv4 Address" (usually starts with 192.168.x.x or 10.x.x.x)

2. **Connect Other Devices:**
   - Ensure they're on the same WiFi network
   - Open browser and go to: `http://YOUR_IP_ADDRESS:3000`
   - Example: `http://192.168.1.100:3000`

3. **Example Access URLs:**
   ```
   Local Computer:  http://localhost:3000
   Phone/Tablet:    http://192.168.1.100:3000
   Other Computer:  http://192.168.1.100:3000
   ```

## 🔧 Troubleshooting

### Connection Issues

**Firewall Blocking Connection:**
- Windows may prompt to allow Node.js through firewall
- Click "Allow access" when prompted
- Or manually add exception in Windows Defender Firewall

**Still Can't Connect:**
1. **Check Network:**
   ```bash
   # On your computer, run:
   ipconfig
   
   # On other device, try to ping:
   ping YOUR_IP_ADDRESS
   ```

2. **Temporarily Disable Firewall:**
   - Windows: Turn off Windows Defender Firewall temporarily
   - Test connection, then re-enable firewall

3. **Check Antivirus:**
   - Some antivirus software blocks network connections
   - Add Node.js to whitelist or disable temporarily

### Common Issues

**"Cannot access from phone":**
- Ensure phone is on same WiFi (not mobile data)
- Check if your computer's IP changed
- Try restarting the server

**"Connection refused":**
- Verify the server is running
- Check if port 3000 is available
- Try a different port: `npm run dev:network -- -p 3001`

**"Slow loading":**
- Development mode is slower than production
- For better performance: `npm run build && npm run start:network`

## 🌍 Network Requirements

**Same Network:**
- All devices must be on the same WiFi network
- Corporate networks may block device-to-device communication
- Public WiFi (hotels, cafes) often blocks this

**IP Address:**
- Your computer gets an IP from your router (DHCP)
- IP may change when you restart computer/router
- For permanent setup, configure static IP in router

## 🔒 Security Notes

**Development Server:**
- Only use on trusted networks (home, office)
- Don't expose to public internet
- Development server is not production-ready

**Production Setup:**
- For public access, use proper hosting (Vercel, Netlify, etc.)
- Enable HTTPS for production
- Configure proper authentication

## 📋 Port Configuration

**Default Port:** 3000

**Custom Port:**
```bash
# Use different port
npm run dev:network -- -p 8080

# Access via: http://YOUR_IP:8080
```

**Port Already in Use:**
```bash
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process (Windows)
taskkill /PID <process_id> /F
```

## 🛠️ Advanced Configuration

### Environment Variables

Create `.env.local` file:
```env
# Custom hostname (optional)
HOSTNAME=0.0.0.0

# Custom port
PORT=3000

# Enable detailed logging
DEBUG=1
```

### Router Configuration

**Port Forwarding (External Access):**
1. Login to your router admin panel
2. Find "Port Forwarding" or "NAT"
3. Forward external port to your computer's IP:3000
4. Access from anywhere: `http://YOUR_PUBLIC_IP:EXTERNAL_PORT`

⚠️ **Warning:** Only do this if you understand security implications!

## 📱 Mobile Testing Tips

**Responsive Design:**
- SignEX is fully responsive
- Test all features on mobile devices
- Live captions work on mobile browsers

**Browser Compatibility:**
- Chrome: Full feature support
- Safari: Full feature support
- Firefox: Limited speech recognition
- Edge: Full feature support

**Performance:**
- Mobile devices may be slower
- Use WiFi for best experience
- Close other apps to free memory

## 💡 Pro Tips

1. **Bookmark the IP:** Save `http://YOUR_IP:3000` as bookmark on mobile
2. **QR Code:** Generate QR code for easy mobile access
3. **Multiple Devices:** Test video calls between devices
4. **Network Speed:** Use 5GHz WiFi for better performance
5. **Static IP:** Configure static IP in router for consistency

## 🆘 Getting Help

**Check Logs:**
```bash
# Server logs show connection attempts
npm run dev:network

# Look for messages like:
# "ready - started server on 0.0.0.0:3000"
# "- Local:    http://localhost:3000"
# "- Network:  http://192.168.1.100:3000"
```

**Test Connection:**
```bash
# From another device, test if server is reachable
curl http://YOUR_IP:3000

# Should return the HTML page
```

**Common Commands:**
```bash
# Restart server
Ctrl+C  # Stop server
npm run server  # Start again

# Check network adapters
ipconfig /all

# Flush DNS (if needed)
ipconfig /flushdns
```

---

**Need More Help?**
- Check the console output for error messages
- Ensure all devices are on the same network
- Try restarting your router if nothing works
