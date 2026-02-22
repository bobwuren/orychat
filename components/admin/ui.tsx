/**
 * components/admin/ui.tsx
 *
 * Primitives UI partagées entre toutes les pages admin.
 * Cohérentes avec le design system Orientys (charbon + or).
 */

import { ReactNode } from "react";

// ---------------------------------------------------------------------------
// Page shell
// ---------------------------------------------------------------------------

/** Conteneur de page avec en-tête titre + actions */
export function AdminPage({ children }: { children: ReactNode }) {
  return <div className="space-y-6">{children}</div>;
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
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-white">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-[#555] mt-1">{subtitle}</p>}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
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

  const variants: Record<BtnVariant, string> = {
    primary:
      "text-[#0e0e0e] bg-gradient-to-r from-[#c9a84c] to-[#e8c97a] hover:brightness-110",
    secondary:
      "text-[#888] bg-[#141414] border border-[#222] hover:text-white hover:border-[#333]",
    ghost: "text-[#555] hover:text-white hover:bg-[#141414]",
    danger:
      "text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20",
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
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
// Table
// ---------------------------------------------------------------------------

export function AdminTable({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-[#1a1a1a] overflow-hidden">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function THead({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-[#0a0a0a] border-b border-[#1a1a1a]">
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
      className={`px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#444] ${right ? "text-right" : "text-left"}`}
    >
      {children}
    </th>
  );
}

export function TBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-[#111]">{children}</tbody>;
}

export function Tr({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      className={`bg-[#0e0e0e] transition-colors duration-150 ${onClick ? "cursor-pointer hover:bg-[#141414]" : "hover:bg-[#111]"}`}
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
        muted ? "text-[#555]" : "text-[#aaa]",
      ].join(" ")}
    >
      {children}
    </td>
  );
}

/** Ligne de tableau vide (état zéro) */
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
        <p className="text-sm text-[#444] mb-3">{label}</p>
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
        <tr key={i} className="bg-[#0e0e0e]">
          {Array.from({ length: cols }).map((__, j) => (
            <td key={j} className="px-4 py-3.5">
              <div
                className="h-4 rounded bg-[#1a1a1a] animate-pulse"
                style={{
                  animationDelay: `${(i * cols + j) * 40}ms`,
                  width: `${60 + Math.random() * 30}%`,
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
// Card conteneur
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
    <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl overflow-hidden">
      {(title || toolbar) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-6 py-5 border-b border-[#1a1a1a]">
          <div>
            {title && (
              <h2 className="text-sm font-semibold text-white">{title}</h2>
            )}
            {description && (
              <p className="text-xs text-[#444] mt-0.5">{description}</p>
            )}
          </div>
          {toolbar && (
            <div className="flex items-center gap-2 shrink-0">{toolbar}</div>
          )}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Searchbar
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
          className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#444]"
          viewBox="0 0 16 16"
          fill="none"
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
          className="pl-9 pr-8 py-2 w-56 bg-[#141414] border border-[#222] rounded-lg text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]/20 transition-all"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#444] hover:text-[#888]"
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
// Pagination
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

  // Génère les pages à afficher (max 5, avec ellipsis)
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

  return (
    <div className="flex items-center justify-between pt-5 border-t border-[#111]">
      <span className="text-xs text-[#444]">
        {from}–{to} sur {totalItems}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#555] hover:text-white hover:bg-[#141414] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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
              key={`ellipsis-${i}`}
              className="w-8 h-8 flex items-center justify-center text-xs text-[#444]"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={[
                "w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-all",
                currentPage === p
                  ? "bg-[#c9a84c]/15 text-[#c9a84c] border border-[#c9a84c]/30"
                  : "text-[#555] hover:text-white hover:bg-[#141414]",
              ].join(" ")}
            >
              {p}
            </button>
          ),
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#555] hover:text-white hover:bg-[#141414] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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
// Dialog / Modal
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

  const widths = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={`relative w-full ${widths[size]} bg-[#0e0e0e] border border-[#1e1e1e] rounded-2xl shadow-2xl overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-[#141414]">
          <div>
            <h2 className="font-display text-lg font-bold text-white">
              {title}
            </h2>
            {description && (
              <p className="text-sm text-[#555] mt-1">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#444] hover:text-white hover:bg-[#141414] transition-all shrink-0 ml-4"
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
        {/* Body */}
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

/** Footer de dialog avec actions */
export function DialogActions({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-end gap-3 pt-5 mt-5 border-t border-[#141414]">
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
      <label className="text-xs font-semibold uppercase tracking-[0.1em] text-[#666]">
        {label}
        {required && <span className="text-[#c9a84c] ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-[#444]">{hint}</p>}
    </div>
  );
}

export function AdminInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-3.5 py-2.5 bg-[#141414] border border-[#222] rounded-lg text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]/20 transition-all disabled:opacity-50 ${props.className ?? ""}`}
    />
  );
}

export function AdminTextarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className={`w-full px-3.5 py-2.5 bg-[#141414] border border-[#222] rounded-lg text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]/20 transition-all resize-none disabled:opacity-50 ${props.className ?? ""}`}
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
      className={`w-full px-3.5 py-2.5 bg-[#141414] border border-[#222] rounded-lg text-sm text-white focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]/20 transition-all disabled:opacity-50 ${props.className ?? ""}`}
    >
      {placeholder && (
        <option value="" className="text-[#444]">
          {placeholder}
        </option>
      )}
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-[#141414]">
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

export function AdminBadge({
  children,
  color = "gray",
}: {
  children: ReactNode;
  color?: BadgeColor;
}) {
  const colors: Record<BadgeColor, string> = {
    gold: "bg-[#c9a84c]/10 border-[#c9a84c]/30 text-[#c9a84c]",
    green: "bg-green-500/10 border-green-500/20 text-green-400",
    red: "bg-red-500/10 border-red-500/20 text-red-400",
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    gray: "bg-[#141414] border-[#222] text-[#666]",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium border rounded ${colors[color]}`}
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
    <div className="flex items-center gap-2 px-3.5 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg">
      <svg
        className="w-3.5 h-3.5 text-red-400 shrink-0"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M8 5v3M8 11h.01M14.5 8a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-xs text-red-400">{message}</span>
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
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-5">
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
        <svg
          className="w-6 h-6 text-red-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="text-center">
        <p className="font-display text-lg font-bold text-white mb-1">
          Erreur de chargement
        </p>
        <p className="text-sm text-[#555]">{message}</p>
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
        className={[
          "relative w-9 h-5 rounded-full border transition-all duration-300 shrink-0",
          checked
            ? "bg-[#c9a84c]/20 border-[#c9a84c]/50"
            : "bg-[#141414] border-[#222]",
          disabled ? "opacity-50 cursor-not-allowed" : "",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300",
            checked
              ? "translate-x-4 bg-[#c9a84c]"
              : "translate-x-0.5 bg-[#444]",
          ].join(" ")}
        />
      </button>
      {label && <span className="text-sm text-[#888]">{label}</span>}
    </label>
  );
}
