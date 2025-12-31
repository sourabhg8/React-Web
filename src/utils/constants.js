// API Base URL
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Token storage key
export const TOKEN_KEY = "auth_token";

// User roles/types
export const ROLES = {
  PLATFORM_ADMIN: "platform_admin",
  ORG_ADMIN: "org_admin",
  ORG_USER: "org_user",
};

// Public routes that don't require authentication
export const PUBLIC_ROUTES = ["/", "/home"];

// API endpoints that don't require token
export const PUBLIC_API_ENDPOINTS = ["/auth/login", "/auth/register"];

// Route paths
export const ROUTES = {
  HOME: "/",
  ALL_ORGANISATIONS: "/admin/organisations",
  USERS: "/users",
  SEARCH: "/search",
};
