import { render, screen } from "@testing-library/react";
import { Card } from "~/components/Card";
import { BrowserRouter } from "react-router-dom";

describe("Card", () => {
  test("renders article information", () => {
    render(
      <Card
        title="Article title"
        summary="Article summary"
        slug="article_slug"
        formattedDate="01/01/2022"
      />,
      {
        wrapper: BrowserRouter,
      }
    );

    expect(screen.getByText("Published 01/01/2022")).toBeDefined();
    expect(screen.getByText("Article title")).toBeDefined();
    expect(screen.getByText("Article summary")).toBeDefined();
    expect(screen.getByRole("link", { name: "Read more" })).toBeDefined();
  });
});
