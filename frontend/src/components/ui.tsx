import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-dark disabled:opacity-50',
  secondary: 'bg-primary-soft text-primary-dark hover:bg-primary-soft/70 disabled:opacity-50',
  outline: 'border border-border text-text hover:bg-black/5 disabled:opacity-50',
  danger: 'bg-danger text-white hover:opacity-90 disabled:opacity-50',
  ghost: 'text-text hover:bg-black/5 disabled:opacity-50',
};

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed ${buttonVariants[variant]} ${className}`}
      {...props}
    />
  );
}

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-xl border border-gray-200 bg-surface px-3.5 py-2.5 text-sm text-text placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${className}`}
      {...props}
    />
  );
}

export function Textarea({ className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full rounded-xl border border-gray-200 bg-surface px-3.5 py-2.5 text-sm text-text placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${className}`}
      {...props}
    />
  );
}

export function Select({ className = '', children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`w-full rounded-xl border border-gray-200 bg-surface px-3.5 py-2.5 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-text">
      {children}
    </label>
  );
}

export function Card({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`rounded-2xl border border-gray-100 bg-surface shadow-sm ${className}`}>{children}</div>
  );
}

export function Badge({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
}

export function Spinner({ className = '' }: { className?: string }) {
  return (
    <div
      className={`h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
      role="status"
      aria-label="Chargement"
    />
  );
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-16 px-6 text-center">
      <p className="text-base font-semibold text-text">{title}</p>
      {description && <p className="mt-1.5 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger" role="alert">
      {message}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-primary">
      <Spinner className="h-8 w-8" />
    </div>
  );
}
