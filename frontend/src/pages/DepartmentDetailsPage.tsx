import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
    ArrowLeft,
    Building2,
    Mail,
    Phone,
    GraduationCap,
    Users,
    BookOpen,
    Calendar,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Loading } from "@/components/common/Loading";
import { ErrorState } from "@/components/common/ErrorState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { departmentsApi } from "@/api/departments";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormSelect } from "@/components/forms/FormSelect";
import { teachersApi } from "@/api/endpoints";

export default function DepartmentDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [teacherId, setTeacherId] = useState("");

    const q = useQuery({
        queryKey: ["departments", id],
        queryFn: () => departmentsApi.get(Number(id)),
        enabled: !!id,
    });

    const teachersQuery = useQuery({
        queryKey: ["teachers"],
        queryFn: teachersApi.list,
    });

    const teacherOptions =
        teachersQuery.data
            ?.filter((t) => t.departmentId === String(d.id))
            .map((t) => ({
                value: String(t.id),
                label: `${t.firstName} ${t.lastName}`,
            })) ?? [];
    const assignMutation = useMutation({
        mutationFn: () =>
            departmentsApi.assignHod(
                d.id,
                Number(teacherId)
            ),

        onSuccess: () => {
            toast.success("HOD assigned.");
            q.refetch();
        },

        onError: (err: any) => {
            toast.error(
                err?.response?.data?.message ??
                "Failed to assign HOD."
            );
        },
    });

    if (q.isLoading) return <Loading />;
    if (q.isError || !q.data)
        return <ErrorState onRetry={() => q.refetch()} />;

    const d = q.data;

    return (
        <div>
            <PageHeader
                title={d.name}
                description={`Department code: ${d.code}`}
                actions={
                    <Button variant="outline" onClick={() => navigate("/departments")}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                }
            />

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardContent className="space-y-6 p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Building2 className="h-7 w-7" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">{d.name}</h2>
                                <p className="text-sm text-muted-foreground">
                                    {d.description || "No description provided."}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={d.email ?? "—"} />
                            <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={d.phoneNumber ?? "—"} />
                            <InfoRow
                                icon={<Users className="h-4 w-4" />}
                                label="Head of Department"
                                value={
                                    d.hodName ? (
                                        <Link to={`/teachers`} className="text-primary hover:underline">
                                            {d.hodName}
                                        </Link>
                                    ) : (
                                        "Not assigned"
                                    )
                                }
                            />
                            <InfoRow
                                icon={<Calendar className="h-4 w-4" />}
                                label="Created"
                                value={d.createdAt ?? "—"}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="space-y-3 p-6">
                        <h3 className="text-sm font-semibold text-muted-foreground">
                            Statistics
                        </h3>
                        <StatRow icon={<GraduationCap className="h-4 w-4" />} label="Students" value={d.totalStudents ?? 0} />
                        <StatRow icon={<Users className="h-4 w-4" />} label="Teachers" value={d.totalTeachers ?? 0} />
                        <StatRow icon={<BookOpen className="h-4 w-4" />} label="Courses" value={d.totalCourses ?? 0} />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="space-y-4 p-6">

                        <h3 className="font-semibold">
                            Assign Head of Department
                        </h3>

                        <FormSelect
                            label="Teacher"
                            value={teacherId}
                            onChange={setTeacherId}
                            options={teacherOptions}
                        />

                        <Button
                            className="w-full"
                            disabled={
                                !teacherId ||
                                assignMutation.isPending
                            }
                            onClick={() => assignMutation.mutate()}
                        >
                            {assignMutation.isPending
                                ? "Assigning..."
                                : "Assign HOD"}
                        </Button>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function InfoRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {icon}
                {label}
            </div>
            <div className="mt-1 text-sm">{value}</div>
        </div>
    );
}

function StatRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: number;
}) {
    return (
        <div className="flex items-center justify-between rounded-md border px-3 py-2">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
                {icon}
                {label}
            </span>
            <span className="font-semibold">{value}</span>
        </div>
    );
}
