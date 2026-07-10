import { useMemo, useState } from "react";
import {
  Building2,
  Plus,
  Users,
  GraduationCap,
  Search,
  Mail,
  Phone,
  Eye
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FormField } from "@/components/forms/FormField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/common/Loading";
import { ErrorState } from "@/components/common/ErrorState";
import { useCrud } from "@/hooks/useCrud";
import { departmentsApi } from "@/api/endpoints";
import type { Department } from "@/types";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { toast } from "sonner";

const schema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phoneNumber: z.string().min(1, "Phone number is required"),
});

type FormValues = z.infer<typeof schema>;


export default function DepartmentsPage() {
  const {
    listQuery,
    createMutation,
    updateMutation,
    removeMutation,
  } = useCrud<Department>("departments", departmentsApi);


  const data = listQuery.data ?? [];
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [toDelete, setToDelete] = useState<Department | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return data;

    return data.filter((d) =>
      [d.code, d.name, d.hodName]
        .some(v => String(v ?? "").toLowerCase().includes(q))
    );
  }, [data, query]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const onSubmit = (values: FormValues) => {
    const payload = {
      code: values.code,
      name: values.name,
      description: values.description || undefined,
      email: values.email || undefined,
      phoneNumber: values.phoneNumber,
    };

    if (editing) {
      updateMutation.mutate(
        {
          id: editing.id,
          data: payload,
        },
        {
          onSuccess: () => {
            toast.success("Department updated successfully.");
          },
          onError: (err: any) => {
            toast.error(
              err?.response?.data?.message ??
              "Failed to update department."
            );
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Department created successfully.");
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message ??
            "Failed to create department."
          );
        },
      });
    }

    reset();
    setEditing(null);
    setDialogOpen(false);
  };

  const stats = useMemo(() => {
    return {
      departments: data.length,
      students: data.reduce(
        (sum, d) => sum + (d.totalStudents ?? 0),
        0
      ),
      teachers: data.reduce(
        (sum, d) => sum + (d.totalTeachers ?? 0),
        0
      ),
    };
  }, [data]);


  return (
    <div>
      <PageHeader
        title="Departments"
        description="Academic departments and their leadership."
        actions={
          <Button
            onClick={() => {
              reset();
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add department
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={<Building2 className="h-5 w-5" />}
          label="Departments"
          value={stats.departments}
        />

        <StatCard
          icon={<GraduationCap className="h-5 w-5" />}
          label="Students"
          value={stats.students}
        />

        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="Teachers"
          value={stats.teachers}
        />
      </div>

      <div className="mb-4 flex items-center gap-2">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />

          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search departments..."
            className="pl-8"
          />
        </div>
      </div>

      {listQuery.isLoading ? (
        <Loading />
      ) : listQuery.isError ? (
        <ErrorState onRetry={() => listQuery.refetch()} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((d) => (
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

                {d.description && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {d.description}
                  </p>
                )}

                <p className="mt-2 text-xs text-muted-foreground">
                  Head: {d.hodName ?? "—"}
                </p>

                {d.email && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    {d.email}
                  </div>
                )}

                {d.phoneNumber && (
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    {d.phoneNumber}
                  </div>
                )}

                <div className="mt-4 flex gap-4 border-t pt-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <GraduationCap className="h-3.5 w-3.5" />
                    {d.totalStudents ?? 0} students
                  </div>

                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {d.totalTeachers ?? 0} teachers
                  </div>
                </div>

                <div className="mt-4 flex gap-2">

                  <Button
                    asChild
                    variant="outline"
                    className="flex-1"
                    size="sm"
                  >
                    <Link to={`/departments/${d.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditing(d);

                      reset({
                        code: d.code,
                        name: d.name,
                        description: d.description ?? "",
                        email: d.email ?? "",
                        phoneNumber: d.phoneNumber ?? "",
                      });

                      setDialogOpen(true);
                    }}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setToDelete(d)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )
      }
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);

          if (!open) {
            reset();
            setEditing(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Department" : "Create Department"}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              label="Department Code"
              registration={register("code")}
              error={errors.code}
            />

            <FormField
              label="Department Name"
              registration={register("name")}
              error={errors.name}
            />

            <FormField
              label="Description"
              registration={register("description")}
            />

            <FormField
              label="Email"
              type="email"
              registration={register("email")}
              error={errors.email}
            />

            <FormField
              label="Phone Number"
              registration={register("phoneNumber")}
              error={errors.phoneNumber}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending
                }
              >
                {editing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(open) => {
          if (!open) setToDelete(null);
        }}
        title="Delete Department?"
        description={`Are you sure you want to delete "${toDelete?.name}"?`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          if (!toDelete) return;

          removeMutation.mutate(toDelete.id, {
            onSuccess: () => {
              toast.success("Department deleted successfully.");
            },
            onError: (err: any) => {
              toast.error(
                err?.response?.data?.message ??
                "Failed to delete department."
              );
            },
          });

          setToDelete(null);
        }}
      />

    </div>
  );
}
function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>

        <div>
          <div className="text-2xl font-semibold">
            {value}
          </div>

          <div className="text-xs text-muted-foreground">
            {label}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}