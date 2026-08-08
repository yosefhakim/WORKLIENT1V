import type { ReactNode } from "react";
import { SearchX, AlertTriangle, Inbox } from "lucide-react";

interface StateViewProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

function StateView({ title, description, action, icon }: StateViewProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-elevated)] text-[var(--color-text-secondary)]">
        {icon}
      </div>
      <h3 className="font-[var(--font-display)] text-lg font-semibold text-[var(--color-text-primary)]">
        {title}
      </h3>
      {description && (
        <p className="max-w-sm text-sm text-[var(--color-text-secondary)]">{description}</p>
      )}
      {action}
    </div>
  );
}

export function EmptyState({ title, description, action }: Omit<StateViewProps, "icon">) {
  return <StateView title={title} description={description} action={action} icon={<Inbox size={22} />} />;
}

export function NoResultsState({ title, description, action }: Omit<StateViewProps, "icon">) {
  return <StateView title={title} description={description} action={action} icon={<SearchX size={22} />} />;
}

export function ErrorState({ title, description, action }: Omit<StateViewProps, "icon">) {
  return (
    <StateView
      title={title}
      description={description}
      action={action}
      icon={<AlertTriangle size={22} className="text-[var(--color-danger)]" />}
    />
  );
}
