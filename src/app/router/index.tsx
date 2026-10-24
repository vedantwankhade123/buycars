/* eslint-disable react-refresh/only-export-components -- route configuration module, not a component module */
import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";

const HomePage = lazy(() => import("@/pages/HomePage"));
const PrivacyPage = lazy(() => import("@/pages/PrivacyPage"));
const TermsPage = lazy(() => import("@/pages/TermsPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

/**
 * Only routes that resolve to a real page are registered. /cars, /cars/:carId, /login,
 * /wishlist, /my-inquiries, /profile, /settings, /seller/* and /admin/* are added by the
 * phases that implement them, so no link in the app can currently land on a 404.
 */
export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/privacy", element: <PrivacyPage /> },
      { path: "/terms", element: <TermsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
