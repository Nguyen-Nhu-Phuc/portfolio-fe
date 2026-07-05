"use client";

import { useEffect, useState } from "react";
import {
  deleteContact,
  fetchAdminContacts,
  markContactRead,
} from "@/lib/api";
import { ContactSubmission } from "@/types/portfolio";
import { useToast } from "@/context/ToastProvider";
import AdminListTable from "./AdminListTable";
import AdminDetailDrawer from "./AdminDetailDrawer";
import { truncate } from "./AdminFields";

interface AdminContactsProps {
  token: string;
}

export default function AdminContacts({ token }: AdminContactsProps) {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
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

  const selectedContact = contacts.find((c) => c._id === selectedId) ?? null;

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
      setSelectedId(null);
      toast.success("Message deleted.");
    } catch {
      toast.error("Failed to delete message.");
    }
  };

  if (loading) return <p className="admin-loading">Loading messages…</p>;
  if (error) return <p className="admin-error">{error}</p>;

  return (
    <div className="admin-section">
      <AdminListTable
        items={contacts}
        onRowClick={(index) => setSelectedId(contacts[index]._id)}
        emptyMessage="No contact submissions yet."
        getRowClassName={(contact) =>
          contact.read ? undefined : "admin-table-row-unread"
        }
        columns={[
          {
            key: "status",
            header: "",
            className: "admin-table-col-narrow",
            render: (c) =>
              c.read ? (
                <span className="admin-table-status">Read</span>
              ) : (
                <span className="admin-table-status admin-table-status--new">
                  New
                </span>
              ),
          },
          {
            key: "name",
            header: "Name",
            render: (c) => c.fullname,
          },
          {
            key: "email",
            header: "Email",
            render: (c) => c.email,
          },
          {
            key: "date",
            header: "Date",
            className: "admin-table-col-narrow",
            render: (c) =>
              new Date(c.createdAt).toLocaleDateString(undefined, {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
          },
          {
            key: "preview",
            header: "Message",
            render: (c) => truncate(c.message, 50),
          },
        ]}
      />

      <AdminDetailDrawer
        open={selectedContact !== null}
        title={selectedContact?.fullname ?? "Message"}
        onClose={() => setSelectedId(null)}
        onDelete={
          selectedContact
            ? () => handleDelete(selectedContact._id)
            : undefined
        }
        deleteLabel="Delete message"
      >
        {selectedContact && (
          <>
            <div className="admin-contact-detail-meta">
              <p>
                <strong>Email:</strong>{" "}
                <a href={`mailto:${selectedContact.email}`}>
                  {selectedContact.email}
                </a>
              </p>
              <p>
                <strong>Received:</strong>{" "}
                {new Date(selectedContact.createdAt).toLocaleString()}
              </p>
            </div>
            {(selectedContact.projectType ||
              selectedContact.budget ||
              selectedContact.timeline) && (
              <dl className="admin-contact-meta">
                {selectedContact.projectType && (
                  <>
                    <dt>Project</dt>
                    <dd>{selectedContact.projectType}</dd>
                  </>
                )}
                {selectedContact.budget && (
                  <>
                    <dt>Budget</dt>
                    <dd>{selectedContact.budget}</dd>
                  </>
                )}
                {selectedContact.timeline && (
                  <>
                    <dt>Timeline</dt>
                    <dd>{selectedContact.timeline}</dd>
                  </>
                )}
              </dl>
            )}
            <div className="admin-field">
              <span className="admin-label">Message</span>
              <p className="admin-contact-message">
                {selectedContact.message}
              </p>
            </div>
            {!selectedContact.read && (
              <div className="admin-contact-actions">
                <button
                  type="button"
                  className="btn-secondary admin-btn"
                  onClick={() => handleMarkRead(selectedContact._id)}
                >
                  Mark as read
                </button>
              </div>
            )}
          </>
        )}
      </AdminDetailDrawer>
    </div>
  );
}
