import { absoluteUrl, buildExcerpt, getBlogPath, normalizeSiteUrl, siteConfig } from "./site.js";

export function toJsonLd(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: normalizeSiteUrl(),
    logo: absoluteUrl("/icon-512.svg"),
    sameAs: [],
  };
}

export function buildWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: normalizeSiteUrl(),
    description: siteConfig.description,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    inLanguage: "en",
  };
}

export function buildCollectionPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Blogscape stories and editorial archive",
    url: normalizeSiteUrl(),
    description: siteConfig.description,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: normalizeSiteUrl(),
    },
  };
}

export function buildContactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Blogscape",
    url: absoluteUrl("/contacts"),
    description: "Get in touch with the Blogscape publishing team.",
    about: {
      "@type": "Organization",
      name: siteConfig.name,
    },
  };
}

export function buildBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildBlogPostingSchema(blog) {
  const path = getBlogPath(blog);
  const description =
    buildExcerpt(blog.sourceDescription || blog.content || blog.title, 180) || siteConfig.description;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description,
    image: blog.url ? [blog.url] : [absoluteUrl(siteConfig.socialImagePath)],
    url: absoluteUrl(path),
    mainEntityOfPage: absoluteUrl(path),
    datePublished: new Date(blog.createdAt || Date.now()).toISOString(),
    dateModified: new Date(blog.updatedAt || blog.createdAt || Date.now()).toISOString(),
    author: {
      "@type": "Person",
      name: blog.author || siteConfig.creator,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/icon-512.svg"),
      },
    },
    articleSection: Array.isArray(blog.category) ? blog.category.join(", ") : blog.category || "Blog",
    keywords: Array.isArray(blog.category) ? blog.category.join(", ") : blog.category || "blog",
    wordCount: (blog.content || "").trim().split(/\s+/).filter(Boolean).length,
  };
}
