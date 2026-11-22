import { createSubmitHandler } from "@/lib/submit-handler";
import { supportSchema } from "@/lib/validation";

export const POST = createSubmitHandler({
  schema: supportSchema,
  table: "support_requests",
  name: "support",
  limit: 4,
  notify: { title: "🛟 طلب دعم جديد", color: 5793266, adminPath: "/admin/support" },
});
