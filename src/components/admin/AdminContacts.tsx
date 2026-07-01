"use client";

import { useEffect, useState } from "react";
import {
  deleteContact,
  fetchAdminContacts,
  markContactRead,
} from "@/lib/api";
import { ContactSubmission } from "@/types/portfolio";
import { useToast } from "@/context/ToastProvider";

interface AdminContactsProps {
  token: string;
}

export default function AdminContacts({ token }: AdminContactsProps) {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const toast = useToast();

  useEffect(() => {
    let cancelled = false;

    fetchAdminContacts(token)
      .then((result) => {
        if (!cancelled) {
          setContacts(result);
          setError("");
        }
      })
      .catch(() => {
        if (!cancelled) {
          const message = "Failed to load messages.";
          setError(message);
          toast.error(message);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token, toast]);

  const handleMarkRead = async (id: string) => {
    try {
      await markContactRead(token, id);
      setContacts((prev) =>
        prev.map((c) => (c._id === id ? { ...c, read: true } : c))
      );
      toast.success("Message marked as read.");
    } catch {
      toast.error("Failed to mark message as read.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteContact(token, id);
      setContacts((prev) => prev.filter((c) => c._id !== id));
      toast.success("Message deleted.");
    } catch {
      toast.error("Failed to delete message.");
    }
  };

  if (loading) return <p className="admin-loading">Loading messages…</p>;
  if (error) return <p className="admin-error">{error}</p>;

  if (contacts.length === 0) {
    return <p className="admin-empty">No contact submissions yet.</p>;
  }

  return (
    <div className="admin-section">
      <ul className="admin-contact-list">
        {contacts.map((contact) => (
          <li
            className={`admin-contact-item${contact.read ? " read" : " unread"}`}
            key={contact._id}
          >
            <div className="admin-contact-head">
              <strong>{contact.fullname}</strong>
              <span>{new Date(contact.createdAt).toLocaleString()}</span>
            </div>
            <p className="admin-contact-email">
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </p>
            {(contact.projectType || contact.budget || contact.timeline) && (
              <dl className="admin-contact-meta">
                {contact.projectType && (
                  <>
                    <dt>Project</dt>
                    <dd>{contact.projectType}</dd>
                  </>
                )}
                {contact.budget && (
                  <>
                    <dt>Budget</dt>
                    <dd>{contact.budget}</dd>
                  </>
                )}
                {contact.timeline && (
                  <>
                    <dt>Timeline</dt>
                    <dd>{contact.timeline}</dd>
                  </>
                )}
              </dl>
            )}
            <p className="admin-contact-message">{contact.message}</p>
            <div className="admin-contact-actions">
              {!contact.read && (
                <button
                  type="button"
                  className="btn-secondary admin-btn"
                  onClick={() => handleMarkRead(contact._id)}
                >
                  Mark read
                </button>
              )}
              <button
                type="button"
                className="admin-remove-btn"
                onClick={() => handleDelete(contact._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
