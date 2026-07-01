"use client";

import { ChangeEvent, useRef, useState } from "react";
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
  const toast = useToast();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);

    try {
      const url = await uploadAdminImage(token, file);
      onChange(url);
      toast.success("Image uploaded successfully.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-field admin-image-field">
      <span className="admin-label">{label}</span>
      {hint && <p className="admin-field-hint">{hint}</p>}

      <div className="admin-image-row">
        {value ? (
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

        <div className="admin-image-actions">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="admin-image-input"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <button
            type="button"
            className="btn-secondary admin-btn admin-image-btn"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading…" : "Upload image"}
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
