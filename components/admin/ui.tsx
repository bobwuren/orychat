/**
 * components/admin/ui.tsx
 *
 * Primitives UI partagées entre toutes les pages admin.
 * Couleurs via variables CSS du design system - aucune valeur hardcodée.
 * Tables responsives : scroll horizontal sur mobile.
 */

import { ReactNode } from "react";

// ---------------------------------------------------------------------------
// Page shell
// ---------------------------------------------------------------------------

export function AdminPage({ children }: { children: ReactNode }) {
  return <div className="space-y-5 lg:space-y-6">{children}</div>;
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <h1
          className="font-display text-2xl lg:text-3xl font-bold truncate"
          style={{ color: "var(--color-text-primary)" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="text-sm mt-0.5"
            style={{ color: "var(--color-text-muted)" }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Boutons
// ---------------------------------------------------------------------------

type BtnVariant = "primary" | "secondary" | "ghost" | "danger";

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  size?: "sm" | "md";
  loading?: boolean;
  icon?: ReactNode;
}

export function Btn({
  variant = "secondary",
  size = "md",
  loading,
  icon,
  children,
  className = "",
  disabled,
  ...props
}: BtnProps) {
  const base =
    "relative inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden";

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
  };

  const variants: Record<BtnVariant, React.CSSProperties> = {
    primary: {
      background: "var(--gradient-brand)",
      color: "var(--color-bg-base)",
    },
    secondary: {
      backgroundColor: "var(--color-bg-surface)",
      color: "var(--color-text-secondary)",
      border: "1px solid var(--color-border-default)",
    },
    ghost: {
      backgroundColor: "transparent",
      color: "var(--color-text-muted)",
    },
    danger: {
      backgroundColor: "var(--color-state-error-bg)",
      color: "var(--color-state-error)",
      border: "1px solid var(--color-state-error-border)",
    },
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${className}`}
      style={variants[variant]}
      {...props}
    >
      {loading ? (
        <svg
          className="w-3.5 h-3.5 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Table - responsive (scroll horizontal sur mobile)
// ---------------------------------------------------------------------------

export function AdminTable({ children }: { children: ReactNode }) {
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: "var(--color-border-default)" }}
    >
      {/* Wrapper scroll horizontal pour mobile */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">{children}</table>
      </div>
    </div>
  );
}

export function THead({ children }: { children: ReactNode }) {
  return (
    <thead
      className="border-b"
      style={{
        backgroundColor: "var(--color-bg-page)",
        borderColor: "var(--color-border-default)",
      }}
    >
      <tr>{children}</tr>
    </thead>
  );
}

export function Th({
  children,
  right,
}: {
  children?: ReactNode;
  right?: boolean;
}) {
  return (
    <th
      className={`px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] whitespace-nowrap ${right ? "text-right" : "text-left"}`}
      style={{ color: "var(--color-text-disabled)" }}
    >
      {children}
    </th>
  );
}

export function TBody({ children }: { children: ReactNode }) {
  return (
    <tbody
      className="divide-y"
      style={{ borderColor: "var(--color-border-subtle)" }}
    >
      {children}
    </tbody>
  );
}

export function Tr({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <tr
      onClick={onClick}
      className={[
        "transition-colors duration-150",
        onClick ? "cursor-pointer" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ backgroundColor: "var(--color-bg-base)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--color-bg-surface)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "var(--color-bg-base)";
      }}
    >
      {children}
    </tr>
  );
}

export function Td({
  children,
  right,
  mono,
  muted,
}: {
  children?: ReactNode;
  right?: boolean;
  mono?: boolean;
  muted?: boolean;
}) {
  return (
    <td
      className={[
        "px-4 py-3.5",
        right ? "text-right" : "",
        mono ? "font-mono text-xs" : "",
      ].join(" ")}
      style={{
        color: muted
          ? "var(--color-text-muted)"
          : "var(--color-text-secondary)",
      }}
    >
      {children}
    </td>
  );
}

/** Ligne vide (état zéro) */
export function EmptyRow({
  colSpan,
  label,
  action,
}: {
  colSpan: number;
  label: string;
  action?: ReactNode;
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-16 text-center">
        <p
          className="text-sm mb-3"
          style={{ color: "var(--color-text-disabled)" }}
        >
          {label}
        </p>
        {action}
      </td>
    </tr>
  );
}

/** Lignes skeleton pendant le chargement */
export function SkeletonRows({
  cols,
  rows = 4,
}: {
  cols: number;
  rows?: number;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} style={{ backgroundColor: "var(--color-bg-base)" }}>
          {Array.from({ length: cols }).map((__, j) => (
            <td key={j} className="px-4 py-3.5">
              <div
                className="h-4 rounded animate-pulse"
                style={{
                  backgroundColor: "var(--color-bg-elevated)",
                  animationDelay: `${(i * cols + j) * 40}ms`,
                  width: `${60 + Math.floor(Math.random() * 30)}%`,
                }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// AdminCard
// ---------------------------------------------------------------------------

export function AdminCard({
  children,
  title,
  description,
  toolbar,
}: {
  children: ReactNode;
  title?: string;
  description?: string;
  toolbar?: ReactNode;
}) {
  return (
    <div
      className="border rounded-2xl overflow-hidden"
      style={{
        backgroundColor: "var(--color-bg-base)",
        borderColor: "var(--color-border-default)",
      }}
    >
      {(title || toolbar) && (
        <div
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-4 sm:py-5 border-b"
          style={{ borderColor: "var(--color-border-default)" }}
        >
          <div>
            {title && (
              <h2
                className="text-sm font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {title}
              </h2>
            )}
            {description && (
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--color-text-disabled)" }}
              >
                {description}
              </p>
            )}
          </div>
          {toolbar && (
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              {toolbar}
            </div>
          )}
        </div>
      )}
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SearchBar
// ---------------------------------------------------------------------------

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Rechercher…",
}: SearchBarProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex items-center gap-2"
    >
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
          viewBox="0 0 16 16"
          fill="none"
          style={{ color: "var(--color-text-disabled)" }}
        >
          <path
            d="M6.5 12a5.5 5.5 0 100-11 5.5 5.5 0 000 11zM14 14l-3-3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-9 pr-8 py-2 w-40 sm:w-56 rounded-lg text-sm focus:outline-none transition-all"
          style={{
            backgroundColor: "var(--color-input-bg)",
            border: `1px solid var(--color-input-border)`,
            color: "var(--color-text-primary)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor =
              "var(--color-input-border-focus)";
            e.currentTarget.style.boxShadow =
              "0 0 0 3px var(--color-input-ring)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--color-input-border)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: "var(--color-text-disabled)" }}
          >
            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 2l8 8M10 2l-8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>
      <Btn type="submit" variant="ghost" size="sm">
        <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
          <path
            d="M6.5 12a5.5 5.5 0 100-11 5.5 5.5 0 000 11zM14 14l-3-3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </Btn>
    </form>
  );
}

// ---------------------------------------------------------------------------
// PaginationBar
// ---------------------------------------------------------------------------

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function PaginationBar({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationBarProps) {
  if (totalItems <= itemsPerPage) return null;

  const from = (currentPage - 1) * itemsPerPage + 1;
  const to = Math.min(currentPage * itemsPerPage, totalItems);

  const pages: (number | "…")[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("…");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

  const btnBase =
    "w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed";

  return (
    <div
      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-5 border-t"
      style={{ borderColor: "var(--color-border-subtle)" }}
    >
      <span className="text-xs" style={{ color: "var(--color-text-disabled)" }}>
        {from}–{to} sur {totalItems}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={btnBase}
          style={{ color: "var(--color-text-muted)" }}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 4l-4 4 4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={`e-${i}`}
              className="w-8 h-8 flex items-center justify-center text-xs"
              style={{ color: "var(--color-text-disabled)" }}
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={btnBase}
              style={
                currentPage === p
                  ? {
                      backgroundColor: "var(--color-accent-bg)",
                      color: "var(--color-brand-accent)",
                      border: "1px solid var(--color-accent-border-md)",
                    }
                  : { color: "var(--color-text-muted)" }
              }
            >
              {p}
            </button>
          ),
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={btnBase}
          style={{ color: "var(--color-text-muted)" }}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dialog / Modal - responsive (plein écran sur mobile)
// ---------------------------------------------------------------------------

interface AdminDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

export function AdminDialog({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
}: AdminDialogProps) {
  if (!open) return null;

  const widths = { sm: "sm:max-w-sm", md: "sm:max-w-lg", lg: "sm:max-w-2xl" };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel - plein écran sur mobile, centré sur desktop */}
      <div
        className={[
          "relative w-full rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden",
          "max-h-[92vh] sm:max-h-[85vh]",
          widths[size],
        ].join(" ")}
        style={{
          backgroundColor: "var(--color-bg-base)",
          border: `1px solid var(--color-border-default)`,
        }}
      >
        {/* Handle mobile (barre de drag visuelle) */}
        <div
          className="w-10 h-1 rounded-full mx-auto mt-3 sm:hidden"
          style={{ backgroundColor: "var(--color-border-strong)" }}
        />

        {/* Header */}
        <div
          className="flex items-start justify-between px-5 sm:px-6 pt-4 pb-4 border-b"
          style={{ borderColor: "var(--color-border-subtle)" }}
        >
          <div>
            <h2
              className="font-display text-base sm:text-lg font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {title}
            </h2>
            {description && (
              <p
                className="text-sm mt-1"
                style={{ color: "var(--color-text-muted)" }}
              >
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-all shrink-0 ml-4"
            style={{ color: "var(--color-text-disabled)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--color-text-primary)";
              e.currentTarget.style.backgroundColor = "var(--color-bg-surface)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--color-text-disabled)";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 3l10 10M13 3L3 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Body - scrollable */}
        <div className="px-5 sm:px-6 py-5 overflow-y-auto max-h-[60vh] sm:max-h-[65vh]">
          {children}
        </div>
      </div>
    </div>
  );
}

/** Footer de dialog avec actions */
export function DialogActions({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex items-center justify-end gap-3 pt-5 mt-5 border-t flex-wrap"
      style={{ borderColor: "var(--color-border-subtle)" }}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Formulaire
// ---------------------------------------------------------------------------

export function FormField({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-xs font-semibold uppercase tracking-[0.1em]"
        style={{ color: "var(--color-text-muted)" }}
      >
        {label}
        {required && (
          <span className="ml-1" style={{ color: "var(--color-brand-accent)" }}>
            *
          </span>
        )}
      </label>
      {children}
      {hint && (
        <p
          className="text-[11px]"
          style={{ color: "var(--color-text-disabled)" }}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "w-full px-3.5 py-2.5 rounded-lg text-sm focus:outline-none transition-all disabled:opacity-50";

const inputStyle: React.CSSProperties = {
  backgroundColor: "var(--color-input-bg)",
  border: `1px solid var(--color-input-border)`,
  color: "var(--color-text-primary)",
};

const onInputFocus = (
  e: React.FocusEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >,
) => {
  e.currentTarget.style.borderColor = "var(--color-input-border-focus)";
  e.currentTarget.style.boxShadow = "0 0 0 3px var(--color-input-ring)";
};

const onInputBlur = (
  e: React.FocusEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >,
) => {
  e.currentTarget.style.borderColor = "var(--color-input-border)";
  e.currentTarget.style.boxShadow = "none";
};

export function AdminInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`${inputClass} ${props.className ?? ""}`}
      style={{ ...inputStyle, ...props.style }}
      onFocus={(e) => {
        onInputFocus(e);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        onInputBlur(e);
        props.onBlur?.(e);
      }}
    />
  );
}

export function AdminTextarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className={`${inputClass} resize-none ${props.className ?? ""}`}
      style={{ ...inputStyle, ...props.style }}
      onFocus={(e) => {
        onInputFocus(e);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        onInputBlur(e);
        props.onBlur?.(e);
      }}
    />
  );
}

interface AdminSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function AdminSelect({
  options,
  placeholder,
  ...props
}: AdminSelectProps) {
  return (
    <select
      {...props}
      className={`${inputClass} ${props.className ?? ""}`}
      style={{ ...inputStyle, ...props.style }}
      onFocus={(e) => {
        onInputFocus(e);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        onInputBlur(e);
        props.onBlur?.(e);
      }}
    >
      {placeholder && (
        <option value="" style={{ color: "var(--color-text-disabled)" }}>
          {placeholder}
        </option>
      )}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------

type BadgeColor = "gold" | "green" | "red" | "blue" | "gray";

const BADGE_STYLES: Record<BadgeColor, React.CSSProperties> = {
  gold: {
    backgroundColor: "var(--color-accent-bg)",
    borderColor: "var(--color-accent-border-md)",
    color: "var(--color-brand-accent)",
  },
  green: {
    backgroundColor: "var(--color-state-success-bg)",
    borderColor: "var(--color-state-success-border)",
    color: "var(--color-state-success)",
  },
  red: {
    backgroundColor: "var(--color-state-error-bg)",
    borderColor: "var(--color-state-error-border)",
    color: "var(--color-state-error)",
  },
  blue: {
    backgroundColor: "rgba(96,165,250,0.08)",
    borderColor: "rgba(96,165,250,0.25)",
    color: "#60a5fa",
  },
  gray: {
    backgroundColor: "var(--color-bg-surface)",
    borderColor: "var(--color-border-default)",
    color: "var(--color-text-muted)",
  },
};

export function AdminBadge({
  children,
  color = "gray",
}: {
  children: ReactNode;
  color?: BadgeColor;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium border rounded"
      style={BADGE_STYLES[color]}
    >
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Erreur inline
// ---------------------------------------------------------------------------

export function InlineError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      className="flex items-center gap-2 px-3.5 py-2.5 border rounded-lg mt-3"
      style={{
        backgroundColor: "var(--color-state-error-bg)",
        borderColor: "var(--color-state-error-border)",
      }}
    >
      <svg
        className="w-3.5 h-3.5 shrink-0"
        viewBox="0 0 16 16"
        fill="none"
        style={{ color: "var(--color-state-error)" }}
      >
        <path
          d="M8 5v3M8 11h.01M14.5 8a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-xs" style={{ color: "var(--color-state-error)" }}>
        {message}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// État d'erreur de page
// ---------------------------------------------------------------------------

export function PageError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-5 px-4 text-center">
      <div
        className="w-14 h-14 rounded-2xl border flex items-center justify-center"
        style={{
          backgroundColor: "var(--color-state-error-bg)",
          borderColor: "var(--color-state-error-border)",
        }}
      >
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          style={{ color: "var(--color-state-error)" }}
        >
          <path
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <p
          className="font-display text-lg font-bold mb-1"
          style={{ color: "var(--color-text-primary)" }}
        >
          Erreur de chargement
        </p>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          {message}
        </p>
      </div>
      <Btn
        variant="secondary"
        onClick={onRetry}
        icon={
          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 8a6 6 0 0110.472-4M14 8a6 6 0 01-10.472 4M2 8h2m10 0h-2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        }
      >
        Réessayer
      </Btn>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Toggle switch
// ---------------------------------------------------------------------------

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, disabled }: ToggleProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className="relative w-9 h-5 rounded-full border transition-all duration-300 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        style={
          checked
            ? {
                backgroundColor: "var(--color-accent-bg-active)",
                borderColor: "var(--color-accent-border-lg)",
              }
            : {
                backgroundColor: "var(--color-bg-surface)",
                borderColor: "var(--color-border-strong)",
              }
        }
      >
        <span
          className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300"
          style={
            checked
              ? {
                  transform: "translateX(16px)",
                  backgroundColor: "var(--color-brand-accent)",
                }
              : {
                  transform: "translateX(2px)",
                  backgroundColor: "var(--color-text-disabled)",
                }
          }
        />
      </button>
      {label && (
        <span
          className="text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {label}
        </span>
      )}
    </label>
  );
}
