import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import styles from "./page.module.css";
import { AuthProvider } from "../contexts/AuthContext";
import AuthHeader from "../components/AuthHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E-com",
  description: "E-com: The best place to shop online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}` + " " + styles.landingBg}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Update cart count on page load
              function updateCartCount() {
                const cartCountElement = document.getElementById('cart-count');
                if (cartCountElement) {
                  const savedCart = localStorage.getItem('cart');
                  if (savedCart) {
                    const cart = JSON.parse(savedCart);
                    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
                    cartCountElement.textContent = totalItems.toString();
                  } else {
                    cartCountElement.textContent = '0';
                  }
                }
              }
              
              // Update on page load
              updateCartCount();
              
              // Also update when localStorage changes (for cross-tab sync)
              window.addEventListener('storage', updateCartCount);
            `
          }}
        />
        <AuthProvider>
          <header className={styles.banner}>
            <a href="/" className={styles.bannerTitle} style={{ textDecoration: 'none', color: '#ffd600', cursor: 'pointer' }}>E-com</a>
            <AuthHeader />
          </header>
          {children}
          <section className={styles.bottomInfoBar}>
            <div className={styles.infoColumns}>
              <div className={styles.infoColumn}>
                <div className={styles.infoTitle}>Order & Purchases</div>
                <a className={styles.infoLink} href="#">Check Order Status</a>
                <a className={styles.infoLink} href="#">Shipping, Delivery & Pickup</a>
                <a className={styles.infoLink} href="#">Returns & Exchanges</a>
                <a className={styles.infoLink} href="#">Price Match Guarantee</a>
                <a className={styles.infoLink} href="#">Product Recalls</a>
                <a className={styles.infoLink} href="#">Trade-In Program</a>
                <a className={styles.infoLink} href="#">Gift Cards</a>
                <a className={styles.infoLink} href="#">Payment Options</a>
                <a className={styles.infoLink} href="#">My E-com® Credit Card</a>
                <a className={styles.infoLink} href="#">Pay Your Bill at Citibank</a>
                <a className={styles.infoLink} href="#">Lease to Own</a>
                <a className={styles.infoLink} href="#">Buy Now, Pay Later</a>
              </div>
              <div className={styles.infoColumn}>
                <div className={styles.infoTitle}>Support & Services</div>
                <a className={styles.infoLink} href="#">Visit our Support Center</a>
                <a className={styles.infoLink} href="#">Shop with an Expert</a>
                <a className={styles.infoLink} href="#">Schedule a Service</a>
                <a className={styles.infoLink} href="#">Manage an Appointment</a>
                <a className={styles.infoLink} href="#">Protection & Support Plans</a>
                <a className={styles.infoLink} href="#">Haul Away & Recycling</a>
                <a className={styles.infoLink} href="#">Contact Us</a>
              </div>
              <div className={styles.infoColumn}>
                <div className={styles.infoTitle}>Rewards & Membership</div>
                <a className={styles.infoLink} href="#">My E-com Memberships</a>
                <a className={styles.infoLink} href="#">View Points & Certificates</a>
                <a className={styles.infoLink} href="#">Member Offers</a>
              </div>
              <div className={styles.infoColumn}>
                <div className={styles.infoTitle}>Partnerships</div>
                <a className={styles.infoLink} href="#">Sell on E-com Marketplace</a>
                <a className={styles.infoLink} href="#">Advertise with Us</a>
                <a className={styles.infoLink} href="#">Affiliates: Creators & Publishers</a>
                <a className={styles.infoLink} href="#">E-com Health</a>
                <a className={styles.infoLink} href="#">E-com Education</a>
                <a className={styles.infoLink} href="#">E-com Business</a>
                <a className={styles.infoLink} href="#">Partner+</a>
              </div>
              <div className={styles.infoColumn}>
                <div className={styles.infoTitle}>About E-com</div>
                <a className={styles.infoLink} href="#">Corporate Information</a>
                <a className={styles.infoLink} href="#">Careers</a>
                <a className={styles.infoLink} href="#">Corporate Responsibility</a>
                <a className={styles.infoLink} href="#">Sustainability</a>
                <a className={styles.infoLink} href="#">Accessibility Survey</a>
                <a className={styles.infoLink} href="#">Sign in or Create Account</a>
              </div>
              <div className={styles.infoColumn}>
                <div className={styles.infoTitle}>Get the latest deals and more.</div>
                <form className={styles.newsletterSignup}>
                  <input type="email" placeholder="Enter email address" required />
                  <button type="submit">Sign Up</button>
                </form>
                <div style={{marginTop: 12, fontSize: '0.97rem'}}>
                  <span>E-com app <a href="#" style={{color:'#ffd600', textDecoration:'underline'}}>Learn more ›</a></span>
                  <span style={{marginTop: 8, display:'block'}}>Share on
                    <a href="#" style={{marginLeft:8, color:'#fff'}}>YouTube</a>
                    <a href="#" style={{marginLeft:8, color:'#fff'}}>Instagram</a>
                    <a href="#" style={{marginLeft:8, color:'#fff'}}>TikTok</a>
                    <a href="#" style={{marginLeft:8, color:'#fff'}}>Facebook</a>
                    <a href="#" style={{marginLeft:8, color:'#fff'}}>Pinterest</a>
                    <a href="#" style={{marginLeft:8, color:'#fff'}}>Twitter</a>
                  </span>
                </div>
                <div style={{marginTop: 12}}>
                  <a href="#" style={{color:'#ffd600', textDecoration:'underline'}}>Give feedback about our website</a>
                </div>
              </div>
            </div>
            <div className={styles.infoBottomLegal}>
              Mobile Site | E-com Canada | Accessibility | Terms & Conditions | Privacy | Interest-Based Ads | State Privacy Rights | Health Data Privacy | Do Not Sell/Share My Personal Information | Limit Use of My Sensitive Personal Information | Targeted Advertising Opt Out | CA Supply Chain Transparency Act<br/>
              In-store pricing may vary. Prices and offers are subject to change. © 2025 E-com. All rights reserved. E-COM, the E-COM logo, the tag design, and MY E-COM are trademarks of E-com and its affiliated companies.
            </div>
          </section>
        </AuthProvider>
      </body>
    </html>
  );
}
