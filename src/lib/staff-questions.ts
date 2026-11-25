/**
 * Question bank for the server-staff application. Shared by the public form
 * (renders the questions) and the API (validates the answers and stores the
 * Arabic question text next to each answer, so the admin always sees exactly
 * what was asked, even if the wording changes later).
 */

export type StaffRole = "moderator" | "support" | "events";

export type StaffQuestion = {
  id: string;
  type: "text" | "textarea" | "select";
  ar: string;
  en: string;
  options?: { value: string; ar: string; en: string }[];
  /** Minimum length for text/textarea answers. */
  min?: number;
  /** Which roles are asked this question. */
  roles: StaffRole[] | "all";
  /** Short label shown above the scenario group in the form. */
  group: "general" | "scenario";
};

const ALL = "all" as const;

export const STAFF_QUESTIONS: StaffQuestion[] = [
  /* ---------- general (all roles) ---------- */
  {
    id: "member_since",
    type: "select",
    group: "general",
    roles: ALL,
    ar: "منذ متى وأنت عضو في سيرفرنا؟",
    en: "How long have you been a member of our server?",
    options: [
      { value: "lt_week", ar: "أقل من أسبوع", en: "Less than a week" },
      { value: "weeks", ar: "من أسبوع إلى شهر", en: "1 week to 1 month" },
      { value: "months", ar: "من شهر إلى 3 أشهر", en: "1 to 3 months" },
      { value: "long", ar: "أكثر من 3 أشهر", en: "More than 3 months" },
    ],
  },
  {
    id: "daily_hours",
    type: "select",
    group: "general",
    roles: ALL,
    ar: "كم ساعة تقدر تتواجد يومياً؟",
    en: "How many hours can you be online per day?",
    options: [
      { value: "lt2", ar: "أقل من ساعتين", en: "Under 2 hours" },
      { value: "2_4", ar: "من 2 إلى 4 ساعات", en: "2–4 hours" },
      { value: "4_6", ar: "من 4 إلى 6 ساعات", en: "4–6 hours" },
      { value: "6p", ar: "أكثر من 6 ساعات", en: "More than 6 hours" },
    ],
  },
  {
    id: "online_times",
    type: "text",
    group: "general",
    roles: ALL,
    min: 3,
    ar: "ما هي أوقات تواجدك المعتادة (بتوقيت السعودية)؟",
    en: "What are your usual online hours (Saudi time)?",
  },
  {
    id: "why_join",
    type: "textarea",
    group: "general",
    roles: ALL,
    min: 20,
    ar: "لماذا تريد الانضمام لإدارة السيرفر؟",
    en: "Why do you want to join the server staff?",
  },
  {
    id: "strengths",
    type: "textarea",
    group: "general",
    roles: ALL,
    min: 20,
    ar: "ما الذي يميزك عن غيرك وتقدر تضيفه للإدارة؟",
    en: "What sets you apart and what can you add to the team?",
  },
  {
    id: "rules_confidentiality",
    type: "select",
    group: "general",
    roles: ALL,
    ar: "هل تتعهد بالحفاظ على سرية نقاشات الإدارة وعدم استغلال الصلاحيات؟",
    en: "Do you promise to keep staff discussions private and never abuse your permissions?",
    options: [
      { value: "yes", ar: "نعم، أتعهد بذلك", en: "Yes, I promise" },
      { value: "no", ar: "لا", en: "No" },
    ],
  },

  /* ---------- admin scenarios ---------- */
  {
    id: "mod_provoke",
    type: "textarea",
    group: "scenario",
    roles: ["moderator"],
    min: 20,
    ar: "عضو يخالف القوانين ويستفز الآخرين في الشات، كيف تتصرف؟",
    en: "A member keeps breaking the rules and provoking others in chat. What do you do?",
  },
  {
    id: "mod_spam_links",
    type: "textarea",
    group: "scenario",
    roles: ["moderator"],
    min: 20,
    ar: "حساب جديد يرسل روابط مشبوهة لعدد كبير من الأعضاء في الخاص والعام، ما خطواتك بالترتيب؟",
    en: "A new account is sending suspicious links to many members. What are your steps, in order?",
  },
  {
    id: "mod_unfair",
    type: "textarea",
    group: "scenario",
    roles: ["moderator"],
    min: 20,
    ar: "عضو أخذ عقوبة ويتهمك أمام الجميع بالظلم والتحيز، كيف تتعامل معه؟",
    en: "A punished member publicly accuses you of being unfair and biased. How do you respond?",
  },
  {
    id: "mod_friend",
    type: "textarea",
    group: "scenario",
    roles: ["moderator"],
    min: 20,
    ar: "صديقك المقرّب في السيرفر خالف قانوناً واضحاً وطلب منك تتجاهل الموضوع، وش تسوي؟",
    en: "Your close friend broke a clear rule and asks you to look the other way. What do you do?",
  },
  {
    id: "mod_colleague",
    type: "textarea",
    group: "scenario",
    roles: ["moderator"],
    min: 20,
    ar: "لاحظت أن أدمن زميلك يسيء استخدام صلاحياته مع الأعضاء، ماذا تفعل؟",
    en: "You notice a fellow admin abusing their permissions. What do you do?",
  },

  /* ---------- support scenarios ---------- */
  {
    id: "sup_repeat",
    type: "textarea",
    group: "scenario",
    roles: ["support"],
    min: 20,
    ar: "عضو يسأل عن شيء تم توضيحه عدة مرات في القناة، كيف ترد عليه؟",
    en: "A member asks about something that has been answered many times. How do you reply?",
  },
  {
    id: "sup_angry",
    type: "textarea",
    group: "scenario",
    roles: ["support"],
    min: 20,
    ar: "عضو غاضب لأن طلبه ما انحل وكتب كلاماً حاداً، كيف تهدّئه وتحل مشكلته؟",
    en: "An angry member whose issue wasn't solved is writing harshly. How do you calm them and fix it?",
  },
  {
    id: "sup_newbie",
    type: "textarea",
    group: "scenario",
    roles: ["support"],
    min: 20,
    ar: "عضو جديد ضايع ولا يعرف من وين يبدأ في السيرفر، كيف تساعده؟",
    en: "A new member is lost and doesn't know where to start. How do you help?",
  },
  {
    id: "sup_unknown",
    type: "textarea",
    group: "scenario",
    roles: ["support"],
    min: 20,
    ar: "سألك عضو سؤالاً ما تعرف جوابه، ماذا تفعل؟",
    en: "A member asks you something you don't know the answer to. What do you do?",
  },
  {
    id: "sup_busy",
    type: "textarea",
    group: "scenario",
    roles: ["support"],
    min: 20,
    ar: "وصلتك عدة طلبات مساعدة في نفس الوقت، كيف ترتّب أولوياتك؟",
    en: "Several help requests arrive at once. How do you prioritise?",
  },

  /* ---------- events scenarios ---------- */
  {
    id: "evt_idea",
    type: "textarea",
    group: "scenario",
    roles: ["events"],
    min: 30,
    ar: "اقترح فعالية لسيرفر تطوير روبلوكس: فكرتها، طريقة تنفيذها، والجوائز المقترحة.",
    en: "Propose an event for a Roblox development server: the idea, how to run it, and prizes.",
  },
  {
    id: "evt_lowturnout",
    type: "textarea",
    group: "scenario",
    roles: ["events"],
    min: 20,
    ar: "قبل الفعالية بساعة لاحظت أن عدد المسجلين قليل جداً، ماذا تفعل؟",
    en: "An hour before an event, very few people have signed up. What do you do?",
  },
  {
    id: "evt_dispute",
    type: "textarea",
    group: "scenario",
    roles: ["events"],
    min: 20,
    ar: "حصل خلاف على نتيجة مسابقة واتهم أحدهم التنظيم بالتحيز، كيف تتصرف؟",
    en: "A contest result is disputed and someone accuses the organisers of bias. How do you act?",
  },
  {
    id: "evt_problem",
    type: "textarea",
    group: "scenario",
    roles: ["events"],
    min: 20,
    ar: "تعطل جزء أساسي من الفعالية أثناء البث، كيف تتعامل مع الموقف؟",
    en: "A key part of the event breaks mid-stream. How do you handle it?",
  },
  {
    id: "evt_team",
    type: "textarea",
    group: "scenario",
    roles: ["events"],
    min: 20,
    ar: "كيف تقسّم المهام بينك وبين باقي الفريق لتنظيم فعالية كبيرة؟",
    en: "How would you split tasks with the team to organise a large event?",
  },
];

export function questionsForRole(role: StaffRole): StaffQuestion[] {
  return STAFF_QUESTIONS.filter((q) => q.roles === "all" || q.roles.includes(role));
}
