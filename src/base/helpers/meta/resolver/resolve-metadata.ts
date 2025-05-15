import type {
  AlternateLinkDescriptor,
  AlternateURLs,
  Languages,
  ResolvedAlternateURLs,
} from "../types/alternative-urls-types";
import type {
  AppleWebApp,
  AppLinks,
  Facebook,
  Pinterest,
  ResolvedAppleWebApp,
  ResolvedAppLinks,
  ResolvedFacebook,
  ResolvedPinterest,
} from "../types/extra-types";
import type { Metadata, ResolvedMetadata } from "../types/metadata-interface";
import type {
  AbsoluteTemplateString,
  Author,
  Icon,
  Icons,
  IconURL,
  ResolvedIcons,
  ResolvedRobots,
  ResolvedVerification,
  Robots,
  TemplateString,
  ThemeColorDescriptor,
  Verification,
} from "../types/metadata-types";
import type { OpenGraph, ResolvedOpenGraph } from "../types/opengraph-types";
import type { ResolvedTwitterMetadata, Twitter } from "../types/twitter-types";

/**
 * Converts a Metadata object into a ResolvedMetadata object
 * This resolves all relative URLs using metadataBase and normalizes the structure
 *
 * @param metadata The source Metadata object
 * @param metadataBase The base URL to resolve relative URLs against (optional)
 * @returns A fully resolved metadata object
 */
export function resolveMetadata(
  metadata: Metadata,
  metadataBase?: URL | null
): ResolvedMetadata {
  const resolved: Partial<ResolvedMetadata> = {};

  // Resolve metadataBase
  resolved.metadataBase = metadata.metadataBase || metadataBase || null;

  // Resolve title
  resolved.title = resolveTitle(metadata.title);

  // Resolve basic string fields
  resolved.description = metadata.description || null;
  resolved.applicationName = metadata.applicationName || null;
  resolved.generator = metadata.generator || null;
  resolved.referrer = metadata.referrer || null;
  resolved.creator = metadata.creator || null;
  resolved.publisher = metadata.publisher || null;
  resolved.abstract = metadata.abstract || null;
  resolved.category = metadata.category || null;
  resolved.classification = metadata.classification || null;

  // Resolve authors
  resolved.authors = resolveAuthors(metadata.authors);

  // Resolve keywords
  resolved.keywords = resolveKeywords(metadata.keywords);

  // Resolve deprecated fields
  resolved.themeColor = resolveThemeColor(metadata.themeColor);
  resolved.colorScheme = metadata.colorScheme || null;
  resolved.viewport = metadata.viewport
    ? typeof metadata.viewport === "string"
      ? metadata.viewport
      : formatViewport(metadata.viewport)
    : null;

  // Resolve robots
  resolved.robots = resolveRobots(metadata.robots);

  // Resolve alternates
  resolved.alternates = resolveAlternates(
    metadata.alternates,
    resolved.metadataBase
  );

  // Resolve icons
  resolved.icons = resolveIcons(metadata.icons, resolved.metadataBase);

  // Resolve manifest
  resolved.manifest = resolveUrl(metadata.manifest, resolved.metadataBase);

  // Resolve Open Graph
  resolved.openGraph = resolveOpenGraph(
    metadata.openGraph,
    resolved.metadataBase
  );

  // Resolve Twitter
  resolved.twitter = resolveTwitter(metadata.twitter, resolved.metadataBase);

  // Resolve verification
  resolved.verification = resolveVerification(metadata.verification);

  // Resolve Facebook
  resolved.facebook = resolveFacebook(metadata.facebook);

  // Resolve Pinterest
  resolved.pinterest = resolvePinterest(metadata.pinterest);

  // Resolve Apple Web App
  resolved.appleWebApp = resolveAppleWebApp(metadata.appleWebApp);

  // Resolve Format Detection
  resolved.formatDetection = metadata.formatDetection || null;

  // Resolve iTunes App
  resolved.itunes = metadata.itunes || null;

  // Resolve App Links
  resolved.appLinks = resolveAppLinks(metadata.appLinks);

  // Resolve link rel properties
  resolved.archives = resolveArray(metadata.archives);
  resolved.assets = resolveArray(metadata.assets);
  resolved.bookmarks = resolveArray(metadata.bookmarks);

  // Resolve pagination
  resolved.pagination = {
    previous: metadata.pagination?.previous
      ? String(metadata.pagination.previous)
      : null,
    next: metadata.pagination?.next ? String(metadata.pagination.next) : null,
  };

  // Resolve other metadata
  resolved.other = metadata.other || null;

  return resolved as ResolvedMetadata;
}

