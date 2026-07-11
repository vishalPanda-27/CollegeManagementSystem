import { z } from "zod";
import { STUDENT_STATUSES } from "../types";

export const studentSchema = z
  .object({
    rollNumber: z.string().trim().min(1, "Roll number is required"),
    firstName: z.string().trim().min(1, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
    email: z.string().trim().email("Enter a valid email"),
    phoneNumber: z.string().trim().min(1, "Phone number is required"),
    dateOfBirth: z.string().optional().or(z.literal("")),
    gender: z.string().min(1, "Gender is required"),
    address: z.string().optional().or(z.literal("")),
    admissionDate: z.string().min(1, "Admission date is required"),
    status: z.enum(STUDENT_STATUSES as [string, ...string[]]),
    departmentId: z
      .number({ error: "Department is required" })
      .int()
      .positive("Department is required"),
  })
  .refine(
    (v) => !v.dateOfBirth || new Date(v.dateOfBirth) <= new Date(),
    { message: "Date of birth cannot be in the future", path: ["dateOfBirth"] },
  );

export type StudentFormValues = z.infer<typeof studentSchema>;
