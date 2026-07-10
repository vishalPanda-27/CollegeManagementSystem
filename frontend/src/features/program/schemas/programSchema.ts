import { z } from "zod";

export const programSchema = z.object({
  programName: z
    .string()
    .trim()
    .min(1, "Program name is required")
    .max(150, "Program name is too long"),
  programCode: z
    .string()
    .trim()
    .min(1, "Program code is required")
    .max(30, "Program code is too long"),
  durationYears: z
    .number({ message: "Duration is required" })
    .int("Duration must be a whole number")
    .min(1, "Duration must be at least 1 year")
    .max(10, "Duration cannot exceed 10 years"),
  description: z.string().max(500).optional().or(z.literal("")),
  departmentId: z
    .number({ message: "Department is required" })
    .int()
    .positive("Department is required"),
});

export type ProgramFormValues = z.infer<typeof programSchema>;
