import { createSubmitHandler } from "@/lib/submit-handler";
import { contactSchema } from "@/lib/validation";

export const POST = createSubmitHandler({
  schema: contactSchema,
  table: "contact_messages",
  name: "contact",
  limit: 5,
  notify: { title: "✉️ رسالة تواصل جديدة", color: 9807270, adminPath: "/admin/messages" },
});
