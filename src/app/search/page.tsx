"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import styles from "../page.module.css";

const N8N_API_URL = "http://localhost:5678/webhook/search-products";
const PAGE_SIZE = 20;

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  thumbnail?: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [authMessage, setAuthMessage] = useState("");

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes and update header count
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    // Update cart count in header immediately
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      cartCountElement.textContent = totalItems.toString();
    }
  }, [cart]);

  // Update cart count on page load
  useEffect(() => {
    const updateCartCount = () => {
      const cartCountElement = document.getElementById('cart-count');
      if (cartCountElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems.toString();
      }
    };
    
    // Update immediately
    updateCartCount();
    
    // Also update after a short delay to ensure DOM is ready
    setTimeout(updateCartCount, 100);
  }, [cart]);

  const addToCart = (product: any) => {
    if (!user) {
      setAuthMessage("Please log in to add items to your cart.");
      setTimeout(() => setAuthMessage(""), 3000);
      return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: 1,
        thumbnail: product.thumbnail
      }]);
    }
    
    // Show success message
    setAuthMessage("Item added to cart!");
    setTimeout(() => setAuthMessage(""), 2000);
  };

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setError("");
    setProducts([]);
    setWarnings([]);
    
    fetch(`${N8N_API_URL}?q=${encodeURIComponent(query)}`)
      .then(res => {
        // Check if response has content before parsing
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }
        
        // Clone the response to check if it has content
        return res.clone().text().then(text => {
          if (!text || text.trim() === '') {
            throw new Error('Empty response');
          }
          try {
            const data = JSON.parse(text);
            return { ok: res.ok, data };
          } catch (parseError) {
            console.error('JSON parse error:', parseError, 'Response text:', text);
            throw new Error('Invalid JSON response');
          }
        });
      })
      .then(({ ok, data }) => {
        // Support both: array of products, or array with a single object with 'products' property
        let productsArr: any[] = [];
        let warningsArr: string[] = [];
        
        if (Array.isArray(data)) {
          if (data.length > 0 && data[0].products) {
            // Old n8n format: [{ products: [...] }]
            productsArr = data[0].products;
            warningsArr = data[0].warnings || [];
          } else {
            // New format: [ {...}, {...}, ... ]
            productsArr = data;
          }
        } else if (data && data.products) {
          productsArr = data.products;
          warningsArr = data.warnings || [];
        }
        
        setProducts(productsArr);
        setTotal(productsArr.length);
        setWarnings(warningsArr);
        
        // Only show error if we got no products AND the response was not ok
        if (productsArr.length === 0 && !ok) {
          setError("Error fetching products. Please try again.");
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        // Only show error if we have no products to display
        if (products.length === 0) {
          setError("Error fetching products. Please try again.");
        }
      })
      .finally(() => setLoading(false));
  }, [query]);

  // Pagination logic
  const startIdx = (page - 1) * PAGE_SIZE;
  const endIdx = startIdx + PAGE_SIZE;
  const paginatedProducts = products.slice(startIdx, endIdx);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const goToPage = (newPage: number) => {
    router.push(`/search?q=${encodeURIComponent(query)}&page=${newPage}`);
  };

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 0" }}>
      <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 24, color: "#222" }}>
        Search results for <span style={{ color: "#2563eb" }}>&quot;{query}&quot;</span>
      </h2>
      
      {/* Authentication status */}
      {!user && (
        <div style={{ 
          background: '#fff3cd', 
          border: '1px solid #ffeaa7', 
          borderRadius: '8px', 
          padding: '12px 16px', 
          marginBottom: '16px',
          color: '#856404',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>⚠️</span>
          <span>Please <a href="/login" style={{ color: '#2563eb', textDecoration: 'underline' }}>log in</a> to add items to your cart.</span>
        </div>
      )}
      
      {/* Auth message */}
      {authMessage && (
        <div style={{ 
          background: authMessage.includes('added') ? '#d4edda' : '#f8d7da', 
          border: `1px solid ${authMessage.includes('added') ? '#c3e6cb' : '#f5c6cb'}`, 
          borderRadius: '8px', 
          padding: '12px 16px', 
          marginBottom: '16px',
          color: authMessage.includes('added') ? '#155724' : '#721c24'
        }}>
          {authMessage}
        </div>
      )}
      
      {warnings.length > 0 && (
        <div style={{ color: '#d32f2f', marginBottom: 16 }}>
          {warnings.map((w, i) => <div key={i}>{w}</div>)}
        </div>
      )}
      {loading && <div>Loading...</div>}
      {error && <div className={styles.error}>{error}</div>}
      {!loading && !error && paginatedProducts.length === 0 && (
        <div className={styles.emptyState}>No products found for your search.</div>
      )}
      <section className={styles.productGrid} style={{ marginTop: 24 }}>
        {paginatedProducts.map(product => {
          console.log('Product card:', product); // Debug: log each product
          return (
            <div key={product.id} className={styles.productCard}>
              {product.thumbnail ? (
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  style={{ width: '120px', borderRadius: '8px', marginBottom: 8 }}
                />
              ) : (
                <div style={{ width: '120px', height: '120px', borderRadius: '8px', marginBottom: 8, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 32 }}>
                  ?
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0 }}>{product.title}</h3>
                <button
                  onClick={() => addToCart(product)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: user ? 'pointer' : 'not-allowed', 
                    marginLeft: 8,
                    opacity: user ? 1 : 0.5
                  }}
                  title={user ? "Add to cart" : "Please log in to add to cart"}
                  aria-label="Add to cart"
                >
                  {/* Cart icon SVG */}
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8m-8 0a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              <p style={{ color: "#444", fontSize: "0.98rem", margin: "8px 0" }}>{product.description}</p>
              <p><b>Price:</b> ${product.price}</p>
              <p><b>Rating:</b> {product.rating}</p>
              <p style={{ fontSize: "0.9rem", color: product.availabilityStatus === "In Stock" ? "#16a34a" : "#d32f2f" }}>
                {product.availabilityStatus}
              </p>
            </div>
          );
        })}
      </section>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className={styles.paginationBar}>
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: page === 1 ? "#e5e7eb" : "#2563eb", color: page === 1 ? "#888" : "#fff", fontWeight: 600, cursor: page === 1 ? "not-allowed" : "pointer" }}
          >
            Previous
          </button>
          <span className={styles.paginationPage}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: page === totalPages ? "#e5e7eb" : "#2563eb", color: page === totalPages ? "#888" : "#fff", fontWeight: 600, cursor: page === totalPages ? "not-allowed" : "pointer" }}
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
} 