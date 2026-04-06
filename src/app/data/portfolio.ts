export interface Project {
  id: string;
  title: string;
  tagline: string;
  year: string;
  category: string;
  image: string;
  color: string;
  problem: string;
  approach: string;
  decisions: string[];
  outcome: string;
  links: { demo?: string; code?: string };
}

export const projects: Project[] = [
  {
    id: 'inventure',
    title: 'Inventure',
    tagline: 'A personal platform to experiment, build, and showcase',
    year: '2025',
    category: 'Full Stack / Personal Platform',
    image: '/projects/inventure.png',
    color: '#6EE7FF',
    problem: 'Needed a dedicated space to experiment with ideas, showcase projects, and explore clean architecture in a practical way — not just theory.',
    approach: 'Built a personal platform to develop, organize, and present creative and technical projects with a focus on scalable structure and thoughtful design. Prioritized clean component architecture and purposeful UI decisions.',
    decisions: [
      'Chose a modular folder structure to allow easy extension as the platform grows',
      'Prioritized performance and clean code over flashy features',
      'Designed for personal use first — real-world constraints breed better solutions',
    ],
    outcome: 'Successfully launched a live project hub that demonstrates development style, design thinking, and experimentation. Serves as a living portfolio of technical exploration.',
    links: { code: 'https://github.com/PrinceJoseph-software/Inventure' },
  },
  {
    id: 'supabase-notes',
    title: 'Notes App',
    tagline: 'Full CRUD notes with Supabase backend on Android',
    year: '2025',
    category: 'Android / Backend Integration',
    image: '/projects/notes-app.png',
    color: '#A78BFA',
    problem: 'Needed hands-on experience integrating a backend database with Android apps — moving beyond local storage into real backend communication.',
    approach: 'Developed a notes app using Kotlin connected to Supabase, implementing full CRUD operations (create, read, update, delete) with real-time sync.',
    decisions: [
      'Chose Supabase over Firebase for its open-source nature and SQL compatibility',
      'Implemented an offline-first design — the app functions even without connectivity',
      'Used Kotlin coroutines for non-blocking database operations',
    ],
    outcome: 'Gained practical experience in database integration and backend communication on Android. Built a functional, data-driven mobile app ready for real users.',
    links: { code: 'https://github.com/PrinceJoseph-software/Supabase' },
  },
  {
    id: 'supabase-auth',
    title: 'Auth System',
    tagline: 'Email/password + GitHub OAuth on Android with Supabase',
    year: '2025',
    category: 'Android / Authentication',
    image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWN1cml0eSUyMGxvY2slMjBkaWdpdGFsJTIwYmx1ZXxlbnwxfHx8fDE3NzU0MTgxMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    color: '#34D399',
    problem: 'Understanding real-world authentication flows in mobile apps beyond theory — implementing secure login systems that handle sessions, OAuth, and user data correctly.',
    approach: 'Built an Android app using Kotlin, Jetpack Compose, and Supabase to implement email/password login, GitHub OAuth, and complete user data storage with session handling.',
    decisions: [
      'Used Jetpack Compose for declarative UI — faster iteration on auth screens',
      'Implemented secure token storage using the Android Keystore',
      'Built GitHub OAuth to understand third-party auth flows end-to-end',
    ],
    outcome: 'Successfully implemented a complete authentication flow with a user dashboard. Significantly improved understanding of secure login systems and user session handling.',
    links: { code: 'https://github.com/PrinceJoseph-software/Account' },
  },
  {
    id: 'ecommerce-ui',
    title: 'E-Commerce UI',
    tagline: 'Clean product detail interface — multiple actions in one screen',
    year: '2025',
    category: 'UI/UX Design / Android',
    image: '/projects/ecommerce-ui.png',
    color: '#F59E0B',
    problem: 'Needed to design a clean, intuitive product detail interface that combines multiple user actions — product info, seller details, and purchase options — in one coherent screen.',
    approach: 'Designed and developed a product detail UI using Kotlin, focusing on visual hierarchy, touch targets, and layout clarity. Iterated through multiple design versions before writing code.',
    decisions: [
      'Designed in Figma first — validated the layout before writing a single line of Kotlin',
      'Used bottom sheets instead of separate screens to maintain context',
      'Prioritized thumb-friendly tap zones for comfortable one-handed use',
    ],
    outcome: 'Created a modern, user-friendly product interface. The project is ongoing, with a strong focus on usability and layout scalability for a full product catalog.',
    links: { demo: 'https://www.linkedin.com/posts/nyobah-joseph-prince-462716311_androiddevelopment-kotlin-mobileapp-ugcPost-7399533763363397632-kXoC?utm_source=share&utm_medium=member_desktop' },
  },
  {
    id: 'moonsync',
    title: 'MoonSync',
    tagline: 'AI-powered menstrual health tracking with community features',
    year: '2025',
    category: 'Product Design / Frontend',
    image: '/projects/moonsync.png',
    color: '#F472B6',
    problem: 'Most existing menstrual health apps are clinical rather than human-centered — lacking personalization, accessibility, and genuine emotional support.',
    approach: 'Led frontend development and UI/UX design in Figma for a menstrual tracking app with AI-generated insights and community features. Applied a human-centered design process throughout.',
    decisions: [
      'Used Figma components to ensure design consistency across all screens',
      'Designed for accessibility — strong color contrast, readable fonts, and clear hierarchy',
      'Built community features with safety and moderation considered from day one',
    ],
    outcome: 'Delivered a user-centered design and contributed to a functional, health-focused platform with personalized AI insights. Demonstrated the ability to lead design on a sensitive and important product.',
    links: { code: 'https://github.com/ayebasuokante669-cpu/moonsync' },
  },
];

