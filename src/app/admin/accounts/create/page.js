"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { addPreCreatedAccount } from "../../../../lib/userStore";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import Select from "../../../components/Select";

const AVAILABILITY_OPTIONS = [
  { value: "", label: "Not set" },
  { value: "Active", label: "Active" },
  { value: "Injured", label: "Injured" },
  { value: "Away", label: "Away" },
  { value: "Unavailable", label: "Unavailable" },
  { value: "University", label: "University" },
];

export default function AdminCreateAccountPage() {
  const router = useRouter();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationality, setNationality] = useState("");
  const [handedness, setHandedness] = useState("");
  const [backhand, setBackhand] = useState("");
  const [ltaNumber, setLtaNumber] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [availability, setAvailability] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const email = (emailOrPhone || "").trim();
    if (!email) {
      setError("Email or phone is required");
      return;
    }
    setSubmitting(true);
    const profile = {
      firstName: (firstName || "").trim() || null,
      lastName: (lastName || "").trim() || null,
      nationality: (nationality || "").trim() || null,
      handedness: (handedness || "").trim() || null,
      backhand: (backhand || "").trim() || null,
      ltaNumber: (ltaNumber || "").trim() || null,
      whatsapp: (whatsapp || "").trim() || null,
      instagram: (instagram || "").trim() || null,
      availability: (availability || "").trim() || null,
      preferredCourts: [],
      returnDate: null,
      photoBase64: null,
    };
    addPreCreatedAccount({ emailOrPhone: email, profile })
      .then(() => {
        setSubmitting(false);
        setSuccess(true);
        setTimeout(() => router.push("/admin/dashboard"), 1500);
      })
      .catch((err) => {
        setSubmitting(false);
        setError(err?.message || "Failed to create account");
      });
  };

  if (success) {
    return (
      <div className="p-4">
        <div className="rounded-lg border border-success/40 bg-success-muted px-4 py-3 text-sm text-success">
          Account created. When the user signs up with that email/phone they will
          continue with this profile. Redirecting...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center gap-2">
        <Link
          href="/admin/dashboard"
          className="rounded-full p-1.5 text-muted hover:bg-card hover:text-text"
          aria-label="Back"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <h1 className="text-xl font-semibold text-text">Create account</h1>
      </div>
      <p className="mb-4 text-sm text-muted">
        Add a player by email or phone. When they sign up with the same
        email/phone they will continue with this profile (no duplicate
        onboarding).
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-danger/50 bg-danger-muted px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        <Input
          id="emailOrPhone"
          label="Email or phone *"
          type="text"
          inputMode="email"
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
          placeholder="player@example.com or +44..."
          required
        />

        <Input
          id="firstName"
          label="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First name"
        />

        <Input
          id="lastName"
          label="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last name"
        />

        <Input
          id="nationality"
          label="Nationality"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          placeholder="e.g. British"
        />

        <div>
          <label className="mb-1 block text-sm font-medium text-muted">
            Handedness
          </label>
          <div className="flex gap-2">
            {["Left", "Right"].map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setHandedness(handedness === h ? "" : h)}
                className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                  handedness === h
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-border bg-card text-muted"
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-muted">
            Backhand
          </label>
          <div className="flex gap-2">
            {["1H", "2H"].map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBackhand(backhand === b ? "" : b)}
                className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                  backhand === b
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-border bg-card text-muted"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <Input
          id="ltaNumber"
          label="LTA number"
          value={ltaNumber}
          onChange={(e) => setLtaNumber(e.target.value)}
          placeholder="e.g. 12345678"
        />

        <Input
          id="whatsapp"
          label="WhatsApp"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="Phone or link"
        />

        <Input
          id="instagram"
          label="Instagram"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          placeholder="Username"
        />

        <Select
          id="availability"
          label="Availability"
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          options={AVAILABILITY_OPTIONS}
        />

        <Button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create account"}
        </Button>
      </form>
    </div>
  );
}
