"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "../PageHeader";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";
import Card from "../components/Card";
import { getCurrentUser, logout, updateProfile } from "../../lib/session";
import { getStoredTheme, setTheme, THEME_IDS, THEME_LABELS } from "../../lib/theme";
import { courts } from "../../data/courts";

const AVAILABILITY_OPTIONS = [
  "Active",
  "Injured",
  "Away",
  "Unavailable",
  "University",
];

function formatWhatsAppUrl(value) {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("wa.me/")) {
    return trimmed.startsWith("wa.me/") ? `https://${trimmed}` : trimmed;
  }
  const cleaned = trimmed.replace(/[\s\-\(\)]/g, "");
  const digits = cleaned.replace(/[^\d+]/g, "");
  if (digits.length > 0) {
    return `https://wa.me/${digits}`;
  }
  return null;
}

function formatInstagramUrl(value) {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.includes("instagram.com/")) {
    if (trimmed.includes("instagram.com/")) {
      return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
    }
    return trimmed;
  }
  const username = trimmed.replace(/^@/, "").replace(/\s/g, "");
  if (username.length > 0) {
    return `https://instagram.com/${username}`;
  }
  return null;
}

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editAvailability, setEditAvailability] = useState("Active");
  const [editReturnDate, setEditReturnDate] = useState("");
  const [editPreferredCourts, setEditPreferredCourts] = useState([]);
  const [editCourtSearch, setEditCourtSearch] = useState("");
  const [editWhatsapp, setEditWhatsapp] = useState("");
  const [editInstagram, setEditInstagram] = useState("");
  const [editPhotoBase64, setEditPhotoBase64] = useState("");
  const [colorScheme, setColorScheme] = useState("dark");

  const loadUser = () => {
    getCurrentUser().then((u) => {
      setUser(u);
      const p = u?.currentUserProfile || {};
      setEditAvailability(p.availability || "Active");
      setEditReturnDate(p.returnDate || "");
      setEditPreferredCourts(p.preferredCourts || []);
      setEditWhatsapp(p.whatsapp || "");
      setEditInstagram(p.instagram || "");
      setEditPhotoBase64(p.photoBase64 || "");
      setLoading(false);
    });
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    setColorScheme(getStoredTheme());
  }, []);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const toggleCourt = (court) => {
    setEditPreferredCourts((prev) =>
      prev.includes(court) ? prev.filter((c) => c !== court) : [...prev, court]
    );
  };

  const filteredCourts = editCourtSearch.trim()
    ? courts.filter((c) =>
        c.toLowerCase().includes(editCourtSearch.trim().toLowerCase())
      )
    : courts;

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setEditPhotoBase64(reader.result || "");
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setSaving(true);
    updateProfile({
      availability: editAvailability,
      returnDate: editReturnDate || null,
      preferredCourts: editPreferredCourts,
      whatsapp: editWhatsapp.trim() || null,
      instagram: editInstagram.trim() || null,
      photoBase64: editPhotoBase64 || null,
    }).then(() => {
      setSaving(false);
      setEditing(false);
      loadUser();
    });
  };

  if (loading) {
    return (
      <div className="flex h-full flex-col bg-background">
        <PageHeader title="Profile" />
        <div className="flex flex-1 items-center justify-center px-4 py-8">
          <p className="text-sm text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  const profile = user?.currentUserProfile || {};
  const displayName =
    profile.firstName != null && profile.lastName != null
      ? `${profile.firstName} ${profile.lastName}`.trim() || "Profile"
      : "Profile";

  const statusClasses =
    (editing ? editAvailability : profile.availability) === "Active"
      ? "border-success/40 bg-success-muted text-success"
      : "border-border bg-card-elevated text-muted";

  const availabilityLabel = editing ? editAvailability : profile.availability || "—";

  return (
    <div className="flex h-full flex-col bg-background">
      <PageHeader
        title={displayName}
        titleRight={
          editing ? (
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-card hover:text-text"
            >
              Cancel
            </button>
          ) : (
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => document.getElementById("profile-settings")?.scrollIntoView({ behavior: "smooth" })}
                className="rounded-xl p-2 text-muted transition-colors hover:bg-card-elevated hover:text-text"
                aria-label="Settings"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/15"
              >
                Edit
              </button>
            </div>
          )
        }
      />

      <div className="flex-1 overflow-y-auto">
        {/* Profile Header - same layout as /player/[id] */}
        <div className="border-b border-border-subtle bg-card-elevated px-4 py-6">
          <div className="flex items-center gap-4">
            {editing ? (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-dashed border-border bg-card"
                >
                  {(editing ? editPhotoBase64 : profile.photoBase64) ? (
                    <img
                      src={editing ? editPhotoBase64 : profile.photoBase64}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-xs text-muted">
                      Add
                    </span>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </>
            ) : (profile.photoBase64 || editPhotoBase64) ? (
              <img
                src={profile.photoBase64 || editPhotoBase64}
                alt="Profile"
                className="h-16 w-16 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold uppercase text-primary-text">
                {profile.firstName?.[0] || profile.lastName?.[0] || "?"}
              </div>
            )}
            <div className="min-w-0 flex-1">
              {editing && (profile.firstName != null || profile.lastName != null) ? (
                <p className="min-w-0 break-words text-xl font-semibold text-text">
                  {profile.firstName} {profile.lastName}
                </p>
              ) : (
                <h2 className="min-w-0 break-words text-xl font-semibold text-text">
                  {displayName}
                </h2>
              )}
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusClasses}`}
                >
                  {availabilityLabel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {editing ? (
          <div className="space-y-4 px-4 py-4">
            <Select
              id="availability"
              label="Availability"
              value={editAvailability}
              onChange={(e) => setEditAvailability(e.target.value)}
              options={AVAILABILITY_OPTIONS.map((opt) => ({ value: opt, label: opt }))}
            />
            {editAvailability !== "Active" && (
              <Input
                id="returnDate"
                label="Return date"
                type="date"
                value={editReturnDate}
                onChange={(e) => setEditReturnDate(e.target.value)}
              />
            )}
            <div>
              <Input
                id="courtSearch"
                label="Preferred courts"
                value={editCourtSearch}
                onChange={(e) => setEditCourtSearch(e.target.value)}
                placeholder="Search courts..."
                className="mb-2"
              />
              <div className="max-h-28 overflow-y-auto rounded-lg border border-border bg-card/50 p-2">
                {filteredCourts.map((court) => (
                  <button
                    key={court}
                    type="button"
                    onClick={() => toggleCourt(court)}
                    className={`mb-1 block w-full rounded px-3 py-2 text-left text-sm ${
                      editPreferredCourts.includes(court)
                        ? "bg-primary/20 text-primary"
                        : "text-muted"
                    }`}
                  >
                    {court}
                    {editPreferredCourts.includes(court) ? " ✓" : ""}
                  </button>
                ))}
              </div>
            </div>
            <Input
              id="whatsapp"
              label="WhatsApp"
              value={editWhatsapp}
              onChange={(e) => setEditWhatsapp(e.target.value)}
              placeholder="Phone or link"
            />
            <Input
              id="instagram"
              label="Instagram"
              value={editInstagram}
              onChange={(e) => setEditInstagram(e.target.value)}
              placeholder="Username (e.g. @username or username)"
            />
            <Button
              type="button"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        ) : (
          <>
            {profile.firstName != null && profile.lastName != null && (
              <div className="border-t border-border-subtle px-4 py-4">
                <p className="mb-1 text-xs font-medium text-muted">Name</p>
                <p className="break-words text-sm text-text">
                  {profile.firstName} {profile.lastName}
                </p>
              </div>
            )}
            {profile.nationality && (
              <div className="border-t border-border-subtle px-4 py-4">
                <p className="mb-1 text-xs font-medium text-muted">Nationality</p>
                <p className="break-words text-sm text-text">{profile.nationality}</p>
              </div>
            )}
            {(profile.handedness || profile.backhand) && (
              <div className="border-t border-border-subtle px-4 py-4">
                <p className="mb-1 text-xs font-medium text-muted">Tennis</p>
                <p className="break-words text-sm text-text">
                  {profile.handedness} hand · {profile.backhand} backhand
                </p>
              </div>
            )}
            <div className="border-t border-border-subtle px-4 py-4">
              <p className="mb-1 text-xs font-medium text-muted">Availability</p>
              <p className="text-sm text-text">{profile.availability || "—"}</p>
              {profile.returnDate && profile.availability !== "Active" && (
                <p className="mt-1 text-xs text-muted">
                  Return: {profile.returnDate}
                </p>
              )}
            </div>
            {profile.preferredCourts?.length > 0 && (
              <div className="border-t border-border-subtle px-4 py-4">
                <p className="mb-1 text-xs font-medium text-muted">Preferred courts</p>
                <p className="break-words text-sm text-text">
                  {profile.preferredCourts.join(", ")}
                </p>
              </div>
            )}
            {(profile.whatsapp || profile.instagram) && (
              <div className="border-t border-border-subtle px-4 py-4">
                <p className="mb-2 text-xs font-medium text-muted">Social media</p>
                <div className="flex flex-col gap-2">
                  {profile.whatsapp && formatWhatsAppUrl(profile.whatsapp) && (
                    <a
                      href={formatWhatsAppUrl(profile.whatsapp)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-text transition-colors hover:bg-card-elevated active:bg-card"
                    >
                      <svg
                        className="h-5 w-5 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      <span>WhatsApp</span>
                    </a>
                  )}
                  {profile.instagram && formatInstagramUrl(profile.instagram) && (
                    <a
                      href={formatInstagramUrl(profile.instagram)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-text transition-colors hover:bg-card-elevated active:bg-card"
                    >
                      <svg
                        className="h-5 w-5 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      <span>Instagram</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            <div id="profile-settings" className="border-t border-border-subtle px-4 py-4">
              <p className="mb-2 text-xs font-medium text-muted">Settings</p>
              <p className="mb-3 text-sm text-text">Color scheme</p>
              <div className="flex flex-wrap gap-2">
                {THEME_IDS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setTheme(id);
                      setColorScheme(id);
                    }}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                      colorScheme === id
                        ? "border-primary bg-primary text-primary-text"
                        : "border-border bg-card text-text hover:bg-card-elevated"
                    }`}
                  >
                    {THEME_LABELS[id]}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-border-subtle p-4 pb-8">
              <Button type="button" variant="secondary" onClick={handleLogout}>
                Log out
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
