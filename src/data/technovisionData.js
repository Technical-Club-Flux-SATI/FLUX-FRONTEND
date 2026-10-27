/**
 * Technovision 2026 — Competition Configuration
 * 
 * All competition data used across landing page, details, registration,
 * and admin dashboard. Edit this file to update event information.
 * 
 * IMPORTANT: Dates, fees, prizes, and rules below are taken from the
 * existing Technovision_26.jsx page. Update them when organizers confirm.
 */

// ── Competition Images ─────────────────────────────────────────────────
import bannerModel from '../assets/events/technovision_2026/competition-banners/model-presentation.png';
import bannerRobo from '../assets/events/technovision_2026/competition-banners/robo-rumble.png';
import bannerRopeway from '../assets/events/technovision_2026/competition-banners/robo-obstacle.png';
import groupImg from '../assets/events/technovision_2026/group.jpeg';
import roboIcon from '../assets/events/technovision_2026/robo_rumble_icon.webp';

// Model presentation gallery
import model1 from '../assets/events/technovision_2026/model/1.jpeg';
import model2 from '../assets/events/technovision_2026/model/2.jpeg';
import model3 from '../assets/events/technovision_2026/model/3.jpeg';

// Robo Rumble gallery
import robo1 from '../assets/events/technovision_2026/robo/1.jpeg';
import robo2 from '../assets/events/technovision_2026/robo/2.jpeg';
import robo3 from '../assets/events/technovision_2026/robo/3.jpeg';

// Ropeway gallery
import ropeway1 from '../assets/events/technovision_2026/ropeway/1.jpeg';
import ropeway2 from '../assets/events/technovision_2026/ropeway/2.jpeg';
import ropeway3 from '../assets/events/technovision_2026/ropeway/3.jpeg';

// ── Event Metadata ─────────────────────────────────────────────────────
export const EVENT_META = {
  name: 'Technovision 2026',
  tagline: 'Innovate. Build. Compete.',
  year: 2026,
  edition: '2026',
  dates: '2 – 3 November 2026',
  venue: 'SATI College, Vidisha',
  venueMapUrl: 'https://maps.app.goo.gl/fTdZm1HhBHnK9JYEA',
  organizer: 'Technical Club FLUX',
  institute: 'Samrat Ashok Technological Institute (SATI), Vidisha',
  email: 'flux.club@satiengg.in',
  whatsappGroup: 'https://chat.whatsapp.com/ITmlgvbmiM7Bu8GGWddYxc',
  rulebookUrl: 'https://drive.google.com/file/d/1Ee689teCqFrLVJWEA8Y7S83k3lH9xODN/view?usp=drive_link',
  heroImage: groupImg,
  contacts: [
    { name: 'Pramit Singh', phone: '7828879681', displayPhone: '78288 79681' },
    { name: 'Devansh Patel', phone: '9302276804', displayPhone: '93022 76804' },
    { name: 'Dhananjay Rawat', phone: '9238138023', displayPhone: '92381 38023' },
    { name: 'Anshika Shukla', phone: '7805823575', displayPhone: '78058 23575' },
  ],
};

// ── Application ID Prefix Codes ────────────────────────────────────────
export const COMP_CODES = {
  'model-presentation': 'MP',
  'robo-obstacle-challenge': 'ROC',
  'robo-rumble': 'RR',
};

// ── Application Statuses ───────────────────────────────────────────────
export const APP_STATUSES = {
  SUBMITTED: { label: 'Submitted', color: 'blue', description: 'Registration successfully received.' },
  UNDER_REVIEW: { label: 'Under Review', color: 'amber', description: 'Organizers are reviewing the application.' },
  APPROVED: { label: 'Approved', color: 'emerald', description: 'Application accepted.' },
  WAITLISTED: { label: 'Waitlisted', color: 'orange', description: 'Application placed on the waiting list.' },
  REJECTED: { label: 'Rejected', color: 'red', description: 'Application not accepted.' },
  WITHDRAWN: { label: 'Withdrawn', color: 'slate', description: 'Application withdrawn.' },
};

export const STATUS_ORDER = ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED'];

// ── Academic Years ─────────────────────────────────────────────────────
export const ACADEMIC_YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

