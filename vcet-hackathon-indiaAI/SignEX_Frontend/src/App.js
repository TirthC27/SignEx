import React, { useState } from 'react';
import './App.css';
import VideoConference from './components/VideoConference';
import JoinRoom from './components/JoinRoom';

function App() {
  const [roomData, setRoomData] = useState(null);

  const handleJoinRoom = (roomID, userName) => {
    setRoomData({ roomID, userName });
  };

  const handleLeaveRoom = () => {
    setRoomData(null);
  };

  return (
    <div className="App">
      {!roomData ? (
        <JoinRoom onJoinRoom={handleJoinRoom} />
      ) : (
        <VideoConference 
          roomID={roomData.roomID}
          userName={roomData.userName}
          onLeaveRoom={handleLeaveRoom}
        />
      )}
    </div>
  );
}

export default App;
