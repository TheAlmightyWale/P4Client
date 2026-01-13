import {
  parseZtagOutput,
  ztagToChangelistInfo,
  parseChangesOutput,
  parseP4Date,
  parseUserOutput,
} from "../../../../src/Main/Features/P4/parser";

describe("P4 Ztag Parser", () => {
  describe("parseZtagOutput", () => {
    it("should parse single ztag record", () => {
      const output = `... change 12345
... time 1705334400
... user jsmith
... client workspace
... status submitted
... desc Fixed login bug`;

      const result = parseZtagOutput(output);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        change: "12345",
        time: "1705334400",
        user: "jsmith",
        client: "workspace",
        status: "submitted",
        desc: "Fixed login bug",
      });
    });

    it("should parse multiple ztag records", () => {
      const output = `... change 12345
... time 1705334400
... user jsmith
... client workspace
... status submitted
... desc First change

... change 12344
... time 1705248000
... user jdoe
... client workspace
... status submitted
... desc Second change`;

      const result = parseZtagOutput(output);

      expect(result).toHaveLength(2);
      expect(result[0].change).toBe("12345");
      expect(result[0].desc).toBe("First change");
      expect(result[1].change).toBe("12344");
      expect(result[1].desc).toBe("Second change");
    });

    it("should handle empty output", () => {
      const result = parseZtagOutput("");
      expect(result).toHaveLength(0);
    });

    it("should handle whitespace-only output", () => {
      const result = parseZtagOutput("   \n  \n  ");
      expect(result).toHaveLength(0);
    });

    it("should handle descriptions with special characters", () => {
      const output = `... change 12345
... time 1705334400
... user jsmith
... client workspace
... status submitted
... desc Fixed bug #123 - user's data with "quotes"`;

      const result = parseZtagOutput(output);

      expect(result[0].desc).toBe(
        'Fixed bug #123 - user\'s data with "quotes"'
      );
    });

    it("should skip lines without values", () => {
      const output = `... change 12345
... time 1705334400
... user jsmith
... client workspace
... status
... desc Test change`;

      const result = parseZtagOutput(output);

      expect(result).toHaveLength(1);
      expect(result[0].status).toBeUndefined();
      expect(result[0].desc).toBe("Test change");
    });

    it("should handle non-ztag lines gracefully", () => {
      const output = `Some random text
... change 12345
... time 1705334400
... user jsmith
... client workspace
... desc Valid change
More random text`;

      const result = parseZtagOutput(output);

      expect(result).toHaveLength(1);
      expect(result[0].change).toBe("12345");
    });
  });

  describe("ztagToChangelistInfo", () => {
    it("should convert ztag records to ChangelistInfo", () => {
      const records = [
        {
          change: "12345",
          time: "1705334400",
          user: "jsmith",
          client: "workspace",
          desc: "Test change",
        },
      ];

      const result = ztagToChangelistInfo(records, "submitted");

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 12345,
        user: "jsmith",
        client: "workspace",
        date: new Date(1705334400 * 1000),
        description: "Test change",
        status: "submitted",
      });
    });

    it("should handle missing description", () => {
      const records = [
        {
          change: "12345",
          time: "1705334400",
          user: "jsmith",
          client: "workspace",
        },
      ];

      const result = ztagToChangelistInfo(records, "pending");

      expect(result[0].description).toBe("");
      expect(result[0].status).toBe("pending");
    });

    it("should convert multiple records", () => {
      const records = [
        {
          change: "12345",
          time: "1705334400",
          user: "jsmith",
          client: "ws1",
          desc: "First",
        },
        {
          change: "12344",
          time: "1705248000",
          user: "jdoe",
          client: "ws2",
          desc: "Second",
        },
      ];

      const result = ztagToChangelistInfo(records, "submitted");

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(12345);
      expect(result[1].id).toBe(12344);
    });
  });

  describe("parseChangesOutput", () => {
    it("should parse ztag changes output correctly", () => {
      const output = `... change 12345
... time 1705334400
... user jsmith
... client workspace
... status submitted
... desc Fixed login bug`;

      const result = parseChangesOutput(output, "submitted");

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(12345);
      expect(result[0].user).toBe("jsmith");
      expect(result[0].client).toBe("workspace");
      expect(result[0].description).toBe("Fixed login bug");
      expect(result[0].status).toBe("submitted");
    });

    it("should handle pending changes", () => {
      const output = `... change 12346
... time 1705420800
... user jsmith
... client workspace
... status pending
... desc Work in progress`;

      const result = parseChangesOutput(output, "pending");

      expect(result).toHaveLength(1);
      expect(result[0].status).toBe("pending");
      expect(result[0].id).toBe(12346);
      expect(result[0].description).toBe("Work in progress");
    });

    it("should handle empty output", () => {
      const result = parseChangesOutput("", "submitted");
      expect(result).toHaveLength(0);
    });

    it("should parse multiple changes", () => {
      const output = `... change 12345
... time 1705334400
... user jsmith
... client workspace
... status submitted
... desc First change

... change 12344
... time 1705248000
... user jdoe
... client workspace
... status submitted
... desc Second change`;

      const result = parseChangesOutput(output, "submitted");

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(12345);
      expect(result[1].id).toBe(12344);
    });
  });

  describe("parseUserOutput", () => {
    it("should extract username from ztag user output", () => {
      const output = `... User jsmith
... Email jsmith@example.com
... FullName John Smith`;

      const result = parseUserOutput(output);
      expect(result).toBe("jsmith");
    });

    it("should handle username with extra fields", () => {
      const output = `... User admin
... Email admin@example.com
... FullName Administrator
... Access 1705334400`;

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

    it("should return null when User field is missing", () => {
      const output = `... Email jsmith@example.com
... FullName John Smith`;

      const result = parseUserOutput(output);
      expect(result).toBeNull();
    });
  });

  describe("parseP4Date", () => {
    it("should parse Unix timestamp", () => {
      const result = parseP4Date("1705334400");
      expect(result.getTime()).toBe(1705334400 * 1000);
    });

    it("should parse YYYY/MM/DD format for backward compatibility", () => {
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

    it("should handle single digit months and days in legacy format", () => {
      const result = parseP4Date("2024/01/05");
      expect(result.getMonth()).toBe(0);
      expect(result.getDate()).toBe(5);
    });
  });
});
