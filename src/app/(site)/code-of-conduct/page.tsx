import { LegalLayout } from '@/components/LegalLayout';

const SECTIONS = [
  { id: 'spirit', title: 'Spirit of the Event' },
  { id: 'respect', title: 'Respect & Inclusion' },
  { id: 'fair-play', title: 'Fair Play' },
  { id: 'digital', title: 'Digital Conduct' },
  { id: 'venue', title: 'Venue Rules' },
  { id: 'media', title: 'Media & Photography' },
  { id: 'enforcement', title: 'Enforcement' },
  { id: 'reporting', title: 'Reporting Violations' },
];

export default function CodeOfConductPage() {
  return (
    <LegalLayout
      title="CODE OF CONDUCT"
      subtitle="TECH KURUKSHETRA is a battlefield of minds — but every warrior is bound by a code."
      lastUpdated="July 2027"
      sections={SECTIONS}
    >
      <h2 id="spirit">Spirit of the Event</h2>
      <p>
        TECH KURUKSHETRA was founded on the principle that technical excellence thrives in an environment of mutual respect, collaborative spirit, and intellectual integrity. This code applies to all participants, volunteers, judges, and sponsors — from the moment you register to the closing ceremony.
      </p>

      <h2 id="respect">Respect & Inclusion</h2>
      <p>
        We are committed to providing a harassment-free experience for everyone, regardless of gender, gender identity, age, sexual orientation, disability, physical appearance, body size, race, ethnicity, religion, or technical experience. Harassment in any form — verbal, physical, or digital — will not be tolerated.
      </p>
      <ul>
        <li>Treat all participants, judges, volunteers, and guests with dignity.</li>
        <li>Language and imagery that is discriminatory or degrading is prohibited.</li>
        <li>Respect personal boundaries and privacy at all times.</li>
      </ul>

      <h2 id="fair-play">Fair Play</h2>
      <p>
        All submissions must be the original work of the registered team. Using pre-built templates, purchasing third-party work, or submitting work from outside the hackathon window (where applicable) is strictly prohibited.
      </p>
      <ul>
        <li>Open-source libraries are permitted — document all external code used.</li>
        <li>AI tools (e.g., GitHub Copilot, ChatGPT) may be used unless an arena specifically prohibits them — declare usage during judging.</li>
        <li>Judges' decisions are final. Do not attempt to influence judges outside designated Q&A sessions.</li>
      </ul>

      <h2 id="digital">Digital Conduct</h2>
      <p>
        Participants must not attempt to interfere with any network infrastructure, other teams' systems, or event equipment. Any deliberate attack on shared systems or unauthorized access attempts will result in immediate disqualification and may be reported to authorities.
      </p>

      <h2 id="venue">Venue Rules</h2>
      <ul>
        <li>Carry a valid college/institution ID at all times during the event.</li>
        <li>No alcohol, drugs, or prohibited substances on the premises.</li>
        <li>Participants are responsible for keeping their workspace clean.</li>
        <li>All equipment brought to the venue is the participant's responsibility.</li>
        <li>Follow all UCPIT campus policies regarding entry, exit, and conduct.</li>
      </ul>

      <h2 id="media">Media & Photography</h2>
      <p>
        TECH KURUKSHETRA may photograph and record the event for promotional use. If you do not wish to appear in photos or videos, notify the organizing team at registration. Participants may photograph and record for personal use but must not publish footage that features other individuals without their consent.
      </p>

      <h2 id="enforcement">Enforcement</h2>
      <p>
        Violations of this code of conduct may result in:
      </p>
      <ul>
        <li>A verbal or written warning</li>
        <li>Immediate disqualification from the event</li>
        <li>Removal from the venue without refund</li>
        <li>Reporting to the participant's college/institution</li>
        <li>Legal action for criminal conduct</li>
      </ul>
      <p>
        The organizing committee reserves the right to take any action deemed appropriate in response to a violation. All decisions are final.
      </p>

      <h2 id="reporting">Reporting Violations</h2>
      <p>
        If you witness or experience a code of conduct violation, report it immediately to any organizing committee member or contact us at <a href="mailto:btech_events@svgu.ac.in">btech_events@svgu.ac.in</a>. All reports will be handled discreetly and with urgency.
      </p>
    </LegalLayout>
  );
}
