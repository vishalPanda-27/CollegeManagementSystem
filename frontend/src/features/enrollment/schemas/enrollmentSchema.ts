import { z } from "zod";

export const enrollmentSchema = z.object({
  studentId: z
    .number({ message: "Student is required" })
    .int()
    .positive("Student is required"),
  courseId: z
    .number({ message: "Course is required" })
    .int()
    .positive("Course is required"),
  enrollmentDate: z.string().optional().or(z.literal("")),
  semester: z.string().min(1, "Semester is required"),
  academicYear: z
    .string()
    .regex(/^\d{4}-\d{4}$/, "Academic year must be in format YYYY-YYYY"),
  status: z
    .enum(["ENROLLED", "COMPLETED", "DROPPED", "WITHDRAWN"])
    .optional(),
  grade: z
    .union([
      z
        .number()
        .min(0, "Grade must be between 0 and 10")
        .max(10, "Grade must be between 0 and 10"),
      z.nan(),
      z.undefined(),
    ])
    .optional(),
});

export type EnrollmentFormValues = z.infer<typeof enrollmentSchema>;
