import { Role } from "@prisma/client";

export type PropertyType =
  | "house"
  | "apartment"
  | "villa"
  | "land"
  | "commercial";
export type ListingType = "sale" | "rent";

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  type: PropertyType;
  listingType: ListingType;
  location: string;
  city: string;
  country: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  features: string[];
  images: string[];
  isFeatured: boolean;
  isNew: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  password: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  image: string;
  completionDate: string;
  features: string[];
}
