"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";
import SectionTitle from "../components/SectionTitle";
import { getSession, setOnboarded } from "../../lib/session";
import { courts } from "../../data/courts";

const AVAILABILITY_OPTIONS = [
  "Active",
  "Injured",
  "Away",
  "Unavailable",
  "University",
];

export default function OnboardingPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Step 1
  const [photoBase64, setPhotoBase64] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationality, setNationality] = useState("");

  // Step 2
  const [handedness, setHandedness] = useState("");
  const [backhand, setBackhand] = useState("");
  const [ltaNumber, setLtaNumber] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");

  // Step 3
  const [courtSearch, setCourtSearch] = useState("");
  const [selectedCourts, setSelectedCourts] = useState([]);
  const [availability, setAvailability] = useState("Active");
  const [returnDate, setReturnDate] = useState("");

  useEffect(() => {
    getSession().then((s) => {
      if (!s.sessionUserId) {
        router.replace("/login");
        return;
      }
      if (s.onboarded) {
        router.replace("/ladder");
        return;
      }
      setLoading(false);
    });
  }, [router]);

  const filteredCourts = courtSearch.trim()
    ? courts.filter((c) =>
        c.toLowerCase().includes(courtSearch.trim().toLowerCase())
      )
    : courts;

  const toggleCourt = (court) => {
    setSelectedCourts((prev) =>
      prev.includes(court) ? prev.filter((c) => c !== court) : [...prev, court]
    );
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoBase64(reader.result || "");
    reader.readAsDataURL(file);
  };

  const canNextStep1 = firstName.trim() && lastName.trim();
  const canNextStep2 = handedness && backhand;
  const canNextStep3 = selectedCourts.length > 0 && availability;
  const showReturnDate = availability && availability !== "Active";

  const handleNext = () => {
    setError("");
    if (step === 1 && !canNextStep1) {
      setError("First name and last name are required");
      return;
    }
    if (step === 2 && !canNextStep2) {
      setError("Handedness and backhand are required");
      return;
    }
    if (step === 3) {
      if (!canNextStep3) {
        setError("Select at least one court and availability");
        return;
      }
      setSubmitting(true);
      const profile = {
        photoBase64: photoBase64 || null,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        nationality: nationality.trim() || null,
        handedness,
        backhand,
        ltaNumber: ltaNumber.trim() || null,
        whatsapp: whatsapp.trim() || null,
        instagram: instagram.trim() || null,
        preferredCourts: selectedCourts,
        availability,
        returnDate: showReturnDate ? returnDate.trim() || null : null,
      };
      setOnboarded(profile).then(() => {
        setSubmitting(false);
        router.replace("/ladder");
      });
      return;
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setError("");
    if (step > 1) setStep((s) => s - 1);
  };

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <p className="text-sm text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background px-4 pt-[env(safe-area-inset-top)] pb-8">
      <div className="mx-auto w-full max-w-sm flex-1">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 pt-8 pb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full ${
                s === step ? "bg-primary" : s < step ? "bg-primary/50" : "bg-border"
              }`}
            />
          ))}
        </div>

        <h1 className="text-xl font-bold text-text">
          {step === 1 && "Identity"}
          {step === 2 && "Tennis"}
          {step === 3 && "Preferences"}
        </h1>
        <p className="mt-1 text-sm text-muted">
          Step {step} of 3
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-danger/50 bg-danger-muted px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-4">
          {step === 1 && (
            <>
              <div>
                <SectionTitle className="mb-2">Profile photo</SectionTitle>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-card text-muted"
                  >
                    {photoBase64 ? (
                      <img
                        src={photoBase64}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs">Add</span>
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                  <p className="text-xs text-muted">Optional</p>
                </div>
              </div>
              <Input
                id="firstName"
                label="First name *"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
              />
              <Input
                id="lastName"
                label="Last name *"
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
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <SectionTitle className="mb-2">Handedness *</SectionTitle>
                <div className="flex gap-2">
                  {["Left", "Right"].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setHandedness(h)}
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
                <SectionTitle className="mb-2">Backhand *</SectionTitle>
                <div className="flex gap-2">
                  {["1H", "2H"].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBackhand(b)}
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
                label="LTA number (optional)"
                value={ltaNumber}
                onChange={(e) => setLtaNumber(e.target.value)}
                placeholder="e.g. 12345678"
              />
              <Input
                id="whatsapp"
                label="WhatsApp (optional)"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Phone or link"
              />
              <Input
                id="instagram"
                label="Instagram (optional)"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="Username (e.g. @username or username)"
              />
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <Input
                  id="courtSearch"
                  label="Preferred courts *"
                  value={courtSearch}
                  onChange={(e) => setCourtSearch(e.target.value)}
                  placeholder="Search courts..."
                  className="mb-3"
                />
                <div className="max-h-32 overflow-y-auto rounded-lg border border-border bg-card/50 p-2">
                  {filteredCourts.map((court) => (
                    <button
                      key={court}
                      type="button"
                      onClick={() => toggleCourt(court)}
                      className={`mb-1 block w-full rounded px-3 py-2 text-left text-sm break-words ${
                        selectedCourts.includes(court)
                          ? "bg-primary/20 text-primary"
                          : "text-text"
                      }`}
                    >
                      {court}
                      {selectedCourts.includes(court) ? " ✓" : ""}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted">
                  Selected: {selectedCourts.length} court(s)
                </p>
              </div>
              <Select
                id="availability"
                label="Availability status *"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                options={AVAILABILITY_OPTIONS.map((opt) => ({ value: opt, label: opt }))}
              />
              {showReturnDate && (
                <Input
                  id="returnDate"
                  label="Return date"
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
              )}
            </>
          )}
        </div>

        <div className="mt-8 flex gap-3">
          {step > 1 ? (
            <Button
              type="button"
              variant="secondary"
              className="w-auto"
              onClick={handleBack}
            >
              Back
            </Button>
          ) : (
            <Button href="/login" variant="secondary" className="flex-1">
              Cancel
            </Button>
          )}
          <Button
            type="button"
            className="flex-1"
            onClick={handleNext}
            disabled={
              (step === 1 && !canNextStep1) ||
              (step === 2 && !canNextStep2) ||
              (step === 3 && (!canNextStep3 || submitting))
            }
          >
            {step === 3 ? (submitting ? "Saving..." : "Finish") : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