/**
 * Resolves a title field from string or template to AbsoluteTemplateString
 */
function resolveTitle(
  title?: null | string | TemplateString | undefined
): AbsoluteTemplateString | null {
  if (!title) {
    return null;
  }

  if (typeof title === "string") {
    return { absolute: title, template: null };
  }

  // Handle the different template string types
  if ("absolute" in title) {
    if ("template" in title) {
      // It's already AbsoluteTemplateString
      return title as AbsoluteTemplateString;
    } else {
      // It's AbsoluteString, convert to AbsoluteTemplateString
      return { absolute: title.absolute, template: null };
    }
  } else if ("default" in title) {
    // It's DefaultTemplateString, convert to AbsoluteTemplateString
    return { absolute: title.default, template: title.template };
  }

  // Fallback (shouldn't happen if types are correct)
  return { absolute: String(title), template: null };
}

/**
 * Resolves authors into an array of Author objects
 */
function resolveAuthors(
  authors?: null | Author | Array<Author> | undefined
): Array<Author> | null {
  if (!authors) {
    return null;
  }

  return Array.isArray(authors) ? authors : [authors];
}

/**
 * Resolves keywords into an array of strings
 */
function resolveKeywords(
  keywords?: null | string | Array<string> | undefined
): Array<string> | null {
  if (!keywords) {
    return null;
  }

  return Array.isArray(keywords)
    ? keywords
    : keywords.split(",").map((k) => k.trim());
}

/**
 * Resolves theme color to an array of ThemeColorDescriptor
 */
function resolveThemeColor(
  themeColor?:
    | null
    | string
    | ThemeColorDescriptor
    | ThemeColorDescriptor[]
    | undefined
): ThemeColorDescriptor[] | null {
  if (!themeColor) {
    return null;
  }

  if (typeof themeColor === "string") {
    return [{ color: themeColor }];
  }

  return Array.isArray(themeColor) ? themeColor : [themeColor];
}

/**
 * Formats viewport configuration to a string
 */
function formatViewport(viewport: any): string {
  const entries = [];
  for (const [key, value] of Object.entries(viewport)) {
    if (value !== undefined) {
      entries.push(`${key}=${value}`);
    }
  }
  return entries.join(", ");
}

/**
 * Resolves robots configuration
 */
function resolveRobots(
  robots?: null | string | Robots | undefined
): ResolvedRobots | null {
  if (!robots) {
    return null;
  }

  // Initialize with basic and googleBot fields
  const result: ResolvedRobots = {
    basic: null,
    googleBot: null,
  };

  if (typeof robots === "string") {
    // For string input, set it directly to basic
    result.basic = robots;
    return result;
  }

  // Build basic robots string from object
  const robotsEntries: string[] = [];

  // Process index/follow
  if (robots.index === true) robotsEntries.push("index");
  else if (robots.index === false) robotsEntries.push("noindex");

  if (robots.follow === true) robotsEntries.push("follow");
  else if (robots.follow === false) robotsEntries.push("nofollow");

  // Process other directives
  Object.entries(robots).forEach(([key, value]) => {
    if (
      key !== "index" &&
      key !== "follow" &&
      key !== "googleBot" &&
      value !== undefined
    ) {
      if (typeof value === "boolean") {
        if (value) robotsEntries.push(key);
      } else {
        robotsEntries.push(`${key}:${value}`);
      }
    }
  });

  if (robotsEntries.length > 0) {
    result.basic = robotsEntries.join(", ");
  }

  // Process googleBot
  if (robots.googleBot) {
    if (typeof robots.googleBot === "string") {
      result.googleBot = robots.googleBot;
    } else {
      const googleBotEntries: string[] = [];

      // Process index/follow for googleBot
      if (robots.googleBot.index === true) googleBotEntries.push("index");
      else if (robots.googleBot.index === false)
        googleBotEntries.push("noindex");

      if (robots.googleBot.follow === true) googleBotEntries.push("follow");
      else if (robots.googleBot.follow === false)
        googleBotEntries.push("nofollow");

      // Process other directives for googleBot
      Object.entries(robots.googleBot).forEach(([key, value]) => {
        if (key !== "index" && key !== "follow" && value !== undefined) {
          if (typeof value === "boolean") {
            if (value) googleBotEntries.push(key);
          } else {
            googleBotEntries.push(`${key}:${value}`);
          }
        }
      });

      if (googleBotEntries.length > 0) {
        result.googleBot = googleBotEntries.join(", ");
      }
    }
  }

  return result;
}

