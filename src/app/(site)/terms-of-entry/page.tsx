import { LegalLayout } from '@/components/LegalLayout';
import { buildPageMeta } from '@/lib/seo';

export const metadata = buildPageMeta({
  title: 'Terms of Entry | TECH KURUKSHETRA 2027',
  description:
    'Official eligibility, registration, and conduct terms for Tech Kurukshetra 2027 participants at UCPIT, SVGU Ahmedabad.',
  path: '/terms-of-entry',
});

const SECTIONS = [
  { id: 'eligibility', title: 'Eligibility' },
  { id: 'registration', title: 'Registration & Fees' },
  { id: 'conduct', title: 'Code of Conduct' },
  { id: 'ip', title: 'Intellectual Property' },
  { id: 'liability', title: 'Liability' },
  { id: 'disqualification', title: 'Disqualification' },
  { id: 'amendments', title: 'Amendments' },
];

export default function TermsOfEntryPage() {
  return (
    <LegalLayout
      title="TERMS OF ENTRY"
      subtitle="Please read these terms carefully before registering for TECH KURUKSHETRA 2027."
      lastUpdated="January 2027"
      sections={SECTIONS}
    >
      <h2 id="eligibility">Eligibility</h2>
      <p>
        TECH KURUKSHETRA 2027 is open to all currently enrolled undergraduate and postgraduate students across India. Participants must carry a valid college ID for verification at the venue. Alumni, faculty, and professionals are not eligible to compete but may attend as guests.
      </p>

      <h2 id="registration">Registration & Fees</h2>
      <p>
        Registration is free for all arenas unless otherwise stated on the arena-specific detail page. In the event of any paid arenas, the fee is non-refundable after the registration deadline. Slots are allocated on a first-come, first-served basis.
      </p>
      <ul>
        <li>Individual registrations must be completed per participant.</li>
        <li>Team registrations require a team leader who is responsible for all communications.</li>
        <li>Duplicate registrations will result in automatic disqualification.</li>
      </ul>

      <h2 id="conduct">Code of Conduct</h2>
      <p>
        All participants are expected to maintain a respectful and professional environment throughout the event. Any form of harassment, plagiarism, or unsportsmanlike conduct will result in immediate disqualification and removal from the venue.
      </p>

      <h2 id="ip">Intellectual Property</h2>
      <p>
        Participants retain full ownership of their project submissions. However, by participating, you grant TECH KURUKSHETRA a non-exclusive, royalty-free license to showcase, photograph, and promote your project for event-related marketing purposes.
      </p>

      <h2 id="liability">Liability</h2>
      <p>
        TECH KURUKSHETRA and SVGU Ahmedabad are not liable for any loss, damage, or injury sustained during the event. Participants are responsible for their own equipment and belongings.
      </p>

      <h2 id="disqualification">Disqualification</h2>
      <p>
        The organizing committee reserves the right to disqualify any team or individual for violation of these terms, unsportsmanlike behavior, or any action deemed harmful to the event's integrity. Decisions of the committee are final and binding.
      </p>

      <h2 id="amendments">Amendments</h2>
      <p>
        TECH KURUKSHETRA reserves the right to amend these terms at any time. Registered participants will be notified of any major changes via the email provided during registration.
      </p>
    </LegalLayout>
  );
}