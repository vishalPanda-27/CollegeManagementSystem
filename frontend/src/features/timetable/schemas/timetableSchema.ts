import { z } from "zod";
import { DAYS_OF_WEEK } from "../types";

const timeRegex = /^\d{2}:\d{2}(:\d{2})?$/;

export const timetableSchema = z
  .object({
    dayOfWeek: z.enum(DAYS_OF_WEEK as [string, ...string[]], {
      message: "Day is required",
    }),
    startTime: z
      .string({ message: "Start time is required" })
      .regex(timeRegex, "Invalid start time"),
    endTime: z
      .string({ message: "End time is required" })
      .regex(timeRegex, "Invalid end time"),
    courseId: z
      .number({ message: "Course is required" })
      .int()
      .positive("Course is required"),
    subjectId: z
      .number({ message: "Subject is required" })
      .int()
      .positive("Subject is required"),
    teacherId: z
      .number({ message: "Teacher is required" })
      .int()
      .positive("Teacher is required"),
    classroomId: z
      .number({ message: "Classroom is required" })
      .int()
      .positive("Classroom is required"),
  })
  .refine((v) => v.endTime > v.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export type TimetableFormValues = z.infer<typeof timetableSchema>;
