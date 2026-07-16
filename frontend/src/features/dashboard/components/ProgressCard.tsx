import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function ProgressCard({
  label,
  value,
  max = 100,
  suffix = "%",
  hint,
}: {
  label: string;
  value: number;
  max?: number;
  suffix?: string;
  hint?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <Card>
      <CardContent className="p-5">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-3xl font-bold">{value.toFixed(2)}</span>
          <span className="text-sm text-muted-foreground">{suffix}</span>
        </div>
        <Progress value={pct} className="mt-3" />
        {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}
