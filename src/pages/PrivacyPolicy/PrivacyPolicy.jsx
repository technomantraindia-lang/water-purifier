import React, { useEffect } from 'react';
import './PrivacyPolicy.css';

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="policy-page">
      <section className="policy-hero">
        <div className="container">
          <span className="eyebrow">Water Filter Africa</span>
          <h1>Privacy Policy</h1>
          <p className="subtitle">Securing your privacy is our primary motive.</p>
        </div>
      </section>

      <section className="policy-content-section">
        <div className="container content-container">
          <div className="policy-card-large">
            <p className="lead-text">
              Buyers' privacy is the most precious asset that Water Filter Africa has. Securing your privacy is our motive. 
              This is why we store and process your information including any sensitive financial information collected on that 
              system that may be protected by physical security along with technological security measures and procedures in 
              accordance with IT Act 2000 and Rules thereunder.
            </p>

            <div className="content-block">
              <h2>Data Collection & Analysis</h2>
              <p>
                Water Filter Africa records, stores, and analyses the data which is available to us through any of our 
                platforms and stores. Majorly the data comes when a purchase is made at any store or on the website.
              </p>
            </div>

            <div className="content-block">
              <h2>Information We Request</h2>
              <p>The following is the information we request the Buyer to furnish:</p>
              <ul className="info-list">
                <li>
                  <span className="bullet-num">a</span>
                  <div>
                    <strong>Mobile and Email:</strong> Used to communicate order updates, digital receipts, and support inquiries.
                  </div>
                </li>
                <li>
                  <span className="bullet-num">b</span>
                  <div>
                    <strong>First name / Last name:</strong> Required for account customization, identification, and shipping logistics.
                  </div>
                </li>
                <li>
                  <span className="bullet-num">c</span>
                  <div>
                    <strong>Postal code:</strong> Used to calculate delivery zones, shipping fees, and local service availability.
                  </div>
                </li>
                <li>
                  <span className="bullet-num">d</span>
                  <div>
                    <strong>Opt-in preference (SMS/Email):</strong> Allows us to respect your communication choices for marketing materials.
                  </div>
                </li>
              </ul>
            </div>

            <div className="content-block">
              <h2>How We Use This Information</h2>
              <p>
                This information helps us to collect feedback from the customers, refine our service delivery, and disclose 
                our latest promotional offers and engineering solutions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
