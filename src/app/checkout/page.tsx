"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";

interface OrderItem {
  title: string;
  quantity: number;
  price: number;
}

interface CartItem {
  title: string;
  quantity: number;
  price: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    // Get cart data from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cartItems = JSON.parse(savedCart);
      const orderData = cartItems.map((item: CartItem) => ({
        title: item.title,
        quantity: item.quantity,
        price: item.price
      }));
      setOrderItems(orderData);
    }
  }, []);

  const getTotalPrice = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleBuy = async () => {
    setLoading(true);
    
    // Prepare data for webhook in the format: title1 quantity1, title2 quantity2, etc.
    const orderData = orderItems.map(item => `${item.title} ${item.quantity}`).join(', ');
    
    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      // Send to webhook and wait for response
      const response = await fetch('http://localhost:5678/webhook/product-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          order: orderData,
          total: getTotalPrice(),
          items: orderItems,
          mail: user?.email || 'unknown@example.com' // Include user email with key 'mail'
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        // Clear cart and show success
        localStorage.removeItem('cart');
        setOrderComplete(true);
        
        // Redirect to home page after 2 seconds
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        throw new Error(`Server error: ${response.status}`);
      }
    } catch (error: unknown) {
      console.error('Error submitting order:', error);
      
      let errorMessage = 'Failed to submit order. Please try again.';
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Request timed out. Please check your backend and try again.';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('Server error')) {
          errorMessage = 'Server error. Please try again later.';
        }
      }
      
      // Show error message to user (you can add a state for this)
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <main style={{ maxWidth: 600, margin: "40px auto", padding: "32px", textAlign: "center" }}>
        <div>Loading...</div>
      </main>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  if (orderComplete) {
    return (
      <main style={{ maxWidth: 600, margin: "40px auto", padding: "32px", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "16px" }}>✅</div>
        <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 16, color: "#16a34a" }}>
          Order Complete!
        </h2>
        <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: 32 }}>
          Your order has been submitted successfully. You will receive a confirmation shortly.
        </p>
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
          Continue Shopping
        </button>
      </main>
    );
  }

  if (orderItems.length === 0) {
    return (
      <main style={{ maxWidth: 600, margin: "40px auto", padding: "32px", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🛒</div>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "12px", color: "#666" }}>Your cart is empty</h2>
        <p style={{ color: "#888", marginBottom: "24px" }}>Add some items to checkout!</p>
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
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 800, margin: "40px auto", padding: "32px" }}>
      <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 24, color: "#222" }}>
        Checkout
      </h2>
      
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: "1.5rem", marginBottom: 16, color: "#333" }}>
          Order Summary
        </h3>
        
        {orderItems.map((item, index) => (
          <div key={index} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <div>
              <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{item.title}</div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>Quantity: {item.quantity}</div>
            </div>
            <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{
        borderTop: '2px solid #e5e7eb',
        paddingTop: '24px',
        marginBottom: '32px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#222'
        }}>
          <span>Total:</span>
          <span>${getTotalPrice().toFixed(2)}</span>
        </div>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={handleBuy}
          disabled={loading}
          style={{
            background: loading ? '#9ca3af' : '#16a34a',
            color: 'white',
            border: 'none',
            padding: '16px 32px',
            borderRadius: '8px',
            fontSize: '1.2rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            minWidth: '200px'
          }}
        >
          {loading ? 'Processing...' : 'Buy Now'}
        </button>
      </div>
      
      {/* Loading Screen */}
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '32px',
            borderRadius: '12px',
            textAlign: 'center',
            maxWidth: '400px'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
            <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>Processing Your Order</h3>
            <p style={{ margin: '0', color: '#666' }}>
              Please wait while we confirm your order with our backend...
            </p>
            <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#888' }}>
              This may take a few seconds
            </div>
          </div>
        </div>
      )}
      
      <div style={{ marginTop: '24px', padding: '16px', background: '#f3f4f6', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#374151' }}>Order Details for Webhook:</h4>
        <p style={{ margin: '0', fontSize: '0.9rem', color: '#6b7280', fontFamily: 'monospace' }}>
          {orderItems.map(item => `${item.title} ${item.quantity}`).join(', ')}
        </p>
      </div>
    </main>
  );
} 