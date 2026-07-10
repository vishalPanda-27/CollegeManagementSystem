import { z } from "zod";

export const subjectSchema = z.object({
  subjectName: z
    .string()
    .trim()
    .min(1, "Subject name is required")
    .max(150, "Subject name is too long"),
  subjectCode: z
    .string()
    .trim()
    .min(1, "Subject code is required")
    .max(30, "Subject code is too long"),
  credits: z
    .number({ message: "Credits is required" })
    .int("Credits must be an integer")
    .min(2, "Credits must be at least 2")
    .max(10, "Credits looks too high"),
  theoryHours: z
    .number({ message: "Theory hours is required" })
    .int()
    .min(1, "Theory hours must be at least 1"),
  practicalHours: z
    .number()
    .int()
    .min(0)
    .optional(),
  semester: z
    .number({ message: "Semester is required" })
    .int()
    .min(1, "Semester must be between 1 and 8")
    .max(8, "Semester must be between 1 and 8"),
  active: z.boolean().optional(),
  departmentId: z
    .number({ message: "Department is required" })
    .int()
    .positive("Department is required"),
  courseId: z
    .number({ message: "Course is required" })
    .int()
    .positive("Course is required"),
});

export type SubjectFormValues = z.infer<typeof subjectSchema>;
