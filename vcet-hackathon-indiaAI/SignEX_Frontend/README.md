# Video Conference App with ZegoCloud

A modern, minimalistic video conferencing application built with React and ZegoCloud SDK.

## Features

- 🎥 High-quality video calls
- 🎤 Audio controls (mute/unmute)
- 📹 Camera controls (on/off)
- 💬 Real-time text chat
- 📱 Screen sharing
- 👥 Participant management
- 🔗 Shareable meeting links
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- ZegoCloud account

### ZegoCloud Setup

1. **Create a ZegoCloud Account**:
   - Visit [ZegoCloud Console](https://console.zegocloud.com/)
   - Sign up for a free account
   - Create a new project

2. **Get Your Credentials**:
   - After creating a project, you'll receive:
     - `App ID` (numeric)
     - `Server Secret` (string)

3. **Update Configuration**:
   - Open `src/components/VideoConference.js`
   - Replace the following values with your actual credentials:
     ```javascript
     const appID = 1484647939; // Replace with your App ID
     const serverSecret = "a4b867c42f61ce51db8970bb27aab14b"; // Replace with your Server Secret
     ```

### Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Development Server with HTTPS**:
   ```bash
   npm start
   ```
   This will start the server with HTTPS enabled, which is required for WebRTC to work on other devices.

3. **Open Your Browser**:
   - Navigate to `https://localhost:3000`
   - Accept the self-signed certificate warning (this is normal for development)
   - The app should load and display the join room interface

4. **Access from Other Devices**:
   - Find your computer's local IP address:
     ```bash
     npm run get-ip
     ```
   - On other devices, navigate to the displayed HTTPS URL (e.g., `https://192.168.22.201:3000`)
   - Accept the certificate warning on each device
   - Now other devices can join the same video conference room!

## Usage

1. **Join a Meeting**:
   - Enter a room ID (or generate a random one)
   - Enter your name
   - Click "Join Meeting"

2. **Meeting Controls**:
   - Camera on/off
   - Microphone mute/unmute
   - Screen sharing
   - Text chat
   - Participant list
   - Leave meeting

3. **Invite Others**:
   - Share the room ID with others
   - They can join using the same room ID

## Project Structure

```
src/
├── components/
│   ├── JoinRoom.js          # Landing page with room join form
│   └── VideoConference.js   # Main video conference component
├── App.js                   # Main application component
├── App.css                  # Application styles
├── index.js                 # React entry point
└── index.css                # Global styles
```

## Customization

### Styling
The app uses a minimalistic design with soft colors. You can modify the styles in:
- `src/App.css` - Main component styles
- `src/index.css` - Global styles

### ZegoCloud Configuration
In `src/components/VideoConference.js`, you can customize:
- Maximum number of users
- Default camera/microphone settings
- UI layout options
- Available features

## Security Note

⚠️ **Important**: In a production environment, never expose your Server Secret in client-side code. The current implementation is for development/testing purposes only. In production, you should:

1. Create a backend service to generate Kit Tokens
2. Call your backend from the frontend to get tokens
3. Keep your Server Secret secure on the backend

## Troubleshooting

### Common Issues

1. **"webrtc requires https or localhost" error**: 
   - This happens when accessing the app from other devices via HTTP
   - **Solution**: Use `npm start` (which enables HTTPS) instead of `npm start-http`
   - Access the app via `https://YOUR_IP:3000` from other devices
   - Accept the self-signed certificate warning on each device

2. **Certificate warnings on other devices**:
   - This is normal for development with self-signed certificates
   - Click "Advanced" → "Proceed to [IP] (unsafe)" or similar option
   - For production, use a proper SSL certificate

3. **"No versions available" error**: 
   - Make sure you have a stable internet connection
   - Try clearing npm cache: `npm cache clean --force`

4. **Camera/Microphone not working**:
   - Ensure your browser has camera/microphone permissions
   - Make sure you're using HTTPS (required for WebRTC)
   - Try refreshing the page and re-granting permissions

5. **Users can't see each other**:
   - Verify both users are using the same Room ID
   - Check your ZegoCloud credentials are correct
   - Ensure both devices are accessing via HTTPS

## Browser Support

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## License

This project is licensed under the MIT License.
