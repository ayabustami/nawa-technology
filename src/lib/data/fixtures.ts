/* =========================================================================
   ⚠ PREVIEW FIXTURES — NOT COMPANY CONTENT
   -------------------------------------------------------------------------
   This file exists for ONE purpose: letting you look at the *populated*
   layout before your database is connected.

   • It is never rendered by default. The site ships showing real EMPTY
     states.
   • It only appears when the developer state-switcher is set to
     "Populated (preview)".
   • Nothing here describes NAWA Technology, its services, its clients or
     its results. Copy is deliberately generic and every record is flagged
     `preview: true` so the UI can stamp it with a PREVIEW ribbon.

   To delete this file safely: remove it, then delete the `populated`
   branch in `src/components/system/StateSwitcher.tsx`.
   ========================================================================= */

import type {
  Capability,
  CompanyValue,
  ContactChannel,
  Milestone,
  ProcessStep,
  Project,
  Service,
  TeamMember,
  Testimonial,
} from './types';

type Preview<T> = T & { preview: true };

const P = <T,>(value: T): Preview<T> => ({ ...value, preview: true });

/* --------------------------------------------------------------- services */

export const PREVIEW_SERVICES: Preview<Service>[] = [
  {
    id: 'prev-svc-01', slug: 'service-01', preview: true,
    name: { en: 'Service 01', ar: 'الخدمة ٠١' },
    shortDescription: {
      en: 'Short description loaded from your database appears here.',
      ar: 'يظهر هنا الوصف المختصر المحمّل من قاعدة البيانات.',
    },
    fullDescription: {
      en: 'The full description is rendered on the service detail page. It supports several paragraphs and is supplied entirely by your API.',
      ar: 'يُعرض الوصف الكامل في صفحة تفاصيل الخدمة، ويتكوّن من عدة فقرات تُزوَّد بالكامل من واجهة البرمجة الخاصة بك.',
    },
    icon: 'layers',
    features: [
      { en: 'Feature one', ar: 'الميزة الأولى' },
      { en: 'Feature two', ar: 'الميزة الثانية' },
      { en: 'Feature three', ar: 'الميزة الثالثة' },
    ],
    technologies: ['Stack A', 'Stack B', 'Stack C'],
    order: 1, featured: true,
  },
  {
    id: 'prev-svc-02', slug: 'service-02', preview: true,
    name: { en: 'Service 02', ar: 'الخدمة ٠٢' },
    shortDescription: {
      en: 'A slightly longer preview description, so you can see how the card handles two lines of text before clamping.',
      ar: 'وصف معاينة أطول قليلاً، لترى كيف تتعامل البطاقة مع سطرين من النص قبل الاقتطاع.',
    },
    icon: 'code-2',
    features: [{ en: 'Feature one', ar: 'الميزة الأولى' }, { en: 'Feature two', ar: 'الميزة الثانية' }],
    technologies: ['Stack A', 'Stack D'],
    order: 2,
  },
  {
    id: 'prev-svc-03', slug: 'service-03', preview: true,
    name: { en: 'Service 03', ar: 'الخدمة ٠٣' },
    shortDescription: { en: 'Short description.', ar: 'وصف مختصر.' },
    icon: 'database',
    features: [{ en: 'Feature one', ar: 'الميزة الأولى' }],
    technologies: ['Stack E'],
    order: 3,
  },
  {
    id: 'prev-svc-04', slug: 'service-04', preview: true,
    name: { en: 'Service 04', ar: 'الخدمة ٠٤' },
    shortDescription: { en: 'Short description.', ar: 'وصف مختصر.' },
    icon: 'shield-check',
    technologies: ['Stack B', 'Stack F'],
    order: 4,
  },
  {
    id: 'prev-svc-05', slug: 'service-05', preview: true,
    name: { en: 'Service 05', ar: 'الخدمة ٠٥' },
    shortDescription: { en: 'Short description.', ar: 'وصف مختصر.' },
    icon: 'line-chart',
    order: 5,
  },
  {
    id: 'prev-svc-06', slug: 'service-06', preview: true,
    name: { en: 'Service 06', ar: 'الخدمة ٠٦' },
    shortDescription: { en: 'Short description.', ar: 'وصف مختصر.' },
    icon: 'cpu',
    order: 6,
  },
];

/* --------------------------------------------------------------- projects */

const project = (n: number, seed: string, category: string, categoryAr: string, extra: Partial<Project> = {}): Preview<Project> =>
  P({
    id: `prev-prj-0${n}`,
    slug: `project-0${n}`,
    title: { en: `Project 0${n}`, ar: `المشروع ٠${n}` },
    description: {
      en: 'Preview description at a realistic length so card layout, clamping and spacing can be evaluated before real data arrives.',
      ar: 'وصف معاينة بطول واقعي حتى يمكن تقييم تخطيط البطاقة والاقتطاع والمسافات قبل وصول البيانات الحقيقية.',
    },
    category: { en: category, ar: categoryAr },
    technologies: ['Tech A', 'Tech B', 'Tech C'],
    date: String(2020 + n),
    ...extra,
  } as Project);

