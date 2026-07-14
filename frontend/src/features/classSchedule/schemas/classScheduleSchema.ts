import { z } from "zod";
import { DAYS_OF_WEEK } from "../types";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

export const classScheduleSchema = z
  .object({
    teacherId: z
      .number({ message: "Teacher is required" })
      .int()
      .positive("Teacher is required"),
    subjectId: z
      .number({ message: "Subject is required" })
      .int()
      .positive("Subject is required"),
    classroomId: z
      .number({ message: "Classroom is required" })
      .int()
      .positive("Classroom is required"),
    dayOfWeek: z.enum(DAYS_OF_WEEK as [string, ...string[]], {
      message: "Day is required",
    }),
    startTime: z
      .string({ message: "Start time is required" })
      .regex(timeRegex, "Invalid start time"),
    endTime: z
      .string({ message: "End time is required" })
      .regex(timeRegex, "Invalid end time"),
    semester: z.string().optional(),
    academicYear: z.string().optional(),
  })
  .refine((v) => v.endTime > v.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export type ClassScheduleFormValues = z.infer<typeof classScheduleSchema>;
