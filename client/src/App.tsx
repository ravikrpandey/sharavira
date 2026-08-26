import { lazy, Suspense } from "react";
import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import SiteShell from "./components/SiteShell";
import Home from "./pages/Home";
import "./index.css";

const EntityPage = lazy(() => import("./pages/ContentPages").then((module) => ({ default: module.EntityPage })));
const PlatformsOverview = lazy(() => import("./pages/ContentPages").then((module) => ({ default: module.PlatformsOverview })));
const FamilyOverviewPage = lazy(() => import("./pages/ContentPages").then((module) => ({ default: module.FamilyOverviewPage })));
const StoriesPage = lazy(() => import("./pages/ContentPages").then((module) => ({ default: module.StoriesPage })));
const StoryDetailPage = lazy(() => import("./pages/ContentPages").then((module) => ({ default: module.StoryDetailPage })));
const ResourcesPage = lazy(() => import("./pages/ContentPages").then((module) => ({ default: module.ResourcesPage })));
const ResourceDetailPage = lazy(() => import("./pages/ContentPages").then((module) => ({ default: module.ResourceDetailPage })));
const SearchPage = lazy(() => import("./pages/ContentPages").then((module) => ({ default: module.SearchPage })));
const ContactPage = lazy(() => import("./pages/ContentPages").then((module) => ({ default: module.ContactPage })));
const CompanyOverview = lazy(() => import("./pages/ContentPages").then((module) => ({ default: module.CompanyOverview })));
const PrivacyPage = lazy(() => import("./pages/ContentPages").then((module) => ({ default: module.PrivacyPage })));
const NotFound = lazy(() => import("./pages/ContentPages").then((module) => ({ default: module.NotFound })));

function App() {
  const Router = import.meta.env.VITE_GITHUB_PAGES === "true" ? HashRouter : BrowserRouter;
  return <ErrorBoundary><Router><SiteShell><Suspense fallback={<div style={{ minHeight: "60vh", display: "grid", placeItems: "center", fontSize: 13 }}>Loading the next perspective…</div>}><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/platforms" element={<PlatformsOverview />} />
    <Route path="/solutions" element={<FamilyOverviewPage />} />
    <Route path="/industries" element={<FamilyOverviewPage />} />
    <Route path="/capabilities" element={<FamilyOverviewPage />} />
    <Route path="/customers" element={<StoriesPage />} />
    <Route path="/resources" element={<ResourcesPage />} />
    <Route path="/customers/stories" element={<StoriesPage />} />
    <Route path="/customers/stories/:slug" element={<StoryDetailPage />} />
    <Route path="/resources/blog" element={<ResourcesPage />} />
    <Route path="/resources/demos" element={<ResourcesPage demoLibrary />} />
    <Route path="/resources/blog/:slug" element={<ResourceDetailPage />} />
    <Route path="/search" element={<SearchPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/company" element={<CompanyOverview />} />
    <Route path="/privacy" element={<PrivacyPage />} />
    <Route path="/:family/:slug" element={<EntityPage />} />
    <Route path="*" element={<NotFound />} />
  </Routes></Suspense></SiteShell></Router></ErrorBoundary>;
}

export default App;