export const PREVIEW_PROJECTS: Preview<Project>[] = [
  project(1, 'a', 'Category A', 'الفئة أ', { featured: true, url: 'https://example.com' }),
  project(2, 'b', 'Category B', 'الفئة ب'),
  project(3, 'c', 'Category A', 'الفئة أ'),
  project(4, 'd', 'Category C', 'الفئة ج'),
  project(5, 'e', 'Category B', 'الفئة ب'),
  project(6, 'f', 'Category C', 'الفئة ج'),
];

/* -------------------------------------------------------------- process */

export const PREVIEW_PROCESS: Preview<ProcessStep>[] = [1, 2, 3, 4].map((n) =>
  P({
    id: `prev-step-0${n}`,
    number: `0${n}`,
    title: { en: 'Step title', ar: 'عنوان المرحلة' },
    description: {
      en: 'Step description will appear here once the process is defined in your database.',
      ar: 'يظهر وصف المرحلة هنا بمجرد تعريف المراحل في قاعدة البيانات.',
    },
    deliverables: [
      { en: 'Deliverable one', ar: 'المُسلَّمة الأولى' },
      { en: 'Deliverable two', ar: 'المُسلَّمة الثانية' },
    ],
  }),
);

/* ----------------------------------------------------------- capabilities */

export const PREVIEW_CAPABILITIES: Preview<Capability>[] = Array.from({ length: 8 }, (_, i) =>
  P({
    id: `prev-cap-0${i + 1}`,
    label: { en: `Capability 0${i + 1}`, ar: `القدرة ٠${i + 1}` },
    group: { en: i % 2 === 0 ? 'Group A' : 'Group B', ar: i % 2 === 0 ? 'المجموعة أ' : 'المجموعة ب' },
    description: { en: 'Optional one-line description.', ar: 'وصف اختياري من سطر واحد.' },
  }),
);

/* ----------------------------------------------------------------- values */

export const PREVIEW_VALUES: Preview<CompanyValue>[] = Array.from({ length: 4 }, (_, i) =>
  P({
    id: `prev-val-0${i + 1}`,
    index: `0${i + 1}`,
    title: { en: 'Value title', ar: 'عنوان القيمة' },
    description: {
      en: 'Value description will appear here.',
      ar: 'يظهر وصف القيمة هنا.',
    },
  }),
);

/* ------------------------------------------------------------- milestones */

export const PREVIEW_MILESTONES: Preview<Milestone>[] = Array.from({ length: 3 }, (_, i) =>
  P({
    id: `prev-ms-0${i + 1}`,
    date: { en: 'Year', ar: 'السنة' },
    title: { en: 'Milestone title', ar: 'عنوان المحطة' },
    description: { en: 'Milestone description will appear here.', ar: 'يظهر وصف المحطة هنا.' },
  }),
);

/* ------------------------------------------------------------------- team */

export const PREVIEW_TEAM: Preview<TeamMember>[] = Array.from({ length: 4 }, (_, i) =>
  P({
    id: `prev-tm-0${i + 1}`,
    name: { en: 'Team member name', ar: 'اسم عضو الفريق' },
    role: { en: 'Role from database', ar: 'المسمى من قاعدة البيانات' },
  }),
);

/* ----------------------------------------------------------- testimonials */

export const PREVIEW_TESTIMONIALS: Preview<Testimonial>[] = Array.from({ length: 3 }, (_, i) =>
  P({
    id: `prev-tst-0${i + 1}`,
    quote: {
      en: 'Client quotes load from your database. This preview string exists only to show the layout at a realistic length.',
      ar: 'تُحمَّل اقتباسات العملاء من قاعدة البيانات. هذا النص للمعاينة فقط لعرض التخطيط بطول واقعي.',
    },
    authorName: { en: 'Author name', ar: 'اسم صاحب التصريح' },
    authorRole: { en: 'Role', ar: 'المسمى الوظيفي' },
    organisation: { en: 'Organisation', ar: 'الجهة' },
  }),
);

/* -------------------------------------------------------- contact channels */

export const PREVIEW_CONTACT_CHANNELS: Preview<ContactChannel>[] = [
  P({ id: 'prev-ch-1', kind: 'email', label: { en: 'Email', ar: 'البريد الإلكتروني' }, value: { en: 'email@your-domain', ar: 'email@your-domain' }, href: 'mailto:email@your-domain' }),
  P({ id: 'prev-ch-2', kind: 'phone', label: { en: 'Phone', ar: 'الهاتف' }, value: { en: '+00 000 000 0000', ar: '+00 000 000 0000' }, href: 'tel:+000000000000' }),
  P({ id: 'prev-ch-3', kind: 'address', label: { en: 'Office', ar: 'المكتب' }, value: { en: 'Address line from database', ar: 'سطر العنوان من قاعدة البيانات' } }),
];

export const PREVIEW_FIXTURES = {
  services: PREVIEW_SERVICES,
  projects: PREVIEW_PROJECTS,
  process: PREVIEW_PROCESS,
  capabilities: PREVIEW_CAPABILITIES,
  values: PREVIEW_VALUES,
  milestones: PREVIEW_MILESTONES,
  team: PREVIEW_TEAM,
  testimonials: PREVIEW_TESTIMONIALS,
  contactChannels: PREVIEW_CONTACT_CHANNELS,
};
