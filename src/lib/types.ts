export type Course = {
  slug: string;
  name: string;
  area: string;
  description: string;
  duration: string;
  subjects: Subject[];
};

export type Subject = {
  name: string;
  description: string;
  semester: number;
};

export type News = {
  id: number;
  title: string;
  excerpt: string;
  body: string;
  createdAt: string;
};
