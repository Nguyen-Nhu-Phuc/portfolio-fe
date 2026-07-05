"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import PortfolioImage from "@/components/PortfolioImage";
import { uploadAdminImage } from "@/lib/api";
import { useToast } from "@/context/ToastProvider";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  token: string;
  hint?: string;
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  token,
  hint,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    return () => {
      if (localPreview) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

  const clearLocalPreview = () => {
    setLocalPreview((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }
      return null;
    });
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    clearLocalPreview();
    const preview = URL.createObjectURL(file);
    setLocalPreview(preview);
    setUploading(true);

    try {
      const url = await uploadAdminImage(token, file);
      onChange(url);
      toast.success("Image uploaded successfully.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      URL.revokeObjectURL(preview);
      setLocalPreview(null);
      setUploading(false);
    }
  };

  return (
    <div
      className={`admin-field admin-image-field${uploading ? " admin-image-field--uploading" : ""}`}
      aria-busy={uploading}
    >
      <span className="admin-label">{label}</span>
      {hint && <p className="admin-field-hint">{hint}</p>}

      <div className="admin-image-row">
        <div
          className={`admin-image-preview-wrap${uploading ? " admin-image-preview-wrap--uploading" : ""}`}
        >
          {uploading && localPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={localPreview}
              alt=""
              className="admin-image-preview"
            />
          ) : value ? (
            <PortfolioImage
              src={value}
              alt=""
              className="admin-image-preview"
              width={72}
              height={72}
              unoptimized
            />
          ) : (
            <div className="admin-image-placeholder" aria-hidden="true">
              No image
            </div>
          )}

          {uploading && (
            <div
              className="admin-image-upload-overlay"
              role="status"
              aria-live="polite"
            >
              <span className="admin-image-upload-spinner" aria-hidden="true" />
              <span className="admin-image-upload-label">Uploading…</span>
              <span className="admin-image-upload-progress" aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="admin-image-actions">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,.svg"
            className="admin-image-input"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <button
            type="button"
            className={`btn-secondary admin-btn admin-image-btn${uploading ? " admin-image-btn--uploading" : ""}`}
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <span className="admin-image-btn-spinner" aria-hidden="true" />
                Uploading…
              </>
            ) : (
              "Upload image"
            )}
          </button>
          {value && (
            <button
              type="button"
              className="admin-remove-btn admin-image-clear"
              onClick={() => onChange("")}
              disabled={uploading}
            >
              Remove
            </button>
          )}
        </div>
      </div>

      <input
        className="admin-input"
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste image URL"
        disabled={uploading}
      />
    </div>
  );
}
