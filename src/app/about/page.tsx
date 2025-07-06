"use client";

export default function AboutPage() {
  return (
    <main style={{ maxWidth: 800, margin: "40px auto", padding: "32px", background: "#fff", borderRadius: 12, boxShadow: "0 2px 16px rgba(37,99,235,0.08)" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#2563eb", marginBottom: 24 }}>About E-com</h1>
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#222", marginBottom: 12 }}>Who We Are</h2>
        <p style={{ fontSize: "1.1rem", color: "#444" }}>
          E-com is a modern, customer-focused ecommerce platform dedicated to making online shopping easy, secure, and enjoyable. We bring together a wide range of products from trusted brands and sellers, all in one place, with a seamless and professional user experience.
        </p>
      </section>
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#222", marginBottom: 12 }}>Our Mission</h2>
        <p style={{ fontSize: "1.1rem", color: "#444" }}>
          Our mission is to empower shoppers with choice, transparency, and convenience. We believe in providing a platform where customers can discover great products, compare prices, and shop with confidence, knowing they are getting the best value and service.
        </p>
      </section>
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#222", marginBottom: 12 }}>Our Values</h2>
        <p style={{ fontSize: "1.1rem", color: "#444" }}>
          We are committed to customer satisfaction, product quality, and transparent pricing. Our platform is designed to make shopping accessible, secure, and enjoyable for everyone. We&apos;re constantly innovating to provide the best possible shopping experience.
        </p>
      </section>
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#222", marginBottom: 12 }}>Why Shop With Us?</h2>
        <ul style={{ fontSize: "1.1rem", color: "#444", paddingLeft: 24, marginBottom: 0 }}>
          <li>Vast selection of products across categories</li>
          <li>Professional, user-friendly interface</li>
          <li>Powerful search and smart recommendations</li>
          <li>Secure checkout and multiple payment options</li>
          <li>Fast, reliable shipping and easy returns</li>
          <li>Dedicated customer support</li>
        </ul>
      </section>
      <section>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#222", marginBottom: 12 }}>Contact Us</h2>
        <p style={{ fontSize: "1.1rem", color: "#444" }}>
          Have questions or feedback? We&apos;d love to hear from you. Our customer support team is here to help with any inquiries about our products, services, or platform.
        </p>
      </section>
    </main>
  );
} 