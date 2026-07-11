export type RoomType = "LECTURE_HALL" | "LAB" | "SEMINAR_HALL" | "AUDITORIUM";
export type RoomStatus = "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";

export const ROOM_TYPES: RoomType[] = [
  "LECTURE_HALL",
  "LAB",
  "SEMINAR_HALL",
  "AUDITORIUM",
];
export const ROOM_STATUSES: RoomStatus[] = [
  "AVAILABLE",
  "OCCUPIED",
  "MAINTENANCE",
];

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  LECTURE_HALL: "Lecture Hall",
  LAB: "Lab",
  SEMINAR_HALL: "Seminar Hall",
  AUDITORIUM: "Auditorium",
};

export const ROOM_STATUS_LABELS: Record<RoomStatus, string> = {
  AVAILABLE: "Available",
  OCCUPIED: "Occupied",
  MAINTENANCE: "Maintenance",
};

export interface Classroom {
  id: number;
  roomNumber: string;
  buildingName: string;
  floor?: number | null;
  capacity: number;
  roomType: RoomType;
  status: RoomStatus;
  departmentId?: number | null;
  departmentName?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface ClassroomRequest {
  roomNumber: string;
  buildingName: string;
  floor?: number | null;
  capacity: number;
  roomType: RoomType;
  status: RoomStatus;
  departmentId?: number | null;
}
