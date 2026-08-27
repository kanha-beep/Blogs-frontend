import { absoluteUrl, buildPageTitle, siteConfig } from "./site.js";

export function buildMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  keywords = [],
  image = siteConfig.socialImagePath,
  type = "website",
  index = true,
  follow = true,
  canonical,
}) {
  const resolvedTitle = title || siteConfig.defaultTitle;
  const canonicalPath = canonical || path;
  const mergedKeywords = [...siteConfig.keywords, ...keywords];

  return {
    title: resolvedTitle,
    description,
    keywords: mergedKeywords,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type,
      locale: siteConfig.locale,
      url: absoluteUrl(canonicalPath),
      siteName: siteConfig.name,
      title: resolvedTitle,
      description,
      images: [
        {
          url: absoluteUrl(image),
          width: 1200,
          height: 630,
          alt: resolvedTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: [absoluteUrl(image)],
    },
    robots: {
      index,
      follow,
      googleBot: {
        index,
        follow,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export function buildStoryMetadata({
  title,
  description,
  canonicalPath,
  image,
  keywords = [],
  index = true,
  follow = true,
}) {
  return buildMetadata({
    title: buildPageTitle(title),
    description,
    path: canonicalPath,
    canonical: canonicalPath,
    image,
    keywords,
    type: "article",
    index,
    follow,
  });
}
