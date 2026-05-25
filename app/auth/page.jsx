import Auth from "../../src/auth/Auth.jsx";
import { buildMetadata } from "../../src/seo/metadata.js";

export const metadata = buildMetadata({
  title: "Sign in to Blogscape",
  description: "Access your Blogscape account to write, publish, and manage blog posts.",
  path: "/auth",
  index: false,
  follow: false,
});

export default function AuthPage() {
  return <Auth />;
}
