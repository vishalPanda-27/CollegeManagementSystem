import { z } from "zod";

export const teacherSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(60),
  lastName: z.string().trim().min(1, "Last name is required").max(60),
  email: z.string().trim().email("Invalid email").max(120),
  phone: z
    .string()
    .trim()
    .min(1, "Phone is required")
    .max(20, "Phone must be at most 20 characters"),
  qualification: z.string().trim().min(1, "Qualification is required").max(120),
  specialization: z.string().trim().min(1, "Specialization is required").max(120),
  joiningDate: z.string().min(1, "Joining date is required"),
  salary: z.number({ error: "Salary is required" }).positive("Salary must be positive"),
  active: z.boolean(),
  departmentId: z
    .number({ error: "Department is required" })
    .int()
    .positive("Department is required"),
  userId: z.number().int().positive().nullable().optional(),
  subjectIds: z.array(z.number().int().positive()).optional(),
  courseIds: z.array(z.number().int().positive()).optional(),
});

export type TeacherFormValues = z.infer<typeof teacherSchema>;