/**
 * Resolves alternates
 */
function resolveAlternates(
  alternates?: null | AlternateURLs | undefined,
  base?: URL | null
): ResolvedAlternateURLs | null {
  if (!alternates) {
    return null;
  }

  const resolved: ResolvedAlternateURLs = {
    canonical: null,
    languages: null,
    media: null,
    types: null,
  };

  // Resolve canonical URL
  if (alternates.canonical) {
    if (
      typeof alternates.canonical === "string" ||
      alternates.canonical instanceof URL
    ) {
      resolved.canonical = {
        url: resolveUrl(alternates.canonical, base) || "",
      };
    } else {
      // It's already an AlternateLinkDescriptor
      resolved.canonical = {
        ...alternates.canonical,
        url: resolveUrl(alternates.canonical.url, base) || "",
      };
    }
  }

  // Resolve language alternates
  if (alternates.languages) {
    resolved.languages = {} as Languages<AlternateLinkDescriptor[]>;

    for (const [lang, langValue] of Object.entries(alternates.languages)) {
      if (!langValue) continue;

      if (typeof langValue === "string" || langValue instanceof URL) {
        resolved.languages[lang as keyof typeof resolved.languages] = [
          {
            url: resolveUrl(langValue, base) || "",
          },
        ];
      } else if (Array.isArray(langValue)) {
        resolved.languages[lang as keyof typeof resolved.languages] =
          langValue.map((item) => {
            if (typeof item === "string" || item instanceof URL) {
              return { url: resolveUrl(item, base) || "" };
            }
            return { ...item, url: resolveUrl(item.url, base) || "" };
          });
      }
    }
  }

  // Resolve media alternates
  if (alternates.media) {
    resolved.media = {};

    for (const [mediaType, mediaValue] of Object.entries(alternates.media)) {
      if (!mediaValue) {
        resolved.media[mediaType] = null;
        continue;
      }

      if (typeof mediaValue === "string" || mediaValue instanceof URL) {
        resolved.media[mediaType] = [
          {
            url: resolveUrl(mediaValue, base) || "",
          },
        ];
      } else if (Array.isArray(mediaValue)) {
        resolved.media[mediaType] = mediaValue.map((item) => {
          if (typeof item === "string" || item instanceof URL) {
            return { url: resolveUrl(item, base) || "" };
          }
          return { ...item, url: resolveUrl(item.url, base) || "" };
        });
      }
    }
  }

  // Resolve type alternates
  if (alternates.types) {
    resolved.types = {};

    for (const [typeKey, typeValue] of Object.entries(alternates.types)) {
      if (!typeValue) {
        resolved.types[typeKey] = null;
        continue;
      }

      if (typeof typeValue === "string" || typeValue instanceof URL) {
        resolved.types[typeKey] = [
          {
            url: resolveUrl(typeValue, base) || "",
          },
        ];
      } else if (Array.isArray(typeValue)) {
        resolved.types[typeKey] = typeValue.map((item) => {
          if (typeof item === "string" || item instanceof URL) {
            return { url: resolveUrl(item, base) || "" };
          }
          return { ...item, url: resolveUrl(item.url, base) || "" };
        });
      }
    }
  }

  return resolved;
}

