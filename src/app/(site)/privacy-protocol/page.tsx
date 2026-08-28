import { LegalLayout } from '@/components/LegalLayout';

const SECTIONS = [
  { id: 'collection', title: 'Data We Collect' },
  { id: 'use', title: 'How We Use Your Data' },
  { id: 'sharing', title: 'Data Sharing' },
  { id: 'storage', title: 'Storage & Security' },
  { id: 'rights', title: 'Your Rights' },
  { id: 'contact', title: 'Contact Us' },
];

export default function PrivacyProtocolPage() {
  return (
    <LegalLayout
      title="PRIVACY PROTOCOL"
      subtitle="Your data is yours. Here's exactly how we handle it at TECH KURUKSHETRA."
      lastUpdated="July 2027"
      sections={SECTIONS}
    >
      <h2 id="collection">Data We Collect</h2>
      <p>
        When you register for TECH KURUKSHETRA, we collect the following information to process your participation:
      </p>
      <ul>
        <li>Full name, email address, and phone number</li>
        <li>College/institution name and enrollment status</li>
        <li>Team details (if registering as a team)</li>
        <li>Project submissions and associated materials</li>
      </ul>
      <p>
        We may also collect anonymized usage data from our website (e.g., page views, referral sources) via Google Analytics to improve our platform.
      </p>

      <h2 id="use">How We Use Your Data</h2>
      <p>Your data is used strictly for event administration, including:</p>
      <ul>
        <li>Sending confirmation emails and event updates</li>
        <li>Printing participant badges and materials</li>
        <li>Communicating with shortlisted teams</li>
        <li>Publishing results and recognizing winners</li>
      </ul>

      <h2 id="sharing">Data Sharing</h2>
      <p>
        We do not sell, trade, or rent your personal data to third parties. Sponsor logos may appear on the website for acknowledgment, but sponsors do not receive individual participant data unless you explicitly opt-in to a sponsor-specific prize or offer.
      </p>

      <h2 id="storage">Storage & Security</h2>
      <p>
        Your data is stored securely using encrypted MongoDB database infrastructure with enterprise-grade access controls. We employ HTTPS encryption for all data transmission. Access to the admin dashboard is strictly restricted to authenticated administrators only.
      </p>

      <h2 id="rights">Your Rights</h2>
      <p>
        You have the right to request access to, correction of, or deletion of your personal data at any time. To exercise these rights, contact us at <a href="mailto:btech_events@svgu.ac.in">btech_events@svgu.ac.in</a>.
      </p>

      <h2 id="contact">Contact Us</h2>
      <p>
        For any privacy-related questions or concerns, please reach out to our data officer at <a href="mailto:btech_events@svgu.ac.in">btech_events@svgu.ac.in</a> or visit the <a href="/contact">Contact page</a>.
      </p>
    </LegalLayout>
  );
}