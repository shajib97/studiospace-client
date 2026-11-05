"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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

interface DeleteStudioButtonProps {
  studioId: string;
  title: string;
}

export default function DeleteStudioButton({
  studioId,
  title,
}: DeleteStudioButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (deleting) return;

    setDeleting(true);

    try {
      const response = await fetch(
        `/api/studios/${encodeURIComponent(studioId)}`,
        { method: "DELETE" },
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Unable to delete the studio.");
        return;
      }

      setOpen(false);
      toast.success("Studio deleted.");
      router.refresh();
    } catch {
      toast.error("Unable to delete the studio. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(value) => {
        if (!deleting) setOpen(value);
      }}
    >
      <AlertDialogTrigger render={<Button variant="outline" />}>
        Delete
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this studio?</AlertDialogTitle>
          <AlertDialogDescription>
            “{title}” will be permanently removed from your listings.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>

          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete Studio"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