/**
 * Resolves icons configuration
 */
function resolveIcons(
  icons?: null | IconURL | Array<Icon> | Icons | undefined,
  base?: URL | null
): ResolvedIcons | null {
  if (!icons) {
    return null;
  }

  const resolved: ResolvedIcons = {
    icon: [],
    apple: [],
  };

  if (typeof icons === "string") {
    // It's a simple URL string
    resolved.icon.push({ url: resolveUrl(icons, base) || "" });
    return resolved;
  }

  if (Array.isArray(icons)) {
    // It's an array of Icon items
    for (const icon of icons) {
      if (typeof icon === "string") {
        // String URL
        resolved.icon.push({ url: resolveUrl(icon, base) || "" });
      } else if ("rel" in icon && icon.rel === "apple-touch-icon") {
        // Icon descriptor with apple-touch-icon rel
        resolved.apple.push({ ...icon, url: resolveUrl(icon.url, base) || "" });
      } else if ("url" in icon) {
        // Standard icon descriptor
        resolved.icon.push({ ...icon, url: resolveUrl(icon.url, base) || "" });
      }
    }
    return resolved;
  }

  // At this point, icons is an Icons object
  if ("icon" in icons && icons.icon) {
    const iconItems = Array.isArray(icons.icon) ? icons.icon : [icons.icon];
    resolved.icon = iconItems.map((item) => {
      if (typeof item === "string") {
        return { url: resolveUrl(item, base) || "" };
      } else if ("url" in item) {
        return { ...item, url: resolveUrl(item.url, base) || "" };
      }
      return { url: "" }; // fallback, shouldn't happen
    });
  }

  if ("apple" in icons && icons.apple) {
    const appleItems = Array.isArray(icons.apple) ? icons.apple : [icons.apple];
    resolved.apple = appleItems.map((item) => {
      if (typeof item === "string") {
        return { url: resolveUrl(item, base) || "" };
      } else if ("url" in item) {
        return { ...item, url: resolveUrl(item.url, base) || "" };
      }
      return { url: "" }; // fallback, shouldn't happen
    });
  }

  if ("shortcut" in icons && icons.shortcut) {
    const shortcutItems = Array.isArray(icons.shortcut)
      ? icons.shortcut
      : [icons.shortcut];
    resolved.shortcut = shortcutItems.map((item) => {
      if (typeof item === "string") {
        return { url: resolveUrl(item, base) || "" };
      } else if ("url" in item) {
        return { ...item, url: resolveUrl(item.url, base) || "" };
      }
      return { url: "" }; // fallback, shouldn't happen
    });
  }

  if ("other" in icons && icons.other) {
    const otherItems = Array.isArray(icons.other) ? icons.other : [icons.other];
    resolved.other = otherItems.map((item) => {
      if ("url" in item) {
        return { ...item, url: resolveUrl(item.url, base) || "" };
      }
      return item; // shouldn't happen given the type
    });
  }

  return resolved;
}

/**
 * Resolves Open Graph configuration
 */
function resolveOpenGraph(
  og?: null | OpenGraph | undefined,
  base?: URL | null
): ResolvedOpenGraph | null {
  if (!og) {
    return null;
  }

  const resolved: ResolvedOpenGraph = { ...og } as any;

  // Resolve URL fields
  if (og.url) {
    resolved.url = resolveUrl(og.url, base) || "";
  }

  // Resolve images
  if (og.images) {
    resolved.images = Array.isArray(og.images) ? og.images : [og.images];
    resolved.images = resolved.images.map((img) => {
      if (typeof img === "string") {
        return { url: resolveUrl(img, base) || "" };
      } else if (img instanceof URL) {
        return { url: img.toString() };
      } else if ("url" in img) {
        return { ...img, url: resolveUrl(img.url, base) || "" };
      }
      return { url: "" }; // Fallback
    });
  }

  // Resolve videos
  if (og.videos) {
    resolved.videos = Array.isArray(og.videos) ? og.videos : [og.videos];
    resolved.videos = resolved.videos.map((video) => {
      if (typeof video === "string") {
        return { url: resolveUrl(video, base) || "" };
      } else if (video instanceof URL) {
        return { url: video.toString() };
      } else if ("url" in video) {
        return { ...video, url: resolveUrl(video.url, base) || "" };
      }
      return { url: "" }; // Fallback
    });
  }

  return resolved;
}

