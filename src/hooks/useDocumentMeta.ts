import { useEffect } from "react";

interface DocumentMeta {
  title: string;
  description?: string;
  canonicalPath?: string;
}

const SITE_NAME = "Mushaf";
const SITE_ORIGIN = "https://quran-progress-tracker--qtracker.replit.app";

function setOrCreateMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function useDocumentMeta({ title, description, canonicalPath }: DocumentMeta) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    if (description) {
      setOrCreateMeta("name", "description", description);
      setOrCreateMeta("property", "og:description", description);
      setOrCreateMeta("name", "twitter:description", description);
    }

    setOrCreateMeta("property", "og:title", fullTitle);
    setOrCreateMeta("name", "twitter:title", fullTitle);

    if (canonicalPath) {
      const url = `${SITE_ORIGIN}${canonicalPath}`;
      setCanonical(url);
      setOrCreateMeta("property", "og:url", url);
    }
  }, [title, description, canonicalPath]);
}
