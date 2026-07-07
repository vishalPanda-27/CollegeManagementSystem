import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { useCrud } from "@/hooks/useCrud";
import { coursesApi } from "@/api/endpoints";
import type { Course } from "@/types";

const demo: Course[] = [
  { id: "1", code: "CS301", title: "Data Structures & Algorithms", credits: 4, departmentId: "1", departmentName: "Computer Science", teacherName: "Dr. Anita Rao" },
  { id: "2", code: "EE210", title: "Circuit Analysis", credits: 3, departmentId: "2", departmentName: "Electrical Engg.", teacherName: "Prof. Sanjay Verma" },
  { id: "3", code: "ME105", title: "Engineering Mechanics", credits: 3, departmentId: "3", departmentName: "Mechanical", teacherName: "Dr. Meera Nair" },
  { id: "4", code: "PH201", title: "Quantum Physics", credits: 4, departmentId: "4", departmentName: "Physics", teacherName: "Dr. Ravi Kumar" },
  { id: "5", code: "CS402", title: "Machine Learning", credits: 4, departmentId: "1", departmentName: "Computer Science", teacherName: "Dr. Anita Rao" },
];

export default function CoursesPage() {
  const { listQuery } = useCrud<Course>("courses", coursesApi);
  const data = listQuery.data ?? demo;

  const columns: Column<Course>[] = [
    { key: "code", header: "Code", render: (r) => <span className="font-mono text-xs">{r.code}</span> },
    { key: "title", header: "Title", render: (r) => <span className="font-medium">{r.title}</span> },
    { key: "credits", header: "Credits" },
    { key: "departmentName", header: "Department" },
    { key: "teacherName", header: "Instructor", className: "text-muted-foreground" },
  ];

  return (
    <div>
      <PageHeader
        title="Courses"
        description="Course catalog and offerings."
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add course
          </Button>
        }
      />
      <DataTable
        data={data}
        columns={columns}
        isLoading={listQuery.isLoading && !data.length}
        searchKeys={["code", "title", "departmentName", "teacherName"]}
        actions={() => (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        )}
      />
    </div>
  );
}
