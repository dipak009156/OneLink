import Navbar from '../components/layout/Navbar'
import ProfileHero from '../components/profile/ProfileHero'
import RepoSection from '../components/profile/RepoSection'
import SkillsSection from '../components/profile/SkillsSection'
import LeetCodeSection from '../components/profile/LeetCodeSection'
import ProjectsSection from '../components/profile/ProjectsSection'
import ExperienceSection from '../components/profile/ExperienceSection'
import EducationSection from '../components/profile/EducationSection'
import ContactCTA from '../components/profile/ContactCTA'
const staticEducation = [
  {
    id: 'edu-1',
    degree: "B.S. in Computer Science",
    college: "Stanford University",
    years: "Class of 2018"
  }
];

const staticProfile = {
  name: "Alex Mercer",
  title: "Senior AI Engineer & Lead Architect",
  summary: "Building the future of artificial intelligence and distributed systems. Creator of several open-source frameworks with over 30,000 combined stars on GitHub. I write code that scales to millions of users.",
  location: "San Francisco, CA",
  isOpenToWork: true,
  avatarInitials: "AM",
  githubUsername: "alexmercer",
  email: "alex.mercer@example.com",
  profilePicture: "https://i.pravatar.cc/150?img=11", 
  skills: [
    "TypeScript", "Rust", "Go", "Python", 
    "React", "Next.js", "Node.js", "PostgreSQL", 
    "Docker", "Kubernetes", "AWS", "WebGPU"
  ]
};

const staticRepos = [
  {
    name: "neura-js",
    description: "Next-generation neural network engine built natively for the web using WebGPU. Capable of running massive LLMs directly in the browser.",
    language: "TypeScript",
    stars: 18402,
    forks: 1204,
    url: "#"
  },
  {
    name: "swift-cache",
    description: "A blazing fast, memory-safe caching distributed system router written in pure Rust.",
    language: "Rust",
    stars: 9205,
    forks: 840,
    url: "#"
  },
  {
    name: "quantum-ui",
    description: "The world's most beautiful and performant React UI component library. Glassmorphism out of the box.",
    language: "TypeScript",
    stars: 12040,
    forks: 1540,
    url: "#"
  },
  {
    name: "go-micro-router",
    description: "Zero-allocation HTTP router for highly concurrent Go microservices.",
    language: "Go",
    stars: 6400,
    forks: 420,
    url: "#"
  }
];

const staticLeetcode = {
  total: 1250,
  easy: 450,
  medium: 620,
  hard: 180
};

const staticProjects = [
  {
    name: "Nebula Protocol",
    description: "A decentralized vector database optimized for extremely large scale RAG pipelines and semantic search.",
    tags: ["Rust", "WASM", "PostgreSQL"],
    liveLink: "#",
    repoLink: "#"
  },
  {
    name: "Eclipse Web Framework",
    description: "Serverless-first fullstack TypeScript framework. Reduces cold starts by 80% using highly optimized edge streaming.",
    tags: ["TypeScript", "V8 Isolates", "React"],
    liveLink: "#",
    repoLink: "#"
  }
];

const staticExperience = [
  {
    id: 'exp-1',
    role: "Open-Source Lead",
    company: "Vercel",
    years: "2023 - Present"
  },
  {
    id: 'exp-2',
    role: "Senior Machine Learning Engineer",
    company: "OpenAI",
    years: "2021 - 2023"
  },
  {
    id: 'exp-3',
    role: "Full Stack Engineer",
    company: "Stripe",
    years: "2018 - 2021"
  }
];

const DemoProfile = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50/30 dark:bg-[#030712] dark:selection:bg-violet-500/30 text-gray-900 dark:text-slate-50 transition-all duration-300">
      {/* Aurora Glow Mesh */}
      <div className="absolute top-0 -left-1/4 w-[150%] max-w-7xl h-[600px] bg-gradient-to-b from-violet-400/20 via-fuchsia-400/10 to-transparent blur-[120px] -z-10 animate-pulse rounded-full opacity-50 dark:opacity-40 pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
      <div className="absolute top-40 right-0 w-[80%] max-w-5xl h-[500px] bg-gradient-to-l from-indigo-500/10 to-transparent blur-[100px] -z-10 rounded-full opacity-60 pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
      
      <div className="relative z-0">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-12 space-y-8">
          <ProfileHero profile={staticProfile} />
          <RepoSection repos={staticRepos} />
          <SkillsSection skills={staticProfile.skills} />
          <LeetCodeSection leetcode={staticLeetcode} />
          <ExperienceSection experience={staticExperience} />
          <EducationSection education={staticEducation} />
          <ProjectsSection projects={staticProjects} />

          <ContactCTA name={staticProfile.name} email={staticProfile.email} />
        </div>
      </div>
    </div>
  )
}

export default DemoProfile
