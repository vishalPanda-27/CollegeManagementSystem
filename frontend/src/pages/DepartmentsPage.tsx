import { Building2, Plus, Users, GraduationCap } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCrud } from "@/hooks/useCrud";
import { departmentsApi } from "@/api/endpoints";
import type { Department } from "@/types";

const demo: Department[] = [
  { id: "1", code: "CSE", name: "Computer Science & Engineering", headOfDepartment: "Dr. Anita Rao", totalStudents: 842, totalTeachers: 32 },
  { id: "2", code: "EEE", name: "Electrical Engineering", headOfDepartment: "Prof. Sanjay Verma", totalStudents: 520, totalTeachers: 24 },
  { id: "3", code: "MECH", name: "Mechanical Engineering", headOfDepartment: "Dr. Meera Nair", totalStudents: 610, totalTeachers: 28 },
  { id: "4", code: "PHY", name: "Physics", headOfDepartment: "Dr. Ravi Kumar", totalStudents: 210, totalTeachers: 14 },
  { id: "5", code: "MATH", name: "Mathematics", headOfDepartment: "Dr. Kavita Joshi", totalStudents: 180, totalTeachers: 12 },
  { id: "6", code: "CHEM", name: "Chemistry", headOfDepartment: "Dr. Suresh Iyer", totalStudents: 195, totalTeachers: 15 },
];

export default function DepartmentsPage() {
  const { listQuery } = useCrud<Department>("departments", departmentsApi);
  const data = listQuery.data ?? demo;

  return (
    <div>
      <PageHeader
        title="Departments"
        description="Academic departments and their leadership."
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add department
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.map((d) => (
          <Card key={d.id} className="transition hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs">
                  {d.code}
                </span>
              </div>
              <h3 className="mt-4 font-semibold">{d.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Head: {d.headOfDepartment ?? "—"}
              </p>
              <div className="mt-4 flex gap-4 border-t pt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <GraduationCap className="h-3.5 w-3.5" />
                  {d.totalStudents} students
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {d.totalTeachers} teachers
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
