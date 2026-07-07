import { createFileRoute } from "@tanstack/react-router";
import App from "@/App";

// Splat route: delegate all URLs to the React Router DOM tree inside App.
export const Route = createFileRoute("/$")({
  component: App,
});
