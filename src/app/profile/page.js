"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "../PageHeader";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";
import Card from "../components/Card";
import { getCurrentUser, logout, updateProfile } from "../../lib/session";
import { courts } from "../../data/courts";

const AVAILABILITY_OPTIONS = [
  "Active",
  "Injured",
  "Away",
  "Unavailable",
  "University",
];

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
  const [editPhotoBase64, setEditPhotoBase64] = useState("");

  const loadUser = () => {
    getCurrentUser().then((u) => {
      setUser(u);
      const p = u?.currentUserProfile || {};
      setEditAvailability(p.availability || "Active");
      setEditReturnDate(p.returnDate || "");
      setEditPreferredCourts(p.preferredCourts || []);
      setEditWhatsapp(p.whatsapp || "");
      setEditPhotoBase64(p.photoBase64 || "");
      setLoading(false);
    });
  };

  useEffect(() => {
    loadUser();
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
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/15"
            >
              Edit
            </button>
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
            {profile.whatsapp && (
              <div className="border-t border-border-subtle px-4 py-4">
                <p className="mb-1 text-xs font-medium text-muted">WhatsApp</p>
                <p className="break-words text-sm text-text">{profile.whatsapp}</p>
              </div>
            )}

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