export interface MemoryCard {
  id: string;
  pairId: string;
  content: string;
  emoji: string;
}

export const memoryCards: MemoryCard[] = [
  { id: 'm1a', pairId: 'm1', content: 'Started coding\n10 years ago', emoji: '🖥️' },
  { id: 'm1b', pairId: 'm1', content: 'Started coding\n10 years ago', emoji: '🖥️' },
  { id: 'm2a', pairId: 'm2', content: 'Restarted my tech journey\n3 years ago — no breaks since', emoji: '🔄' },
  { id: 'm2b', pairId: 'm2', content: 'Restarted my tech journey\n3 years ago — no breaks since', emoji: '🔄' },
  { id: 'm3a', pairId: 'm3', content: 'Committed to growth\nuntil goals are fully achieved', emoji: '🎯' },
  { id: 'm3b', pairId: 'm3', content: 'Committed to growth\nuntil goals are fully achieved', emoji: '🎯' },
  { id: 'm4a', pairId: 'm4', content: 'Studied software\ndevelopment at NIIT', emoji: '🎓' },
  { id: 'm4b', pairId: 'm4', content: 'Studied software\ndevelopment at NIIT', emoji: '🎓' },
  { id: 'm5a', pairId: 'm5', content: 'Design + code\nis my creative space', emoji: '🎨' },
  { id: 'm5b', pairId: 'm5', content: 'Design + code\nis my creative space', emoji: '🎨' },
  { id: 'm6a', pairId: 'm6', content: 'I build for\nboth web and mobile', emoji: '📱' },
  { id: 'm6b', pairId: 'm6', content: 'I build for\nboth web and mobile', emoji: '📱' },
  { id: 'm7a', pairId: 'm7', content: 'On a journey\ninto cybersecurity', emoji: '🔐' },
  { id: 'm7b', pairId: 'm7', content: 'On a journey\ninto cybersecurity', emoji: '🔐' },
  { id: 'm8a', pairId: 'm8', content: 'Building things that\nwork in the real world', emoji: '🌍' },
  { id: 'm8b', pairId: 'm8', content: 'Building things that\nwork in the real world', emoji: '🌍' },
];

export const skillCategories = [
  {
    id: 'development',
    label: 'Development',
    color: '#6EE7FF',
    skills: [
      { id: 'fullstack', name: 'Full Stack Development', level: 82 },
      { id: 'react', name: 'React / JavaScript', level: 85 },
      { id: 'kotlin', name: 'Kotlin (Android)', level: 78 },
      { id: 'jetpack', name: 'Jetpack Compose', level: 72 },
      { id: 'supabase', name: 'Supabase / Backend', level: 76 },
    ],
  },
  {
    id: 'design',
    label: 'Design & UX',
    color: '#A78BFA',
    skills: [
      { id: 'figma', name: 'Figma', level: 88 },
      { id: 'uxresearch', name: 'User Research', level: 80 },
      { id: 'prototyping', name: 'Wireframing & Prototyping', level: 84 },
      { id: 'designsystems', name: 'Design Systems', level: 79 },
      { id: 'responsive', name: 'Responsive Design', level: 87 },
    ],
  },
  {
    id: 'security',
    label: 'Cybersecurity',
    color: '#34D399',
    skills: [
      { id: 'secfund', name: 'Security Fundamentals', level: 65 },
      { id: 'authsystems', name: 'Auth & Authorization', level: 74 },
      { id: 'securecoding', name: 'Secure App Development', level: 70 },
      { id: 'websec', name: 'Web Security Concepts', level: 62 },
      { id: 'ethicalhack', name: 'Ethical Hacking (Learning)', level: 48 },
    ],
  },
];

