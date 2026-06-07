import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended page from location state, or default to root "/"
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(false);

    if (!username || !password) {
      setError('لطفا نام کاربری و رمز عبور را وارد کنید.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8089/api/auth/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Customize Persian messages based on API status codes
        if (response.status === 401) {
          throw new Error('نام کاربری یا رمز عبور اشتباه است.');
        } else if (response.status === 403) {
          throw new Error('شما دسترسی ورود به این بخش را ندارید.');
        } else {
          throw new Error(data.message || 'خطایی در برقراری ارتباط رخ داد.');
        }
      }

      // Expected response structure: { token, user, role }
      // Adapt keys according to your exact backend API response format
      login(data.token || data.accessToken, data.user, data.role);
      
      // Redirect to the intended page
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'اتصال به سرور برقرار نشد. لطفا دوباره تلاش کنید.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>ورود به سیستم</h2>
        
        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.inputGroup}>
          <label style={styles.label}>نام کاربری</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            disabled={isLoading}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>رمز عبور</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            disabled={isLoading}
          />
        </div>

        <button type="submit" style={styles.button} disabled={isLoading}>
          {isLoading ? 'در حال ارسال...' : 'ورود'}
        </button>
      </form>
    </div>
  );
};

// Simple embedded RTL styles for the login layout
const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', direction: 'rtl', fontFamily: 'Tahoma, sans-serif' },
  form: { padding: '2rem', border: '1px solid #ccc', borderRadius: '8px', width: '320px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  title: { textAlign: 'center', marginBottom: '1.5rem' },
  error: { color: 'red', backgroundColor: '#ffe6e6', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.85rem' },
  inputGroup: { marginBottom: '1rem', display: 'flex', flexDirection: 'column' },
  label: { marginBottom: '0.5rem', fontSize: '0.9rem' },
  input: { padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', direction: 'ltr' },
  button: { width: '100%', padding: '0.75rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default Login;
