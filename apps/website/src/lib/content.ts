// Website-only presentation content (navigation copy, marketing photography).
// Structured data that both apps need (sizing tiers, past-project records)
// lives in @gavikina/engine instead.

export interface NavItem {
  path: string;
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
    { path: '/about', label: 'About us', note: 'Who we are and how we work' },
    { path: '/how-it-works', label: 'How it works', note: 'Enquiry to aftercare' },
    { path: '/projects', label: 'Past projects', note: 'Commissioned installations' },
    { path: '/faq', label: 'FAQ', note: 'Common questions answered' },
  ] },
  { key: 'solutions', label: 'Solutions', items: [
    { path: '/catalogue', label: 'Product catalogue', note: 'Systems by size and price' },
    { path: '/calculator', label: 'Solar calculator', note: 'Size it yourself in a minute' },
    { path: '/assessment', label: 'Full assessment', note: 'Personalised recommendation' },
  ] },
  { key: 'opportunities', label: 'Opportunities', items: [
    { path: '/agent', label: 'Become an agent', note: 'Earn on introductions' },
    { path: '/careers', label: 'Careers', note: 'Open roles' },
    { path: '/investors', label: 'Investors guide', note: 'Request the full pack' },
  ] },
];

export const FOOTER_COLS: { label: string; items: [string, string][] }[] = [
  { label: 'Company', items: [['/about', 'About us'], ['/how-it-works', 'How it works'], ['/projects', 'Past projects'], ['/faq', 'FAQ']] },
  { label: 'Solutions', items: [['/catalogue', 'Product catalogue'], ['/calculator', 'Solar calculator'], ['/assessment', 'Full assessment']] },
  { label: 'Opportunities', items: [['/agent', 'Become an agent'], ['/careers', 'Careers'], ['/investors', 'Investors guide'], ['/contact', 'Contact']] },
];

const U = (id: string) => `https://images.unsplash.com/${id}?fm=jpg&q=70&w=1400&fit=crop&auto=format`;

export interface Photo {
  src: string;
  credit: string;
  creditHref: string;
}

export const HERO_SLOTS: (Photo & { id: string; placeholder: string })[] = [
  { id: 'gv-hero-1', placeholder: 'Drop step 1: crew setting out the mounting rails', src: U('flagged/photo-1566838616631-f2618f74a6a2'), credit: 'Photo by Vivint Solar on Unsplash', creditHref: 'https://unsplash.com/@vivintsolar' },
  { id: 'gv-hero-2', placeholder: 'Drop step 2: lifting and placing the panels', src: U('photo-1617269778723-73a40cf299bd'), credit: 'Photo by Jeroen van de Water on Unsplash', creditHref: 'https://unsplash.com/@joenevdw' },
  { id: 'gv-hero-3', placeholder: 'Drop step 3: wiring the array and inverter', src: U('photo-1707247111552-aaf74241058b'), credit: 'Photo by Chirayu Trivedi on Unsplash', creditHref: 'https://unsplash.com/@rc820' },
  { id: 'gv-hero-4', placeholder: 'Drop step 4: finished system, commissioned', src: U('photo-1745187946672-2c1d8cf26a2b'), credit: 'Photo by Rafael Moreno on Unsplash', creditHref: 'https://unsplash.com/@rafamrn' },
];

// Keyed by the shared Project.id (from @gavikina/engine) — the admin
// dashboard only tracks a photo COUNT (no upload pipeline yet), so the
// actual marketing photography lives here until a real media backend exists.
export const PROJECT_PHOTOS: Record<string, Photo> = {
  p1: { src: U('flagged/photo-1566838616631-f2618f74a6a2'), credit: 'Photo by Vivint Solar on Unsplash', creditHref: 'https://unsplash.com/@vivintsolar' },
  p2: { src: U('photo-1707247111552-aaf74241058b'), credit: 'Photo by Chirayu Trivedi on Unsplash', creditHref: 'https://unsplash.com/@rc820' },
  p3: { src: U('photo-1655300256335-beef51a914fe'), credit: 'Photo by Watt A Lot on Unsplash', creditHref: 'https://unsplash.com/@wattalot' },
  p4: { src: U('photo-1694327671725-e2a81cda3436'), credit: 'Photo by Michael Pointner on Unsplash', creditHref: 'https://unsplash.com/@pino_rumbero' },
  p5: { src: U('photo-1660330589243-4c640d878052'), credit: 'Photo by Raze Solar on Unsplash', creditHref: 'https://unsplash.com/@razesolar' },
  p6: { src: U('photo-1617269778723-73a40cf299bd'), credit: 'Photo by Jeroen van de Water on Unsplash', creditHref: 'https://unsplash.com/@joenevdw' },
};

export const CASE_STUDY_PHOTO: Photo = {
  src: U('photo-1668097613572-40b7c11c8727'),
  credit: 'Photo by Markus Spiske on Unsplash',
  creditHref: 'https://unsplash.com/@markusspiske',
};

export const ABOUT_PHOTO: Photo = {
  src: U('photo-1660330589257-813305a4a383'),
  credit: 'Photo by Raze Solar on Unsplash',
  creditHref: 'https://unsplash.com/@razesolar',
};

export const FAQS = [
  { q: 'How long does an installation take?', a: 'Most residential systems are installed and commissioned in one to three days once the equipment is on site. Business installations with staged circuits can take a week. The inspection happens before anything is ordered, so the timeline you are given is the one you get.' },
  { q: 'Do I have to remove my generator?', a: 'No. Many customers keep the generator for the first few months as reassurance, then stop using it. The hybrid inverter can be configured to accept generator input for exceptional loads.' },
  { q: 'What happens on cloudy days or in the rainy season?', a: 'Panel output drops but does not stop. We size the battery bank against your chosen backup duration, so the system carries the load overnight and through low-output days. For critical business loads we size conservatively and can add a grid or generator fallback.' },
  { q: 'Can I start small and add panels later?', a: 'Yes, if the inverter is sized for it from the start. Tell the engineer during the inspection that you plan to expand and we specify an inverter and mounting layout with headroom.' },
  { q: 'Why is the price a range and not a fixed figure?', a: 'Roof type, cable runs, mounting and battery chemistry all move the cost. The range on this site covers the realistic spread for each system size. The fixed figure comes after the site inspection, and it does not move afterwards.' },
  { q: 'Do you offer instalments?', a: 'We accept staged payments against installation milestones, and we work with financing partners for larger systems. Choose your preferred method in the assessment and the engineer prepares accordingly.' },
  { q: 'What happens if something fails after installation?', a: 'Call us. Workmanship is covered by us directly; components carry their manufacturer warranty, which we register in your name at commissioning. We keep the as-built drawings so any technician we send knows your system.' },
];
