"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

// TODO: Replace with your actual n8n webhook URL
const N8N_API_URL = "http://localhost:5678/webhook/search-products";

export default function Home() {
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Slideshow logic
  const images = [
    "/Laptop-bg.png",
    "/furniture-bg.png",
    "/sports-bg.png"
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % images.length);
    }, 7000); // 7s per image
    return () => clearInterval(interval);
  }, [images.length]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) {
      setError("Please enter a search term.");
      return;
    }
    setError("");
    router.push(`/search?q=${encodeURIComponent(search)}&page=1`);
  };

  return (
    <div style={{position: 'relative', width: '100%', flex: 1, minHeight: '100vh', background: '#fff'}}>
      <div className={styles.backgroundSlideshow}>
        {images.map((img, idx) => (
          <div
            key={img}
            className={styles.backgroundSlide}
            style={{
              backgroundImage: `url(${img})`,
              opacity: idx === current ? 1 : 0,
              zIndex: idx === current ? 1 : 0,
            }}
            data-active={idx === current}
          />
        ))}
      </div>
      <main className={styles.centerMain}>
        <form className={styles.centerSearchBar} onSubmit={handleSearch} autoComplete="off">
          <input
            type="text"
            placeholder="Search for the product"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={styles.centerSearchInput}
            required
          />
          <button type="submit" className={styles.centerSearchButton} aria-label="Search">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="2" />
              <line x1="15.2" y1="15.2" x2="20" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </form>
        {error && <div className={styles.error}>{error}</div>}
      </main>
    </div>
  );
}