/**
 * Resolves Twitter metadata
 */
function resolveTwitter(
  twitter?: null | Twitter | undefined,
  base?: URL | null
): ResolvedTwitterMetadata | null {
  if (!twitter) {
    return null;
  }

  const resolved: ResolvedTwitterMetadata = { ...twitter } as any;

  // Resolve images
  if (twitter.images) {
    const images = Array.isArray(twitter.images)
      ? twitter.images
      : [twitter.images];
    const resolvedImages = images.map((img) => {
      if (typeof img === "string") {
        return { url: resolveUrl(img, base) || "" };
      } else if (img instanceof URL) {
        return { url: img.toString() };
      } else if ("url" in img) {
        return { ...img, url: resolveUrl(img.url, base) || "" };
      }
      return { url: "" }; // Fallback
    });

    resolved.images = resolvedImages;
  }

  return resolved;
}

/**
 * Resolves verification
 */
function resolveVerification(
  verification?: Verification | undefined
): ResolvedVerification | null {
  if (!verification) {
    return null;
  }

  const resolved: ResolvedVerification = { other: {} };

  for (const k in verification) {
    const key = k as keyof typeof verification;
    const value = verification[key];

    if (key === "other") {
      if (!verification.other || !resolved.other) continue;

      for (const [key, value] of Object.entries(verification.other)) {
        if (!Array.isArray(value)) {
          resolved.other[key] = [value];
          continue;
        }

        resolved.other[key] = value;
      }

      continue;
    }

    if (value && !Array.isArray(value)) {
      resolved[key] = [value] as Array<string | number>;
      continue;
    }

    resolved[key] = value as Array<string | number>;
  }

  return resolved;
}

/**
 * Resolves Facebook metadata
 */
function resolveFacebook(
  facebook?: null | Facebook | undefined
): ResolvedFacebook | null {
  if (!facebook) {
    return null;
  }

  return facebook as ResolvedFacebook;
}

/**
 * Resolves Pinterest metadata
 */
function resolvePinterest(
  pinterest?: null | Pinterest | undefined
): ResolvedPinterest | null {
  if (!pinterest) {
    return null;
  }

  return pinterest as ResolvedPinterest;
}

/**
 * Resolves Apple Web App metadata
 */
function resolveAppleWebApp(
  appleWebApp?: null | boolean | AppleWebApp | undefined
): ResolvedAppleWebApp | null {
  if (!appleWebApp) {
    return null;
  }

  if (appleWebApp === true) {
    return { capable: true };
  }

  return appleWebApp as ResolvedAppleWebApp;
}

/**
 * Resolves App Links
 */
function resolveAppLinks(
  appLinks?: null | AppLinks | undefined
): ResolvedAppLinks | null {
  if (!appLinks) {
    return null;
  }

  return appLinks as ResolvedAppLinks;
}

/**
 * Resolves a URL or string to a URL string
 */
function resolveUrl(
  url: string | URL | undefined | null,
  base?: URL | null
): string | null {
  if (!url) {
    return null;
  }

  // If it's already a URL object, convert to string
  if (url instanceof URL) {
    return url.toString();
  }

  // If the URL starts with a slash, treat it as a relative URL but don't resolve against base
  if (url.startsWith("/")) {
    return url;
  }

  // If we have a base URL and the URL is relative, resolve against base
  if (base && !url.startsWith("http://") && !url.startsWith("https://")) {
    try {
      return new URL(url, base).toString();
    } catch {
      return url;
    }
  }

  return url;
}

/**
 * Resolves an array or single item to an array
 */
function resolveArray<T>(
  item?: null | T | Array<T> | undefined
): Array<T> | null {
  if (!item) {
    return null;
  }

  return Array.isArray(item) ? item : [item];
}
