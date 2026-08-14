"use client";

import { useState } from "react";

type Props = {
  id: string;
  name: string;
  label: string;
  minLength?: number;
  autoComplete?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
};

export function PasswordField({
  id,
  name,
  label,
  minLength = 6,
  autoComplete,
  required = true,
  value,
  onChange,
}: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label className="mb-1 block text-sm" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          required={required}
          minLength={required ? minLength : undefined}
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          className="field pr-20"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--muted)]"
          aria-label={visible ? "Esconder senha" : "Mostrar senha"}
        >
          {visible ? "Esconder" : "Mostrar"}
        </button>
      </div>
    </div>
  );
}
