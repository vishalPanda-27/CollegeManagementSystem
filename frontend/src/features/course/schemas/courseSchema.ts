import { z } from "zod";

export const courseSchema = z.object({
  courseName: z
    .string()
    .min(2, "Course name must be at least 2 characters")
    .max(150, "Course name is too long"),
  courseCode: z
    .string()
    .min(2, "Course code is required")
    .max(30, "Course code is too long"),
  credits: z
    .number({ message: "Credits is required" })
    .int("Credits must be an integer")
    .min(2, "Credits must be at least 2")
    .max(10, "Credits looks too high"),
  semester: z
    .number({ message: "Semester is required" })
    .int("Semester must be an integer")
    .min(1, "Semester must be greater than zero")
    .max(8, "Semester must be 8 or less"),
  description: z.string().max(500, "Description is too long").optional(),
  departmentId: z
    .number({ message: "Department is required" })
    .int()
    .positive("Department is required"),
  programId: z.number().int().positive().optional(),
});

export type CourseFormValues = z.infer<typeof courseSchema>;
