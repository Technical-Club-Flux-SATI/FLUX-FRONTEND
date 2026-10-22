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
  whatsappGroup: 'https://chat.whatsapp.com/ITmlgvbmiM7Bu8GGWddYxc?mode=gi_t',
  rulebookUrl: 'https://drive.google.com/file/d/1Ee689teCqFrLVJWEA8Y7S83k3lH9xODN/view?usp=drive_link',
  heroImage: groupImg,
  contacts: [
    { name: 'Shreya Chahar', phone: '6268459415' },
    { name: 'Nitil Singh', phone: '9691347076' },
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
    categoryBadge: 'Innovation & Engineering',
    categoryColor: 'emerald',
    icon: 'Lightbulb',
    banner: bannerModel,
    gallery: [model1, model2, model3],
    shortDescription: 'Showcase your innovative ideas, working models, engineering projects, and creative solutions. Explain your model, demonstrate its functionality, and present its real-world applications.',
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
    participationType: 'both', // 'individual', 'team', or 'both'
    maxTeamSize: 4,
    minTeamSize: 1,
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
    code: 'ROC',
    title: 'Bot Racing',
    shortTitle: 'Bot Racing',
    categoryBadge: 'Robotics Challenge',
    categoryColor: 'cyan',
    icon: 'Bot',
    banner: bannerRopeway,
    gallery: [ropeway1, ropeway2, ropeway3],
    shortDescription: "Put your robot's precision, control, and navigation skills to the test. Navigate through challenging obstacles and complete the course efficiently.",
    overview: `A hardware-based robotics competition where contestants will be tasked with designing and building robots capable of effectively moving across a slackline/ropeway. Teams will compete against each other in a round-robin format. This event tests mechanical design, balance control, and strategic engineering.`,
    objectives: [
      'Challenge students to design robots with precision movement and balance',
      'Test engineering skills in creating lightweight, efficient robots',
      'Promote competitive spirit through a round-robin tournament format',
      'Encourage innovative mechanical design solutions',
    ],
    eligibility: [
      'Open to all college and school students',
      'Participants from other institutes are welcome',
      'Solo or dual participation allowed',
    ],
    participationType: 'both',
    participationLabels: { individual: 'Solo', team: 'Dual' },
    maxTeamSize: 2,
    minTeamSize: 1,
    equipment: [
      'Custom-built robot (must be brought by participants)',
      'Robot must weigh under 1 kilogram',
      'Batteries and remote controller (if wired/wireless)',
    ],
    rules: [
      'The bot must be lightweight (under 1 kilogram).',
      'The robot must be capable of moving effectively across the ropeway/slackline.',
      'The bot may be based on a fun or entertaining theme.',
      'Design must comply with all safety and hardware constraints.',
    ],
    judgingCriteria: [
      'Speed of completing the obstacle course',
      'Robot control precision and stability',
      'Mechanical design and build quality',
      'Innovation in approach',
    ],
    prizes: [
      'Top-3 Teams: Certificates & Goodies',
      'Participation Certificates for all',
    ],
    pdfRulebook: 'https://drive.google.com/file/d/1r22pR1QgCU6f3B6aAXQnikHjjpfpGrlK/view?usp=drive_link',
    timeline: [
      { label: 'Registration Deadline', date: '1 Nov 2026' },
      { label: 'Round-Robin Matches', date: '2 Nov 2026' },
    ],
    registrationDeadline: '2026-11-01',
    eventDate: '2 Nov 2026',
    faqs: [
      { q: 'What is the maximum weight for the robot?', a: 'The bot must be lightweight, under 1 kilogram.' },
      { q: 'Is there a registration fee?', a: 'Yes, there is a registration fee for students from other colleges. SATI students may have different arrangements. Check with the organizers.' },
      { q: 'Can I use a commercially available robot kit?', a: 'Refer to the official rulebook for detailed specifications and constraints.' },
      { q: 'How are matches structured?', a: 'Teams compete in a round-robin format with matches on 2 Nov 2026.' },
    ],
  },
  {
    id: 'robo-rumble',
    slug: 'robo-rumble',
    code: 'RR',
    title: 'Robo Rumble',
    shortTitle: 'Robo Rumble',
    categoryBadge: 'Robotics Arena',
    categoryColor: 'violet',
    icon: 'roboIcon',
    iconImage: roboIcon,
    banner: bannerRobo,
    gallery: [robo1, robo2, robo3],
    shortDescription: "Enter the robotics arena and test your robot's performance, strategy, and engineering. Compete against other participants in an exciting robotics showdown.",
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
    pdfRulebook: 'https://drive.google.com/file/d/1Kw831e0SAWjpQ04rpf5QvmC4bO63SlIF/view?usp=drive_link',
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
