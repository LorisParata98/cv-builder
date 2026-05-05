// Dizionario per auto-generazione atsKeywords
// Chiave: label normalizzato (lowercase), Valore: array di keyword da espandere
export const FRAMEWORK_KEYWORDS = {
  "angular": ["Angular", "Angular 8", "Angular 11", "Angular 14", "Angular 17", "Angular 18", "Angular 20"],
  "react": ["React", "React 16", "React 17", "React 18", "React 19", "React.js"],
  "react.js": ["React", "React 16", "React 17", "React 18", "React 19", "React.js"],
  "vue": ["Vue.js", "Vue 2", "Vue 3", "Vue.js 2", "Vue.js 3"],
  "vue.js": ["Vue.js", "Vue 2", "Vue 3", "Vue.js 2", "Vue.js 3"],
  "typescript": ["TypeScript", "TypeScript 4", "TypeScript 5"],
  "javascript": ["JavaScript", "ES6", "ES2020", "ES2022"],
  "node.js": ["Node.js", "Node", "NodeJS"],
  "nodejs": ["Node.js", "Node", "NodeJS"],
  "next.js": ["Next.js", "Next.js 13", "Next.js 14", "Next.js 15"],
  "nextjs": ["Next.js", "Next.js 13", "Next.js 14", "Next.js 15"],
  "docker": ["Docker", "Docker Compose", "containerization"],
  "kubernetes": ["Kubernetes", "K8s", "container orchestration"],
  "aws": ["AWS", "Amazon Web Services", "cloud computing"],
  "azure": ["Azure", "Microsoft Azure", "cloud computing"],
  "gcp": ["GCP", "Google Cloud", "Google Cloud Platform"],
  "python": ["Python", "Python 3", "Python 3.10", "Python 3.11", "Python 3.12"],
  "java": ["Java", "Java 11", "Java 17", "Java 21"],
  "spring": ["Spring", "Spring Boot", "Spring Framework"],
  "django": ["Django", "Django REST Framework"],
  "fastapi": ["FastAPI", "Python REST API"],
  "postgresql": ["PostgreSQL", "Postgres", "SQL"],
  "mysql": ["MySQL", "SQL"],
  "mongodb": ["MongoDB", "NoSQL"],
  "redis": ["Redis", "caching"],
  "graphql": ["GraphQL", "Apollo GraphQL"],
  "tailwind": ["Tailwind CSS", "Tailwind"],
  "tailwind css": ["Tailwind CSS", "Tailwind"],
  "figma": ["Figma", "UI design", "design tool"],
  "git": ["Git", "GitHub", "GitLab", "version control"],
  "jest": ["Jest", "unit testing", "JavaScript testing"],
  "cypress": ["Cypress", "E2E testing", "end-to-end testing"],
  "terraform": ["Terraform", "Infrastructure as Code", "IaC"],
  "ci/cd": ["CI/CD", "continuous integration", "continuous deployment", "DevOps"],
  "agile": ["Agile", "Scrum", "Kanban", "sprint"],
};

// Genera atsKeywords dato un label
export function generateAtsKeywords(label) {
  if (!label) return [];
  const key = label.toLowerCase().trim();
  return FRAMEWORK_KEYWORDS[key] || [label];
}
