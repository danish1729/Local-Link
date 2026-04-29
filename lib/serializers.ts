// lib/serializers.ts

import { Types } from "mongoose";

// A type for data that is safe to pass to React components (JSON-serializable).
type Serializable =
  | string
  | number
  | boolean
  | null
  | undefined
  | Serializable[]
  | { [key: string]: Serializable };

// An approximation of a Mongoose provider document before serialization.
// In a real app, this would likely be imported from the model definition.
interface ProviderDocument {
  _id?: Types.ObjectId;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  serviceType?: string;
  hourlyRate?: number;
  bio?: string;
  rating?: number;
  completedJobs?: number;
  location?: { address?: string; type?: string; coordinates?: number[] } | string;
  languages?: string[];
  responseTime?: string;
  availability?: string;
  experience?: number;
  createdAt?: Date;
  updatedAt?: Date;
  // Allow other Mongoose properties with serializable values or common Mongoose types.
  [key: string]: Serializable | Types.ObjectId | Date | undefined;
}

// The shape of a provider object after serialization.
interface SerializedProvider {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  profileImage: string | null;
  serviceType: string;
  hourlyRate: number;
  bio: string;
  rating: number;
  completedJobs: number;
  location: string;
  languages: string[];
  responseTime: string;
  availability: string;
  experience: number;
  education: any[];
  workExperience: any[];
  certificates: any[];
  averageRating: number;
  totalReviews: number;
  reviewsReceived: any[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Safely serializes Mongoose documents and objects for use in React components
 * Handles: ObjectId, Dates, GeoJSON, nested objects, arrays
 */
export function serializeData(data: unknown): Serializable {
  if (data === null || data === undefined) {
    return data;
  }

  // Handle Mongoose ObjectId
  if (data instanceof Types.ObjectId) {
    return data.toString();
  }

  // Handle Date objects
  if (data instanceof Date) {
    return data.toISOString();
  }

  // Handle GeoJSON objects (location field)
  if (
    data &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    "type" in data &&
    "coordinates" in data
  ) {
    // Return null to avoid sending complex GeoJSON objects to the client.
    return null;
  }

  // Handle Mongoose Document (has toObject method).
  if (data && typeof data === "object" && "toObject" in data && typeof (data as { toObject: unknown }).toObject === "function") {
    // Convert Mongoose doc to a plain object, including virtuals.
    data = (data as { toObject: (options?: object) => unknown }).toObject({ virtuals: true });
  }

  // Handle Arrays by recursively serializing each item
  if (Array.isArray(data)) {
    return data.map((item) => serializeData(item));
  }

  // Handle Plain Objects
  if (data && typeof data === "object") {
    const serialized: { [key: string]: Serializable } = {};

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = (data as Record<string, unknown>)[key];

        // Skip internal Mongoose fields
        if (key === "__v" || key === "$__") {
          continue;
        }

        // Recursively serialize nested values
        serialized[key] = serializeData(value);
      }
    }

    return serialized;
  }

  // Return primitives as-is
  return data as Serializable;
}

/**
 * Deep clone and serialize - safer for nested structures
 */
export function deepSerialize(data: unknown): Serializable {
  try {
    // This is a quick way to deep clone and serialize. It handles Dates and
    // Mongoose ObjectIds (via their toJSON method), but might fail on other
    // complex types or circular references.
    const cloned = JSON.parse(JSON.stringify(data));
    // Run through our own serializer to handle any other edge cases and Mongoose specifics.
    return serializeData(cloned);
  } catch {
    // If JSON.stringify fails, fall back to our more robust serializer.
    return serializeData(data);
  }
}

/**
 * Serialize a single provider document, creating a plain object with specific fields.
 */
export function serializeProvider(provider: ProviderDocument): SerializedProvider {
  let locationString = "Pakistan";
  if (provider.location) {
    if (typeof provider.location === "string") {
      locationString = provider.location;
    } else if (typeof provider.location.address === "string") {
      locationString = provider.location.address;
    }
  }

  return {
    _id: provider._id?.toString() ?? "",
    name: provider.name ?? "",
    email: provider.email ?? "",
    phone: provider.phone ?? "",
    role: provider.role ?? "provider",
    profileImage: (provider.profileImage as string) ?? null,
    serviceType: provider.serviceType ?? "",
    hourlyRate: provider.hourlyRate ?? 0,
    bio: provider.bio ?? "",
    rating: provider.rating ?? 0,
    completedJobs: provider.completedJobs ?? 0,
    location: locationString,
    languages: Array.isArray(provider.languages)
      ? provider.languages
      : ["Urdu", "English"],
    responseTime: provider.responseTime ?? "Within 1 hour",
    availability: provider.availability ?? "Full-time",
    experience: provider.experience ?? 5,
    education: Array.isArray(provider.education) ? deepSerialize(provider.education) as any[] : [],
    workExperience: Array.isArray(provider.workExperience) ? deepSerialize(provider.workExperience) as any[] : [],
    certificates: Array.isArray(provider.certificates) ? deepSerialize(provider.certificates) as any[] : [],
    averageRating: Number(provider.averageRating ?? provider.rating ?? 0),
    totalReviews: Number(provider.totalReviews ?? provider.completedJobs ?? 0),
    reviewsReceived: Array.isArray(provider.reviewsReceived) ? deepSerialize(provider.reviewsReceived) as any[] : [],
    createdAt: provider.createdAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: provider.updatedAt?.toISOString() ?? new Date().toISOString(),
    // Do NOT include the raw location GeoJSON object
  };
}

/**
 * Serialize an array of provider documents.
 */
export function serializeProviders(providers: ProviderDocument[]): SerializedProvider[] {
  return providers.map(serializeProvider);
}
