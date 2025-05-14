import { ReactNode } from "react";
import { expect } from "vitest";
import ReactDOMServer from "react-dom/server";

export function compareJsx(actualJsx: ReactNode, expectedJsx: ReactNode) {
  expect(ReactDOMServer.renderToString(actualJsx)).toBe(
    ReactDOMServer.renderToString(expectedJsx)
  );
}
