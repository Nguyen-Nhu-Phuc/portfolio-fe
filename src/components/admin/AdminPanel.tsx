"use client";

import { FormEvent, useEffect, useState, useSyncExternalStore } from "react";
import {
  PortfolioAdminData,
  emptyLoc,
} from "@/types/localized";
import {
  adminLogin,
  fetchAdminPortfolio,
  saveAdminPortfolio,
} from "@/lib/api";
import { resolveImageSrc } from "@/lib/images";
import Link from "next/link";
import AdminLogin from "./AdminLogin";
import ImageUploadField from "./ImageUploadField";
import AdminContacts from "./AdminContacts";
import AdminSettings from "./AdminSettings";
import AdminListTable from "./AdminListTable";
import AdminDetailDrawer from "./AdminDetailDrawer";
import {
  LocalizedField,
  SelectField,
  TextField,
  truncate,
} from "./AdminFields";
import { useToast } from "@/context/ToastProvider";
import {
  DEFAULT_PROJECT_CATEGORIES,
  slugifyCategory,
} from "@/lib/projectCategories";

const TOKEN_KEY = "admin-token";

type Tab =
  | "profile"
  | "about"
  | "services"
  | "categories"
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
  { id: "categories", label: "Categories" },
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

function normalizeAdminPortfolio(
  portfolio: PortfolioAdminData
): PortfolioAdminData {
  return {
    ...portfolio,
    projectCategories:
      portfolio.projectCategories?.length > 0
        ? portfolio.projectCategories
        : DEFAULT_PROJECT_CATEGORIES.map((category) => ({ ...category })),
  };
}

