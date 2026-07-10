export interface Program {
  programId: number;
  programName: string;
  programCode: string;
  durationYears: number;
  description?: string | null;
  departmentId: number;
  departmentName?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProgramRequest {
  programName: string;
  programCode: string;
  durationYears: number;
  description?: string;
  departmentId: number;
}
