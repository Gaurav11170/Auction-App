// src/Profile.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError } from '../utils';
import './Profile.css'; // Create this CSS file

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchProfile = async () => {
      try {
        const response = await fetch('https://deploy-mern-app-1-api.vercel.app/profile', { // Replace with your profile API endpoint
          headers: {
            Authorization: token,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          handleError(errorData.message || 'Failed to fetch profile');
          return;
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        handleError(error.message || 'An error occurred');
      }
    };

    fetchProfile();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <div className="profile-info">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        {/* Add more profile details here */}
      </div>
      <button onClick={() => navigate('/')}>Go Home</button>
    </div>
  );
}

export default Profile;