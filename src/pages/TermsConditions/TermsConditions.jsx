import React, { useEffect } from 'react';
import './TermsConditions.css';

export default function TermsConditions() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="terms-page">
      <section className="terms-hero">
        <div className="container">
          <span className="eyebrow">Water Filter Africa</span>
          <h1>Terms & Conditions</h1>
          <p className="subtitle">Buyer Agreement and Terms of Service.</p>
        </div>
      </section>

      <section className="terms-content-section">
        <div className="container content-container">
          <div className="terms-card-large">
            <div className="content-block">
              <h2>1. Buyer’s Account & Registration Obligations</h2>
              <p>
                If the Buyers use the Website and register as a buyer, The Buyers shall be Authoritative for maintaining 
                the secrecy of Buyer’s Display Name and Password and the buyer shall be responsible for all the activities 
                which occur under Buyer’s Name and Password.
              </p>
              <p>
                If the Buyer provides any irrelevant information or fake information on Water Filter Africa, in that case, 
                Water Filter Africa shall have the right to indefinitely suspend or terminate or block access of Buyer’s 
                membership on the website and refuse to provide the Buyers with access to the Website.
              </p>
            </div>

            <div className="content-block">
              <h2>2. Website Registration & Service Charges</h2>
              <p>
                Registration on the Website is free for buyers. Water Filter Africa does not charge any fee for browsing 
                and buying on the website.
              </p>
              <p>
                However, Water Filter Africa reserves the right to change its Fee Policy from time to time. In this regard, 
                Water Filter Africa is legitimate to introduce new services and modify some or all of the existing services 
                offered on the Website.
              </p>
            </div>

            <div className="content-block">
              <h2>3. Replacement Policy & Warranty</h2>
              <p>
                The Buyer undertakes to take all the necessary measures to preserve in good condition all the products ordered 
                and delivered by Water Filter Africa.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
