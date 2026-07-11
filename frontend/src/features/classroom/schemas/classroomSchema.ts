import { z } from "zod";

export const classroomSchema = z.object({
  roomNumber: z.string().trim().min(1, "Room number is required"),
  buildingName: z.string().trim().min(1, "Building name is required"),
  floor: z
    .number()
    .int("Floor must be an integer")
    .min(0, "Floor must be positive")
    .optional(),
  capacity: z
    .number()
    .int()
    .min(30, "Capacity must be at least 30"),
  roomType: z.enum(["LECTURE_HALL", "LAB", "SEMINAR_HALL", "AUDITORIUM"], {
    message: "Room type is required",
  }),
  status: z.enum(["AVAILABLE", "OCCUPIED", "MAINTENANCE"], {
    message: "Room status is required",
  }),
  departmentId: z.number().int().positive().optional(),
});

export type ClassroomFormValues = z.infer<typeof classroomSchema>;
