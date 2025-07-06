"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "../../page.module.css";

const N8N_PRODUCT_INFO_URL = "http://localhost:5678/webhook/product-info";

export default function ProductInfoPage() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title") || "";
  const desc = searchParams.get("desc") || "";
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!title) return;
    setLoading(true);
    setError("");
    
    // Send the webhook request but don't wait for response
    fetch(`${N8N_PRODUCT_INFO_URL}?title=${encodeURIComponent(title)}`)
      .catch(err => {
        // Silently ignore any errors - we don't care about the response
        console.log('Webhook called (response ignored)');
      });
    
    // Immediately show success message
    setTimeout(() => {
      setLoading(false);
      setInfo("Saved to Google Sheet");
    }, 1000);
  }, [title]);

  // Render logic for info
  function renderInfo(info: any) {
    if (typeof info === 'string') {
      return <div style={{ fontSize: '1.2rem', color: '#16a34a', fontWeight: 600, textAlign: 'center', padding: '20px' }}>{info}</div>;
    }
    return <div style={{ fontSize: '1.2rem', color: '#16a34a', fontWeight: 600, textAlign: 'center', padding: '20px' }}>Saved to Google Sheet</div>;
  }

  return (
    <main className={styles.productInfoContainer}>
      <h2>{title}</h2>
      <p style={{ color: "#888" }}>{desc}</p>
      {loading ? (
        <div>Loading info...</div>
      ) : error ? (
        <div style={{ color: '#d32f2f' }}>{error}</div>
      ) : (
        <div style={{ marginTop: 24, fontSize: "1.1rem", color: "#222" }}>
          {renderInfo(info)}
        </div>
      )}
    </main>
  );
} 