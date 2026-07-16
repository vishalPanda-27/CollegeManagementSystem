import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Unauthorized() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <h1 className="mt-6 text-3xl font-bold">403 · Access Denied</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        You don't have permission to view this page. If you believe this is a
        mistake, contact your administrator.
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link to="/">Back to dashboard</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/settings">Settings</Link>
        </Button>
      </div>
    </div>
  );
}
