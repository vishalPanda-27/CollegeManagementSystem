import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useCrud } from "@/hooks/useCrud";
import { studentsApi } from "@/api/endpoints";
import type { Student } from "@/types";

const demoStudents: Student[] = [
  { id: "1", rollNumber: "CS22001", name: "Priya Sharma", email: "priya@college.edu", departmentId: "1", departmentName: "Computer Science", year: 3, gpa: 3.8, status: "ACTIVE" },
  { id: "2", rollNumber: "EE22014", name: "Arjun Mehta", email: "arjun@college.edu", departmentId: "2", departmentName: "Electrical Engg.", year: 2, gpa: 3.5, status: "ACTIVE" },
  { id: "3", rollNumber: "ME21042", name: "Neha Kapoor", email: "neha@college.edu", departmentId: "3", departmentName: "Mechanical", year: 4, gpa: 3.9, status: "GRADUATED" },
  { id: "4", rollNumber: "CS23087", name: "Rohan Iyer", email: "rohan@college.edu", departmentId: "1", departmentName: "Computer Science", year: 1, gpa: 3.2, status: "ACTIVE" },
  { id: "5", rollNumber: "PH22011", name: "Sara Ali", email: "sara@college.edu", departmentId: "4", departmentName: "Physics", year: 3, gpa: 3.6, status: "INACTIVE" },
];

const statusColor: Record<Student["status"], string> = {
  ACTIVE: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  INACTIVE: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  GRADUATED: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
};

export default function StudentsPage() {
  const { listQuery, removeMutation } = useCrud<Student>("students", studentsApi);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const data = listQuery.data ?? demoStudents;

  const columns: Column<Student>[] = [
    { key: "rollNumber", header: "Roll No.", render: (r) => <span className="font-mono text-xs">{r.rollNumber}</span> },
    { key: "name", header: "Name", render: (r) => <span className="font-medium">{r.name}</span> },
    { key: "email", header: "Email", className: "text-muted-foreground" },
    { key: "departmentName", header: "Department" },
    { key: "year", header: "Year" },
    { key: "gpa", header: "GPA", render: (r) => (r.gpa?.toFixed(2) ?? "—") },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <Badge variant="outline" className={statusColor[r.status]}>
          {r.status}
        </Badge>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Students"
        description="Manage enrolled students across all departments."
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add student
          </Button>
        }
      />

      <DataTable
        data={data}
        columns={columns}
        isLoading={listQuery.isLoading && !data.length}
        isError={false}
        onRetry={() => listQuery.refetch()}
        searchPlaceholder="Search by name, roll no, email..."
        searchKeys={["name", "rollNumber", "email", "departmentName"]}
        actions={(row) => (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon" aria-label="Edit">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Delete"
              onClick={() => setConfirmId(String(row.id))}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        )}
      />

      <ConfirmDialog
        open={!!confirmId}
        onOpenChange={(o) => !o && setConfirmId(null)}
        title="Delete student?"
        description="This student record will be permanently removed."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          if (confirmId) removeMutation.mutate(confirmId);
          setConfirmId(null);
        }}
      />
    </div>
  );
}
