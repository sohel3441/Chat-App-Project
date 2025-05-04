// components/Login.jsx
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const Login = () => {
  const handleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;

      const res = await axios.post('http://localhost:5000/api/auth/google-login', {
        token,
      });

      console.log('Login success:', res.data);

      // You can now store user or token in localStorage/context
      localStorage.setItem('user', JSON.stringify(res.data.user));

    } catch (err) {
      console.error('Login error', err);
    }
  };

  return (
    <div>
      <h2>Login with Google</h2>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log('Google Login Failed')}
      />
    </div>
  );
};

export default Login;