export const thoughtsBranches = [
  {
    id: 'root',
    text: "You've found your way here. Most people don't make it this far.",
    choices: [
      { label: 'I was curious', next: 'curious' },
      { label: 'I was persistent', next: 'persistent' },
      { label: 'I got lucky', next: 'lucky' },
    ],
  },
  {
    id: 'curious',
    text: "Curiosity is the only thing that scales. Every great engineer I've met has it in abundance. It's not taught — it's cultivated by building things that scare you.",
    choices: [
      { label: 'What scares you?', next: 'fear' },
      { label: 'What excites you?', next: 'excitement' },
    ],
  },
  {
    id: 'persistent',
    text: "Persistence without direction is just noise. But you combined it with direction. That's rare. The people who change industries aren't the smartest — they're the ones who stayed when it got hard.",
    choices: [
      { label: 'What made you stay?', next: 'stayed' },
      { label: 'What almost made you quit?', next: 'quit' },
    ],
  },
  {
    id: 'lucky',
    text: "Luck is real. But it favors the prepared. I've had moments of pure serendipity — and every single one happened because I was already in motion.",
    choices: [
      { label: "What's your biggest lucky break?", next: 'break' },
      { label: 'What do you think about luck?', next: 'luck_philosophy' },
    ],
  },
  {
    id: 'fear',
    text: "Mediocrity. Not failure — mediocrity. Failure means you tried something real. Mediocrity means you played it safe and got exactly what you asked for.",
    choices: [
      { label: 'How do you fight it?', next: 'fight' },
    ],
  },
  {
    id: 'excitement',
    text: "The moment when design and code stop fighting each other and start amplifying each other. When the UI you imagined in Figma actually comes alive in the browser or on Android — exactly as you pictured it. Those moments are rare, and I spend my career chasing them.",
    choices: [
      { label: 'Tell me more', next: 'systems' },
    ],
  },
  {
    id: 'stayed',
    text: "The work. When everything else fell apart, the work was still there. Code doesn't care about your feelings — and sometimes that's exactly what you need.",
    choices: [{ label: 'I understand that', next: 'end' }],
  },
  {
    id: 'quit',
    text: "Doubt. There's always a moment where you wonder if it's worth it. I came back to tech after stepping away — and that restart was the best decision I made. Endings are underrated. So are restarts.",
    choices: [{ label: 'What did you learn?', next: 'learned' }],
  },
  {
    id: 'break',
    text: "Deciding to commit fully — to not treat this as a side interest but as a career I was building brick by brick. That shift in mindset changed everything.",
    choices: [{ label: "That's a good story", next: 'end' }],
  },
  {
    id: 'luck_philosophy',
    text: "I think luck is what we call patterns we don't understand yet. The more you show up, the more you create conditions where good things can happen. It's not magic — it's math.",
    choices: [{ label: 'That makes sense', next: 'end' }],
  },
  {
    id: 'fight',
    text: 'I take on projects that terrify me a little. Projects where I\'m not sure I can deliver. The discomfort is a signal — it means I\'m growing. I crossed from "just web dev" into Android, and now cybersecurity. Comfort is the enemy.',
    choices: [{ label: 'I needed to hear that', next: 'end' }],
  },
  {
    id: 'systems',
    text: "When design and engineering share a language, teams stop translating and start creating. I've spent my career learning both — Figma and Android Studio, CSS and Kotlin, UX thinking and security thinking. Bridging that gap is the work.",
    choices: [{ label: "That's your mission", next: 'end' }],
  },
  {
    id: 'learned',
    text: "Ship embarrassingly early. Fall in love with the problem, never the solution. And always, always listen to the person who says \"this doesn't make sense\" — they're usually right.",
    choices: [{ label: 'Good lessons', next: 'end' }],
  },
  {
    id: 'end',
    text: "Thank you for exploring this space. There's a version of the web where every portfolio is a conversation rather than a résumé. This is my attempt at that.",
    choices: [],
  },
];

export const futureGoals = [
  {
    id: 'security-fullstack',
    year: '2025–2026',
    title: 'Become Security-Focused Full Stack',
    description:
      'Integrate security thinking into every layer of the stack — from secure API design to hardened mobile apps. Not just building things, but building things that are difficult to break.',
    status: 'in-progress',
    color: '#6EE7FF',
  },
  {
    id: 'real-apps',
    year: '2026',
    title: 'Launch Scalable Real-World Apps',
    description:
      'Move from personal projects to products that real users depend on. Launch at least one application that handles real traffic, real data, and real edge cases.',
    status: 'planned',
    color: '#A78BFA',
  },
  {
    id: 'cybersecurity',
    year: '2026–2027',
    title: 'Master Cybersecurity',
    description:
      'Grow into app security and ethical hacking — understanding systems well enough to break them, then build them better. Certifications, CTFs, and real-world practice.',
    status: 'started',
    color: '#34D399',
  },
  {
    id: 'design-dev',
    year: 'Ongoing',
    title: 'Master Design-to-Development',
    description:
      'Fully own the design-to-development pipeline — from user research and Figma prototypes through to production-ready code. Be the person who bridges both worlds without compromise.',
    status: 'in-progress',
    color: '#F59E0B',
  },
];
