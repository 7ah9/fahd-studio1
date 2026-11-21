import { createSubmitHandler } from "@/lib/submit-handler";
import { supportSchema } from "@/lib/validation";

export const POST = createSubmitHandler({
  schema: supportSchema,
  table: "support_requests",
  name: "support",
  limit: 4,
});
