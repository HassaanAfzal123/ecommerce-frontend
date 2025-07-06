"use client";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup, signupWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    if (!email || !password || !confirmPassword) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const success = await signup(email, password);
      if (success) {
        router.push('/');
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);
    
    try {
      const success = await signupWithGoogle();
      if (success) {
        router.push('/');
      } else {
        setError("Google signup failed. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 400, margin: "40px auto", padding: "32px", background: "#fff", borderRadius: 12, boxShadow: "0 2px 16px rgba(37,99,235,0.08)" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#2563eb", marginBottom: 24 }}>Sign Up</h1>
      <button
        onClick={handleGoogleSignup}
        disabled={loading}
        style={{
          width: '100%',
          background: loading ? '#f3f4f6' : '#fff',
          color: loading ? '#9ca3af' : '#222',
          border: '1px solid #2563eb',
          borderRadius: 8,
          padding: '12px 0',
          fontWeight: 600,
          fontSize: '1rem',
          marginBottom: 18,
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10
        }}
      >
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: 22, height: 22 }} />
        {loading ? 'Signing up...' : 'Sign up with Google'}
      </button>
      <div style={{ textAlign: 'center', color: '#888', marginBottom: 18 }}>or sign up with email</div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: 12, 
            marginBottom: 14, 
            borderRadius: 8, 
            border: '1px solid #e5e7eb', 
            fontSize: '1rem',
            background: loading ? '#f3f4f6' : '#fff',
            color: '#222',
            outline: 'none'
          }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: 12, 
            marginBottom: 14, 
            borderRadius: 8, 
            border: '1px solid #e5e7eb', 
            fontSize: '1rem',
            background: loading ? '#f3f4f6' : '#fff',
            color: '#222',
            outline: 'none'
          }}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: 12, 
            marginBottom: 18, 
            borderRadius: 8, 
            border: '1px solid #e5e7eb', 
            fontSize: '1rem',
            background: loading ? '#f3f4f6' : '#fff',
            color: '#222',
            outline: 'none'
          }}
          required
        />
        {error && <div style={{ color: '#d32f2f', marginBottom: 12 }}>{error}</div>}
        <button
          type="submit"
          disabled={loading}
          style={{ 
            width: '100%', 
            background: loading ? '#9ca3af' : '#2563eb', 
            color: '#fff', 
            border: 'none', 
            borderRadius: 8, 
            padding: '12px 0', 
            fontWeight: 700, 
            fontSize: '1rem', 
            cursor: loading ? 'not-allowed' : 'pointer' 
          }}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      <div style={{ marginTop: 18, textAlign: 'center', color: '#666' }}>
        Already have an account? <a href="/login" style={{ color: '#2563eb', textDecoration: 'underline' }}>Log in</a>
      </div>
    </main>
  );
} 