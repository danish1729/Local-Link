import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { connectDB } from "./db";
import User from "@/models/User";

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

    // 4. Fetch fresh user data from DB to ensure role/status are never stale
    await connectDB();
    const user = await User.findById(payload.userId).lean();

    if (!user) {
      return null;
    }

    // 5. Return the fresh user data
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage || null,
      providerStatus: user.providerStatus || "none"
    };
  } catch (error) {
    // If token is invalid or expired, return null
    return null;
  }
}