function TableThumb({ src, alt }: { src: string; alt?: string }) {
  if (!src) return <span className="admin-table-thumb-empty">—</span>;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolveImageSrc(src)}
      alt={alt ?? ""}
      className="admin-table-thumb"
    />
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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [aboutLocale, setAboutLocale] = useState<"en" | "vi">("en");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving">("idle");
  const [loadError, setLoadError] = useState("");
  const toast = useToast();

  useEffect(() => {
    setSelectedIndex(null);
  }, [tab, aboutLocale]);

  useEffect(() => {
    if (!authToken) return;

    let cancelled = false;

    fetchAdminPortfolio(authToken)
      .then((portfolio) => {
        if (!cancelled) {
          setLoadError("");
          setData(normalizeAdminPortfolio(portfolio));
        }
      })
      .catch(() => {
        if (!cancelled) {
          sessionStorage.removeItem(TOKEN_KEY);
          setToken(null);
          const message =
            "Session expired or portfolio unavailable. Please log in again.";
          setLoadError(message);
          toast.error(message);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [authToken, toast]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const newToken = await adminLogin(username, password);
      sessionStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
      setPassword("");
      toast.success("Signed in successfully.");
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login failed");
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setData(null);
    toast.info("Logged out.");
  };

  const handleSave = async () => {
    if (!authToken || !data) return;
    setSaveStatus("saving");
    try {
      const updated = await saveAdminPortfolio(authToken, data);
      setData(updated);
      toast.success("Portfolio saved successfully.");
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setSaveStatus("idle");
    }
  };

  const updateProfile = (patch: Partial<PortfolioAdminData["profile"]>) => {
    if (!data) return;
    setData({ ...data, profile: { ...data.profile, ...patch } });
  };

  const closeDetail = () => setSelectedIndex(null);

  const removeAt = <T,>(items: T[], index: number): T[] =>
    items.filter((_, j) => j !== index);

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

  const selectedService =
    selectedIndex !== null ? data.services[selectedIndex] : null;
  const selectedCategory =
    selectedIndex !== null ? data.projectCategories[selectedIndex] : null;
  const selectedProject =
    selectedIndex !== null ? data.projects[selectedIndex] : null;
  const selectedSkill =
    selectedIndex !== null ? data.skills[selectedIndex] : null;
  const selectedExperience =
    selectedIndex !== null ? data.experience[selectedIndex] : null;
  const selectedEducation =
    selectedIndex !== null ? data.education[selectedIndex] : null;
  const selectedTestimonial =
    selectedIndex !== null ? data.testimonials[selectedIndex] : null;
  const selectedBlog =
    selectedIndex !== null ? data.blogs[selectedIndex] : null;
  const selectedClient =
    selectedIndex !== null ? data.clients[selectedIndex] : null;
  const selectedSocialLink =
    selectedIndex !== null ? data.profile.socialLinks[selectedIndex] : null;
  const aboutParagraphs =
    aboutLocale === "en" ? data.about.en : data.about.vi;
  const selectedAboutParagraph =
    selectedIndex !== null ? aboutParagraphs[selectedIndex] : null;

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1 className="admin-title">Portfolio Admin</h1>
          <p className="admin-subtitle">
            Edit English & Vietnamese content stored in the database.
          </p>
        </div>
        <div className="admin-header-actions">
          <Link href="/en/about" className="admin-back-link">
            View site
          </Link>
          <button
            type="button"
            className="btn-secondary admin-btn"
            onClick={handleLogout}
          >
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
            <LocalizedField
              label="Name"
              value={data.profile.name}
              onChange={(v) => updateProfile({ name: v })}
            />
            <LocalizedField
              label="Title"
              value={data.profile.title}
              onChange={(v) => updateProfile({ title: v })}
            />
            <LocalizedField
              label="Tagline"
              value={data.profile.tagline ?? emptyLoc()}
              onChange={(v) => updateProfile({ tagline: v })}
            />
            <LocalizedField
              label="Availability"
              value={data.profile.availability ?? emptyLoc()}
              onChange={(v) => updateProfile({ availability: v })}
            />
            <LocalizedField
              label="Location"
              value={data.profile.location}
              onChange={(v) => updateProfile({ location: v })}
            />
            <LocalizedField
              label="Birthday display"
              value={data.profile.birthdayDisplay}
              onChange={(v) => updateProfile({ birthdayDisplay: v })}
            />
            <TextField
              label="Birthday (ISO date)"
              value={data.profile.birthday}
              onChange={(v) => updateProfile({ birthday: v })}
              type="date"
            />
            <TextField
              label="Email"
              value={data.profile.email}
              onChange={(v) => updateProfile({ email: v })}
              type="email"
            />
            <TextField
              label="Phone"
              value={data.profile.phone}
              onChange={(v) => updateProfile({ phone: v })}
            />
            {authToken && (
              <ImageUploadField
                label="Avatar"
                value={data.profile.avatar}
                onChange={(v) => updateProfile({ avatar: v })}
                token={authToken}
                hint="JPEG, PNG, WebP, GIF, or SVG — max 5 MB"
              />
            )}
            <TextField
              label="Résumé URL"
              value={data.profile.resumeUrl ?? ""}
              onChange={(v) => updateProfile({ resumeUrl: v })}
            />
            <TextField
              label="Map embed URL"
              value={data.profile.mapEmbedUrl}
              onChange={(v) => updateProfile({ mapEmbedUrl: v })}
            />
            <TextField
              label="Years experience"
              value={String(data.profile.yearsExperience ?? "")}
              onChange={(v) =>
                updateProfile({ yearsExperience: v ? Number(v) : undefined })
              }
              type="number"
            />
            <label className="admin-field">
              <span className="admin-label">Availability status</span>
              <select
                className="admin-input"
                value={data.profile.availabilityStatus ?? "open"}
                onChange={(e) =>
                  updateProfile({
                    availabilityStatus: e.target.value as
                      | "open"
                      | "limited"
                      | "unavailable",
                  })
                }
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
                onChange={(e) =>
                  updateProfile({ remoteFriendly: e.target.checked })
                }
              />
              Remote-friendly
            </label>

            <div className="admin-subsection">
              <div className="admin-section-toolbar">
                <h3>Social links</h3>
                <button
                  type="button"
                  className="admin-add-btn"
                  onClick={() => {
                    const next = [
                      ...data.profile.socialLinks,
                      { platform: "", url: "", icon: "logo-github", logo: "" },
                    ];
                    updateProfile({ socialLinks: next });
                    setSelectedIndex(next.length - 1);
                  }}
                >
                  Add social link
                </button>
              </div>
              <AdminListTable
                items={data.profile.socialLinks}
                onRowClick={setSelectedIndex}
                emptyMessage="No social links yet."
                columns={[
                  {
                    key: "logo",
                    header: "",
                    className: "admin-table-col-thumb",
                    render: (link) =>
                      link.logo ? (
                        <TableThumb src={link.logo} alt="" />
                      ) : (
                        <span className="admin-table-thumb-empty">—</span>
                      ),
                  },
                  {
                    key: "platform",
                    header: "Platform",
                    render: (link) => link.platform || "—",
                  },
                  {
                    key: "url",
                    header: "URL",
                    render: (link) => truncate(link.url, 40),
                  },
                  {
                    key: "icon",
                    header: "Icon fallback",
                    render: (link) => link.icon || "—",
                  },
                ]}
              />
            </div>

            <AdminDetailDrawer
              open={selectedSocialLink !== null && selectedIndex !== null}
              title={
                selectedSocialLink?.platform
                  ? `Social: ${selectedSocialLink.platform}`
                  : "Social link"
              }
              onClose={closeDetail}
              onDelete={
                selectedIndex !== null
                  ? () => {
                      updateProfile({
                        socialLinks: removeAt(
                          data.profile.socialLinks,
                          selectedIndex
                        ),
                      });
                      closeDetail();
                    }
                  : undefined
              }
            >
              {selectedSocialLink && selectedIndex !== null && (
                <>
                  <TextField
                    label="Platform"
                    value={selectedSocialLink.platform}
                    onChange={(v) => {
                      const socialLinks = [...data.profile.socialLinks];
                      socialLinks[selectedIndex] = {
                        ...selectedSocialLink,
                        platform: v,
                      };
                      updateProfile({ socialLinks });
                    }}
                  />
                  <TextField
                    label="URL"
                    value={selectedSocialLink.url}
                    onChange={(v) => {
                      const socialLinks = [...data.profile.socialLinks];
                      socialLinks[selectedIndex] = {
                        ...selectedSocialLink,
                        url: v,
                      };
                      updateProfile({ socialLinks });
                    }}
                  />
                  {authToken && (
                    <ImageUploadField
                      label="Logo"
                      value={selectedSocialLink.logo ?? ""}
                      onChange={(v) => {
                        const socialLinks = [...data.profile.socialLinks];
                        socialLinks[selectedIndex] = {
                          ...selectedSocialLink,
                          logo: v,
                        };
                        updateProfile({ socialLinks });
                      }}
                      token={authToken}
                      hint="Square PNG/SVG works best. Shown on the contact page when set."
                    />
                  )}
                  <TextField
                    label="Icon fallback (ion-icon name)"
                    value={selectedSocialLink.icon}
                    onChange={(v) => {
                      const socialLinks = [...data.profile.socialLinks];
                      socialLinks[selectedIndex] = {
                        ...selectedSocialLink,
                        icon: v,
                      };
                      updateProfile({ socialLinks });
                    }}
                  />
                </>
              )}
            </AdminDetailDrawer>
          </div>
        )}

        {tab === "about" && (
          <div className="admin-section">
            <div className="admin-section-toolbar">
              <div className="admin-locale-toggle">
                <button
                  type="button"
                  className={`admin-tab${aboutLocale === "en" ? " active" : ""}`}
                  onClick={() => setAboutLocale("en")}
                >
                  English
                </button>
                <button
                  type="button"
                  className={`admin-tab${aboutLocale === "vi" ? " active" : ""}`}
                  onClick={() => setAboutLocale("vi")}
                >
                  Vietnamese
                </button>
              </div>
              <button
                type="button"
                className="admin-add-btn"
                onClick={() => {
                  const key = aboutLocale;
                  const next = [...data.about[key], ""];
                  setData({
                    ...data,
                    about: { ...data.about, [key]: next },
                  });
                  setSelectedIndex(next.length - 1);
                }}
              >
                Add paragraph
              </button>
            </div>
            <AdminListTable
              items={aboutParagraphs}
              onRowClick={setSelectedIndex}
              emptyMessage={`No ${aboutLocale.toUpperCase()} paragraphs yet.`}
              columns={[
                {
                  key: "index",
                  header: "#",
                  className: "admin-table-col-narrow",
                  render: (_, i) => i + 1,
                },
                {
                  key: "preview",
                  header: "Preview",
                  render: (text) => truncate(text, 80),
                },
              ]}
            />
            <AdminDetailDrawer
              open={selectedAboutParagraph !== null && selectedIndex !== null}
              title={`About paragraph (${aboutLocale.toUpperCase()})`}
              onClose={closeDetail}
              onDelete={
                selectedIndex !== null
                  ? () => {
                      const key = aboutLocale;
                      setData({
                        ...data,
                        about: {
                          ...data.about,
                          [key]: removeAt(data.about[key], selectedIndex),
                        },
                      });
                      closeDetail();
                    }
                  : undefined
              }
            >
              {selectedAboutParagraph !== null && selectedIndex !== null && (
                <label className="admin-field">
                  <span className="admin-label">Content</span>
                  <textarea
                    className="admin-input"
                    value={selectedAboutParagraph}
                    rows={8}
                    onChange={(e) => {
                      const key = aboutLocale;
                      const paragraphs = [...data.about[key]];
                      paragraphs[selectedIndex] = e.target.value;
                      setData({
                        ...data,
                        about: { ...data.about, [key]: paragraphs },
                      });
                    }}
                  />
                </label>
              )}
            </AdminDetailDrawer>
          </div>
        )}

        {tab === "services" && (
          <div className="admin-section">
            <div className="admin-section-toolbar">
              <p className="admin-hint admin-hint--inline">
                Click a row to edit. Remember to save changes when done.
              </p>
              <button
                type="button"
                className="admin-add-btn"
                onClick={() => {
                  const next = [
                    ...data.services,
                    { icon: "", title: emptyLoc(), description: emptyLoc() },
                  ];
                  setData({ ...data, services: next });
                  setSelectedIndex(next.length - 1);
                }}
              >
                Add service
              </button>
            </div>
            <AdminListTable
              items={data.services}
              onRowClick={setSelectedIndex}
              columns={[
                {
                  key: "icon",
                  header: "",
                  className: "admin-table-col-thumb",
                  render: (s) => <TableThumb src={s.icon} alt="" />,
                },
                {
                  key: "title",
                  header: "Title (EN)",
                  render: (s) => s.title.en || "—",
                },
                {
                  key: "titleVi",
                  header: "Title (VI)",
                  render: (s) => s.title.vi || "—",
                },
                {
                  key: "desc",
                  header: "Description",
                  render: (s) => truncate(s.description.en || s.description.vi),
                },
              ]}
            />
            <AdminDetailDrawer
              open={selectedService !== null && selectedIndex !== null}
              title={selectedService?.title.en || "Service"}
              onClose={closeDetail}
              onDelete={
                selectedIndex !== null
                  ? () => {
                      setData({
                        ...data,
                        services: removeAt(data.services, selectedIndex),
                      });
                      closeDetail();
                    }
                  : undefined
              }
            >
              {selectedService && selectedIndex !== null && authToken && (
                <>
                  <ImageUploadField
                    label="Service icon"
                    value={selectedService.icon}
                    onChange={(v) => {
                      const services = [...data.services];
                      services[selectedIndex] = {
                        ...selectedService,
                        icon: v,
                      };
                      setData({ ...data, services });
                    }}
                    token={authToken}
                  />
                  <LocalizedField
                    label="Title"
                    value={selectedService.title}
                    onChange={(v) => {
                      const services = [...data.services];
                      services[selectedIndex] = {
                        ...selectedService,
                        title: v,
                      };
                      setData({ ...data, services });
                    }}
                  />
                  <LocalizedField
                    label="Description"
                    value={selectedService.description}
                    onChange={(v) => {
                      const services = [...data.services];
                      services[selectedIndex] = {
                        ...selectedService,
                        description: v,
                      };
                      setData({ ...data, services });
                    }}
                    multiline
                  />
                </>
              )}
            </AdminDetailDrawer>
          </div>
        )}

        {tab === "categories" && (
          <div className="admin-section">
            <div className="admin-section-toolbar">
              <p className="admin-hint admin-hint--inline">
                Manage portfolio filter tabs used for project filtering.
              </p>
              <button
                type="button"
                className="admin-add-btn"
                onClick={() => {
                  const next = [
                    ...data.projectCategories,
                    { slug: "", label: emptyLoc() },
                  ];
                  setData({ ...data, projectCategories: next });
                  setSelectedIndex(next.length - 1);
                }}
              >
                Add category
              </button>
            </div>
            <AdminListTable
              items={data.projectCategories}
              onRowClick={setSelectedIndex}
              columns={[
                {
                  key: "slug",
                  header: "Slug",
                  render: (c) => c.slug || "—",
                },
                {
                  key: "en",
                  header: "Label (EN)",
                  render: (c) => c.label.en || "—",
                },
                {
                  key: "vi",
                  header: "Label (VI)",
                  render: (c) => c.label.vi || "—",
                },
              ]}
            />
            <AdminDetailDrawer
              open={selectedCategory !== null && selectedIndex !== null}
              title={selectedCategory?.label.en || "Category"}
              onClose={closeDetail}
              onDelete={
                selectedIndex !== null
                  ? () => {
                      setData({
                        ...data,
                        projectCategories: removeAt(
                          data.projectCategories,
                          selectedIndex
                        ),
                      });
                      closeDetail();
                    }
                  : undefined
              }
              deleteLabel="Remove category"
            >
              {selectedCategory && selectedIndex !== null && (
                <>
                  <LocalizedField
                    label="Category name"
                    value={selectedCategory.label}
                    onChange={(v) => {
                      const projectCategories = [...data.projectCategories];
                      const slug =
                        selectedCategory.slug || slugifyCategory(v.en);
                      projectCategories[selectedIndex] = {
                        ...selectedCategory,
                        label: v,
                        slug: selectedCategory.slug ? selectedCategory.slug : slug,
                      };
                      setData({ ...data, projectCategories });
                    }}
                  />
                  <TextField
                    label="Filter key (slug)"
                    value={selectedCategory.slug}
                    onChange={(v) => {
                      const projectCategories = [...data.projectCategories];
                      projectCategories[selectedIndex] = {
                        ...selectedCategory,
                        slug: slugifyCategory(v),
                      };
                      setData({ ...data, projectCategories });
                    }}
                  />
                </>
              )}
            </AdminDetailDrawer>
          </div>
        )}

        {tab === "projects" && (
          <div className="admin-section">
            <div className="admin-section-toolbar">
              <button
                type="button"
                className="admin-add-btn"
                onClick={() => {
                  const defaultCategory = data.projectCategories[0];
                  const next = [
                    ...data.projects,
                    {
                      title: emptyLoc(),
                      category: defaultCategory?.label ?? emptyLoc(),
                      categorySlug: defaultCategory?.slug ?? "",
                      image: "",
                      url: "",
                    },
                  ];
                  setData({ ...data, projects: next });
                  setSelectedIndex(next.length - 1);
                }}
              >
                Add project
              </button>
            </div>
            <AdminListTable
              items={data.projects}
              onRowClick={setSelectedIndex}
              columns={[
                {
                  key: "image",
                  header: "",
                  className: "admin-table-col-thumb",
                  render: (p) => <TableThumb src={p.image} alt="" />,
                },
                {
                  key: "title",
                  header: "Title",
                  render: (p) => p.title.en || p.title.vi || "—",
                },
                {
                  key: "category",
                  header: "Category",
                  render: (p) => p.categorySlug || "—",
                },
                {
                  key: "featured",
                  header: "Featured",
                  className: "admin-table-col-narrow",
                  render: (p) => (p.featured ? "Yes" : "—"),
                },
              ]}
            />
            <AdminDetailDrawer
              open={selectedProject !== null && selectedIndex !== null}
              title={selectedProject?.title.en || "Project"}
              onClose={closeDetail}
              onDelete={
                selectedIndex !== null
                  ? () => {
                      setData({
                        ...data,
                        projects: removeAt(data.projects, selectedIndex),
                      });
                      closeDetail();
                    }
                  : undefined
              }
            >
              {selectedProject && selectedIndex !== null && authToken && (
                <>
                  <LocalizedField
                    label="Title"
                    value={selectedProject.title}
                    onChange={(v) => {
                      const projects = [...data.projects];
                      projects[selectedIndex] = {
                        ...selectedProject,
                        title: v,
                      };
                      setData({ ...data, projects });
                    }}
                  />
                  <SelectField
                    label="Category"
                    value={selectedProject.categorySlug}
                    placeholder="Select category"
                    options={data.projectCategories.map((category) => ({
                      value: category.slug,
                      label: `${category.label.en} / ${category.label.vi}`,
                    }))}
                    onChange={(slug) => {
                      const selected = data.projectCategories.find(
                        (category) => category.slug === slug
                      );
                      const projects = [...data.projects];
                      projects[selectedIndex] = {
                        ...selectedProject,
                        categorySlug: slug,
                        category: selected?.label ?? emptyLoc(),
                      };
                      setData({ ...data, projects });
                    }}
                  />
                  <LocalizedField
                    label="Description"
                    value={selectedProject.description ?? emptyLoc()}
                    onChange={(v) => {
                      const projects = [...data.projects];
                      projects[selectedIndex] = {
                        ...selectedProject,
                        description: v,
                      };
                      setData({ ...data, projects });
                    }}
                    multiline
                  />
                  <ImageUploadField
                    label="Project image"
                    value={selectedProject.image}
                    onChange={(v) => {
                      const projects = [...data.projects];
                      projects[selectedIndex] = {
                        ...selectedProject,
                        image: v,
                      };
                      setData({ ...data, projects });
                    }}
                    token={authToken}
                  />
                  <TextField
                    label="Project URL"
                    value={selectedProject.url}
                    onChange={(v) => {
                      const projects = [...data.projects];
                      projects[selectedIndex] = {
                        ...selectedProject,
                        url: v,
                      };
                      setData({ ...data, projects });
                    }}
                  />
                  <TextField
                    label="Tech stack (comma-separated)"
                    value={(selectedProject.techStack ?? []).join(", ")}
                    onChange={(v) => {
                      const projects = [...data.projects];
                      projects[selectedIndex] = {
                        ...selectedProject,
                        techStack: v
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      };
                      setData({ ...data, projects });
                    }}
                  />
                  <label className="admin-field admin-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedProject.featured ?? false}
                      onChange={(e) => {
                        const projects = [...data.projects];
                        projects[selectedIndex] = {
                          ...selectedProject,
                          featured: e.target.checked,
                        };
                        setData({ ...data, projects });
                      }}
                    />
                    Featured project
                  </label>
                </>
              )}
            </AdminDetailDrawer>
          </div>
        )}

        {tab === "skills" && (
          <div className="admin-section">
            <div className="admin-section-toolbar">
              <button
                type="button"
                className="admin-add-btn"
                onClick={() => {
                  const next = [
                    ...data.skills,
                    { name: emptyLoc(), percentage: 80 },
                  ];
                  setData({ ...data, skills: next });
                  setSelectedIndex(next.length - 1);
                }}
              >
                Add skill
              </button>
            </div>
            <AdminListTable
              items={data.skills}
              onRowClick={setSelectedIndex}
              columns={[
                {
                  key: "name",
                  header: "Name (EN)",
                  render: (s) => s.name.en || "—",
                },
                {
                  key: "nameVi",
                  header: "Name (VI)",
                  render: (s) => s.name.vi || "—",
                },
                {
                  key: "pct",
                  header: "%",
                  className: "admin-table-col-narrow",
                  render: (s) => s.percentage,
                },
              ]}
            />
            <AdminDetailDrawer
              open={selectedSkill !== null && selectedIndex !== null}
              title={selectedSkill?.name.en || "Skill"}
              onClose={closeDetail}
              onDelete={
                selectedIndex !== null
                  ? () => {
                      setData({
                        ...data,
                        skills: removeAt(data.skills, selectedIndex),
                      });
                      closeDetail();
                    }
                  : undefined
              }
            >
              {selectedSkill && selectedIndex !== null && (
                <>
                  <LocalizedField
                    label="Name"
                    value={selectedSkill.name}
                    onChange={(v) => {
                      const skills = [...data.skills];
                      skills[selectedIndex] = { ...selectedSkill, name: v };
                      setData({ ...data, skills });
                    }}
                  />
                  <TextField
                    label="Percentage"
                    value={String(selectedSkill.percentage)}
                    type="number"
                    onChange={(v) => {
                      const skills = [...data.skills];
                      skills[selectedIndex] = {
                        ...selectedSkill,
                        percentage: Number(v) || 0,
                      };
                      setData({ ...data, skills });
                    }}
                  />
                </>
              )}
            </AdminDetailDrawer>
          </div>
        )}

        {tab === "experience" && (
          <div className="admin-section">
            <div className="admin-section-toolbar">
              <button
                type="button"
                className="admin-add-btn"
                onClick={() => {
                  const next = [
                    ...data.experience,
                    {
                      title: emptyLoc(),
                      period: emptyLoc(),
                      description: emptyLoc(),
                    },
                  ];
                  setData({ ...data, experience: next });
                  setSelectedIndex(next.length - 1);
                }}
              >
                Add experience
              </button>
            </div>
            <AdminListTable
              items={data.experience}
              onRowClick={setSelectedIndex}
              columns={[
                {
                  key: "title",
                  header: "Title",
                  render: (item) => item.title.en || item.title.vi || "—",
                },
                {
                  key: "period",
                  header: "Period",
                  render: (item) => item.period.en || item.period.vi || "—",
                },
                {
                  key: "desc",
                  header: "Description",
                  render: (item) =>
                    truncate(item.description.en || item.description.vi),
                },
              ]}
            />
            <AdminDetailDrawer
              open={selectedExperience !== null && selectedIndex !== null}
              title={selectedExperience?.title.en || "Experience"}
              onClose={closeDetail}
              onDelete={
                selectedIndex !== null
                  ? () => {
                      setData({
                        ...data,
                        experience: removeAt(data.experience, selectedIndex),
                      });
                      closeDetail();
                    }
                  : undefined
              }
            >
              {selectedExperience && selectedIndex !== null && (
                <>
                  <LocalizedField
                    label="Title"
                    value={selectedExperience.title}
                    onChange={(v) => {
                      const experience = [...data.experience];
                      experience[selectedIndex] = {
                        ...selectedExperience,
                        title: v,
                      };
                      setData({ ...data, experience });
                    }}
                  />
                  <LocalizedField
                    label="Period"
                    value={selectedExperience.period}
                    onChange={(v) => {
                      const experience = [...data.experience];
                      experience[selectedIndex] = {
                        ...selectedExperience,
                        period: v,
                      };
                      setData({ ...data, experience });
                    }}
                  />
                  <LocalizedField
                    label="Description"
                    value={selectedExperience.description}
                    onChange={(v) => {
                      const experience = [...data.experience];
                      experience[selectedIndex] = {
                        ...selectedExperience,
                        description: v,
                      };
                      setData({ ...data, experience });
                    }}
                    multiline
                  />
                </>
              )}
            </AdminDetailDrawer>
          </div>
        )}

        {tab === "education" && (
          <div className="admin-section">
            <div className="admin-section-toolbar">
              <button
                type="button"
                className="admin-add-btn"
                onClick={() => {
                  const next = [
                    ...data.education,
                    {
                      title: emptyLoc(),
                      period: emptyLoc(),
                      description: emptyLoc(),
                    },
                  ];
                  setData({ ...data, education: next });
                  setSelectedIndex(next.length - 1);
                }}
              >
                Add education
              </button>
            </div>
            <AdminListTable
              items={data.education}
              onRowClick={setSelectedIndex}
              columns={[
                {
                  key: "title",
                  header: "Title",
                  render: (item) => item.title.en || item.title.vi || "—",
                },
                {
                  key: "period",
                  header: "Period",
                  render: (item) => item.period.en || item.period.vi || "—",
                },
                {
                  key: "desc",
                  header: "Description",
                  render: (item) =>
                    truncate(item.description.en || item.description.vi),
                },
              ]}
            />
            <AdminDetailDrawer
              open={selectedEducation !== null && selectedIndex !== null}
              title={selectedEducation?.title.en || "Education"}
              onClose={closeDetail}
              onDelete={
                selectedIndex !== null
                  ? () => {
                      setData({
                        ...data,
                        education: removeAt(data.education, selectedIndex),
                      });
                      closeDetail();
                    }
                  : undefined
              }
            >
              {selectedEducation && selectedIndex !== null && (
                <>
                  <LocalizedField
                    label="Title"
                    value={selectedEducation.title}
                    onChange={(v) => {
                      const education = [...data.education];
                      education[selectedIndex] = {
                        ...selectedEducation,
                        title: v,
                      };
                      setData({ ...data, education });
                    }}
                  />
                  <LocalizedField
                    label="Period"
                    value={selectedEducation.period}
                    onChange={(v) => {
                      const education = [...data.education];
                      education[selectedIndex] = {
                        ...selectedEducation,
                        period: v,
                      };
                      setData({ ...data, education });
                    }}
                  />
                  <LocalizedField
                    label="Description"
                    value={selectedEducation.description}
                    onChange={(v) => {
                      const education = [...data.education];
                      education[selectedIndex] = {
                        ...selectedEducation,
                        description: v,
                      };
                      setData({ ...data, education });
                    }}
                    multiline
                  />
                </>
              )}
            </AdminDetailDrawer>
          </div>
        )}

        {tab === "testimonials" && (
          <div className="admin-section">
            <div className="admin-section-toolbar">
              <button
                type="button"
                className="admin-add-btn"
                onClick={() => {
                  const next = [
                    ...data.testimonials,
                    {
                      avatar: "",
                      name: emptyLoc(),
                      text: emptyLoc(),
                      date: new Date().toISOString().slice(0, 10),
                    },
                  ];
                  setData({ ...data, testimonials: next });
                  setSelectedIndex(next.length - 1);
                }}
              >
                Add testimonial
              </button>
            </div>
            <AdminListTable
              items={data.testimonials}
              onRowClick={setSelectedIndex}
              columns={[
                {
                  key: "avatar",
                  header: "",
                  className: "admin-table-col-thumb",
                  render: (t) => <TableThumb src={t.avatar} alt="" />,
                },
                {
                  key: "name",
                  header: "Name",
                  render: (t) => t.name.en || t.name.vi || "—",
                },
                {
                  key: "role",
                  header: "Role",
                  render: (t) => t.role?.en || t.role?.vi || "—",
                },
                {
                  key: "date",
                  header: "Date",
                  className: "admin-table-col-narrow",
                  render: (t) => t.date,
                },
              ]}
            />
            <AdminDetailDrawer
              open={selectedTestimonial !== null && selectedIndex !== null}
              title={selectedTestimonial?.name.en || "Testimonial"}
              onClose={closeDetail}
              onDelete={
                selectedIndex !== null
                  ? () => {
                      setData({
                        ...data,
                        testimonials: removeAt(
                          data.testimonials,
                          selectedIndex
                        ),
                      });
                      closeDetail();
                    }
                  : undefined
              }
            >
              {selectedTestimonial && selectedIndex !== null && authToken && (
                <>
                  <ImageUploadField
                    label="Avatar"
                    value={selectedTestimonial.avatar}
                    onChange={(v) => {
                      const testimonials = [...data.testimonials];
                      testimonials[selectedIndex] = {
                        ...selectedTestimonial,
                        avatar: v,
                      };
                      setData({ ...data, testimonials });
                    }}
                    token={authToken}
                  />
                  <LocalizedField
                    label="Name"
                    value={selectedTestimonial.name}
                    onChange={(v) => {
                      const testimonials = [...data.testimonials];
                      testimonials[selectedIndex] = {
                        ...selectedTestimonial,
                        name: v,
                      };
                      setData({ ...data, testimonials });
                    }}
                  />
                  <LocalizedField
                    label="Role"
                    value={selectedTestimonial.role ?? emptyLoc()}
                    onChange={(v) => {
                      const testimonials = [...data.testimonials];
                      testimonials[selectedIndex] = {
                        ...selectedTestimonial,
                        role: v,
                      };
                      setData({ ...data, testimonials });
                    }}
                  />
                  <LocalizedField
                    label="Text"
                    value={selectedTestimonial.text}
                    onChange={(v) => {
                      const testimonials = [...data.testimonials];
                      testimonials[selectedIndex] = {
                        ...selectedTestimonial,
                        text: v,
                      };
                      setData({ ...data, testimonials });
                    }}
                    multiline
                  />
                  <TextField
                    label="Date (ISO)"
                    value={selectedTestimonial.date}
                    onChange={(v) => {
                      const testimonials = [...data.testimonials];
                      testimonials[selectedIndex] = {
                        ...selectedTestimonial,
                        date: v,
                      };
                      setData({ ...data, testimonials });
                    }}
                  />
                </>
              )}
            </AdminDetailDrawer>
          </div>
        )}

        {tab === "blogs" && (
          <div className="admin-section">
            <div className="admin-section-toolbar">
              <button
                type="button"
                className="admin-add-btn"
                onClick={() => {
                  const next = [
                    ...data.blogs,
                    {
                      title: emptyLoc(),
                      category: emptyLoc(),
                      excerpt: emptyLoc(),
                      image: "",
                      url: "",
                      date: new Date().toISOString().slice(0, 10),
                    },
                  ];
                  setData({ ...data, blogs: next });
                  setSelectedIndex(next.length - 1);
                }}
              >
                Add blog post
              </button>
            </div>
            <AdminListTable
              items={data.blogs}
              onRowClick={setSelectedIndex}
              columns={[
                {
                  key: "image",
                  header: "",
                  className: "admin-table-col-thumb",
                  render: (p) => <TableThumb src={p.image} alt="" />,
                },
                {
                  key: "title",
                  header: "Title",
                  render: (p) => p.title.en || p.title.vi || "—",
                },
                {
                  key: "category",
                  header: "Category",
                  render: (p) => p.category.en || p.category.vi || "—",
                },
                {
                  key: "date",
                  header: "Date",
                  className: "admin-table-col-narrow",
                  render: (p) => p.date,
                },
              ]}
            />
            <AdminDetailDrawer
              open={selectedBlog !== null && selectedIndex !== null}
              title={selectedBlog?.title.en || "Blog post"}
              onClose={closeDetail}
              onDelete={
                selectedIndex !== null
                  ? () => {
                      setData({
                        ...data,
                        blogs: removeAt(data.blogs, selectedIndex),
                      });
                      closeDetail();
                    }
                  : undefined
              }
            >
              {selectedBlog && selectedIndex !== null && authToken && (
                <>
                  <LocalizedField
                    label="Title"
                    value={selectedBlog.title}
                    onChange={(v) => {
                      const blogs = [...data.blogs];
                      blogs[selectedIndex] = { ...selectedBlog, title: v };
                      setData({ ...data, blogs });
                    }}
                  />
                  <LocalizedField
                    label="Category"
                    value={selectedBlog.category}
                    onChange={(v) => {
                      const blogs = [...data.blogs];
                      blogs[selectedIndex] = { ...selectedBlog, category: v };
                      setData({ ...data, blogs });
                    }}
                  />
                  <LocalizedField
                    label="Excerpt"
                    value={selectedBlog.excerpt}
                    onChange={(v) => {
                      const blogs = [...data.blogs];
                      blogs[selectedIndex] = { ...selectedBlog, excerpt: v };
                      setData({ ...data, blogs });
                    }}
                    multiline
                  />
                  <ImageUploadField
                    label="Blog image"
                    value={selectedBlog.image}
                    onChange={(v) => {
                      const blogs = [...data.blogs];
                      blogs[selectedIndex] = { ...selectedBlog, image: v };
                      setData({ ...data, blogs });
                    }}
                    token={authToken}
                  />
                  <TextField
                    label="Post URL"
                    value={selectedBlog.url}
                    onChange={(v) => {
                      const blogs = [...data.blogs];
                      blogs[selectedIndex] = { ...selectedBlog, url: v };
                      setData({ ...data, blogs });
                    }}
                  />
                  <TextField
                    label="Date (ISO)"
                    value={selectedBlog.date}
                    onChange={(v) => {
                      const blogs = [...data.blogs];
                      blogs[selectedIndex] = { ...selectedBlog, date: v };
                      setData({ ...data, blogs });
                    }}
                  />
                </>
              )}
            </AdminDetailDrawer>
          </div>
        )}

        {tab === "clients" && (
          <div className="admin-section">
            <div className="admin-section-toolbar">
              <button
                type="button"
                className="admin-add-btn"
                onClick={() => {
                  const next = [...data.clients, { logo: "", url: "" }];
                  setData({ ...data, clients: next });
                  setSelectedIndex(next.length - 1);
                }}
              >
                Add client
              </button>
            </div>
            <AdminListTable
              items={data.clients}
              onRowClick={setSelectedIndex}
              columns={[
                {
                  key: "logo",
                  header: "",
                  className: "admin-table-col-thumb",
                  render: (c) => <TableThumb src={c.logo} alt="" />,
                },
                {
                  key: "url",
                  header: "URL",
                  render: (c) => truncate(c.url, 50),
                },
              ]}
            />
            <AdminDetailDrawer
              open={selectedClient !== null && selectedIndex !== null}
              title="Client"
              onClose={closeDetail}
              onDelete={
                selectedIndex !== null
                  ? () => {
                      setData({
                        ...data,
                        clients: removeAt(data.clients, selectedIndex),
                      });
                      closeDetail();
                    }
                  : undefined
              }
            >
              {selectedClient && selectedIndex !== null && authToken && (
                <>
                  <ImageUploadField
                    label="Client logo"
                    value={selectedClient.logo}
                    onChange={(v) => {
                      const clients = [...data.clients];
                      clients[selectedIndex] = { ...selectedClient, logo: v };
                      setData({ ...data, clients });
                    }}
                    token={authToken}
                  />
                  <TextField
                    label="URL"
                    value={selectedClient.url}
                    onChange={(v) => {
                      const clients = [...data.clients];
                      clients[selectedIndex] = { ...selectedClient, url: v };
                      setData({ ...data, clients });
                    }}
                  />
                </>
              )}
            </AdminDetailDrawer>
          </div>
        )}

        {tab === "contacts" && authToken && (
          <AdminContacts key={authToken} token={authToken} />
        )}

        {tab === "settings" && authToken && (
          <AdminSettings token={authToken} username={username} />
        )}
      </div>
    </div>
  );
}
