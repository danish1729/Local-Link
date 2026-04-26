import { cookies } from "next/headers";
import { jwtVerify } from "jose";

// Ensure this matches your .env
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function getAuthUser() {
  try {
    // 1. Get the cookie store
    const cookieStore = await cookies();

    // 2. IMPORTANT: Look for "auth_token", not "token"
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return null;
    }

    // 3. Verify the token
    const { payload } = await jwtVerify(token, JWT_SECRET);

    console.log(payload.name)

    // 4. Return the user data
    return {
      _id: payload.userId as string,
      name: payload.name as string, // Ensure your Login API puts 'name' in the token, or fetch it from DB here
      email: payload.email as string,
      role: payload.role as string,
      // If profileImage isn't in the token, you might want to fetch the full user from DB here
      // But for the header, basic info is usually enough.
      // If you need the image and it's not in the token, let me know!
    };
  } catch (error) {
    // If token is invalid or expired, return null
    return null;
  }
}
