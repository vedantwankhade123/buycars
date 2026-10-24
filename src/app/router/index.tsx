/* eslint-disable react-refresh/only-export-components -- route configuration module, not a component module */
import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";

const HomePage = lazy(() => import("@/pages/HomePage"));
const PrivacyPage = lazy(() => import("@/pages/PrivacyPage"));
const TermsPage = lazy(() => import("@/pages/TermsPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

const CatalogPage = lazy(() => import("@/pages/CatalogPage"));
const CarDetailPage = lazy(() => import("@/pages/CarDetailPage"));
const SellPage = lazy(() => import("@/pages/SellPage"));
const SellerPage = lazy(() => import("@/pages/SellerPage"));
const AccountPage = lazy(() => import("@/pages/AccountPage"));
const InquiriesPage = lazy(() => import("@/pages/InquiriesPage"));
const WishlistPage = lazy(() => import("@/pages/WishlistPage"));
/** Public marketplace and authenticated account workspaces. */
export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/cars", element: <CatalogPage /> },
      { path: "/cars/:carId", element: <CarDetailPage /> },
      { path: "/sell", element: <SellPage /> },
      { path: "/seller", element: <SellerPage /> },
      { path: "/account", element: <AccountPage /> },
      { path: "/settings", element: <AccountPage /> },
      { path: "/wishlist", element: <WishlistPage /> },
      { path: "/inquiries", element: <InquiriesPage /> },
      { path: "/privacy", element: <PrivacyPage /> },
      { path: "/terms", element: <TermsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
