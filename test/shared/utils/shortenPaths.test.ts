import { shortenPaths } from "../../../src/shared/utils/shortenPaths";

describe("shortenPaths", () => {
  it("should return just filenames when all are unique", () => {
    const paths = [
      "//depot/main/src/foo.cpp",
      "//depot/main/src/bar.cpp",
      "//depot/main/src/baz.cpp",
    ];

    const result = shortenPaths(paths);

    expect(result).toEqual(["foo.cpp", "bar.cpp", "baz.cpp"]);
  });

  it("should add one parent segment to disambiguate duplicates", () => {
    const paths = [
      "//depot/main/src/foo.cpp",
      "//depot/main/lib/foo.cpp",
    ];

    const result = shortenPaths(paths);

    expect(result).toEqual(["src/foo.cpp", "lib/foo.cpp"]);
  });

  it("should add multiple parent segments when needed", () => {
    const paths = [
      "//depot/main/a/common/foo.cpp",
      "//depot/main/b/common/foo.cpp",
    ];

    const result = shortenPaths(paths);

    expect(result).toEqual(["a/common/foo.cpp", "b/common/foo.cpp"]);
  });

  it("should handle mixed unique and duplicate filenames", () => {
    const paths = [
      "//depot/main/src/foo.cpp",
      "//depot/main/lib/foo.cpp",
      "//depot/main/src/bar.cpp",
    ];

    const result = shortenPaths(paths);

    expect(result).toEqual(["src/foo.cpp", "lib/foo.cpp", "bar.cpp"]);
  });

  it("should handle a single file", () => {
    const paths = ["//depot/main/src/only.cpp"];

    const result = shortenPaths(paths);

    expect(result).toEqual(["only.cpp"]);
  });

  it("should handle empty array", () => {
    const result = shortenPaths([]);

    expect(result).toEqual([]);
  });

  it("should handle paths with different depths", () => {
    const paths = [
      "//depot/deep/nested/path/foo.cpp",
      "//depot/foo.cpp",
    ];

    const result = shortenPaths(paths);

    expect(result).toEqual(["path/foo.cpp", "depot/foo.cpp"]);
  });
});
