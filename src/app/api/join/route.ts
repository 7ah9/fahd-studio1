import { createSubmitHandler } from "@/lib/submit-handler";
import { joinSchema } from "@/lib/validation";

export const POST = createSubmitHandler({
  schema: joinSchema,
  table: "join_applications",
  name: "join",
  limit: 3,
});
