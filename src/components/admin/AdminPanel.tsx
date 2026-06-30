"use client";

import { FormEvent, useEffect, useState, useSyncExternalStore } from "react";
import {
  PortfolioAdminData,
  LocalizedString,
  emptyLoc,
} from "@/types/localized";
import {
  adminLogin,
  fetchAdminPortfolio,
  saveAdminPortfolio,
} from "@/lib/api";
import Link from "next/link";
import AdminLogin from "./AdminLogin";
import ImageUploadField from "./ImageUploadField";
import AdminContacts from "./AdminContacts";
import AdminSettings from "./AdminSettings";

const TOKEN_KEY = "admin-token";

type Tab =
  | "profile"
  | "about"
  | "services"
  | "projects"
  | "skills"
  | "experience"
  | "education"
  | "testimonials"
  | "blogs"
  | "clients"
  | "contacts"
  | "settings";

const TABS: { id: Tab; label: string }[] = [
  { id: "profile", label: "Profile" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "testimonials", label: "Testimonials" },
  { id: "blogs", label: "Blog" },
  { id: "clients", label: "Clients" },
  { id: "contacts", label: "Inbox" },
  { id: "settings", label: "Settings" },
];

function LocalizedField({
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

function TextField({
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

export default function AdminPanel() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [token, setToken] = useState<string | null>(null);
  const sessionToken = mounted ? sessionStorage.getItem(TOKEN_KEY) : null;
  const authToken = token ?? sessionToken;
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [data, setData] = useState<PortfolioAdminData | null>(null);
  const [tab, setTab] = useState<Tab>("profile");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!authToken) return;

    let cancelled = false;

    fetchAdminPortfolio(authToken)
      .then((portfolio) => {
        if (!cancelled) {
          setLoadError("");
          setData(portfolio);
        }
      })
      .catch(() => {
        if (!cancelled) {
          sessionStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setLoadError(
            "Session expired or portfolio unavailable. Please log in again."
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [authToken]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const authToken = await adminLogin(username, password);
      sessionStorage.setItem(TOKEN_KEY, authToken);
      setToken(authToken);
      setPassword("");
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setData(null);
  };

  const handleSave = async () => {
    if (!authToken || !data) return;
    setSaveStatus("saving");
    try {
      const updated = await saveAdminPortfolio(authToken, data);
      setData(updated);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch {
      setSaveStatus("error");
    }
  };

  const updateProfile = (patch: Partial<PortfolioAdminData["profile"]>) => {
    if (!data) return;
    setData({ ...data, profile: { ...data.profile, ...patch } });
  };

  if (!mounted) {
    return (
      <div className="admin-page">
        <p className="admin-loading">Loading…</p>
      </div>
    );
  }

  if (!authToken) {
    return (
      <AdminLogin
        username={username}
        password={password}
        onUsernameChange={setUsername}
        onPasswordChange={setPassword}
        onSubmit={handleLogin}
        loginError={loginError}
        loadError={loadError}
        loginLoading={loginLoading}
      />
    );
  }

  if (!data) {
    return (
      <div className="admin-page">
        <p className="admin-loading">Loading portfolio…</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1 className="admin-title">Portfolio Admin</h1>
          <p className="admin-subtitle">Edit English & Vietnamese content stored in the database.</p>
        </div>
        <div className="admin-header-actions">
          <Link href="/en/about" className="admin-back-link">View site</Link>
          <button type="button" className="btn-secondary admin-btn" onClick={handleLogout}>
            Log out
          </button>
          <button
            type="button"
            className="btn-primary admin-btn"
            onClick={handleSave}
            disabled={saveStatus === "saving"}
          >
            {saveStatus === "saving" ? "Saving…" : "Save changes"}
          </button>
        </div>
      </header>

      {saveStatus === "saved" && <p className="admin-success">Saved successfully.</p>}
      {saveStatus === "error" && <p className="admin-error">Failed to save. Try again.</p>}

      <nav className="admin-tabs" aria-label="Sections">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`admin-tab${tab === item.id ? " active" : ""}`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="admin-panel">
        {tab === "profile" && (
          <div className="admin-section">
            <LocalizedField label="Name" value={data.profile.name} onChange={(v) => updateProfile({ name: v })} />
            <LocalizedField label="Title" value={data.profile.title} onChange={(v) => updateProfile({ title: v })} />
            <LocalizedField label="Tagline" value={data.profile.tagline ?? emptyLoc()} onChange={(v) => updateProfile({ tagline: v })} />
            <LocalizedField label="Availability" value={data.profile.availability ?? emptyLoc()} onChange={(v) => updateProfile({ availability: v })} />
            <LocalizedField label="Location" value={data.profile.location} onChange={(v) => updateProfile({ location: v })} />
            <LocalizedField label="Birthday display" value={data.profile.birthdayDisplay} onChange={(v) => updateProfile({ birthdayDisplay: v })} />
            <TextField label="Birthday (ISO date)" value={data.profile.birthday} onChange={(v) => updateProfile({ birthday: v })} type="date" />
            <TextField label="Email" value={data.profile.email} onChange={(v) => updateProfile({ email: v })} type="email" />
            <TextField label="Phone" value={data.profile.phone} onChange={(v) => updateProfile({ phone: v })} />
            {authToken && (
              <ImageUploadField
                label="Avatar"
                value={data.profile.avatar}
                onChange={(v) => updateProfile({ avatar: v })}
                token={authToken}
                hint="JPEG, PNG, WebP, or GIF — max 5 MB"
              />
            )}
            <TextField label="Résumé URL" value={data.profile.resumeUrl ?? ""} onChange={(v) => updateProfile({ resumeUrl: v })} />
            <TextField label="Map embed URL" value={data.profile.mapEmbedUrl} onChange={(v) => updateProfile({ mapEmbedUrl: v })} />
            <TextField label="Years experience" value={String(data.profile.yearsExperience ?? "")} onChange={(v) => updateProfile({ yearsExperience: v ? Number(v) : undefined })} type="number" />
            <label className="admin-field">
              <span className="admin-label">Availability status</span>
              <select
                className="admin-input"
                value={data.profile.availabilityStatus ?? "open"}
                onChange={(e) => updateProfile({ availabilityStatus: e.target.value as "open" | "limited" | "unavailable" })}
              >
                <option value="open">Open</option>
                <option value="limited">Limited</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </label>
            <label className="admin-field admin-checkbox">
              <input
                type="checkbox"
                checked={data.profile.remoteFriendly ?? false}
                onChange={(e) => updateProfile({ remoteFriendly: e.target.checked })}
              />
              Remote-friendly
            </label>
            <div className="admin-subsection">
              <h3>Social links</h3>
              {data.profile.socialLinks.map((link, i) => (
                <div className="admin-card" key={i}>
                  <TextField label="Platform" value={link.platform} onChange={(v) => {
                    const socialLinks = [...data.profile.socialLinks];
                    socialLinks[i] = { ...link, platform: v };
                    updateProfile({ socialLinks });
                  }} />
                  <TextField label="URL" value={link.url} onChange={(v) => {
                    const socialLinks = [...data.profile.socialLinks];
                    socialLinks[i] = { ...link, url: v };
                    updateProfile({ socialLinks });
                  }} />
                  <TextField label="Icon (ion-icon name)" value={link.icon} onChange={(v) => {
                    const socialLinks = [...data.profile.socialLinks];
                    socialLinks[i] = { ...link, icon: v };
                    updateProfile({ socialLinks });
                  }} />
                  <button type="button" className="admin-remove-btn" onClick={() => {
                    updateProfile({ socialLinks: data.profile.socialLinks.filter((_, j) => j !== i) });
                  }}>Remove</button>
                </div>
              ))}
              <button type="button" className="admin-add-btn" onClick={() => updateProfile({
                socialLinks: [...data.profile.socialLinks, { platform: "", url: "", icon: "logo-github" }],
              })}>Add social link</button>
            </div>
          </div>
        )}

        {tab === "about" && (
          <div className="admin-section">
            <h3>About paragraphs (EN)</h3>
            {data.about.en.map((p, i) => (
              <div className="admin-card" key={`en-${i}`}>
                <textarea className="admin-input" value={p} rows={3} onChange={(e) => {
                  const en = [...data.about.en];
                  en[i] = e.target.value;
                  setData({ ...data, about: { ...data.about, en } });
                }} />
                <button type="button" className="admin-remove-btn" onClick={() => {
                  setData({ ...data, about: { ...data.about, en: data.about.en.filter((_, j) => j !== i) } });
                }}>Remove</button>
              </div>
            ))}
            <button type="button" className="admin-add-btn" onClick={() => {
              setData({ ...data, about: { ...data.about, en: [...data.about.en, ""] } });
            }}>Add EN paragraph</button>
            <h3>About paragraphs (VI)</h3>
            {data.about.vi.map((p, i) => (
              <div className="admin-card" key={`vi-${i}`}>
                <textarea className="admin-input" value={p} rows={3} onChange={(e) => {
                  const vi = [...data.about.vi];
                  vi[i] = e.target.value;
                  setData({ ...data, about: { ...data.about, vi } });
                }} />
                <button type="button" className="admin-remove-btn" onClick={() => {
                  setData({ ...data, about: { ...data.about, vi: data.about.vi.filter((_, j) => j !== i) } });
                }}>Remove</button>
              </div>
            ))}
            <button type="button" className="admin-add-btn" onClick={() => {
              setData({ ...data, about: { ...data.about, vi: [...data.about.vi, ""] } });
            }}>Add VI paragraph</button>
          </div>
        )}

        {tab === "services" && (
          <div className="admin-section">
            {data.services.map((service, i) => (
              <div className="admin-card" key={i}>
                {authToken && (
                  <ImageUploadField
                    label="Service icon"
                    value={service.icon}
                    onChange={(v) => {
                      const services = [...data.services];
                      services[i] = { ...service, icon: v };
                      setData({ ...data, services });
                    }}
                    token={authToken}
                  />
                )}
                <LocalizedField label="Title" value={service.title} onChange={(v) => {
                  const services = [...data.services];
                  services[i] = { ...service, title: v };
                  setData({ ...data, services });
                }} />
                <LocalizedField label="Description" value={service.description} onChange={(v) => {
                  const services = [...data.services];
                  services[i] = { ...service, description: v };
                  setData({ ...data, services });
                }} multiline />
                <button type="button" className="admin-remove-btn" onClick={() => {
                  setData({ ...data, services: data.services.filter((_, j) => j !== i) });
                }}>Remove</button>
              </div>
            ))}
            <button type="button" className="admin-add-btn" onClick={() => {
              setData({ ...data, services: [...data.services, { icon: "", title: emptyLoc(), description: emptyLoc() }] });
            }}>Add service</button>
          </div>
        )}

        {tab === "projects" && (
          <div className="admin-section">
            {data.projects.map((project, i) => (
              <div className="admin-card" key={i}>
                <LocalizedField label="Title" value={project.title} onChange={(v) => {
                  const projects = [...data.projects];
                  projects[i] = { ...project, title: v };
                  setData({ ...data, projects });
                }} />
                <LocalizedField label="Category" value={project.category} onChange={(v) => {
                  const projects = [...data.projects];
                  projects[i] = { ...project, category: v };
                  setData({ ...data, projects });
                }} />
                <TextField label="Category slug (filter key)" value={project.categorySlug} onChange={(v) => {
                  const projects = [...data.projects];
                  projects[i] = { ...project, categorySlug: v };
                  setData({ ...data, projects });
                }} />
                <LocalizedField label="Description" value={project.description ?? emptyLoc()} onChange={(v) => {
                  const projects = [...data.projects];
                  projects[i] = { ...project, description: v };
                  setData({ ...data, projects });
                }} multiline />
                {authToken && (
                  <ImageUploadField
                    label="Project image"
                    value={project.image}
                    onChange={(v) => {
                      const projects = [...data.projects];
                      projects[i] = { ...project, image: v };
                      setData({ ...data, projects });
                    }}
                    token={authToken}
                  />
                )}
                <TextField label="Project URL" value={project.url} onChange={(v) => {
                  const projects = [...data.projects];
                  projects[i] = { ...project, url: v };
                  setData({ ...data, projects });
                }} />
                <TextField label="Tech stack (comma-separated)" value={(project.techStack ?? []).join(", ")} onChange={(v) => {
                  const projects = [...data.projects];
                  projects[i] = { ...project, techStack: v.split(",").map((s) => s.trim()).filter(Boolean) };
                  setData({ ...data, projects });
                }} />
                <label className="admin-field admin-checkbox">
                  <input type="checkbox" checked={project.featured ?? false} onChange={(e) => {
                    const projects = [...data.projects];
                    projects[i] = { ...project, featured: e.target.checked };
                    setData({ ...data, projects });
                  }} />
                  Featured project
                </label>
                <button type="button" className="admin-remove-btn" onClick={() => {
                  setData({ ...data, projects: data.projects.filter((_, j) => j !== i) });
                }}>Remove</button>
              </div>
            ))}
            <button type="button" className="admin-add-btn" onClick={() => {
              setData({ ...data, projects: [...data.projects, { title: emptyLoc(), category: emptyLoc(), categorySlug: "web design", image: "", url: "" }] });
            }}>Add project</button>
          </div>
        )}

        {tab === "skills" && (
          <div className="admin-section">
            {data.skills.map((skill, i) => (
              <div className="admin-card" key={i}>
                <LocalizedField label="Name" value={skill.name} onChange={(v) => {
                  const skills = [...data.skills];
                  skills[i] = { ...skill, name: v };
                  setData({ ...data, skills });
                }} />
                <TextField label="Percentage" value={String(skill.percentage)} type="number" onChange={(v) => {
                  const skills = [...data.skills];
                  skills[i] = { ...skill, percentage: Number(v) || 0 };
                  setData({ ...data, skills });
                }} />
                <button type="button" className="admin-remove-btn" onClick={() => {
                  setData({ ...data, skills: data.skills.filter((_, j) => j !== i) });
                }}>Remove</button>
              </div>
            ))}
            <button type="button" className="admin-add-btn" onClick={() => {
              setData({ ...data, skills: [...data.skills, { name: emptyLoc(), percentage: 80 }] });
            }}>Add skill</button>
          </div>
        )}

        {tab === "experience" && (
          <div className="admin-section">
            {data.experience.map((item, i) => (
              <div className="admin-card" key={i}>
                <LocalizedField label="Title" value={item.title} onChange={(v) => {
                  const experience = [...data.experience];
                  experience[i] = { ...item, title: v };
                  setData({ ...data, experience });
                }} />
                <LocalizedField label="Period" value={item.period} onChange={(v) => {
                  const experience = [...data.experience];
                  experience[i] = { ...item, period: v };
                  setData({ ...data, experience });
                }} />
                <LocalizedField label="Description" value={item.description} onChange={(v) => {
                  const experience = [...data.experience];
                  experience[i] = { ...item, description: v };
                  setData({ ...data, experience });
                }} multiline />
                <button type="button" className="admin-remove-btn" onClick={() => {
                  setData({ ...data, experience: data.experience.filter((_, j) => j !== i) });
                }}>Remove</button>
              </div>
            ))}
            <button type="button" className="admin-add-btn" onClick={() => {
              setData({ ...data, experience: [...data.experience, { title: emptyLoc(), period: emptyLoc(), description: emptyLoc() }] });
            }}>Add experience</button>
          </div>
        )}

        {tab === "education" && (
          <div className="admin-section">
            {data.education.map((item, i) => (
              <div className="admin-card" key={i}>
                <LocalizedField label="Title" value={item.title} onChange={(v) => {
                  const education = [...data.education];
                  education[i] = { ...item, title: v };
                  setData({ ...data, education });
                }} />
                <LocalizedField label="Period" value={item.period} onChange={(v) => {
                  const education = [...data.education];
                  education[i] = { ...item, period: v };
                  setData({ ...data, education });
                }} />
                <LocalizedField label="Description" value={item.description} onChange={(v) => {
                  const education = [...data.education];
                  education[i] = { ...item, description: v };
                  setData({ ...data, education });
                }} multiline />
                <button type="button" className="admin-remove-btn" onClick={() => {
                  setData({ ...data, education: data.education.filter((_, j) => j !== i) });
                }}>Remove</button>
              </div>
            ))}
            <button type="button" className="admin-add-btn" onClick={() => {
              setData({ ...data, education: [...data.education, { title: emptyLoc(), period: emptyLoc(), description: emptyLoc() }] });
            }}>Add education</button>
          </div>
        )}

        {tab === "testimonials" && (
          <div className="admin-section">
            {data.testimonials.map((item, i) => (
              <div className="admin-card" key={i}>
                {authToken && (
                  <ImageUploadField
                    label="Avatar"
                    value={item.avatar}
                    onChange={(v) => {
                      const testimonials = [...data.testimonials];
                      testimonials[i] = { ...item, avatar: v };
                      setData({ ...data, testimonials });
                    }}
                    token={authToken}
                  />
                )}
                <LocalizedField label="Name" value={item.name} onChange={(v) => {
                  const testimonials = [...data.testimonials];
                  testimonials[i] = { ...item, name: v };
                  setData({ ...data, testimonials });
                }} />
                <LocalizedField label="Role" value={item.role ?? emptyLoc()} onChange={(v) => {
                  const testimonials = [...data.testimonials];
                  testimonials[i] = { ...item, role: v };
                  setData({ ...data, testimonials });
                }} />
                <LocalizedField label="Text" value={item.text} onChange={(v) => {
                  const testimonials = [...data.testimonials];
                  testimonials[i] = { ...item, text: v };
                  setData({ ...data, testimonials });
                }} multiline />
                <TextField label="Date (ISO)" value={item.date} onChange={(v) => {
                  const testimonials = [...data.testimonials];
                  testimonials[i] = { ...item, date: v };
                  setData({ ...data, testimonials });
                }} />
                <button type="button" className="admin-remove-btn" onClick={() => {
                  setData({ ...data, testimonials: data.testimonials.filter((_, j) => j !== i) });
                }}>Remove</button>
              </div>
            ))}
            <button type="button" className="admin-add-btn" onClick={() => {
              setData({ ...data, testimonials: [...data.testimonials, { avatar: "", name: emptyLoc(), text: emptyLoc(), date: new Date().toISOString().slice(0, 10) }] });
            }}>Add testimonial</button>
          </div>
        )}

        {tab === "blogs" && (
          <div className="admin-section">
            {data.blogs.map((post, i) => (
              <div className="admin-card" key={i}>
                <LocalizedField label="Title" value={post.title} onChange={(v) => {
                  const blogs = [...data.blogs];
                  blogs[i] = { ...post, title: v };
                  setData({ ...data, blogs });
                }} />
                <LocalizedField label="Category" value={post.category} onChange={(v) => {
                  const blogs = [...data.blogs];
                  blogs[i] = { ...post, category: v };
                  setData({ ...data, blogs });
                }} />
                <LocalizedField label="Excerpt" value={post.excerpt} onChange={(v) => {
                  const blogs = [...data.blogs];
                  blogs[i] = { ...post, excerpt: v };
                  setData({ ...data, blogs });
                }} multiline />
                {authToken && (
                  <ImageUploadField
                    label="Blog image"
                    value={post.image}
                    onChange={(v) => {
                      const blogs = [...data.blogs];
                      blogs[i] = { ...post, image: v };
                      setData({ ...data, blogs });
                    }}
                    token={authToken}
                  />
                )}
                <TextField label="Post URL" value={post.url} onChange={(v) => {
                  const blogs = [...data.blogs];
                  blogs[i] = { ...post, url: v };
                  setData({ ...data, blogs });
                }} />
                <TextField label="Date (ISO)" value={post.date} onChange={(v) => {
                  const blogs = [...data.blogs];
                  blogs[i] = { ...post, date: v };
                  setData({ ...data, blogs });
                }} />
                <button type="button" className="admin-remove-btn" onClick={() => {
                  setData({ ...data, blogs: data.blogs.filter((_, j) => j !== i) });
                }}>Remove</button>
              </div>
            ))}
            <button type="button" className="admin-add-btn" onClick={() => {
              setData({ ...data, blogs: [...data.blogs, { title: emptyLoc(), category: emptyLoc(), excerpt: emptyLoc(), image: "", url: "", date: new Date().toISOString().slice(0, 10) }] });
            }}>Add blog post</button>
          </div>
        )}

        {tab === "clients" && (
          <div className="admin-section">
            {data.clients.map((client, i) => (
              <div className="admin-card" key={i}>
                {authToken && (
                  <ImageUploadField
                    label="Client logo"
                    value={client.logo}
                    onChange={(v) => {
                      const clients = [...data.clients];
                      clients[i] = { ...client, logo: v };
                      setData({ ...data, clients });
                    }}
                    token={authToken}
                  />
                )}
                <TextField label="URL" value={client.url} onChange={(v) => {
                  const clients = [...data.clients];
                  clients[i] = { ...client, url: v };
                  setData({ ...data, clients });
                }} />
                <button type="button" className="admin-remove-btn" onClick={() => {
                  setData({ ...data, clients: data.clients.filter((_, j) => j !== i) });
                }}>Remove</button>
              </div>
            ))}
            <button type="button" className="admin-add-btn" onClick={() => {
              setData({ ...data, clients: [...data.clients, { logo: "", url: "" }] });
            }}>Add client</button>
          </div>
        )}

        {tab === "contacts" && authToken && (
          <AdminContacts token={authToken} />
        )}

        {tab === "settings" && authToken && (
          <AdminSettings token={authToken} username={username} />
        )}
      </div>
    </div>
  );
}
