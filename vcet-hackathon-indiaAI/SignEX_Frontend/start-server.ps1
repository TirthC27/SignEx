# SignEX Network Server Startup Script
# Run this script to start the server accessible from other devices

Write-Host ""
Write-Host "🚀 Starting SignEX Network Server..." -ForegroundColor Green
Write-Host ""

# Function to get local IP address
function Get-LocalIP {
    $networkAdapters = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { 
        $_.IPAddress -ne "127.0.0.1" -and 
        $_.PrefixOrigin -eq "Dhcp" -and
        $_.AddressState -eq "Preferred"
    }
    
    if ($networkAdapters) {
        return $networkAdapters[0].IPAddress
    }
    
    # Fallback method
    $ip = (Get-NetIPConfiguration | Where-Object { $_.IPv4DefaultGateway -ne $null }).IPv4Address.IPAddress
    if ($ip) {
        return $ip
    }
    
    return "localhost"
}

# Get the local IP
$localIP = Get-LocalIP
$port = 3000

# Display connection information
Write-Host "📱 Access your SignEX app from any device:" -ForegroundColor Cyan
Write-Host "   Local:    http://localhost:$port" -ForegroundColor White
Write-Host "   Network:  http://${localIP}:$port" -ForegroundColor Yellow
Write-Host ""
Write-Host "📋 Instructions for other devices:" -ForegroundColor Cyan
Write-Host "   1. Connect to the same WiFi network as this computer" -ForegroundColor White
Write-Host "   2. Open a web browser on your phone/tablet/computer" -ForegroundColor White
Write-Host "   3. Go to: http://${localIP}:$port" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔧 Troubleshooting:" -ForegroundColor Cyan
Write-Host "   - Ensure devices are on the same WiFi network" -ForegroundColor White
Write-Host "   - Allow Node.js through Windows Firewall if prompted" -ForegroundColor White
Write-Host "   - Try temporarily disabling antivirus if connection fails" -ForegroundColor White
Write-Host ""
Write-Host "💡 Press Ctrl+C to stop the server" -ForegroundColor Magenta
Write-Host "================================================================" -ForegroundColor Gray
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

# Check if npm packages are installed
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Add firewall rule (requires admin rights)
try {
    $firewallRule = Get-NetFirewallRule -DisplayName "SignEX Node.js Server" -ErrorAction SilentlyContinue
    if (!$firewallRule) {
        Write-Host "🔥 Adding Windows Firewall rule..." -ForegroundColor Yellow
        New-NetFirewallRule -DisplayName "SignEX Node.js Server" -Direction Inbound -Protocol TCP -LocalPort $port -Action Allow -ErrorAction SilentlyContinue
        Write-Host "✅ Firewall rule added" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Could not add firewall rule automatically" -ForegroundColor Yellow
    Write-Host "   You may need to allow Node.js manually if Windows prompts you" -ForegroundColor White
}

# Start the development server
try {
    Write-Host "🚀 Starting development server..." -ForegroundColor Green
    npm run dev:network
} catch {
    Write-Host ""
    Write-Host "❌ Failed to start server" -ForegroundColor Red
    Write-Host "Try running: npm run server" -ForegroundColor Yellow
}
