import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCrud } from "@/hooks/useCrud";
import { teachersApi } from "@/api/endpoints";
import type { Teacher } from "@/types";

const demo: Teacher[] = [
  { id: "1", employeeId: "EMP001", name: "Dr. Ravi Kumar", email: "ravi@college.edu", departmentId: "4", departmentName: "Physics", designation: "Professor", status: "ACTIVE" },
  { id: "2", employeeId: "EMP014", name: "Dr. Anita Rao", email: "anita@college.edu", departmentId: "1", departmentName: "Computer Science", designation: "Associate Prof.", status: "ACTIVE" },
  { id: "3", employeeId: "EMP022", name: "Prof. Sanjay Verma", email: "sanjay@college.edu", departmentId: "2", departmentName: "Electrical Engg.", designation: "Assistant Prof.", status: "ACTIVE" },
  { id: "4", employeeId: "EMP031", name: "Dr. Meera Nair", email: "meera@college.edu", departmentId: "3", departmentName: "Mechanical", designation: "Professor", status: "INACTIVE" },
];

export default function TeachersPage() {
  const { listQuery } = useCrud<Teacher>("teachers", teachersApi);
  const data = listQuery.data ?? demo;

  const columns: Column<Teacher>[] = [
    { key: "employeeId", header: "Employee ID", render: (r) => <span className="font-mono text-xs">{r.employeeId}</span> },
    { key: "name", header: "Name", render: (r) => <span className="font-medium">{r.name}</span> },
    { key: "email", header: "Email", className: "text-muted-foreground" },
    { key: "departmentName", header: "Department" },
    { key: "designation", header: "Designation" },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <Badge
          variant="outline"
          className={
            r.status === "ACTIVE"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-muted text-muted-foreground"
          }
        >
          {r.status}
        </Badge>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Teachers"
        description="Faculty members across departments."
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add teacher
          </Button>
        }
      />
      <DataTable
        data={data}
        columns={columns}
        isLoading={listQuery.isLoading && !data.length}
        searchKeys={["name", "employeeId", "email", "departmentName"]}
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
