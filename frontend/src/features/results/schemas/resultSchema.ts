import { z } from "zod";

export const resultSchema = z
  .object({
    studentId: z
      .number({ message: "Student is required" })
      .int()
      .positive("Student is required"),
    subjectId: z
      .number({ message: "Subject is required" })
      .int()
      .positive("Subject is required"),
    marksObtained: z
      .number({ message: "Marks obtained is required" })
      .min(0, "Marks cannot be negative"),
    maximumMarks: z
      .number({ message: "Maximum marks is required" })
      .min(1, "Maximum marks must be greater than 0"),
  })
  .refine((v) => v.marksObtained <= v.maximumMarks, {
    path: ["marksObtained"],
    message: "Marks obtained cannot exceed maximum marks",
  });

export type ResultFormValues = z.infer<typeof resultSchema>;
