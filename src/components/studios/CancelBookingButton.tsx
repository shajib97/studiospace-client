"use client";

import { useState } from "react";
import { toast } from "sonner";
import { cancelBooking } from "@/app/my-bookings/actions";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function CancelBookingButton({
  bookingId,
}: {
  bookingId: string;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleCancel() {
    setSaving(true);

    try {
      const result = await cancelBooking(bookingId);

      if (!result.success) {
        toast.error(result.message || "Unable to cancel the booking.");
        return;
      }

      setOpen(false);
      toast.success("Booking cancelled.");
    } catch {
      toast.error("Unable to cancel the booking. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(value) => {
        if (!saving) setOpen(value);
      }}
    >
      <AlertDialogTrigger render={<Button variant="outline" />}>
        Cancel Booking
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
          <AlertDialogDescription>
            The host will no longer be able to confirm this request.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={saving}>Keep Booking</AlertDialogCancel>

          <Button
            type="button"
            variant="destructive"
            onClick={handleCancel}
            disabled={saving}
          >
            {saving ? "Cancelling..." : "Yes, Cancel Booking"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
