"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import IonIcon from "../IonIcon";

interface AdminLoginProps {
  username: string;
  password: string;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  loginError: string;
  loadError: string;
  loginLoading: boolean;
}

export default function AdminLogin({
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  loginError,
  loadError,
  loginLoading,
}: AdminLoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const errorMessage = loginError || loadError;

  return (
    <div className="admin-login-page">
      <header className="admin-login-nav">
        <Link href="/" className="admin-login-nav-brand">
          Portfolio
        </Link>
        <span className="admin-login-nav-badge">Admin</span>
      </header>

      <main className="admin-login-main">
        <div className="admin-login-card">
          <div className="admin-login-card-inner">
            <div className="admin-login-mark" aria-hidden="true">
              <IonIcon name="shield-checkmark-outline" />
            </div>

            <p className="admin-login-eyebrow">Secure access</p>
            <h1 className="admin-login-title">Sign in to Admin</h1>
            <p className="admin-login-lead">
              Manage bilingual portfolio content — profile, projects, blog, and more.
            </p>

            <form onSubmit={onSubmit} className="admin-login-form">
              <label className="admin-login-field">
                <span className="admin-login-label">Username</span>
                <input
                  className="admin-login-input admin-login-input--plain"
                  type="text"
                  value={username}
                  onChange={(e) => onUsernameChange(e.target.value)}
                  placeholder="admin"
                  autoComplete="username"
                  required
                  autoFocus
                />
              </label>

              <label className="admin-login-field">
                <span className="admin-login-label">Password</span>
                <div className="admin-login-input-wrap">
                  <input
                    className="admin-login-input"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    placeholder="Enter admin password"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="admin-login-input-toggle"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <IonIcon
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                    />
                  </button>
                </div>
              </label>

              {errorMessage && (
                <p className="admin-login-error" role="alert">
                  <IonIcon name="alert-circle-outline" />
                  <span>{errorMessage}</span>
                </p>
              )}

              <button
                type="submit"
                className="btn-primary admin-login-submit"
                disabled={
                  loginLoading || !(username ?? "").trim() || !password.trim()
                }
              >
                {loginLoading ? "Signing in…" : "Sign in"}
              </button>
            </form>

            <p className="admin-login-footnote">
              Session expires after 12 hours. Content is saved directly to your database.
            </p>
          </div>

          <Link href="/" className="admin-login-back">
            <IonIcon name="arrow-back-outline" />
            <span>Back to portfolio</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
