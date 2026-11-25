"use client";

import { DynamicForm, type FormField } from "./DynamicForm";

export type StaffQuestionView = {
  id: string;
  type: "text" | "textarea" | "select";
  label: string;
  group: "general" | "scenario";
  roles: string[] | "all";
  options?: { value: string; label: string }[];
};

type Props = {
  questions: StaffQuestionView[];
  base: FormField[];
  headings: { general: string; scenario: string };
  submitLabel: string;
  success: { title: string; text: string };
  note: string;
};

/** Staff application: base fields first, then the questions for the chosen role. */
export function StaffForm({ questions, base, headings, submitLabel, success, note }: Props) {
  const fieldsFor = (values: Record<string, string>): FormField[] => {
    const role = values.role;
    if (!role) return base;
    const asked = questions.filter((q) => q.roles === "all" || q.roles.includes(role));
    let lastGroup = "";
    const dynamic = asked.map((q): FormField => {
      const heading = q.group !== lastGroup ? headings[q.group] : undefined;
      lastGroup = q.group;
      return {
        name: `q_${q.id}`,
        label: q.label,
        type: q.type,
        options: q.options,
        maxLength: q.type === "select" ? undefined : 1500,
        heading,
      };
    });
    return [...base, ...dynamic];
  };

  // Collect the q_* fields into one `answers` object for the API.
  const shape = (payload: Record<string, unknown>) => {
    const out: Record<string, unknown> = {};
    const answers: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(payload)) {
      if (k.startsWith("q_")) answers[k.slice(2)] = v;
      else out[k] = v;
    }
    out.answers = answers;
    return out;
  };

  return (
    <DynamicForm
      endpoint="/api/staff"
      fields={fieldsFor}
      shape={shape}
      submitLabel={submitLabel}
      success={success}
      note={note}
    />
  );
}
