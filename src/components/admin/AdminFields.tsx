"use client";

import { LocalizedString } from "@/types/localized";

export function LocalizedField({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: LocalizedString;
  onChange: (v: LocalizedString) => void;
  multiline?: boolean;
}) {
  const Input = multiline ? "textarea" : "input";
  return (
    <div className="admin-field admin-loc-field">
      <span className="admin-label">{label}</span>
      <div className="admin-loc-row">
        <label className="admin-loc-col">
          <span className="admin-loc-tag">EN</span>
          <Input
            className="admin-input"
            value={value.en}
            onChange={(e) => onChange({ ...value, en: e.target.value })}
          />
        </label>
        <label className="admin-loc-col">
          <span className="admin-loc-tag">VI</span>
          <Input
            className="admin-input"
            value={value.vi}
            onChange={(e) => onChange({ ...value, vi: e.target.value })}
          />
        </label>
      </div>
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="admin-field">
      <span className="admin-label">{label}</span>
      <input
        className="admin-input"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = "Select…",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <label className="admin-field">
      <span className="admin-label">{label}</span>
      <select
        className="admin-input admin-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function truncate(text: string, max = 60): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed || "—";
  return `${trimmed.slice(0, max)}…`;
}
