import { render, screen } from "@testing-library/react";
import { ArticlesList } from "~/components/ArticlesList";
import { BrowserRouter } from "react-router-dom";

describe("ArticlesList", () => {
  test("renders 'No results' if there are no articles", () => {
    render(
      <ArticlesList
        articles={[]}
        page={0}
        previousPage={null}
        nextPage={null}
        totalPages={0}
      />
    );

    expect(screen.getByText("No results")).toBeDefined();
  });

  test("renders articles", () => {
    render(
      <ArticlesList
        articles={[
          {
            title: "Test article",
            summary: "This is a test article",
            formattedDate: "January 1, 2021",
            slug: "test-article",
          },
        ]}
        page={2}
        previousPage={1}
        nextPage={3}
        totalPages={5}
      />,
      {
        wrapper: BrowserRouter,
      }
    );

    expect(screen.getByText("Test article")).toBeDefined();
    expect(screen.getByText("This is a test article")).toBeDefined();
    expect(screen.getByText("Published January 1, 2021")).toBeDefined();
    expect(screen.getByText("Read more")).toBeDefined();

    expect(screen.getByText("Previous")).toBeDefined();
    expect(screen.getByText("Next")).toBeDefined();

    expect(screen.getByText("3 of 5")).toBeDefined();
  });

  test("renders articles with no previous page", () => {
    render(
      <ArticlesList
        articles={[
          {
            title: "Test article",
            summary: "This is a test article",
            formattedDate: "January 1, 2021",
            slug: "test-article",
          },
        ]}
        page={0}
        previousPage={null}
        nextPage={1}
        totalPages={5}
      />,
      {
        wrapper: BrowserRouter,
      }
    );

    expect(screen.getByText("Test article")).toBeDefined();
    expect(screen.getByText("This is a test article")).toBeDefined();
    expect(screen.getByText("Published January 1, 2021")).toBeDefined();
    expect(screen.getByText("Read more")).toBeDefined();

    expect(screen.queryByText("Previous")).toBeNull();
    expect(screen.getByText("Next")).toBeDefined();

    expect(screen.getByText("1 of 5")).toBeDefined();
  });

  test("renders articles with no next page", () => {
    render(
      <ArticlesList
        articles={[
          {
            title: "Test article",
            summary: "This is a test article",
            formattedDate: "January 1, 2021",
            slug: "test-article",
          },
        ]}
        page={1}
        previousPage={0}
        nextPage={null}
        totalPages={2}
      />,
      {
        wrapper: BrowserRouter,
      }
    );

    expect(screen.getByText("Test article")).toBeDefined();
    expect(screen.getByText("This is a test article")).toBeDefined();
    expect(screen.getByText("Published January 1, 2021")).toBeDefined();
    expect(screen.getByText("Read more")).toBeDefined();

    expect(screen.getByText("Previous")).toBeDefined();
    expect(screen.queryByText("Next")).toBeNull();

    expect(screen.getByText("2 of 2")).toBeDefined();
  });

  test("renders articles with no previous or next page", () => {
    render(
      <ArticlesList
        articles={[
          {
            title: "Test article",
            summary: "This is a test article",
            formattedDate: "January 1, 2021",
            slug: "test-article",
          },
        ]}
        page={0}
        previousPage={null}
        nextPage={null}
        totalPages={1}
      />,
      {
        wrapper: BrowserRouter,
      }
    );

    expect(screen.getByText("Test article")).toBeDefined();
    expect(screen.getByText("This is a test article")).toBeDefined();
    expect(screen.getByText("Published January 1, 2021")).toBeDefined();
    expect(screen.getByText("Read more")).toBeDefined();

    expect(screen.queryByText("Previous")).toBeNull();
    expect(screen.queryByText("Next")).toBeNull();

    expect(screen.getByText("1 of 1")).toBeDefined();
  });
});
