/**
 * SEO / AEO / GEO — Single Source of Truth
 * ─────────────────────────────────────────
 * All structured-data constants, per-page metadata helpers,
 * and FAQ content live here. Import from this file only —
 * never hardcode URLs or schema in page components directly.
 */

// ── Canonical identity ────────────────────────────────────────────────────────
export const SITE_URL   = 'https://www.techkurukshetra.in';
export const SITE_NAME  = 'TECH KURUKSHETRA';
export const OG_IMAGE   = `${SITE_URL}/og-image.png`;
export const LOGO_URL   = `${SITE_URL}/favicon.ico`;

// Event facts — update these when official dates are confirmed
export const EVENT_YEAR       = '2027';
export const EVENT_START_DATE = '2027-01-20';
export const EVENT_END_DATE   = '2027-01-21';
export const EVENT_VENUE_NAME = 'UCPIT — Chimanbhai Patel Institute Campus';
export const EVENT_VENUE_ADDR = 'SG Highway, Near Prahlad Nagar, Ahmedabad, Gujarat 380015, India';
export const CONTACT_EMAIL    = 'btech_events@svgu.ac.in';

// Social / entity URLs — used in sameAs and footer links
export const SOCIAL = {
  tkInstagram  : 'https://www.instagram.com/svgutechkurukshetra',
  svguSite     : 'https://svgu.ac.in',
  svguInstagram: 'https://www.instagram.com/svguniversity',
} as const;

// ── Metadata helper ───────────────────────────────────────────────────────────
interface PageMetaOptions {
  title       : string;   // Final page title (template wraps it)
  description : string;
  path        : string;   // e.g. '/register'
  ogImage?    : string;
}

export function buildPageMeta({ title, description, path, ogImage }: PageMetaOptions) {
  const url = `${SITE_URL}${path}`;
  const image = ogImage || OG_IMAGE;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type       : 'website' as const,
      url,
      title,
      description,
      siteName   : SITE_NAME,
      images     : [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card       : 'summary_large_image' as const,
      title,
      description,
      images     : [image],
    },
  };
}

// ── Organization schema (homepage + sameAs) ───────────────────────────────────
export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type'   : 'Organization',
  name      : SITE_NAME,
  url       : SITE_URL,
  logo      : LOGO_URL,
  email     : CONTACT_EMAIL,
  sameAs    : [
    SOCIAL.tkInstagram,
    SOCIAL.svguSite,
    SOCIAL.svguInstagram,
  ],
  parentOrganization: {
    '@type': 'EducationalOrganization',
    name   : 'Sardar Vallabhbhai Global University (SVGU)',
    url    : SOCIAL.svguSite,
  },
};

// ── Festival / Event schema (homepage overview) ───────────────────────────────
export const FESTIVAL_SCHEMA = {
  '@context'            : 'https://schema.org',
  '@type'               : 'Festival',
  name                  : `${SITE_NAME} ${EVENT_YEAR}`,
  url                   : SITE_URL,
  startDate             : EVENT_START_DATE,
  endDate               : EVENT_END_DATE,
  eventStatus           : 'https://schema.org/EventScheduled',
  eventAttendanceMode   : 'https://schema.org/OfflineEventAttendanceMode',
  isAccessibleForFree   : true,
  description           : `Tech Kurukshetra ${EVENT_YEAR} is a two-day national tech festival organized by the B.Tech Department at SVGU (Sardar Vallabhbhai Global University), held on January 20–21, ${EVENT_YEAR} at UCPIT, Ahmedabad. The festival features 12 competitive arenas spanning hackathons, coding competitions, cybersecurity, gaming, and non-technical events. Participation is free and open to all enrolled undergraduate and postgraduate students across India.`,
  location: {
    '@type'  : 'Place',
    name     : EVENT_VENUE_NAME,
    address  : {
      '@type'         : 'PostalAddress',
      streetAddress   : 'SG Highway, Near Prahlad Nagar',
      addressLocality : 'Ahmedabad',
      postalCode      : '380015',
      addressRegion   : 'GJ',
      addressCountry  : 'IN',
    },
  },
  organizer: ORGANIZATION_SCHEMA,
  offers: {
    '@type'       : 'Offer',
    price         : '0',
    priceCurrency : 'INR',
    availability  : 'https://schema.org/InStock',
    url           : `${SITE_URL}/register`,
  },
};

// ── FAQ content — used for FAQPage schema AND React rendering ─────────────────
export const FAQ_ITEMS: Array<{ question: string; answer: string }> = [
  {
    question: 'What is Tech Kurukshetra?',
    answer  : `Tech Kurukshetra is a two-day national technical festival organized by the B.Tech Department at SVGU (Sardar Vallabhbhai Global University), held at UCPIT, Ahmedabad. It features 12 competitive arenas spanning hackathons, code sprints, cybersecurity challenges, gaming tournaments, and non-technical events, bringing together 1,000+ students from across India.`,
  },
  {
    question: `When is Tech Kurukshetra ${EVENT_YEAR}?`,
    answer  : `Tech Kurukshetra ${EVENT_YEAR} is held on January 20–21, ${EVENT_YEAR}. Registration deadlines vary by arena and typically close 1–2 days before each event. Check the Timeline page for exact milestone dates.`,
  },
  {
    question: `Where is Tech Kurukshetra ${EVENT_YEAR} held?`,
    answer  : `Tech Kurukshetra ${EVENT_YEAR} is held at UCPIT — Chimanbhai Patel Institute Campus, SG Highway, Near Prahlad Nagar, Ahmedabad, Gujarat 380015, India, under SVGU (Sardar Vallabhbhai Global University).`,
  },
  {
    question: `How do I register for Tech Kurukshetra ${EVENT_YEAR}?`,
    answer  : `Registration is free and fully online at techkurukshetra.in/register. Select your arena, enter your team details (team size requirements vary by event), and submit before the per-event deadline. You will receive a confirmation on screen after successful submission.`,
  },
  {
    question: `Is Tech Kurukshetra ${EVENT_YEAR} free to attend?`,
    answer  : `Yes — participation in all 12 event arenas at Tech Kurukshetra ${EVENT_YEAR} is free for registered students. Participants must carry a valid college/institution ID for verification at the venue.`,
  },
  {
    question: `What events are at Tech Kurukshetra ${EVENT_YEAR}?`,
    answer  : `Tech Kurukshetra ${EVENT_YEAR} features 12 arenas: 5 technical events (Hackathon, Project Showcase, Hands-on Tech Workshop, Code Sprint, Digital Forensics Hunt / CTF) and 7 non-technical events (BGMI, Valorant, Chess, Badminton, Volleyball, Carrom, Rangoli). Each event has specific team-size requirements and registration deadlines listed on the Arenas page.`,
  },
];

// ── FAQPage schema ────────────────────────────────────────────────────────────
export const FAQ_SCHEMA = {
  '@context'  : 'https://schema.org',
  '@type'     : 'FAQPage',
  mainEntity  : FAQ_ITEMS.map(({ question, answer }) => ({
    '@type'          : 'Question',
    name             : question,
    acceptedAnswer   : {
      '@type': 'Answer',
      text  : answer,
    },
  })),
};

// ── Breadcrumb helper ─────────────────────────────────────────────────────────
export function buildBreadcrumbSchema(
  items: Array<{ name: string; path: string }>
) {
  return {
    '@context'        : 'https://schema.org',
    '@type'           : 'BreadcrumbList',
    itemListElement   : items.map((item, index) => ({
      '@type'   : 'ListItem',
      position  : index + 1,
      name      : item.name,
      item      : `${SITE_URL}${item.path}`,
    })),
  };
}
