import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/forms/FormField";
import { GraduationCap, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ??
    "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "admin@college.edu", password: "password" },
  });

  const onSubmit = async (values: FormValues) => {
    await login(values.email, values.password);
    navigate(from, { replace: true });
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
            Manage your entire campus,<br />in one place.
          </h1>
          <p className="mt-4 max-w-md text-primary-foreground/80">
            Students, faculty, courses, and departments — unified under a modern
            administration console.
          </p>
        </div>
        <p className="text-sm text-primary-foreground/70">© 2025 Campus OS</p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <Card className="w-full max-w-md border-0 shadow-none lg:border lg:shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold">Sign in</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Access your administration dashboard.
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                autoComplete="current-password"
                error={errors.password}
                registration={register("password")}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign in
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-primary hover:underline"
              >
                Create one
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
