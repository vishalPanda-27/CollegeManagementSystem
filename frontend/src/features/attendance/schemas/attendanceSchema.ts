import { z } from "zod";
import { ATTENDANCE_STATUSES } from "../types";

const todayIso = () => new Date().toISOString().slice(0, 10);

export const attendanceSchema = z.object({
  studentId: z
    .number({ message: "Student is required" })
    .int()
    .positive("Student is required"),
  subjectId: z
    .number({ message: "Subject is required" })
    .int()
    .positive("Subject is required"),
  markedById: z
    .number()
    .int()
    .positive()
    .nullable()
    .optional(),
  attendanceDate: z
    .string({ message: "Attendance date is required" })
    .min(1, "Attendance date is required")
    .refine((v) => v <= todayIso(), {
      message: "Attendance date cannot be in the future",
    }),
  status: z.enum(ATTENDANCE_STATUSES as [string, ...string[]], {
    message: "Status is required",
  }),
});

export type AttendanceFormValues = z.infer<typeof attendanceSchema>;
