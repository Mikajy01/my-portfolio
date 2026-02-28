export interface ProjectImage {
  url: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  tags: string[];
  image: string;
  images: ProjectImage[];
  link?: string;
  github?: string;
  type: "professional" | "personal";
}