import "server-only";
import type { ZodObject, ZodRawShape } from "zod";
import {
  applicationUpdateSchema,
  messageUpdateSchema,
  newsSchema,
  partnerSchema,
  projectSchema,
  socialSchema,
  statSchema,
  supportUpdateSchema,
} from "./validation";

export type ResourceConfig = {
  table: string;
  schema: ZodObject<ZodRawShape>;
  /** Resources that only visitors create (applications, messages…) can't be created by admins. */
  canCreate: boolean;
  order: { column: string; ascending: boolean }[];
  /** Tables that have an updated_at column we should bump on PATCH. */
  touchUpdatedAt?: boolean;
};

export const RESOURCES: Record<string, ResourceConfig> = {
  projects: {
    table: "projects",
    schema: projectSchema,
    canCreate: true,
    touchUpdatedAt: true,
    order: [
      { column: "sort_order", ascending: true },
      { column: "created_at", ascending: false },
    ],
  },
  news: {
    table: "news",
    schema: newsSchema,
    canCreate: true,
    order: [{ column: "created_at", ascending: false }],
  },
  stats: {
    table: "stats",
    schema: statSchema,
    canCreate: true,
    order: [{ column: "sort_order", ascending: true }],
  },
  social: {
    table: "social_links",
    schema: socialSchema,
    canCreate: true,
    order: [{ column: "sort_order", ascending: true }],
  },
  partners: {
    table: "partners",
    schema: partnerSchema,
    canCreate: true,
    order: [{ column: "sort_order", ascending: true }],
  },
  applications: {
    table: "join_applications",
    schema: applicationUpdateSchema,
    canCreate: false,
    order: [{ column: "created_at", ascending: false }],
  },
  staff: {
    table: "staff_applications",
    schema: applicationUpdateSchema,
    canCreate: false,
    order: [{ column: "created_at", ascending: false }],
  },
  support: {
    table: "support_requests",
    schema: supportUpdateSchema,
    canCreate: false,
    order: [{ column: "created_at", ascending: false }],
  },
  messages: {
    table: "contact_messages",
    schema: messageUpdateSchema,
    canCreate: false,
    order: [{ column: "created_at", ascending: false }],
  },
};
