// src/components/auth/AuthPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import './auth.css';

const POLICY_IDS = ['terms','privacy','refund','cancellation','shipping'];
const POLICY_LABELS = {
  terms: 'Terms & Conditions', privacy: 'Privacy Policy',
  refund: 'Refund Policy', cancellation: 'Cancellation Policy', shipping: 'Shipping Policy',
};

// ── Top Navigation Bar ────────────────────────────────────────────────────────
function NavBar({ activePage, setPage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);

  const mainLinks = [
    { id: 'home',         label: 'Home' },
    { id: 'about',        label: 'About Us' },
    { id: 'subscription', label: 'Subscription' },
    { id: 'contact',      label: 'Contact' },
  ];

  const nav = (id) => { setPage(id); setMenuOpen(false); setPolicyOpen(false); };
  const isPolicyActive = POLICY_IDS.includes(activePage);

  return (
    <nav className="auth-navbar">
      <div className="auth-navbar-inner">
        <div className="auth-navbar-brand" onClick={() => nav('home')}>
          soc<span>.ai.in</span>
        </div>

        <div className={`auth-navbar-links${menuOpen ? ' open' : ''}`}>
          {mainLinks.map(l => (
            <button key={l.id}
              className={`auth-nav-link${activePage === l.id ? ' active' : ''}`}
              onClick={() => nav(l.id)}
            >{l.label}</button>
          ))}

          {/* Policies dropdown */}
          <div className="auth-nav-dropdown">
            <button
              className={`auth-nav-link auth-nav-dropdown-btn${isPolicyActive ? ' active' : ''}`}
              onClick={() => setPolicyOpen(p => !p)}
            >Policies ▾</button>
            {policyOpen && (
              <div className="auth-nav-dropdown-menu">
                {POLICY_IDS.map(id => (
                  <button key={id}
                    className={`auth-nav-dropdown-item${activePage === id ? ' active' : ''}`}
                    onClick={() => nav(id)}
                  >{POLICY_LABELS[id]}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button className="auth-nav-hamburger" onClick={() => setMenuOpen(p => !p)}>
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}

// ── About Us Page ─────────────────────────────────────────────────────────────
function AboutPage() {
  return (
    <div className="auth-page-wrap">
      <div className="policy-card">
        <div className="policy-title">About Us</div>
        <div className="policy-updated">soc.ai.in — AI-Powered Option Chain &amp; Trading Analytics Platform</div>

        <div className="policy-section">
          <div className="policy-section-title">Who We Are</div>
          <p>This website is operated by <strong>Rajan Kushwaha</strong>, trading under the name <strong>soc.ai.in</strong>. We are an independent fintech platform based in Gopalganj, Bihar, India, dedicated to empowering retail traders with professional-grade market analysis tools.</p>
          <p>SOC stands for <strong>Simplify Option Chain</strong> — our core mission is to make complex options data accessible, actionable, and understandable for every trader, from beginners to seasoned professionals.</p>
        </div>

        <div className="policy-section">
          <div className="policy-section-title">What We Offer</div>
          <p>soc.ai.in provides a suite of AI-enhanced tools designed for Indian equity and derivatives traders:</p>
          <ul>
            <li><strong>Live Option Chain:</strong> Real-time OI, Volume, LTP, and Greeks — all in one view via WebSocket</li>
            <li><strong>AI Auto Analysis:</strong> Automated market analysis updated every minute during trading hours</li>
            <li><strong>Bromos &amp; MCTR Trade Signals:</strong> OI-based Support &amp; Resistance strategy signals</li>
            <li><strong>Scalp &amp; Positional Setups:</strong> Intraday and multi-day trade setups powered by proprietary models</li>
            <li><strong>AI Power Stock:</strong> AI-driven stock strength analysis and ranking</li>
            <li><strong>Journal Book:</strong> Track and review your trades with P&amp;L analytics</li>
            <li><strong>Historical Data:</strong> Access past option chain snapshots for backtesting and review</li>
            <li><strong>Community Membership:</strong> Lifetime access to exclusive learning sessions, post-market analysis, and research</li>
          </ul>
        </div>

        <div className="policy-section">
          <div className="policy-section-title">Our Mission</div>
          <p>We believe every trader deserves the same quality of data and analysis that institutional participants have. Our goal is to bridge that gap — delivering real-time, AI-powered insights through a clean, fast, and reliable platform that works on any device.</p>
        </div>

        <div className="policy-section">
          <div className="policy-section-title">Important Disclaimer</div>
          <p>All content, signals, and analysis on soc.ai.in are <strong>for educational and informational purposes only</strong>. Nothing on this platform constitutes financial advice or a recommendation to buy or sell any security. Trading involves substantial risk of loss. Users are solely responsible for their trading decisions.</p>
        </div>

        <div className="policy-section">
          <div className="policy-section-title">Registered Details</div>
          <ul>
            <li><strong>Legal Name:</strong> Rajan Kushwaha</li>
            <li><strong>Trade Name:</strong> soc.ai.in / Simplify Option Chain</li>
            <li><strong>Registered Address:</strong> Rampur Khurd, Po Dhebwa, PS Gopalpur, Dist. Gopalganj, Bihar — 841503</li>
            <li><strong>Email:</strong> simplifyoptionchain@gmail.com</li>
            <li><strong>Mobile:</strong> +91 84015 20208</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ── Subscription Page ─────────────────────────────────────────────────────────
function SubscriptionPage() {
  const [tab, setTab] = useState('regular');
  const [showToast, setShowToast] = useState(false);

  const handleSelectPlan = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const regularPlans = [
    {
      name: 'Weekly',
      days: 7,
      price: 111,
      communityPrice: 66.6,
      perDayCom: 9.51,
      perDayNon: 15.86,
      save: { perDay: 6.34, total: 44.4 },
      popular: false,
    },
    {
      name: 'Monthly',
      days: 30,
      price: 249,
      communityPrice: 149,
      perDayCom: 4.97,
      perDayNon: 8.3,
      save: { perDay: 3.33, total: 100 },
      popular: false,
    },
    {
      name: 'Half Yearly',
      days: 180,
      price: 1434,
      communityPrice: 860,
      perDayCom: 4.78,
      perDayNon: 7.97,
      save: { perDay: 3.19, total: 574 },
      popular: true,
    },
    {
      name: 'Yearly',
      days: 365,
      price: 2749,
      communityPrice: 1649,
      perDayCom: 4.52,
      perDayNon: 7.53,
      save: { perDay: 3.01, total: 1100 },
      popular: false,
    },
  ];

  const advancePlans = [
    { name: 'Monthly', days: 30, price: 499, communityPrice: 299, popular: false },
    { name: 'Half Yearly', days: 180, price: 2499, communityPrice: 1499, popular: true },
    { name: 'Yearly', days: 365, price: 4499, communityPrice: 2699, popular: false },
  ];

  const features = ['All free plan benefits', 'Live Option Chain', 'Scalp Signals', 'Positional Signals', 'S/R Levels'];
  const advFeatures = ['All Regular Plan benefits', 'AI Auto Analysis', 'Bromos Trade Signals', 'MCTR Trade Signals', 'AI Power Stock', 'Priority Support'];

  return (
    <div className="auth-page-wrap">
      {showToast && (
        <div className="sub-toast">
          🔧 Payment gateway integration is currently under process. Please check back soon!
        </div>
      )}
      {/* Community Membership Banner */}
      <div className="sub-community-banner">
        <div className="sub-comm-left">
          <div className="sub-comm-title">Community Membership</div>
          <div className="sub-comm-price">₹9,999</div>
          <div className="sub-comm-sub">One-time payment · Lifetime Access</div>
          <button className="sub-comm-btn" onClick={handleSelectPlan}>Join Community</button>
        </div>
        <div className="sub-comm-right">
          <div className="sub-comm-perks-title">Community Benefits</div>
          {['40% Discount on All Plans', 'Post-Market Analysis Sessions', 'Community Support Group', 'Weekly Learning Classes', 'Exclusive Q&amp;A on Weekends', 'Lifetime Updates &amp; Research'].map((b, i) => (
            <div key={i} className="sub-comm-perk">✓ {b}</div>
          ))}
        </div>
      </div>

      {/* Plan Tabs */}
      <div className="sub-tab-row">
        <button className={`sub-tab-btn${tab === 'regular' ? ' active' : ''}`} onClick={() => setTab('regular')}>Regular Plans</button>
        <button className={`sub-tab-btn${tab === 'advance' ? ' active' : ''}`} onClick={() => setTab('advance')}>Advance Plans</button>
      </div>

      {/* Regular Plans */}
      {tab === 'regular' && (
        <div className="sub-plans-grid">
          {regularPlans.map(p => (
            <div key={p.name} className={`sub-plan-card${p.popular ? ' popular' : ''}`}>
              {p.popular && <div className="sub-popular-badge">★ Popular</div>}
              <div className="sub-plan-name">{p.name}</div>
              <div className="sub-plan-price-box">
                <div className="sub-plan-label">Starting from</div>
                <div className="sub-plan-price">₹{p.price.toLocaleString('en-IN')}</div>
                <div className="sub-plan-duration">for {p.days} days</div>
                <div className="sub-plan-tag">Non-Community</div>
              </div>
              <div className="sub-price-table">
                <div className="sub-pt-head">
                  <span>Plan Type</span><span>Per Day</span><span>Total Price</span>
                </div>
                <div className="sub-pt-row community-row">
                  <span>Community</span>
                  <span>₹{p.perDayCom}</span>
                  <span>₹{p.communityPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="sub-pt-row">
                  <span>★ Non-Community</span>
                  <span>₹{p.perDayNon}</span>
                  <span>₹{p.price.toLocaleString('en-IN')}</span>
                </div>
                <div className="sub-pt-save">
                  <span>You Save</span>
                  <span>₹{p.save.perDay}</span>
                  <span>₹{p.save.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <button className="sub-select-btn" onClick={handleSelectPlan}>Select Plan</button>
              <div className="sub-features">
                {features.map((f, i) => <div key={i} className="sub-feat">✓ {f}</div>)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Advance Plans */}
      {tab === 'advance' && (
        <div className="sub-plans-grid sub-plans-grid-3">
          {advancePlans.map(p => (
            <div key={p.name} className={`sub-plan-card${p.popular ? ' popular' : ''}`}>
              {p.popular && <div className="sub-popular-badge">★ Popular</div>}
              <div className="sub-plan-name">{p.name}</div>
              <div className="sub-plan-price-box">
                <div className="sub-plan-label">Starting from</div>
                <div className="sub-plan-price">₹{p.price.toLocaleString('en-IN')}</div>
                <div className="sub-plan-duration">for {p.days} days</div>
                <div className="sub-plan-tag">Non-Community</div>
              </div>
              <div className="sub-price-table">
                <div className="sub-pt-head">
                  <span>Plan Type</span><span>Total Price</span>
                </div>
                <div className="sub-pt-row community-row">
                  <span>Community</span>
                  <span>₹{p.communityPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="sub-pt-row">
                  <span>Non-Community</span>
                  <span>₹{p.price.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <button className="sub-select-btn" onClick={handleSelectPlan}>Select Plan</button>
              <div className="sub-features">
                {advFeatures.map((f, i) => <div key={i} className="sub-feat">✓ {f}</div>)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No COD Notice */}
      <div className="sub-no-cod">
        ⚠️ <strong>No Cash on Delivery (COD).</strong> soc.ai.in offers exclusively <strong>digital subscription services</strong>. All payments are processed online. No physical goods are delivered.
      </div>

      {/* Footer links */}
      <div className="sub-policy-links">
        Operated by: <strong>Rajan Kushwaha</strong> &nbsp;|&nbsp;
        Registered Address: Rampur Khurd, Po Dhebwa, PS Gopalpur, Dist. Gopalganj, Bihar – 841503
      </div>
    </div>
  );
}

// ── Contact Page ──────────────────────────────────────────────────────────────
function ContactPage() {
  return (
    <div className="auth-page-wrap">
      <div className="contact-card">
        <div className="contact-title">Contact &amp; Business Details</div>
        <div className="contact-sub">Reach out for support, queries, or payment-related issues.</div>
        <div className="contact-grid contact-grid-3">
          <div className="contact-item">
            <div className="contact-icon">👤</div>
            <div className="contact-label">Legal Name</div>
            <div className="contact-value">Rajan Kushwaha</div>
          </div>
          <div className="contact-item">
            <div className="contact-icon">🏷️</div>
            <div className="contact-label">Trade Name</div>
            <div className="contact-value">soc.ai.in<br /><span style={{fontSize:'12px',color:'#888'}}>Simplify Option Chain</span></div>
          </div>
          <div className="contact-item">
            <div className="contact-icon">📞</div>
            <div className="contact-label">Mobile / WhatsApp</div>
            <div className="contact-value"><a href="tel:8401520208">+91 84015 20208</a></div>
          </div>
          <div className="contact-item">
            <div className="contact-icon">✉️</div>
            <div className="contact-label">Email</div>
            <div className="contact-value"><a href="mailto:simplifyoptionchain@gmail.com">simplifyoptionchain@gmail.com</a></div>
          </div>
          <div className="contact-item contact-item-wide">
            <div className="contact-icon">📍</div>
            <div className="contact-label">Registered Address (Aadhaar)</div>
            <div className="contact-value">
              Rampur Khurd, Post Office – Dhebwa,<br />
              Police Station – Gopalpur,<br />
              District – Gopalganj, Bihar – 841503, India
            </div>
          </div>
        </div>
        <div className="contact-note">
          Support hours: Monday – Saturday, 9:00 AM – 6:00 PM IST. We respond within 24 hours.<br />
          For payment/refund issues, always include your payment reference/transaction ID.
        </div>
      </div>
    </div>
  );
}

// ── Terms & Conditions ────────────────────────────────────────────────────────
function TermsPage() {
  return (
    <div className="auth-page-wrap">
      <div className="policy-card">
        <div className="policy-title">Terms &amp; Conditions</div>
        <div className="policy-updated">Last updated: April 2026 | This website is operated by <strong>Rajan Kushwaha</strong> (Trade name: soc.ai.in)</div>

        <div className="policy-section">
          <div className="policy-section-title">1. Acceptance of Terms</div>
          <p>By accessing or using soc.ai.in, you agree to be bound by these Terms &amp; Conditions. If you do not agree, please do not use the platform. These terms apply to all visitors, users, and registered members.</p>
        </div>
        <div className="policy-section">
          <div className="policy-section-title">2. Platform Description</div>
          <p>soc.ai.in is an AI-powered option chain and trading analytics platform operated by Rajan Kushwaha. We provide real-time market data tools, trading signals, journal features, and educational content for Indian equity derivatives traders.</p>
        </div>
        <div className="policy-section">
          <div className="policy-section-title">3. Not Financial Advice</div>
          <p>All content, signals, analysis, and data on soc.ai.in are strictly <strong>for educational and informational purposes only</strong>. Nothing on this platform constitutes investment advice, financial advice, or a recommendation to buy or sell any security. Trading in derivatives involves substantial risk of capital loss. Users are solely responsible for all trading decisions.</p>
        </div>
        <div className="policy-section">
          <div className="policy-section-title">4. User Obligations</div>
          <ul>
            <li>You must be at least 18 years of age to register</li>
            <li>You must provide accurate registration information</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials</li>
            <li>You must not share your account login with any third party</li>
            <li>You must not scrape, copy, or redistribute any platform data or signals commercially</li>
            <li>You must report any unauthorized account access immediately</li>
          </ul>
        </div>
        <div className="policy-section">
          <div className="policy-section-title">5. Intellectual Property</div>
          <p>All content, software, algorithms, UI designs, trading models, and signals on soc.ai.in are the intellectual property of Rajan Kushwaha / soc.ai.in. Unauthorized reproduction, distribution, or commercial use is strictly prohibited and may result in legal action.</p>
        </div>
        <div className="policy-section">
          <div className="policy-section-title">6. Subscription &amp; Payments</div>
          <p>All subscription plans are digital services paid in advance in Indian Rupees (INR). Prices are inclusive of applicable taxes. Subscriptions are non-transferable. No Cash on Delivery (COD) is offered — all transactions are online only.</p>
        </div>
        <div className="policy-section">
          <div className="policy-section-title">7. Platform Availability</div>
          <p>We aim for maximum uptime but do not guarantee uninterrupted access. Scheduled maintenance will be communicated in advance. We are not liable for losses arising from temporary unavailability.</p>
        </div>
        <div className="policy-section">
          <div className="policy-section-title">8. Governing Law</div>
          <p>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Gopalganj, Bihar, India.</p>
        </div>
        <div className="policy-section">
          <div className="policy-section-title">9. Contact</div>
          <p>Rajan Kushwaha | Rampur Khurd, Po Dhebwa, PS Gopalpur, Dist. Gopalganj, Bihar – 841503 | <a href="mailto:simplifyoptionchain@gmail.com">simplifyoptionchain@gmail.com</a> | +91 84015 20208</p>
        </div>
      </div>
    </div>
  );
}

// ── Privacy Policy ────────────────────────────────────────────────────────────
function PrivacyPage() {
  return (
    <div className="auth-page-wrap">
      <div className="policy-card">
        <div className="policy-title">Privacy Policy</div>
        <div className="policy-updated">Last updated: April 2026 | Operated by Rajan Kushwaha (soc.ai.in)</div>

        <div className="policy-section">
          <div className="policy-section-title">1. Information We Collect</div>
          <ul>
            <li><strong>Registration data:</strong> Full name, email address, mobile number, city</li>
            <li><strong>Usage data:</strong> Pages visited, features used, session timestamps</li>
            <li><strong>Payment data:</strong> Transaction IDs and plan details (we do not store card/UPI details — handled by payment gateway)</li>
            <li><strong>Technical data:</strong> IP address, browser type, device type, cookies</li>
          </ul>
        </div>
        <div className="policy-section">
          <div className="policy-section-title">2. How We Use Your Information</div>
          <ul>
            <li>To authenticate your account and provide platform access</li>
            <li>To process subscription payments and send confirmation emails</li>
            <li>To send OTPs and account security notifications</li>
            <li>To improve platform features based on usage analytics</li>
            <li>To respond to support queries</li>
          </ul>
        </div>
        <div className="policy-section">
          <div className="policy-section-title">3. Data Sharing</div>
          <p>We do not sell, rent, or share your personal data with third parties for marketing purposes. Data may be shared only with: (a) payment gateway providers for transaction processing, (b) cloud service providers for hosting, and (c) law enforcement if legally required.</p>
        </div>
        <div className="policy-section">
          <div className="policy-section-title">4. Data Security</div>
          <p>We use industry-standard encryption (HTTPS/TLS) for all data transmission. Passwords are stored as hashed values — never in plain text. Regular security audits are conducted.</p>
        </div>
        <div className="policy-section">
          <div className="policy-section-title">5. Cookies</div>
          <p>We use session cookies for authentication. These are essential for platform functionality and are deleted when you log out. We do not use third-party advertising cookies.</p>
        </div>
        <div className="policy-section">
          <div className="policy-section-title">6. Data Retention</div>
          <p>Account data is retained for the duration of your subscription plus 12 months. You may request deletion of your account and personal data by emailing us at <a href="mailto:simplifyoptionchain@gmail.com">simplifyoptionchain@gmail.com</a>.</p>
        </div>
        <div className="policy-section">
          <div className="policy-section-title">7. Your Rights</div>
          <p>You have the right to access, correct, or request deletion of your personal data. Contact us at <a href="mailto:simplifyoptionchain@gmail.com">simplifyoptionchain@gmail.com</a> for any data-related requests. We respond within 7 business days.</p>
        </div>
        <div className="policy-section">
          <div className="policy-section-title">8. Contact</div>
          <p>Rajan Kushwaha | <a href="mailto:simplifyoptionchain@gmail.com">simplifyoptionchain@gmail.com</a> | +91 84015 20208</p>
        </div>
      </div>
    </div>
  );
}

// ── Refund Policy Page ────────────────────────────────────────────────────────
function RefundPage() {
  return (
    <div className="auth-page-wrap">
      <div className="policy-card">
        <div className="policy-title">Return &amp; Refund Policy</div>
        <div className="policy-updated">Last updated: April 2026 | Operated by Rajan Kushwaha (soc.ai.in)</div>

        <div className="policy-section">
          <div className="policy-section-title">1. Nature of Service</div>
          <p>soc.ai.in offers exclusively digital subscription services. Since our products are intangible (platform access, data tools, AI signals), there are no physical returns. All sales are final once service access is activated.</p>
        </div>
        <div className="policy-section">
          <div className="policy-section-title">2. Standard Policy — Non-Refundable</div>
          <p>All subscription plans (Weekly ₹111 | Monthly ₹249 | Half Yearly ₹1,434 | Yearly ₹2,749) and the Community Membership (₹9,999) are <strong>non-refundable</strong> once access is granted. Partial-period refunds are not applicable.</p>
        </div>
        <div className="policy-section">
          <div className="policy-section-title">3. Eligible Refund Cases</div>
          <p>Refunds are considered <strong>only</strong> in the following cases:</p>
          <ul>
            <li><strong>Duplicate payment:</strong> Same plan charged twice due to a gateway error — <em>report within 24 hours</em></li>
            <li><strong>Extended outage:</strong> Platform inaccessible for 48+ continuous hours due to our server failure — <em>verified by our logs</em></li>
            <li><strong>Billing error:</strong> Wrong amount charged due to a system error on our end — <em>report within 48 hours</em></li>
          </ul>
        </div>
        <div className="policy-section">
          <div className="policy-section-title">4. Refund Request Process</div>
          <p>To request a refund, email <a href="mailto:simplifyoptionchain@gmail.com">simplifyoptionchain@gmail.com</a> with:</p>
          <ul>
            <li>Your registered email address</li>
            <li>Payment transaction/reference ID</li>
            <li>Screenshot of payment confirmation</li>
            <li>Reason for refund request</li>
          </ul>
          <p>Requests must be submitted within <strong>48 hours</strong> of the transaction.</p>
        </div>
        <div className="policy-section">
          <div className="policy-section-title">5. Refund Duration &amp; Mode</div>
          <ul>
            <li><strong>Review period:</strong> 3–5 business days to verify eligibility</li>
            <li><strong>Processing time:</strong> 7–10 business days after approval</li>
            <li><strong>Refund mode:</strong> Credited back to the original payment method (UPI, Credit/Debit Card, Net Banking)</li>
            <li><strong>Additional bank processing:</strong> 2–5 business days depending on your bank</li>
          </ul>
        </div>
        <div className="policy-section">
          <div className="policy-section-title">6. Contact</div>
          <p>Rajan Kushwaha | <a href="mailto:simplifyoptionchain@gmail.com">simplifyoptionchain@gmail.com</a> | +91 84015 20208<br />
          Rampur Khurd, Po Dhebwa, PS Gopalpur, Dist. Gopalganj, Bihar – 841503</p>
        </div>
      </div>
    </div>
  );
}

// ── Cancellation Policy ───────────────────────────────────────────────────────
function CancellationPage() {
  return (
    <div className="auth-page-wrap">
      <div className="policy-card">
        <div className="policy-title">Cancellation Policy</div>
        <div className="policy-updated">Last updated: April 2026 | Operated by Rajan Kushwaha (soc.ai.in)</div>

        <div className="policy-section">
          <div className="policy-section-title">1. Subscription Cancellation</div>
          <p>soc.ai.in subscriptions are <strong>non-auto-renewing</strong>. Each plan expires after its paid duration (7 / 30 / 180 / 365 days). There is no automatic recurring charge — you manually repurchase when needed.</p>
        </div>
        <div className="policy-section">
          <div className="policy-section-title">2. How to Cancel</div>
          <p>Since subscriptions do not auto-renew, no formal cancellation action is needed. Simply do not renew when your plan expires. If you wish to deactivate your account entirely, email us at <a href="mailto:simplifyoptionchain@gmail.com">simplifyoptionchain@gmail.com</a>.</p>
        </div>
        <div className="policy-section">
          <div className="policy-section-title">3. Cancellation Duration &amp; Access</div>
          <ul>
            <li><strong>Weekly plan (7 days):</strong> Access continues until day 7 from activation</li>
            <li><strong>Monthly plan (30 days):</strong> Access continues until day 30 from activation</li>
            <li><strong>Half Yearly plan (180 days):</strong> Access continues until day 180 from activation</li>
            <li><strong>Yearly plan (365 days):</strong> Access continues until day 365 from activation</li>
            <li><strong>Community Membership (Lifetime):</strong> Permanent — no expiry or cancellation once activated</li>
          </ul>
          <p>Cancellation or non-renewal does <strong>not</strong> entitle you to a prorated refund for unused days.</p>
        </div>
        <div className="policy-section">
          <div className="policy-section-title">4. Account Deactivation</div>
          <p>If you request complete account deletion, all your data (trade journal, settings, history) will be permanently deleted within <strong>7 business days</strong> of the confirmed request. This action is irreversible.</p>
        </div>
        <div className="policy-section">
          <div className="policy-section-title">5. Contact</div>
          <p>Rajan Kushwaha | <a href="mailto:simplifyoptionchain@gmail.com">simplifyoptionchain@gmail.com</a> | +91 84015 20208</p>
        </div>
      </div>
    </div>
  );
}

// ── Shipping Policy ───────────────────────────────────────────────────────────
function ShippingPage() {
  return (
    <div className="auth-page-wrap">
      <div className="policy-card">
        <div className="policy-title">Shipping &amp; Delivery Policy</div>
        <div className="policy-updated">Last updated: April 2026 | Operated by Rajan Kushwaha (soc.ai.in)</div>

        <div className="policy-section">
          <div className="policy-section-title">1. Digital Product — No Physical Shipping</div>
          <p>soc.ai.in is a <strong>100% digital platform</strong>. We do not sell or ship any physical products. All our offerings — subscription plans, community membership, signals, and tools — are delivered electronically over the internet.</p>
          <p><strong>Cash on Delivery (COD) is not available and is not applicable</strong> as no physical delivery takes place.</p>
        </div>
        <div className="policy-section">
          <div className="policy-section-title">2. Delivery Method</div>
          <ul>
            <li><strong>Subscription Plans:</strong> Instant platform access via your registered login after payment verification</li>
            <li><strong>Community Membership:</strong> Invitation and access link sent to registered email within <strong>1 hour</strong> of payment</li>
            <li><strong>OTP &amp; Verification Emails:</strong> Delivered within <strong>2–5 minutes</strong> (check spam/junk folder)</li>
            <li><strong>Password Reset Links:</strong> Delivered within <strong>2–5 minutes</strong></li>
          </ul>
        </div>
        <div className="policy-section">
          <div className="policy-section-title">3. Delivery Duration</div>
          <ul>
            <li>Standard activation: <strong>Immediate to 15 minutes</strong> after confirmed payment</li>
            <li>Maximum activation window: <strong>2 hours</strong> in exceptional gateway delay cases</li>
            <li>If not activated within 2 hours: Contact us immediately with payment proof</li>
          </ul>
        </div>
        <div className="policy-section">
          <div className="policy-section-title">4. Service Availability</div>
          <p>The platform targets <strong>99.9% uptime</strong> during Indian market hours (9:00 AM – 4:00 PM IST, Monday–Friday). Scheduled maintenance is performed outside market hours with advance notice.</p>
        </div>
        <div className="policy-section">
          <div className="policy-section-title">5. System Requirements</div>
          <ul>
            <li>Stable internet connection (minimum 1 Mbps)</li>
            <li>Modern web browser (Chrome, Firefox, Edge, Safari — latest versions)</li>
            <li>JavaScript must be enabled</li>
            <li>Minimum screen: 320px (mobile) / 1024px (desktop recommended)</li>
          </ul>
        </div>
        <div className="policy-section">
          <div className="policy-section-title">6. Contact for Delivery Issues</div>
          <p>Rajan Kushwaha | <a href="mailto:simplifyoptionchain@gmail.com">simplifyoptionchain@gmail.com</a> | +91 84015 20208<br />
          Response within 24 hours during business days (Mon–Sat, 9 AM – 6 PM IST)</p>
        </div>
      </div>
    </div>
  );
}

const API_BASE = process.env.REACT_APP_API_URL || '';

const AuthPage = () => {
  const [navPage, setNavPage] = useState('home');

  // State management
  const [activeTab, setActiveTab] = useState('signin');
  const [activePanel, setActivePanel] = useState('signin');
  const [currentEmail, setCurrentEmail] = useState('');
  const [pendingOTPAction, setPendingOTPAction] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState({ show: false, text: 'Please wait...' });
  
  // Form states
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [redirectTo, setRedirectTo] = useState('dashboard');
  const [signUpData, setSignUpData] = useState({
    firstName: '', lastName: '', email: '', mobile: '', city: '',
    password: '', confirmPassword: '', verificationType: 'otp'
  });
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetPasswords, setResetPasswords] = useState({ newPassword: '', confirmPassword: '' });
  
  // OTP state
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(600);
  const otpInputsRef = useRef([]);

  // Check session and URL params on mount
  useEffect(() => {
    fetch(`${API_BASE}/api/auth/check-session`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (data.authenticated && !resetToken) {
          window.location.href = '/optionchain';
        }
      })
      .catch(() => {});

    const params = new URLSearchParams(window.location.search);
    const token = params.get('reset_token');
    if (token) {
      setResetToken(token);
      setActivePanel('reset');
    }
    if (params.get('reason') === 'timeout') {
      showAlert('You were signed out due to inactivity.', 'info');
    }
  }, []);

  // Inactivity logout
  useEffect(() => {
    let inactiveTimer;
    const resetInactiveTimer = () => {
      clearTimeout(inactiveTimer);
      inactiveTimer = setTimeout(async () => {
        await fetch(`${API_BASE}/api/auth/logout`, { method: 'POST', credentials: 'include' });
        localStorage.removeItem('soc_auth_state');
        localStorage.removeItem('soc_bootstrap');
        localStorage.removeItem('soc_symbols');
        window.location.href = '/?reason=timeout';
      }, 5 * 60 * 1000);
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(ev => {
      document.addEventListener(ev, resetInactiveTimer, true);
    });
    
    resetInactiveTimer();
    return () => {
      clearTimeout(inactiveTimer);
      events.forEach(ev => document.removeEventListener(ev, resetInactiveTimer, true));
    };
  }, []);

  // OTP timer
  useEffect(() => {
    if (activePanel === 'otp' && otpTimer > 0) {
      const interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activePanel, otpTimer]);

  const showAlert = (message, type = 'info') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  const clearAlert = () => setAlert({ show: false, message: '', type: '' });

  const switchTab = (tab) => {
    setActiveTab(tab);
    setActivePanel(tab);
    clearAlert();
  };

  // API Handlers
  const handleSignIn = async (e) => {
    e.preventDefault();
    clearAlert();
    setLoading({ show: true, text: 'Signing in...' });

    try {
      const res = await fetch(`${API_BASE}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(signInData)
      });
      const data = await res.json();
      setLoading({ show: false, text: '' });

      if (data.success) {
        showAlert('Login successful! Redirecting...', 'success');
        const dest = redirectTo === 'live' ? '/optionchain' : redirectTo === 'historical' ? '/historical' : '/';
        setTimeout(() => window.location.href = dest, 1000);
      } else {
        showAlert(data.error || 'Login failed', 'error');
      }
    } catch {
      setLoading({ show: false, text: '' });
      showAlert('Network error. Please try again.', 'error');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    clearAlert();

    if (signUpData.password !== signUpData.confirmPassword) {
      showAlert('Passwords do not match', 'error');
      return;
    }
    if (!/^\d{10}$/.test(signUpData.mobile)) {
      showAlert('Enter a valid 10-digit mobile number', 'error');
      return;
    }

    setLoading({ show: true, text: 'Creating account...' });
    setCurrentEmail(signUpData.email);

    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${signUpData.firstName} ${signUpData.lastName}`,
          ...signUpData
        })
      });
      const data = await res.json();
      setLoading({ show: false, text: '' });

      if (data.success) {
        if (signUpData.verificationType === 'otp') {
          setPendingOTPAction('signup');
          setActivePanel('otp');
          setOtpTimer(600);
        } else {
          setActivePanel('link-sent');
          showAlert(data.message, 'success');
        }
      } else {
        showAlert(data.error, 'error');
      }
    } catch {
      setLoading({ show: false, text: '' });
      showAlert('Network error. Please try again.', 'error');
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 5) {
      showAlert('Enter all 5 digits', 'error');
      return;
    }

    clearAlert();
    setLoading({ show: true, text: 'Verifying...' });

    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: currentEmail, otp: otpString })
      });
      const data = await res.json();
      setLoading({ show: false, text: '' });

      if (data.success) {
        showAlert('Email verified! Redirecting...', 'success');
        setTimeout(() => window.location.href = '/optionchain', 1200);
      } else {
        showAlert(data.error, 'error');
      }
    } catch {
      setLoading({ show: false, text: '' });
      showAlert('Network error. Please try again.', 'error');
    }
  };

  const handleResendOTP = async () => {
    setLoading({ show: true, text: 'Sending new OTP...' });

    try {
      const res = await fetch(`${API_BASE}/api/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentEmail, verificationType: 'otp' })
      });
      const data = await res.json();
      setLoading({ show: false, text: '' });

      if (data.success) {
        showAlert('New OTP sent!', 'success');
        setOtp(['', '', '', '', '']);
        setOtpTimer(600);
      } else {
        showAlert(data.error, 'error');
      }
    } catch {
      setLoading({ show: false, text: '' });
      showAlert('Network error.', 'error');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    clearAlert();
    setLoading({ show: true, text: 'Sending reset link...' });

    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      setLoading({ show: false, text: '' });

      if (data.success) {
        setCurrentEmail(forgotEmail);
        setActivePanel('link-sent');
        showAlert('Password reset link sent to your email!', 'success');
      } else {
        showAlert(data.error, 'error');
      }
    } catch {
      setLoading({ show: false, text: '' });
      showAlert('Network error. Please try again.', 'error');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (resetPasswords.newPassword !== resetPasswords.confirmPassword) {
      showAlert('Passwords do not match', 'error');
      return;
    }

    clearAlert();
    setLoading({ show: true, text: 'Updating password...' });

    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, newPassword: resetPasswords.newPassword })
      });
      const data = await res.json();
      setLoading({ show: false, text: '' });

      if (data.success) {
        showAlert('Password updated! Redirecting to sign in...', 'success');
        setTimeout(() => {
          window.history.replaceState({}, '', '/');
          setResetToken('');
          switchTab('signin');
        }, 2000);
      } else {
        showAlert(data.error, 'error');
      }
    } catch {
      setLoading({ show: false, text: '' });
      showAlert('Network error. Please try again.', 'error');
    }
  };

  // OTP input handlers
  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, '').slice(0, 5);
      const newOtp = [...otp];
      pasted.split('').forEach((char, i) => {
        if (i < 5) newOtp[i] = char;
      });
      setOtp(newOtp);
      otpInputsRef.current[Math.min(pasted.length, 4)]?.focus();
    } else {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 4) {
        otpInputsRef.current[index + 1].focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1].focus();
    }
    if (e.key === 'Enter') {
      handleVerifyOTP();
    }
  };

  const formatTime = () => {
    const minutes = String(Math.floor(otpTimer / 60)).padStart(2, '0');
    const seconds = String(otpTimer % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const hideTabs = ['otp', 'link-sent', 'forgot', 'reset'].includes(activePanel);

  return (
    <div className="auth-root">
      <NavBar activePage={navPage} setPage={setNavPage} />

      {navPage === 'about'        && <AboutPage />}
      {navPage === 'subscription' && <SubscriptionPage />}
      {navPage === 'contact'      && <ContactPage />}
      {navPage === 'terms'        && <TermsPage />}
      {navPage === 'privacy'      && <PrivacyPage />}
      {navPage === 'refund'       && <RefundPage />}
      {navPage === 'cancellation' && <CancellationPage />}
      {navPage === 'shipping'     && <ShippingPage />}

      {navPage === 'home' && (
    <div className="auth-container">
      {/* Background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="auth-box">

        {/* Top header — spans full width of both panels */}
        <div className="auth-top-header">
          <div className="auth-top-welcome">Welcome to</div>
          <div className="auth-top-brand">soc<span>.ai.in</span></div>
          <div className="auth-top-sub">AI-Powered Option Chain &amp; Trading Platform</div>
        </div>

        {/* Panels row */}
        <div className="auth-panels">

        {/* Left panel — features */}
        <div className="left-panel">

          <div className="lp-top-label">Everything you need to trade smarter</div>

          {/* Feature list */}
          <div className="hero-features">
            {[
              { icon: '⚡', title: 'Real-Time Data',        sub: 'WebSocket — no refresh needed'        },
              { icon: '📊', title: 'Volume & OI Analysis',  sub: '1, 3, 5, 15 min breakdowns'           },
              { icon: '🎯', title: 'Smart S&R Levels',      sub: 'OI-based support & resistance'         },
              { icon: '🔗', title: 'Full Option Chain',     sub: 'OI, Volume, LTP, Greeks in one view'   },
              { icon: '✨', title: 'Highlight System',      sub: 'Top OI & volume change markers'        },
              { icon: '🤖', title: 'AI Auto Analysis',      sub: 'Auto analysis every 1 min'             },
              { icon: '📈', title: 'Swing Trade',           sub: 'Multi-day positional setups'           },
              { icon: '📓', title: 'Journal Book',          sub: 'Track every trade & review P&L'        },
              { icon: '🧠', title: 'AI Power Stock',        sub: 'AI-powered stock signals'              },
              { icon: '🔍', title: 'AI Pattern Match',      sub: 'Chart pattern recognition engine'      },
              { icon: '📉', title: 'Bromos Trade',          sub: 'OI-based S&R strategy signals'         },
              { icon: '🔄', title: 'MCTR Trade',            sub: 'Mean-reversion & trend signals'        },
            ].map((f, i) => (
              <div key={i} className="hero-feat">
                <div className="hero-feat-icon">{f.icon}</div>
                <div className="hero-feat-body">
                  <div className="hero-feat-title">{f.title}</div>
                  <div className="hero-feat-sub">{f.sub}</div>
                </div>
                <div className="hero-feat-check">✓</div>
              </div>
            ))}
          </div>

          {/* Tagline */}
          <div className="hero-tagline">
            <div className="hero-tagline-line" />
            <span>"Trade with Data, Not Emotions"</span>
            <div className="hero-tagline-line" />
          </div>
        </div>

        {/* Right panel — form */}
        <div className={`right-panel${activePanel === 'signup' ? ' right-panel-wide' : ''}`}>
          <div className="wrapper">

          <div className="card">
            {/* Loading */}
            {loading.show && (
              <div className="loader active">
                <div className="spinner"></div>
                <p>{loading.text}</p>
              </div>
            )}

            {/* Alert */}
            {alert.show && (
              <div className={`alert ${alert.type}`}>{alert.message}</div>
            )}

            {/* Tabs */}
            {!hideTabs && (
              <div className="tabs">
                <div 
                  className={`tab ${activeTab === 'signin' ? 'active' : ''}`}
                  onClick={() => switchTab('signin')}
                >
                  Sign In
                </div>
                <div 
                  className={`tab ${activeTab === 'signup' ? 'active' : ''}`}
                  onClick={() => switchTab('signup')}
                >
                  Sign Up
                </div>
              </div>
            )}

            {/* Sign In Panel */}
            {activePanel === 'signin' && (
              <div className="panel active">
                <div className="section-title">Welcome back</div>
                <div className="section-sub">Sign in to your SOC account</div>
                <form onSubmit={handleSignIn} autoComplete="off">
                  <div className="field">
                    <label>Email Address</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={signInData.email}
                      onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                    />
                  </div>
                  <div className="field">
                    <label>Password</label>
                    <input
                      type="password"
                      placeholder="Your password"
                      required
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                    />
                  </div>
                  <div className="field">
                    <label>After Login, Go To</label>
                    <select value={redirectTo} onChange={(e) => setRedirectTo(e.target.value)}>
                      <option value="dashboard">📊 Dashboard</option>
                      <option value="live">⚡ Live Option Chain</option>
                      <option value="historical">📁 Historical</option>
                    </select>
                  </div>
                  <a className="forgot-link" onClick={() => setActivePanel('forgot')}>Forgot password?</a>
                  <button type="submit" className="btn btn-primary">Sign In →</button>
                </form>
              </div>
            )}

            {/* Sign Up Panel */}
            {activePanel === 'signup' && (
              <div className="panel active">
                <div className="section-title">Create account</div>
                <div className="section-sub">Join Simplify Option Chain — it's free</div>
                <form onSubmit={handleSignUp} autoComplete="off">

                  {/* Row 1: Name */}
                  <div className="row-2">
                    <div className="field">
                      <label>First Name</label>
                      <input type="text" placeholder="Raj" required value={signUpData.firstName}
                        onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })} />
                    </div>
                    <div className="field">
                      <label>Last Name</label>
                      <input type="text" placeholder="Sharma" required value={signUpData.lastName}
                        onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })} />
                    </div>
                  </div>

                  {/* Row 2: Email + Mobile */}
                  <div className="row-2">
                    <div className="field">
                      <label>Email Address</label>
                      <input type="email" placeholder="you@example.com" required value={signUpData.email}
                        onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })} />
                    </div>
                    <div className="field">
                      <label>Mobile Number</label>
                      <div className="phone-row">
                        <div className="phone-prefix">🇮🇳 +91</div>
                        <input type="tel" placeholder="9876543210" maxLength="10" required value={signUpData.mobile}
                          onChange={(e) => setSignUpData({ ...signUpData, mobile: e.target.value })} />
                      </div>
                    </div>
                  </div>

                  {/* Row 3: City */}
                  <div className="field">
                    <label>City</label>
                    <input type="text" placeholder="Mumbai, Delhi, Ahmedabad..." required value={signUpData.city}
                      onChange={(e) => setSignUpData({ ...signUpData, city: e.target.value })} />
                  </div>

                  {/* Row 4: Password + Confirm */}
                  <div className="row-2">
                    <div className="field">
                      <label>Password</label>
                      <input type="password" placeholder="Min 6 characters" required minLength="6" value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })} />
                    </div>
                    <div className="field">
                      <label>Confirm Password</label>
                      <input type="password" placeholder="Re-enter password" required value={signUpData.confirmPassword}
                        onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })} />
                    </div>
                  </div>

                  {/* Row 5: Verification */}
                  <div className="field">
                    <label>Verification Method</label>
                    <div className="verify-options">
                      <div className={`verify-opt ${signUpData.verificationType === 'otp' ? 'selected' : ''}`}
                        onClick={() => setSignUpData({ ...signUpData, verificationType: 'otp' })}>
                        <div className="v-icon">🔢</div>
                        <div className="v-title">OTP</div>
                        <div className="v-sub">Instant · 10 min</div>
                      </div>
                      <div className={`verify-opt ${signUpData.verificationType === 'link' ? 'selected' : ''}`}
                        onClick={() => setSignUpData({ ...signUpData, verificationType: 'link' })}>
                        <div className="v-icon">📧</div>
                        <div className="v-title">Email Link</div>
                        <div className="v-sub">Flexible · 24 hr</div>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary">Create Account →</button>
                </form>
              </div>
            )}

            {/* OTP Panel */}
            {activePanel === 'otp' && (
              <div className="panel active">
                <div className="section-title">Enter OTP</div>
                <div className="section-sub">Check your email for the 5-digit code</div>

                <div className="otp-wrap">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={el => otpInputsRef.current[index] = el}
                      className="otp-digit"
                      maxLength="1"
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    />
                  ))}
                </div>
                <div className="otp-timer">
                  Expires in <span>{formatTime()}</span>
                </div>

                <button onClick={handleVerifyOTP} className="btn btn-primary">
                  Verify OTP →
                </button>
                <div className="resend-row">
                  Didn't receive it? <a onClick={handleResendOTP}>Resend OTP</a>
                </div>
                <button 
                  onClick={() => setActivePanel(pendingOTPAction === 'forgot' ? 'forgot' : 'signup')} 
                  className="btn btn-ghost"
                >
                  ← Go Back
                </button>
              </div>
            )}

            {/* Forgot Password Panel */}
            {activePanel === 'forgot' && (
              <div className="panel active">
                <div className="section-title">Reset Password</div>
                <div className="section-sub">Enter your email to receive a reset link</div>
                <form onSubmit={handleForgotPassword}>
                  <div className="field">
                    <label>Email Address</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Send Reset Link →</button>
                </form>
                <button onClick={() => switchTab('signin')} className="btn btn-ghost">← Back to Sign In</button>
              </div>
            )}

            {/* Email Link Sent Panel */}
            {activePanel === 'link-sent' && (
              <div className="panel active">
                <div className="email-sent">
                  <div className="email-icon-big">📨</div>
                  <h3>Check Your Email</h3>
                  <p>
                    We sent a verification link to<br />
                    <strong>{currentEmail}</strong>
                  </p>
                  <p style={{ marginTop: '12px' }}>
                    Click the link to activate your account. It's valid for <strong>24 hours</strong>.
                  </p>
                </div>
                <div style={{ height: '20px' }}></div>
                <button onClick={() => switchTab('signin')} className="btn btn-primary">Back to Sign In</button>
              </div>
            )}

            {/* Reset Password Panel */}
            {activePanel === 'reset' && (
              <div className="panel active">
                <div className="section-title">New Password</div>
                <div className="section-sub">Set your new password below</div>
                <form onSubmit={handleResetPassword}>
                  <div className="field">
                    <label>New Password</label>
                    <input
                      type="password"
                      placeholder="Min 6 characters"
                      required
                      minLength="6"
                      value={resetPasswords.newPassword}
                      onChange={(e) => setResetPasswords({ ...resetPasswords, newPassword: e.target.value })}
                    />
                  </div>
                  <div className="field">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      placeholder="Re-enter password"
                      required
                      value={resetPasswords.confirmPassword}
                      onChange={(e) => setResetPasswords({ ...resetPasswords, confirmPassword: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Set Password →</button>
                </form>
              </div>
            )}
          </div>
        </div>
        </div>{/* end right-panel */}
        </div>{/* end auth-panels */}
      </div>{/* end auth-box */}
    </div>
      )}{/* end navPage === home */}
    </div>
  );
};

export default AuthPage;