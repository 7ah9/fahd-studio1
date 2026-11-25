export type Project = {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  details_ar: string;
  details_en: string;
  category: string;
  status: "current" | "completed";
  image_url: string | null;
  link_url: string | null;
  featured: boolean;
  is_map: boolean;
  sort_order: number;
  created_at: string;
};

export type NewsItem = {
  id: string;
  title_ar: string;
  title_en: string;
  body_ar: string;
  body_en: string;
  kind: "news" | "announcement";
  published: boolean;
  created_at: string;
};

export type Stat = {
  id: string;
  label_ar: string;
  label_en: string;
  value: number;
  suffix: string;
  sort_order: number;
};

export type SocialLink = {
  id: string;
  platform: string;
  url: string;
  sort_order: number;
};

export type JoinApplication = {
  id: string;
  full_name: string;
  age: number;
  discord_username: string;
  experience_level: string;
  specialty: string;
  portfolio_links: string;
  about: string;
  status: "pending" | "accepted" | "rejected";
  admin_note: string;
  created_at: string;
};

export type SupportRequest = {
  id: string;
  full_name: string;
  discord_username: string;
  topic: string;
  message: string;
  status: "new" | "in_progress" | "resolved";
  created_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type Partner = {
  id: string;
  name: string;
  logo_url: string | null;
  url: string | null;
  sort_order: number;
};
