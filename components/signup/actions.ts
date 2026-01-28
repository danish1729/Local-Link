"use server";

export async function signupAction(formData: FormData) {
  try {
    const payload = Object.fromEntries(formData.entries());

    const res = await fetch("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        latitude: Number(payload.latitude),
        longitude: Number(payload.longitude),
        hourlyRate: payload.hourlyRate ? Number(payload.hourlyRate) : undefined,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      return { error: data.message || "Signup failed" };
    }

    return { success: true };
  } catch {
    return { error: "Something went wrong" };
  }
}
