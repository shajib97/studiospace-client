"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { createApiToken } from "@/lib/api-token";

export async function cancelBooking(bookingId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, message: "Please log in to cancel a booking." };
    }

    const token = await createApiToken(session.user.id);
    const origin = new URL(process.env.BETTER_AUTH_URL!).origin;

    const response = await fetch(
      `${process.env.API_URL}/api/bookings/${encodeURIComponent(bookingId)}/cancel`,
      {
        method: "PATCH",
        headers: {
          Origin: origin,
          Cookie: `studiospace_api_token=${token}`,
        },
      },
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Unable to cancel the booking.",
      };
    }

    revalidatePath("/my-bookings");
    return { success: true };
  } catch {
    return {
      success: false,
      message: "Unable to cancel the booking. Please try again.",
    };
  }
}