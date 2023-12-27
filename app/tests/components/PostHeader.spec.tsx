import { render, screen } from "@testing-library/react";
import { ArticleHeader } from "~/components/ArticleHeader";
import { BrowserRouter } from "react-router-dom";

describe("ArticleHeader", () => {
  test("renders article metadata", () => {
    render(
      <ArticleHeader
        attributes={{
          title: "Test article",
          date: "2021-01-01",
          tags: ["tag1", "tag2"],
        }}
      />,
      {
        wrapper: BrowserRouter,
      }
    );

    expect(screen.getByText("Test article")).toBeDefined();
    expect(screen.getByText("January 1, 2021")).toBeDefined();
    expect(screen.getByText("#tag1")).toBeDefined();
    expect(screen.getByText("#tag2")).toBeDefined();
  });
});
