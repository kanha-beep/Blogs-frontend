import "bootstrap/dist/css/bootstrap.min.css";
import "../src/index.css";
import { Suspense } from "react";
import Providers from "./providers.jsx";

export const metadata = {
  title: "Blogscape",
  description: "Modern publishing blog platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={null}>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
