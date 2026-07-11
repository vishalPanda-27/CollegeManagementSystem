import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface MultiOption {
  value: number;
  label: string;
  hint?: string;
}

interface Props {
  options: MultiOption[];
  value: number[];
  onChange: (v: number[]) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  emptyText?: string;
  invalid?: boolean;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  disabled,
  loading,
  emptyText = "No options.",
  invalid,
}: Props) {
  const [open, setOpen] = useState(false);
  const selected = useMemo(
    () => options.filter((o) => value.includes(o.value)),
    [options, value],
  );

  const toggle = (v: number) => {
    if (value.includes(v)) onChange(value.filter((x) => x !== v));
    else onChange([...value, v]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-invalid={invalid}
          disabled={disabled}
          className={cn(
            "h-auto min-h-9 w-full justify-between gap-2 py-1.5 font-normal",
            !selected.length && "text-muted-foreground",
          )}
        >
          <div className="flex flex-1 flex-wrap items-center gap-1">
            {loading ? (
              <span>Loading...</span>
            ) : selected.length === 0 ? (
              <span>{placeholder}</span>
            ) : (
              selected.map((s) => (
                <Badge
                  key={s.value}
                  variant="secondary"
                  className="gap-1 pr-1 text-xs"
                >
                  {s.label}
                  <span
                    role="button"
                    tabIndex={-1}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle(s.value);
                    }}
                    className="rounded p-0.5 hover:bg-muted-foreground/20"
                  >
                    <X className="h-3 w-3" />
                  </span>
                </Badge>
              ))
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((o) => {
                const isSel = value.includes(o.value);
                return (
                  <CommandItem
                    key={o.value}
                    value={`${o.label} ${o.hint ?? ""}`}
                    onSelect={() => toggle(o.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSel ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <span className="flex-1">{o.label}</span>
                    {o.hint && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        {o.hint}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
