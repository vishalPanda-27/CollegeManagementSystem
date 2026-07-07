import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Pencil,
  Trash2,
  ShieldCheck,
  ShieldOff,
  Lock,
  Unlock,
  Users as UsersIcon,
  UserCheck,
  UserX,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { FormField } from "@/components/forms/FormField";
import { FormSelect } from "@/components/forms/FormSelect";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usersApi } from "@/api/users";
import type { Role, UserRecord, UserRequest } from "@/types";
import { formatDate } from "@/utils/format";

const ROLES: Role[] = ["ADMIN", "DEAN", "TEACHER", "STUDENT"];

const baseSchema = z.object({
  username: z.string().trim().min(3, "Min 3 characters").max(50),
  email: z.string().trim().email("Invalid email").max(255),
  role: z.enum(["ADMIN", "DEAN", "TEACHER", "STUDENT"], {
    message: "Role is required",
  }),
  enabled: z.boolean(),
  accountLocked: z.boolean(),
  password: z.string().optional(),
});

type FormValues = z.infer<typeof baseSchema>;

type RoleFilter = Role | "ALL";
type StatusFilter = "ALL" | "ENABLED" | "DISABLED";

const roleBadge: Record<Role, string> = {
  ADMIN: "bg-purple-500/15 text-purple-600 dark:text-purple-300",
  DEAN: "bg-blue-500/15 text-blue-600 dark:text-blue-300",
  TEACHER: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
  STUDENT: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
};

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function UsersPage() {
  const qc = useQueryClient();
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<UserRecord | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<UserRecord | null>(null);

  const usersQuery = useQuery({
    queryKey: ["users", roleFilter, statusFilter],
    queryFn: () => {
      if (roleFilter !== "ALL") return usersApi.byRole(roleFilter);
      if (statusFilter === "ENABLED") return usersApi.enabled();
      if (statusFilter === "DISABLED") return usersApi.disabled();
      return usersApi.list();
    },
  });

  const strengthQuery = useQuery({
    queryKey: ["users", "strength"],
    queryFn: usersApi.strength,
  });
  const enabledStrengthQuery = useQuery({
    queryKey: ["users", "enabled-strength"],
    queryFn: usersApi.enabledStrength,
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["users"] });
  };

  const createMut = useMutation({
    mutationFn: (data: UserRequest) => usersApi.create(data),
    onSuccess: () => {
      toast.success("User created");
      setDialogOpen(false);
      invalidate();
    },
    onError: (e: unknown) => toast.error(errMsg(e, "Failed to create user")),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserRequest }) =>
      usersApi.update(id, data),
    onSuccess: () => {
      toast.success("User updated");
      setDialogOpen(false);
      invalidate();
    },
    onError: (e: unknown) => toast.error(errMsg(e, "Failed to update user")),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => usersApi.remove(id),
    onSuccess: () => {
      toast.success("User deleted");
      setConfirmDelete(null);
      invalidate();
    },
    onError: (e: unknown) => toast.error(errMsg(e, "Failed to delete user")),
  });

  const patchMut = useMutation({
    mutationFn: ({
      id,
      action,
    }: {
      id: number;
      action: "enable" | "disable" | "lock" | "unlock";
    }) => usersApi[action](id),
    onSuccess: (_d, v) => {
      toast.success(`User ${v.action}d`);
      invalidate();
    },
    onError: (e: unknown) => toast.error(errMsg(e, "Action failed")),
  });

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (u: UserRecord) => {
    setEditing(u);
    setDialogOpen(true);
  };

  const columns: Column<UserRecord>[] = useMemo(
    () => [
      {
        key: "username",
        header: "Username",
        render: (u) => <span className="font-medium">{u.username}</span>,
      },
      { key: "email", header: "Email" },
      {
        key: "role",
        header: "Role",
        render: (u) => (
          <Badge variant="secondary" className={roleBadge[u.role]}>
            {u.role}
          </Badge>
        ),
      },
      {
        key: "status",
        header: "Status",
        render: (u) => (
          <div className="flex flex-wrap gap-1.5">
            <Badge
              variant="outline"
              className={
                u.enabled
                  ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-300"
                  : "border-muted-foreground/30 text-muted-foreground"
              }
            >
              {u.enabled ? "Enabled" : "Disabled"}
            </Badge>
            {u.accountLocked && (
              <Badge
                variant="outline"
                className="border-destructive/40 text-destructive"
              >
                Locked
              </Badge>
            )}
          </div>
        ),
      },
      {
        key: "createdAt",
        header: "Created",
        render: (u) => (
          <span className="text-muted-foreground">
            {u.createdAt ? formatDate(u.createdAt) : "—"}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage user accounts, roles, and access."
        actions={
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" /> New User
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total Users"
          value={strengthQuery.data ?? "—"}
          icon={UsersIcon}
        />
        <StatCard
          label="Enabled"
          value={enabledStrengthQuery.data ?? "—"}
          icon={UserCheck}
        />
        <StatCard
          label="Disabled"
          value={
            typeof strengthQuery.data === "number" &&
              typeof enabledStrengthQuery.data === "number"
              ? strengthQuery.data - enabledStrengthQuery.data
              : "—"
          }
          icon={UserX}
        />
      </div>

      <DataTable<UserRecord>
        data={usersQuery.data}
        columns={columns}
        isLoading={usersQuery.isLoading}
        isError={usersQuery.isError}
        onRetry={() => usersQuery.refetch()}
        searchPlaceholder="Search by username or email..."
        searchKeys={["username", "email"]}
        toolbar={
          <div className="flex flex-wrap gap-2">
            <Select
              value={roleFilter}
              onValueChange={(v) => {
                setRoleFilter(v as RoleFilter);
                if (v !== "ALL") setStatusFilter("ALL");
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All roles</SelectItem>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v as StatusFilter);
                if (v !== "ALL") setRoleFilter("ALL");
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All statuses</SelectItem>
                <SelectItem value="ENABLED">Enabled</SelectItem>
                <SelectItem value="DISABLED">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
        actions={(u) => (
          <div className="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              title={u.enabled ? "Disable" : "Enable"}
              onClick={() =>
                patchMut.mutate({
                  id: u.id,
                  action: u.enabled ? "disable" : "enable",
                })
              }
            >
              {u.enabled ? (
                <ShieldOff className="h-4 w-4" />
              ) : (
                <ShieldCheck className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title={u.accountLocked ? "Unlock" : "Lock"}
              onClick={() =>
                patchMut.mutate({
                  id: u.id,
                  action: u.accountLocked ? "unlock" : "lock",
                })
              }
            >
              {u.accountLocked ? (
                <Unlock className="h-4 w-4" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Edit"
              onClick={() => openEdit(u)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Delete"
              onClick={() => setConfirmDelete(u)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        )}
      />

      <UserFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        submitting={createMut.isPending || updateMut.isPending}
        onSubmit={(values) => {
          const payload: UserRequest = {
            username: values.username,
            email: values.email,
            role: values.role,
            enabled: values.enabled,
            accountLocked: values.accountLocked,
            ...(values.password ? { password: values.password } : {}),
          };
          if (editing) {
            updateMut.mutate({ id: editing.id, data: payload });
          } else {
            createMut.mutate(payload);
          }
        }}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
        title="Delete user?"
        description={
          confirmDelete
            ? `This will permanently delete "${confirmDelete.username}". This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() =>
          confirmDelete && deleteMut.mutate(confirmDelete.id)
        }
      />
    </div>
  );
}

function UserFormDialog({
  open,
  onOpenChange,
  editing,
  submitting,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  editing: UserRecord | null;
  submitting: boolean;
  onSubmit: (values: FormValues) => void;
}) {
  const schema = editing
    ? baseSchema.refine(
      (v) => !v.password || v.password.length >= 8,
      { path: ["password"], message: "Min 8 characters" },
    )
    : baseSchema.extend({
      password: z.string().min(8, "Min 8 characters").max(100),
    });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      username: editing?.username ?? "",
      email: editing?.email ?? "",
      password: "",
      role: editing?.role ?? "STUDENT",
      enabled: editing?.enabled ?? true,
      accountLocked: editing?.accountLocked ?? false,
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) reset();
      }}
    >
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit User" : "Create User"}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          id="user-form"
        >
          <FormField
            label="Username"
            registration={register("username")}
            error={errors.username}
            placeholder="jdoe"
          />
          <FormField
            label="Email"
            type="email"
            registration={register("email")}
            error={errors.email}
            placeholder="user@example.com"
          />
          <FormField
            label={editing ? "Password (leave blank to keep)" : "Password"}
            type="password"
            registration={register("password")}
            error={errors.password}
            placeholder="••••••••"
          />
          <FormSelect
            label="Role"
            value={watch("role")}
            onChange={(v) => setValue("role", v as Role, { shouldValidate: true })}
            options={ROLES.map((r) => ({ value: r, label: r }))}
            error={errors.role}
          />
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 rounded-md border p-3 text-sm">
              <input
                type="checkbox"
                {...register("enabled")}
                className="h-4 w-4"
              />
              Enabled
            </label>
            <label className="flex items-center gap-2 rounded-md border p-3 text-sm">
              <input
                type="checkbox"
                {...register("accountLocked")}
                className="h-4 w-4"
              />
              Account locked
            </label>
          </div>
        </form>
        <DialogFooter>
          <Button
            variant="outline"
            type="button"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" form="user-form" disabled={submitting}>
            {editing ? "Save changes" : "Create user"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function errMsg(e: unknown, fallback: string): string {
  if (typeof e === "object" && e !== null) {
    const anyE = e as { response?: { data?: { message?: string } }; message?: string };
    return anyE.response?.data?.message ?? anyE.message ?? fallback;
  }
  return fallback;
}
