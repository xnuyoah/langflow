import { renderHook } from "@testing-library/react";
import { formatDocumentTitle, useDocumentTitle } from "../use-document-title";

describe("formatDocumentTitle", () => {
  it("brands the page title", () => {
    expect(formatDocumentTitle("Flows")).toBe("Flows | DataFlow");
  });

  it("does not double-brand a title that already names the product", () => {
    expect(formatDocumentTitle("DataFlow API Keys")).toBe("DataFlow API Keys");
  });

  it("falls back to the product name for an empty title", () => {
    expect(formatDocumentTitle(undefined)).toBe("DataFlow");
    expect(formatDocumentTitle(null)).toBe("DataFlow");
    expect(formatDocumentTitle("   ")).toBe("DataFlow");
  });
});

describe("useDocumentTitle", () => {
  it("sets the document title while mounted and resets it on unmount", () => {
    const { unmount } = renderHook(() => useDocumentTitle("Global Variables"));
    expect(document.title).toBe("Global Variables | DataFlow");

    unmount();
    expect(document.title).toBe("DataFlow");
  });

  it("follows a title that resolves after the first render", () => {
    const { rerender } = renderHook(
      ({ title }: { title?: string }) => useDocumentTitle(title),
      { initialProps: { title: undefined } },
    );
    expect(document.title).toBe("DataFlow");

    rerender({ title: "My Flow" });
    expect(document.title).toBe("My Flow | DataFlow");
  });
});
