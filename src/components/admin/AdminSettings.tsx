"use client";

import { FormEvent, useState } from "react";
import { changeAdminPassword } from "@/lib/api";
import { useToast } from "@/context/ToastProvider";

interface AdminSettingsProps {
  token: string;
  username: string;
}

export default function AdminSettings({ token, username }: AdminSettingsProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      await changeAdminPassword(token, {
        username,
        currentPassword,
        newPassword,
      });
      toast.success("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to change password."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-section">
      <h3>Change password</h3>
      <form className="admin-settings-form" onSubmit={handleSubmit}>
        <label className="admin-field">
          <span className="admin-label">Current password</span>
          <input
            className="admin-input"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>
        <label className="admin-field">
          <span className="admin-label">New password</span>
          <input
            className="admin-input"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
        </label>
        <label className="admin-field">
          <span className="admin-label">Confirm new password</span>
          <input
            className="admin-input"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
        </label>
        <button
          type="submit"
          className="btn-primary admin-btn"
          disabled={saving}
        >
          {saving ? "Updating…" : "Update password"}
        </button>
      </form>
    </div>
  );
}
