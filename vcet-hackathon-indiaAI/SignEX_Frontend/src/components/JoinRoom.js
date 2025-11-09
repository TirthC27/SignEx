import React, { useState } from 'react';
import { generateRoomID } from '../config/zegoConfig';

const JoinRoom = ({ onJoinRoom }) => {
  const [roomID, setRoomID] = useState('');
  const [userName, setUserName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomID.trim() && userName.trim()) {
      onJoinRoom(roomID.trim(), userName.trim());
    }
  };

  const generateRandomRoomID = () => {
    const randomID = generateRoomID();
    setRoomID(randomID);
  };

  return (
    <div className="join-container">
      <h1>Video Conference</h1>
      <h2>Join a Meeting</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="roomID">Room ID</label>
          <input
            type="text"
            id="roomID"
            value={roomID}
            onChange={(e) => setRoomID(e.target.value)}
            placeholder="Enter room ID or generate one"
            required
          />
          <button 
            type="button" 
            onClick={generateRandomRoomID}
            style={{
              marginTop: '0.5rem',
              padding: '0.5rem 1rem',
              background: '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Generate Random ID
          </button>
        </div>
        
        <div className="form-group">
          <label htmlFor="userName">Your Name</label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="join-button"
          disabled={!roomID.trim() || !userName.trim()}
        >
          Join Meeting
        </button>
      </form>
    </div>
  );
};

export default JoinRoom;
