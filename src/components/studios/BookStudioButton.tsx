"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface BookStudioButtonProps {
  studioId: string;
  title: string;
}

export default function BookStudioButton({
  studioId,
  title,
}: BookStudioButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    const form = new FormData(event.currentTarget);
    const start = new Date(String(form.get("startTime") ?? ""));
    const end = new Date(String(form.get("endTime") ?? ""));

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      start.getTime() <= Date.now() ||
      end.getTime() <= start.getTime()
    ) {
      toast.error("Choose a future start time and an end time after it.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studioId,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
        }),
      });

      if (response.status === 401) {
        toast.info("Please log in to book a studio.");
        router.push(
          `/login?next=${encodeURIComponent(`/studios/${studioId}`)}`,
        );
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Unable to submit the booking.");
        return;
      }

      setOpen(false);
      toast.success("Booking requested. Waiting for host confirmation.");
    } catch {
      toast.error("Unable to submit the booking. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!saving) setOpen(value);
      }}
    >
      <DialogTrigger
        render={
          <Button className="mt-7 w-full rounded-full bg-red-600 text-white hover:bg-red-700" />
        }
      >
        Book Workspace Now
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book {title}</DialogTitle>
          <DialogDescription>
            Choose a start and end time in your device’s time zone. The host
            will review your request.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleBooking}>
          <fieldset disabled={saving} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start time</Label>
              <Input
                id="startTime"
                name="startTime"
                type="datetime-local"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End time</Label>
              <Input
                id="endTime"
                name="endTime"
                type="datetime-local"
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="submit"
                className="bg-red-600 text-white hover:bg-red-700"
              >
                {saving ? "Sending request..." : "Request Booking"}
              </Button>
            </DialogFooter>
          </fieldset>
        </form>
      </DialogContent>
    </Dialog>
  );
}
