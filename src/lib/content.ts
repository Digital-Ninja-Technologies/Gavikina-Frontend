// Shared static content used across pages.

export interface NavItem {
  page: string;
  label: string;
  note: string;
}

export interface NavGroup {
  key: string;
  label: string;
  items: NavItem[];
}

export const NAV: NavGroup[] = [
  { key: 'company', label: 'Company', items: [
    { page: 'about', label: 'About us', note: 'Who we are and how we work' },
    { page: 'how', label: 'How it works', note: 'Enquiry to aftercare' },
    { page: 'projects', label: 'Past projects', note: 'Commissioned installations' },
    { page: 'faq', label: 'FAQ', note: 'Common questions answered' },
  ] },
  { key: 'solutions', label: 'Solutions', items: [
    { page: 'catalogue', label: 'Product catalogue', note: 'Systems by size and price' },
    { page: 'calculator', label: 'Solar calculator', note: 'Size it yourself in a minute' },
    { page: 'assessment', label: 'Full assessment', note: 'Personalised recommendation' },
  ] },
  { key: 'opportunities', label: 'Opportunities', items: [
    { page: 'agent', label: 'Become an agent', note: 'Earn on introductions' },
    { page: 'careers', label: 'Careers', note: 'Open roles' },
    { page: 'investors', label: 'Investors guide', note: 'Request the full pack' },
  ] },
];

export const PAGE_PATHS: Record<string, string> = {
  home: '/',
  about: '/about',
  projects: '/projects',
  catalogue: '/catalogue',
  how: '/how-it-works',
  agent: '/agent',
  careers: '/careers',
  investors: '/investors',
  faq: '/faq',
  contact: '/contact',
  calculator: '/calculator',
  assessment: '/assessment',
};

export const FOOTER_COLS = [
  { label: 'Company', items: [['about', 'About us'], ['how', 'How it works'], ['projects', 'Past projects'], ['faq', 'FAQ']] },
  { label: 'Solutions', items: [['catalogue', 'Product catalogue'], ['calculator', 'Solar calculator'], ['assessment', 'Full assessment']] },
  { label: 'Opportunities', items: [['agent', 'Become an agent'], ['careers', 'Careers'], ['investors', 'Investors guide'], ['contact', 'Contact']] },
] as const;

const U = (id: string) => `https://images.unsplash.com/${id}?fm=jpg&q=70&w=1400&fit=crop&auto=format`;

export interface Project {
  id: string;
  slotId: string;
  title: string;
  location: string;
  system_size: string;
  category: 'home' | 'business';
  is_case_study: boolean;
  body: string;
  src: string;
  credit: string;
  creditHref: string;
  placeholder: string;
}

const RAW_PROJECTS = [
  { id: 'p1', title: 'Lekki Phase 1 duplex', location: 'Lekki, Lagos', system_size: '5kVA', category: 'home' as const, is_case_study: false, body: 'Full-house cover including two bedroom ACs and the borehole pump.',
    src: U('flagged/photo-1566838616631-f2618f74a6a2'), credit: 'Photo by Vivint Solar on Unsplash', creditHref: 'https://unsplash.com/@vivintsolar' },
  { id: 'p2', title: 'Ikeja private clinic', location: 'Ikeja, Lagos', system_size: '10kVA', category: 'business' as const, is_case_study: true, body: 'Ward, theatre lighting and vaccine cold chain on 24-hour autonomy.',
    src: U('photo-1707247111552-aaf74241058b'), credit: 'Photo by Chirayu Trivedi on Unsplash', creditHref: 'https://unsplash.com/@rc820' },
  { id: 'p3', title: 'Gwarinpa family home', location: 'Gwarinpa, Abuja', system_size: '3.5kVA', category: 'home' as const, is_case_study: false, body: 'Replaced a 3.5kVA petrol generator that was running six hours a night.',
    src: U('photo-1655300256335-beef51a914fe'), credit: 'Photo by Watt A Lot on Unsplash', creditHref: 'https://unsplash.com/@wattalot' },
  { id: 'p4', title: 'Ring Road supermarket', location: 'Benin City, Edo', system_size: '10kVA', category: 'business' as const, is_case_study: false, body: 'Display chillers, POS and floor lighting through the full trading day.',
    src: U('photo-1694327671725-e2a81cda3436'), credit: 'Photo by Michael Pointner on Unsplash', creditHref: 'https://unsplash.com/@pino_rumbero' },
  { id: 'p5', title: 'Ogudu terrace', location: 'Ogudu, Lagos', system_size: '2.5kVA', category: 'home' as const, is_case_study: false, body: 'Essentials backup: lights, fans, fridge, TV and charging.',
    src: U('photo-1660330589243-4c640d878052'), credit: 'Photo by Raze Solar on Unsplash', creditHref: 'https://unsplash.com/@razesolar' },
  { id: 'p6', title: 'Wuse tailoring workshop', location: 'Wuse, Abuja', system_size: '5kVA', category: 'business' as const, is_case_study: false, body: 'Six industrial machines plus pressing irons on staged loads.',
    src: U('photo-1617269778723-73a40cf299bd'), credit: 'Photo by Jeroen van de Water on Unsplash', creditHref: 'https://unsplash.com/@joenevdw' },
];