// ── Competitions ───────────────────────────────────────────────────────
export const COMPETITIONS = [
  {
    id: 'model-presentation',
    slug: 'model-presentation',
    code: 'MP',
    title: 'Model Presentation',
    shortTitle: 'Model Presentation',
    categoryBadge: 'Hardware & IoT',
    categoryColor: 'emerald',
    icon: 'Lightbulb',
    banner: bannerModel,
    gallery: [model1, model2, model3],
    shortDescription: 'Hardware, Working Models & Innovation',
    overview: `Model Presentation is an innovation-driven technical event where participants present their hardware robots, kits, and working models. The event focuses on structured presentation, technical explanation, and critical evaluation. Participants are expected to demonstrate the functionality of their model and present its real-world applications to a panel of judges.`,
    objectives: [
      'Encourage students to think creatively and develop innovative engineering solutions',
      'Provide a platform to showcase working models and science projects',
      'Develop presentation, communication, and technical explanation skills',
      'Foster hands-on learning and practical application of theoretical concepts',
    ],
    eligibility: [
      'Open to all college and school students',
      'Participants from other institutes are welcome',
      'Individual or team participation allowed',
    ],
    participationType: 'both', // Single or team
    participationLabels: { individual: 'Single', team: 'Team (2–4 Members)' },
    maxTeamSize: 4,
    minTeamSize: 2,
    equipment: [
      'Working model / hardware project (must be brought by participants)',
      'Any necessary power source or batteries',
      'Supporting charts, posters, or digital presentations (optional)',
    ],
    rules: [
      'The project must be hardware-based (working model only) or science-based.',
      'The project must be safe to operate and must demonstrate a valid technical concept.',
      'The project must be original. Copied or commercially available ready-made projects may lead to disqualification.',
      'The use of dangerous materials, chemicals, explosives, or high-risk components is strictly prohibited.',
      'Participants are expected to maintain proper decorum and discipline at the venue.',
      'Any violent behavior or unprofessional conduct towards organizers or other participants will result in immediate disqualification and removal from the venue.',
      'The organizing committee has the right to modify the schedule or structure of the event if required.',
    ],
    judgingCriteria: [
      'Innovation and creativity of the project',
      'Technical soundness and working condition',
      'Quality of presentation and explanation',
      'Real-world applicability and impact',
      'Originality of concept',
    ],
    prizes: [
      'Winner: Goodies & Certificates',
      'Participation Certificates for all',
    ],
    timeline: [
      { label: 'Registration Deadline', date: '1 Nov 2026' },
      { label: 'Presentation Day', date: '2 Nov 2026' },
    ],
    registrationDeadline: '2026-11-01',
    eventDate: '2 Nov 2026',
    faqs: [
      { q: 'Is there a registration fee?', a: 'There is no fee for Model Presentation.' },
      { q: 'Can I participate individually?', a: 'Yes, both individual and team participation is allowed.' },
      { q: 'What type of models are accepted?', a: 'Only hardware-based working models or science-based projects are accepted. Software-only projects are not eligible.' },
      { q: 'Can I bring a commercially available kit?', a: 'The project must be original. Commercially available ready-made projects may lead to disqualification.' },
    ],
  },
  {
    id: 'robo-obstacle-challenge',
    slug: 'robo-obstacle-challenge',
    code: 'WB',
    title: 'Walking Bot',
    subtitle: '(Strictly No Wheels)',
    shortTitle: 'Walking Bot',
    categoryBadge: 'Locomotion Innovation',
    categoryBadgeSecondary: 'Strictly No Wheels',
    categoryColor: 'cyan',
    icon: 'Bot',
    banner: bannerRopeway,
    gallery: [ropeway1, ropeway2, ropeway3],
    tagline: '🛑 No wheels allowed. Legged linkages, inchworms & crawlers only.',
    shortDescription: 'Legged, Crawlers & Non-Wheeled Locomotion',
    overview: 'Obstacle sprint for custom robots built strictly without wheels, using legged linkages or crawlers.',
    notice: 'All bots must be completed by 30 October. A screening round will be held on 31 October. Only 15 shortlisted teams will be selected for Walking Bot.',
    objectives: [
      'Encourage creative non-wheeled mechanical design and biomimicry',
      'Test engineering and precision in multi-terrain obstacle traversal',
      'Promote innovative locomotion techniques like Theo Jansen and Klann linkages',
      'Foster teamwork in robotics mechanics and electronic control',
    ],
    eligibility: [
      'Open to all college and school students',
      'Participants from other institutes are welcome',
      'Single or dual participation allowed',
    ],
    participationType: 'both',
    participationLabels: { individual: 'Single', team: 'Dual (2 Members)' },
    maxTeamSize: 2,
    minTeamSize: 2,
    equipment: [
      'Custom-built robot built strictly without wheels',
      'Legged linkages, inchworms, crawlers, or sliding mechanisms',
      'Maximum power supply: up to 12V DC',
      'Remote controller and batteries',
    ],
    rules: [
      'NO wheels or circular rolling elements for movement.',
      'Allowed: Theo Jansen/Klann linkages, walkers, inchworms, crawlers, sliding linkages.',
      'Bot must cross the multi-terrain obstacle track in minimum time. Power supply up to 12V DC.',
      'Team size: 2 to 4 members.',
      'Accepted Locomotion Inspirations: Theo Jansen leg linkages, Klann linkages, bipedal or quadruped walkers, peristaltic / inchworm crawlers, and linear slide skating mechanisms. Any wheel usage results in immediate disqualification.',
    ],
    inspirations: 'Theo Jansen leg linkages, Klann linkages, bipedal or quadruped walkers, peristaltic / inchworm crawlers, and linear slide skating mechanisms. Any wheel usage results in immediate disqualification.',
    arenaTimeline: {
      registrationDeadline: '30 Oct 2026',
      eventDateTime: '02 Nov 2026 (10:30 AM)',
      location: 'SU Ground',
    },
    rewards: [
      'Fastest Bot Winner: Trophy, Goodies & Certificate',
      'Innovation in Locomotion Award',
      'Participation Certificates for all builders',
    ],
    judgingCriteria: [
      'Track traversal speed & completion time',
      'Mechanical design, stability, and walking mechanics',
      'Strict adherence to no-wheel constraints',
      'Innovation in locomotion mechanisms',
    ],
    prizes: [
      'Fastest Bot Winner: Trophy, Goodies & Certificate',
      'Innovation in Locomotion Award',
      'Participation Certificates for all builders',
    ],
    pdfRulebook: '/events/technovision_2026/robo_walk_rules.pdf',
    timeline: [
      { label: 'Registration Deadline', date: '30 Oct 2026' },
      { label: 'Screening Round (Top 15 Teams)', date: '31 Oct 2026' },
      { label: 'Obstacle Sprint Event (10:30 AM)', date: '02 Nov 2026' },
    ],
    registrationDeadline: '2026-10-30',
    eventDate: '02 Nov 2026 (10:30 AM)',
    location: 'SU Ground',
    faqs: [
      { q: 'Are wheels allowed in any form?', a: 'NO. Wheels or circular rolling elements for movement are strictly prohibited and will lead to immediate disqualification.' },
      { q: 'What mechanisms are permitted?', a: 'Theo Jansen linkages, Klann linkages, bipedal or quadruped walkers, peristaltic/inchworm crawlers, and linear slide skating mechanisms are allowed.' },
      { q: 'What is the team size?', a: 'Team size is 2 to 4 members.' },
      { q: 'What is the screening round on 31 October?', a: 'All bots must be ready by 30 October. A screening round on 31 October will shortlist the top 15 teams to compete in the main arena.' },
    ],
  },
  {
    id: 'robo-rumble',
    slug: 'robo-rumble',
    code: 'RR',
    title: 'Robo Rumble',
    shortTitle: 'Robo Rumble',
    categoryBadge: 'Combat & Hurdle',
    categoryColor: 'violet',
    icon: 'roboIcon',
    iconImage: roboIcon,
    banner: bannerRobo,
    gallery: [robo1, robo2, robo3],
    shortDescription: 'High-Octane Hurdle & Combat Arena',
    overview: `An intensive hardware-focused competition where students create robots to navigate varying terrains and specialized hurdles. The competition track features unique obstacles and technical challenges. This event pushes the boundaries of mechanical design, electrical engineering, and strategic thinking.`,
    objectives: [
      "Test robots' ability to navigate challenging terrain and obstacles",
      'Evaluate mechanical design, durability, and strategic engineering',
      'Create an exciting competitive arena for robotics enthusiasts',
      'Encourage innovation in robot design and control systems',
    ],
    eligibility: [
      'Open to all college and school students',
      'Participants from other institutes are welcome',
      'Team participation required',
    ],
    participationType: 'team',
    participationLabels: { team: 'Team (2–4 Members)' },
    maxTeamSize: 4,
    minTeamSize: 2,
    equipment: [
      'Custom-built robot (must be brought by participants)',
      'Robot must not exceed 1.5 kg weight',
      'Maximum dimensions: 20cm × 20cm × 20cm (0% tolerance)',
      'Only one 12V battery pack allowed',
      'Voltage difference must not exceed 12V between any two points',
    ],
    rules: [
      'Weight of the bot should not exceed 1.5 kg. The bot must be able to fit in a maximum dimension of length 20cm × breadth 20cm × height 20cm. 0% error for each dimension will not be tolerated.',
      'Voltage difference between two points in the bot should not be greater than 12V and only one 12V battery pack is allowed.',
    ],
    judgingCriteria: [
      'Obstacle course completion and speed',
      'Robot build quality and engineering',
      'Strategy and control during competition',
      'Compliance with size and weight constraints',
    ],
    prizes: [
      'Winner: Certificates & Special Gifts',
      'Participation Certificates for all',
    ],
    pdfRulebook: '/events/technovision_2026/robo_rumble_rules.pdf',
    timeline: [
      { label: 'Registration Deadline', date: '1 Nov 2026' },
      { label: 'Event Day', date: '3 Nov 2026' },
    ],
    registrationDeadline: '2026-11-01',
    eventDate: '3 Nov 2026',
    faqs: [
      { q: 'What are the size constraints?', a: 'Maximum dimensions: 20cm length × 20cm breadth × 20cm height with 0% tolerance.' },
      { q: 'What is the maximum weight?', a: 'The bot must not exceed 1.5 kg.' },
      { q: 'How many batteries can I use?', a: 'Only one 12V battery pack is allowed. Voltage difference between any two points must not exceed 12V.' },
      { q: 'Are teams from other colleges allowed?', a: 'Yes, Technovision welcomes participation from other institutes and schools.' },
    ],
  },
];

// Helper to find a competition by slug
export const getCompetitionBySlug = (slug) =>
  COMPETITIONS.find((c) => c.slug === slug) || null;

// Helper to find a competition by code
export const getCompetitionByCode = (code) =>
  COMPETITIONS.find((c) => c.code === code) || null;
