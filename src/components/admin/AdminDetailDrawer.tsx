"use client";

import { ReactNode, useEffect } from "react";

interface AdminDetailDrawerProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onDelete?: () => void;
  deleteLabel?: string;
  children: ReactNode;
}

export default function AdminDetailDrawer({
  open,
  title,
  onClose,
  onDelete,
  deleteLabel = "Remove",
  children,
}: AdminDetailDrawerProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="admin-detail-root" role="presentation">
      <button
        type="button"
        className="admin-detail-backdrop"
        aria-label="Close detail panel"
        onClick={onClose}
      />
      <aside
        className="admin-detail-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-detail-title"
      >
        <header className="admin-detail-header">
          <button
            type="button"
            className="admin-detail-back"
            onClick={onClose}
          >
            ← Back
          </button>
          <h2 id="admin-detail-title" className="admin-detail-title">
            {title}
          </h2>
          {onDelete && (
            <button
              type="button"
              className="admin-remove-btn admin-detail-delete"
              onClick={onDelete}
            >
              {deleteLabel}
            </button>
          )}
        </header>
        <div className="admin-detail-body">{children}</div>
      </aside>
    </div>
  );
}
