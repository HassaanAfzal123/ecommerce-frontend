"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import styles from "../page.module.css";

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  thumbnail?: string;
}

export default function CartPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    // Update cart count in header
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      cartCountElement.textContent = totalItems.toString();
    }
  }, [cart]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.id !== id));
    } else {
      setCart(cart.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeItem = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <main style={{ maxWidth: 800, margin: "40px auto", padding: "32px", textAlign: "center" }}>
        <div>Loading...</div>
      </main>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <main style={{ maxWidth: 800, margin: "40px auto", padding: "32px" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 24, color: "#222" }}>Your Cart</h1>
      
      {cart.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🛒</div>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "12px", color: "#666" }}>Your cart is empty</h2>
          <p style={{ color: "#888", marginBottom: "24px" }}>Add some items to get started!</p>
          <button
            onClick={() => router.push('/')}
            style={{
              background: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: "24px" }}>
            {cart.map(item => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "16px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  marginBottom: "12px",
                  background: "#fff"
                }}
              >
                {item.thumbnail && (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    style={{ width: "60px", height: "60px", borderRadius: "4px", marginRight: "16px" }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0 0 4px 0", fontSize: "1.1rem", color: "#222" }}>{item.title}</h3>
                  <p style={{ margin: "0", color: "#666", fontSize: "0.9rem" }}>${item.price}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginRight: "16px" }}>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    style={{
                      background: "#f3f4f6",
                      border: "none",
                      borderRadius: "4px",
                      width: "32px",
                      height: "32px",
                      cursor: "pointer",
                      fontSize: "1.2rem"
                    }}
                  >
                    -
                  </button>
                  <span style={{ minWidth: "40px", textAlign: "center", fontWeight: "600" }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    style={{
                      background: "#f3f4f6",
                      border: "none",
                      borderRadius: "4px",
                      width: "32px",
                      height: "32px",
                      cursor: "pointer",
                      fontSize: "1.2rem"
                    }}
                  >
                    +
                  </button>
                </div>
                <div style={{ textAlign: "right", marginRight: "16px" }}>
                  <p style={{ margin: "0", fontWeight: "600", color: "#222" }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  style={{
                    background: "#fee2e2",
                    color: "#dc2626",
                    border: "none",
                    borderRadius: "4px",
                    padding: "8px 12px",
                    cursor: "pointer",
                    fontSize: "0.9rem"
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          <div style={{
            borderTop: "2px solid #e5e7eb",
            paddingTop: "24px",
            marginTop: "24px"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px"
            }}>
              <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#222" }}>Total:</h2>
              <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "700", color: "#2563eb" }}>
                ${getTotalPrice().toFixed(2)}
              </h2>
            </div>
            
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => router.push('/')}
                style={{
                  background: "#f3f4f6",
                  color: "#374151",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  cursor: "pointer"
                }}
              >
                Continue Shopping
              </button>
              <button
                onClick={() => router.push('/checkout')}
                style={{
                  background: "#16a34a",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
} 