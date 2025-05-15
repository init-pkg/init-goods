// @vitest-environment jsdom
import React from "react";
import { generateMetadata } from "@/base";
import { describe, expect, it } from "vitest";
import { compareJsx } from "@tests/utils/compareJsx";

describe("Test for metadata", () => {
  it("should generate base metadata", () => {
    expect(window).toBeDefined();

    const metadata = generateMetadata({
      title: "title",
      description: "description",
    });

    const expectedMetadata = (
      <>
        <title>title</title>
        <meta
          name="description"
          content="description"
        />
      </>
    );

    compareJsx(metadata, expectedMetadata);
  });

  it("should generate metadata with open graph", () => {
    const metadata = generateMetadata({
      title: "title",
      description: "description",
      openGraph: {
        title: "Opengraph Title",
        description: "Opengraph Description",
        url: "https://example.com/og-url",
        siteName: "Opengraph Site Name",
        type: "website",
        alternateLocale: ["en_US", "fr_FR"],
        locale: "en_US",
        images: [
          {
            url: "https://example.com/og-image.jpg",
            width: 800,
            height: 600,
          },
        ],
      },
    });

    const expectedMetadata = (
      <>
        <title>title</title>
        <meta
          name="description"
          content="description"
        />
        <meta
          property="og:title"
          content="Opengraph Title"
        />
        <meta
          property="og:description"
          content="Opengraph Description"
        />
        <meta
          property="og:url"
          content="https://example.com/og-url"
        />
        <meta
          property="og:site_name"
          content="Opengraph Site Name"
        />
        <meta
          property="og:locale"
          content="en_US"
        />
        <meta
          property="og:image"
          content="https://example.com/og-image.jpg"
        />
        <meta
          property="og:image:width"
          content="800"
        />
        <meta
          property="og:image:height"
          content="600"
        />
        <meta
          property="og:locale:alternate"
          content="en_US"
        />
        <meta
          property="og:locale:alternate"
          content="fr_FR"
        />
        <meta
          property="og:type"
          content="website"
        />
      </>
    );

    compareJsx(metadata, expectedMetadata);
  });

  it("should generate metadata with twitter", () => {
    const metadata = generateMetadata({
      title: "title",
      description: "description",
      twitter: {
        card: "summary_large_image",
        site: "@example",
        title: "Twitter Title",
        description: "Twitter Description",
        images: "https://example.com/twitter-image.jpg",
      },
    });

    const expectedMetadata = (
      <>
        <title>title</title>
        <meta
          name="description"
          content="description"
        />
        <meta
          name="twitter:card"
          content="summary_large_image"
        />
        <meta
          name="twitter:site"
          content="@example"
        />
        <meta
          name="twitter:title"
          content="Twitter Title"
        />
        <meta
          name="twitter:description"
          content="Twitter Description"
        />
        <meta
          name="twitter:image"
          content="https://example.com/twitter-image.jpg"
        />
      </>
    );

    compareJsx(metadata, expectedMetadata);
  });

  it("should generate metadata with icons", () => {
    const metadata = generateMetadata({
      title: "title",
      description: "description",
      icons: {
        icon: "/favicon.ico",
        shortcut: "/shortcut-icon.png",
        apple: [
          {
            url: "/apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png",
          },
        ],
        other: [
          {
            rel: "manifest",
            url: "/site.webmanifest",
          },
        ],
      },
    });

    const expectedMetadata = (
      <>
        <title>title</title>
        <meta
          name="description"
          content="description"
        />
        <link
          rel="shortcut icon"
          href="/shortcut-icon.png"
        />
        <link
          rel="icon"
          href="/favicon.ico"
        />
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
          sizes="180x180"
          type="image/png"
        />
        <link
          rel="manifest"
          href="/site.webmanifest"
        />
      </>
    );

    compareJsx(metadata, expectedMetadata);
  });

  it("should generate metadata with alternates", () => {
    const metadata = generateMetadata({
      title: "title",
      description: "description",
      alternates: {
        languages: {
          en: "/en",
          fr: "/fr",
        },
        types: {
          html: "/index.html",
          json: "/index.json",
        },
      },
    });

    const expectedMetadata = (
      <>
        <title>title</title>
        <meta
          name="description"
          content="description"
        />
        <link
          rel="alternate"
          hrefLang="en"
          href="/en"
        />
        <link
          rel="alternate"
          hrefLang="fr"
          href="/fr"
        />
        <link
          rel="alternate"
          type="text/html"
          href="/index.html"
        />
        <link
          rel="alternate"
          type="application/json"
          href="/index.json"
        />
      </>
    );

    compareJsx(metadata, expectedMetadata);
  });

  it("Should generate uncommon fields", () => {
    const metadata = generateMetadata({
      other: {
        "created-at": "2021-01-01",
        "article:modified_time": "2021-01-02",
      },
    });

    const expectedMetadata = (
      <>
        <meta
          name="created-at"
          content="2021-01-01"
        />
        <meta
          name="article:modified_time"
          content="2021-01-02"
        />
      </>
    );

    compareJsx(metadata, expectedMetadata);
  });

  it("Should generate canonical url", () => {
    const metadata = generateMetadata({
      alternates: {
        canonical: "https://example.com/canonical",
      },
    });

    const expectedMetadata = (
      <>
        <link
          rel="canonical"
          href="https://example.com/canonical"
        />
      </>
    );

    compareJsx(metadata, expectedMetadata);
  });

  it("Should generate varification meta", () => {
    const metadata = generateMetadata({
      verification: {
        google: "google-site-verification",
        yandex: "yandex-site-verification",
        other: {
          steam: "steam-site-verification",
        },
      },
    });

    const expectedMetadata = (
      <>
        <meta
          name="google-site-verification"
          content="google-site-verification"
        />
        <meta
          name="yandex-verification"
          content="yandex-site-verification"
        />
        <meta
          name="steam"
          content="steam-site-verification"
        />
      </>
    );

    compareJsx(metadata, expectedMetadata);
  });
});
