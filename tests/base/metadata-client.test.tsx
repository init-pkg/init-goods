// @vitest-environment jsdom
import React from "react";
import { generateMetadata } from "@/base";
import { compareJsx } from "@/testing/compareJsx";
import { describe, expect, it } from "vitest";

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
});