export const PROJECTS: Project[] = RAW_PROJECTS.map((p) => ({
  ...p,
  slotId: 'gv-proj-' + p.id,
  placeholder: p.title + ' — install photo',
}));

export const HERO_SLOTS = [
  { id: 'gv-hero-1', placeholder: 'Drop step 1: crew setting out the mounting rails', src: U('flagged/photo-1566838616631-f2618f74a6a2'), credit: 'Photo by Vivint Solar on Unsplash', creditHref: 'https://unsplash.com/@vivintsolar' },
  { id: 'gv-hero-2', placeholder: 'Drop step 2: lifting and placing the panels', src: U('photo-1617269778723-73a40cf299bd'), credit: 'Photo by Jeroen van de Water on Unsplash', creditHref: 'https://unsplash.com/@joenevdw' },
  { id: 'gv-hero-3', placeholder: 'Drop step 3: wiring the array and inverter', src: U('photo-1707247111552-aaf74241058b'), credit: 'Photo by Chirayu Trivedi on Unsplash', creditHref: 'https://unsplash.com/@rc820' },
  { id: 'gv-hero-4', placeholder: 'Drop step 4: finished system, commissioned', src: U('photo-1745187946672-2c1d8cf26a2b'), credit: 'Photo by Rafael Moreno on Unsplash', creditHref: 'https://unsplash.com/@rafamrn' },
];

export const FAQS = [
  { q: 'How long does an installation take?', a: 'Most residential systems are installed and commissioned in one to three days once the equipment is on site. Business installations with staged circuits can take a week. The inspection happens before anything is ordered, so the timeline you are given is the one you get.' },
  { q: 'Do I have to remove my generator?', a: 'No. Many customers keep the generator for the first few months as reassurance, then stop using it. The hybrid inverter can be configured to accept generator input for exceptional loads.' },
  { q: 'What happens on cloudy days or in the rainy season?', a: 'Panel output drops but does not stop. We size the battery bank against your chosen backup duration, so the system carries the load overnight and through low-output days. For critical business loads we size conservatively and can add a grid or generator fallback.' },
  { q: 'Can I start small and add panels later?', a: 'Yes, if the inverter is sized for it from the start. Tell the engineer during the inspection that you plan to expand and we specify an inverter and mounting layout with headroom.' },
  { q: 'Why is the price a range and not a fixed figure?', a: 'Roof type, cable runs, mounting and battery chemistry all move the cost. The range on this site covers the realistic spread for each system size. The fixed figure comes after the site inspection, and it does not move afterwards.' },
  { q: 'Do you offer instalments?', a: 'We accept staged payments against installation milestones, and we work with financing partners for larger systems. Choose your preferred method in the assessment and the engineer prepares accordingly.' },
  { q: 'What happens if something fails after installation?', a: 'Call us. Workmanship is covered by us directly; components carry their manufacturer warranty, which we register in your name at commissioning. We keep the as-built drawings so any technician we send knows your system.' },
];
