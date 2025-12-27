export type Project = {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  liveLink: string;
  imageUrl: string;
};

export const mockProjects: Project[] = [
  {
    id: 'project-1',
    title: 'E-commerce Platform',
    description: 'A responsive e-commerce site built with React and Node.js, featuring a full-featured shopping cart and payment integration.',
    technologies: ['React', 'Node.js', 'MongoDB'],
    liveLink: '#',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb2RlfGVufDB8fHx8MTc2MzM5MjQ5MXww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'project-2',
    title: 'Data Analytics Dashboard',
    description: 'A web application for visualizing and analyzing complex datasets, built with Vue.js and Python.',
    technologies: ['Vue.js', 'Python', 'SQL'],
    liveLink: '#',
    imageUrl: 'https://images.unsplash.com/photo-1686061593213-98dad7c599b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxkYXNoYm9hcmQlMjBhbmFseXRpY3N8ZW58MHx8fHwxNzYzMzAzOTc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'project-3',
    title: 'Company Landing Page',
    description: 'A modern, fast, and SEO-optimized landing page for a tech startup, designed in Figma and built with Next.js.',
    technologies: ['Next.js', 'Figma', 'REST APIs'],
    liveLink: '#',
    imageUrl: 'https://images.unsplash.com/photo-1678690832311-bb6e361989ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx3ZWJzaXRlJTIwZGVzaWdufGVufDB8fHx8MTc2MzM5MDc0OHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
];
