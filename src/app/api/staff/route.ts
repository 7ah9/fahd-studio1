import { createSubmitHandler } from "@/lib/submit-handler";
import { staffSchema } from "@/lib/validation";

export const POST = createSubmitHandler({
  schema: staffSchema,
  table: "staff_applications",
  name: "staff",
  limit: 3,
  notify: { title: "🛡️ طلب تقديم لإدارة السيرفر", color: 15844367, adminPath: "/admin/staff" },
});
