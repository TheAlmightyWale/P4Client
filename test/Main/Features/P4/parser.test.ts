import {
  parseChangesOutput,
  parseP4Date,
  parseUserOutput,
} from "../../../../src/Main/Features/P4/parser";

describe("P4 Parser", () => {
  describe("parseChangesOutput", () => {
    it("should parse submitted changes correctly", () => {
      const output = `Change 12345 on 2024/01/15 by jsmith@workspace *submitted* 'Fixed login bug'
Change 12344 on 2024/01/14 by jdoe@workspace *submitted* 'Added new feature'`;

      const result = parseChangesOutput(output, "submitted");

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 12345,
        user: "jsmith",
        client: "workspace",
        date: new Date(2024, 0, 15),
        description: "Fixed login bug",
        status: "submitted",
      });
      expect(result[1]).toEqual({
        id: 12344,
        user: "jdoe",
        client: "workspace",
        date: new Date(2024, 0, 14),
        description: "Added new feature",
        status: "submitted",
      });
    });

    it("should handle empty output", () => {
      const result = parseChangesOutput("", "submitted");
      expect(result).toHaveLength(0);
    });

    it("should handle whitespace-only output", () => {
      const result = parseChangesOutput("   \n  \n  ", "submitted");
      expect(result).toHaveLength(0);
    });

    it("should parse pending changes correctly", () => {
      const output = `Change 12346 on 2024/01/16 by jsmith@workspace *pending* 'Work in progress'`;

      const result = parseChangesOutput(output, "pending");

      expect(result).toHaveLength(1);
      expect(result[0].status).toBe("pending");
      expect(result[0].id).toBe(12346);
      expect(result[0].description).toBe("Work in progress");
    });

    it("should handle descriptions with special characters", () => {
      const output = `Change 12347 on 2024/01/17 by jsmith@workspace *submitted* 'Fixed bug #123 - user's data'`;

      const result = parseChangesOutput(output, "submitted");

      expect(result).toHaveLength(1);
      expect(result[0].description).toBe("Fixed bug #123 - user's data");
    });

    it("should skip malformed lines", () => {
      const output = `Change 12345 on 2024/01/15 by jsmith@workspace *submitted* 'Valid change'
Invalid line that should be skipped
Change 12346 on 2024/01/16 by jdoe@workspace *submitted* 'Another valid change'`;

      const result = parseChangesOutput(output, "submitted");

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(12345);
      expect(result[1].id).toBe(12346);
    });
  });

  describe("parseP4Date", () => {
    it("should parse P4 date format correctly", () => {
      const result = parseP4Date("2024/01/15");
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(0); // January is 0
      expect(result.getDate()).toBe(15);
    });

    it("should parse different months correctly", () => {
      const result = parseP4Date("2024/12/25");
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(11); // December is 11
      expect(result.getDate()).toBe(25);
    });

    it("should handle single digit months and days", () => {
      const result = parseP4Date("2024/01/05");
      expect(result.getMonth()).toBe(0);
      expect(result.getDate()).toBe(5);
    });
  });

  describe("parseUserOutput", () => {
    it("should extract username from p4 user -o output", () => {
      const output = `User:   jsmith

Email:  jsmith@example.com

FullName:       John Smith`;

      const result = parseUserOutput(output);
      expect(result).toBe("jsmith");
    });

    it("should handle username with no extra whitespace", () => {
      const output = `User: admin
Email: admin@example.com`;

      const result = parseUserOutput(output);
      expect(result).toBe("admin");
    });

    it("should return null for invalid output", () => {
      const result = parseUserOutput("invalid output");
      expect(result).toBeNull();
    });

    it("should return null for empty output", () => {
      const result = parseUserOutput("");
      expect(result).toBeNull();
    });

    it("should handle output with User: but no value", () => {
      const result = parseUserOutput("User:");
      expect(result).toBeNull();
    });
  });
});
