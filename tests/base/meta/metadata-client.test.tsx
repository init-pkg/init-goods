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
          property="og:type"
          content="website"
        />
        <meta
          property="og:locale"
          content="en_US"
        />
        <meta
          property="og:locale:alternate"
          content="fr_FR"
        />
        <meta
          property="og:locale:alternate"
          content="en_US"
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
          rel="icon"
          href="/favicon.ico"
        />
        <link
          rel="shortcut icon"
          href="/shortcut-icon.png"
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
          href="/en"
          hrefLang="en"
        />
        <link
          rel="alternate"
          href="/fr"
          hrefLang="fr"
        />
        <link
          rel="alternate"
          href="/index.html"
          type="text/html"
        />
        <link
          rel="alternate"
          href="/index.json"
          type="application/json"
        />
      </>
    );

    compareJsx(metadata, expectedMetadata);
  });
});
