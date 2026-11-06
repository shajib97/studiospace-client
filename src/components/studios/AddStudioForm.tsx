"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { StudioDetails } from "@/types/studio";

const categories = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
];

const textFields = [
  { name: "title", label: "Studio title" },
  { name: "location", label: "Location or address" },
] as const;

const numberFields = [
  { name: "hourlyRate", label: "Hourly rate (USD)", min: 0.01, step: 0.01 },
  { name: "securityDeposit", label: "Deposit (USD)", min: 0, step: 0.01 },
  { name: "maxCapacity", label: "Maximum capacity", min: 1, step: 1 },
] as const;

interface AddStudioFormProps {
  ownerName: string;
  ownerEmail: string;
  studio?: StudioDetails;
}

export default function AddStudioForm({
  ownerName,
  ownerEmail,
  studio,
}: AddStudioFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    const form = new FormData(event.currentTarget);
    const image = form.get("image");
    const photo = image instanceof File && image.size > 0 ? image : null;

    if (!studio && !photo) {
      toast.error("Choose a studio photo.");
      return;
    }

    if (photo && photo.size > 4 * 1024 * 1024) {
      toast.error("Choose a photo up to 4 MB.");
      return;
    }

    setSaving(true);

    try {
      let imageUrl: string | undefined;

      if (photo) {
        const photoData = new FormData();
        photoData.append("image", photo);

        const uploadResponse = await fetch("/api/upload-image", {
          method: "POST",
          body: photoData,
        });

        const upload = await uploadResponse.json();

        if (!uploadResponse.ok || typeof upload.imageUrl !== "string") {
          toast.error(upload.message || "Photo upload failed.");
          return;
        }

        imageUrl = upload.imageUrl;
      }

      if (!studio) {
        const tokenResponse = await fetch("/api/session/token", {
          method: "POST",
        });

        if (!tokenResponse.ok) {
          toast.error("Unable to verify your session. Please log in again.");
          return;
        }
      }

      const studioData = {
        title: String(form.get("title") ?? "").trim(),
        category: String(form.get("category") ?? ""),
        hourlyRate: Number(form.get("hourlyRate")),
        securityDeposit: Number(form.get("securityDeposit")),
        maxCapacity: Number(form.get("maxCapacity")),
        location: String(form.get("location") ?? "").trim(),
        amenities: String(form.get("amenities") ?? "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        overview: String(form.get("overview") ?? "").trim(),
        imageUrl,
      };

      const url = studio
        ? `/api/studios/${encodeURIComponent(studio._id)}`
        : "/api/studios";

      const response = await fetch(url, {
        method: studio ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studioData),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Unable to save the studio.");
        return;
      }

      toast.success(studio ? "Studio updated." : "Studio added successfully.");
      router.push("/my-listings");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 rounded-3xl border border-border bg-card p-6 md:p-8"
    >
      <fieldset disabled={saving} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="ownerName">Host name</Label>
            <Input id="ownerName" value={ownerName} readOnly />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerEmail">Host email</Label>
            <Input id="ownerEmail" value={ownerEmail} readOnly />
          </div>
        </div>

        {textFields.map((field) => (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              name={field.name}
              defaultValue={studio?.[field.name]}
              required
            />
          </div>
        ))}

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            defaultValue={studio?.category ?? ""}
            required
            className="w-full rounded-lg border border-input bg-background px-3 py-2"
          >
            <option value="" disabled>
              Choose a category
            </option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {numberFields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                min={field.min}
                step={field.step}
                defaultValue={studio?.[field.name]}
                required
              />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Studio photo</Label>
          <Input
            id="image"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required={!studio}
          />
          <p className="text-xs text-muted-foreground">
            {studio
              ? "Leave this blank to keep the current photo."
              : "JPG, PNG, or WebP. Up to 4 MB."}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amenities">Amenities</Label>
          <Input
            id="amenities"
            name="amenities"
            defaultValue={studio?.amenities?.join(", ")}
            placeholder="Wi-Fi, Parking, Studio Lighting"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="overview">Studio overview</Label>
          <textarea
            id="overview"
            name="overview"
            rows={5}
            defaultValue={studio?.overview}
            required
            className="w-full rounded-lg border border-input bg-background px-3 py-2"
          />
        </div>

        <Button
          type="submit"
          className="rounded-full bg-red-600 px-7 text-white hover:bg-red-700"
        >
          {saving ? "Saving studio..." : studio ? "Save Changes" : "Add Studio"}
        </Button>
      </fieldset>
    </form>
  );
}
