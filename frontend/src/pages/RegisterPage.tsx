import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/forms/FormField";
import { FormSelect } from "@/components/forms/FormSelect";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Loader2, CheckCircle2 } from "lucide-react";
import { authApi } from "@/api/endpoints";
import type { Role } from "@/types";
import { toast } from "sonner";

const schema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be at most 50 characters"),
  email: z.string().trim().email("Invalid email format").max(255),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be at most 100 characters"),
  role: z.enum(["ADMIN", "DEAN", "TEACHER", "STUDENT"], {
    message: "Role is required",
  }),
});

type FormValues = z.infer<typeof schema>;

const roleOptions = [
  { value: "STUDENT", label: "Student" },
  { value: "TEACHER", label: "Teacher" },
  { value: "DEAN", label: "Dean" },
  { value: "ADMIN", label: "Admin" },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: "", email: "", password: "", role: "STUDENT" },
  });

  const role = watch("role");

  const onSubmit = async (values: FormValues) => {
    try {
      await authApi.register({ ...values, role: values.role as Role });
      setSuccess(true);
      toast.success("Account created. Please verify your email.");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Registration failed. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      <div className="hidden bg-gradient-to-br from-primary via-primary/90 to-primary/60 p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="text-lg font-semibold">Campus OS</span>
        </div>
        <div>
          <h1 className="text-4xl font-bold leading-tight">
            Create your account
          </h1>
          <p className="mt-4 max-w-md text-primary-foreground/80">
            Join the Campus OS platform to manage students, faculty, courses,
            and departments.
          </p>
        </div>
        <p className="text-sm text-primary-foreground/70">© 2025 Campus OS</p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <Card className="w-full max-w-md border-0 shadow-none lg:border lg:shadow-sm">
          <CardContent className="p-6 sm:p-8">
            {success ? (
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Check your inbox</h2>
                <p className="text-sm text-muted-foreground">
                  We sent a verification link to your email. Please verify your
                  account before signing in.
                </p>
                <Button className="w-full" onClick={() => navigate("/login")}>
                  Back to sign in
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold">Create account</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Register to access the administration dashboard.
                  </p>
                </div>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4"
                  noValidate
                >
                  <FormField
                    label="Username"
                    autoComplete="username"
                    error={errors.username}
                    registration={register("username")}
                  />
                  <FormField
                    label="Email"
                    type="email"
                    autoComplete="email"
                    error={errors.email}
                    registration={register("email")}
                  />
                  <FormField
                    label="Password"
                    type="password"
                    autoComplete="new-password"
                    error={errors.password}
                    registration={register("password")}
                    hint="At least 8 characters."
                  />
                  <FormSelect
                    label="Role"
                    value={role}
                    onChange={(v) => setValue("role", v as Role, { shouldValidate: true })}
                    options={roleOptions}
                    error={errors.role}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create account
                  </Button>
                </form>
                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-primary hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
