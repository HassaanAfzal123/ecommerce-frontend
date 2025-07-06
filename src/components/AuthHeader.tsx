"use client";
import { useAuth } from "../contexts/AuthContext";
import styles from "../app/page.module.css";

export default function AuthHeader() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className={styles.navLinks}>
        <div className={styles.navLink}>Loading...</div>
      </div>
    );
  }

  if (user) {
    return (
      <div className={styles.navLinks}>
        <a href="/" className={styles.navLink}>Home</a>
        <a href="/about" className={styles.navLink}>About</a>
        <a href="/cart" className={styles.navLink} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8m-8 0a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span id="cart-count" style={{ fontSize: '0.8rem', background: '#ffd600', color: '#000', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>0</span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={styles.navLink} style={{ color: '#ffd600', fontSize: '0.9rem' }}>
            Hi, {user.name || user.email.split('@')[0]}!
          </span>
          <button
            onClick={logout}
            className={styles.navLink}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              color: '#fff',
              fontWeight: '600',
              fontSize: '1.08rem',
              padding: '8px 0'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.navLinks}>
      <a href="/" className={styles.navLink}>Home</a>
      <a href="/about" className={styles.navLink}>About</a>
      <a href="/signup" className={styles.navLink}>Sign Up</a>
      <a href="/login" className={styles.navLink}>Login</a>
    </div>
  );
} 