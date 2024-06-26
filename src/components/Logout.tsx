import React from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import styles from '../styles/User.module.css'

const Logout = () => {
  const navigate = useNavigate(); 

  const handleLogout = async () => {
    try {
      await signOut(auth); 
      window.location.reload(); 
      navigate('/login'); 
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <a className={styles.logout} href="#" onClick={handleLogout}>Logout</a>
  );
}

export default Logout;
