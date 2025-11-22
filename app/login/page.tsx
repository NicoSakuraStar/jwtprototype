'use client';

import { useState } from 'react';
// Using inline styles for simplicity, but in a nicer app, Tailwind CSS or CSS Modules is used
// Note: Next.js 14 App Router features are used

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    const endpoint = isLoginMode ? '/api/login' : '/api/signup';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLoginMode) {
          // Success case for LOGIN
          setMessage('✅ logged in successfully');
          // In a real application, you would now redirect the user to a protected route (e.g., router.push('/dashboard'))
        } else {
          // Success case for SIGNUP
          setMessage('✅ Registration successful! Please switch to Login and try logging in.');
          // Automatically switch to login mode for convenience
          setIsLoginMode(true);
        }
      } else {
        // Error case (e.g., Invalid credentials, User already exists)
        setMessage(`❌ Error: ${data.message || 'An unknown error occurred.'}`);
      }
    } catch (error) {
      console.error('API call error:', error);
      setMessage('❌ Network error. Check server console.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>
        {isLoginMode ? 'User Login' : 'User Registration'}
      </h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        
        <label htmlFor="email" style={styles.label}>Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <label htmlFor="password" style={styles.label}>Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />

        <button type="submit" disabled={isLoading} style={styles.button}>
          {isLoading
            ? 'Processing...'
            : isLoginMode
            ? 'Log In'
            : 'Sign Up'}
        </button>

        <p style={styles.toggleText}>
          {isLoginMode ? "Don't have an account?" : "Already have an account?"}
          <span 
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setMessage(''); // Clear message on mode switch
            }}
            style={styles.toggleLink}
          >
            {isLoginMode ? ' Sign Up' : ' Log In'}
          </span>
        </p>

      </form>

      {message && (
        <p style={{ 
          ...styles.message, 
          color: message.startsWith('✅') ? 'green' : 'red' 
        }}>
          {message}
        </p>
      )}
    </div>
  );
}

// Simple styles object for aesthetic appeal
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '40px',
    maxWidth: '400px',
    margin: '80px auto',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    fontFamily: 'sans-serif',
  },
  header: {
    fontSize: '24px',
    marginBottom: '30px',
    textAlign: 'center',
    color: '#333',
    borderBottom: '2px solid #eee',
    paddingBottom: '10px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '5px',
    fontWeight: '600',
    color: '#555',
  },
  input: {
    marginBottom: '20px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '16px',
  },
  button: {
    padding: '12px 20px',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    opacity: 1,
    marginTop: '10px',
  },
  toggleText: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '14px',
    color: '#666',
  },
  toggleLink: {
    color: '#0070f3',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginLeft: '5px',
  },
  message: {
    marginTop: '20px',
    padding: '15px',
    borderRadius: '8px',
    fontWeight: 'bold',
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
  }
};