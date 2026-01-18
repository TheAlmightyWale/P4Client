import { parseTicketsOutput } from "../../../../src/Main/Features/P4/providers/cli/parser";

describe("parseTicketsOutput", () => {
  it("should parse empty tickets output", () => {
    const output = "";
    const tickets = parseTicketsOutput(output);

    expect(tickets).toEqual([]);
  });

  it("should parse single ticket", () => {
    const output = `... user testuser
... ticket ABC123DEF456GHI789
... Host ssl:perforce.example.com:1666`;

    const tickets = parseTicketsOutput(output);

    expect(tickets).toHaveLength(1);
    expect(tickets[0]).toEqual({
      user: "testuser",
      ticket: "ABC123DEF456GHI789",
      host: "ssl:perforce.example.com:1666",
    });
  });

  it("should parse multiple tickets", () => {
    const output = `... user testuser
... ticket ABC123DEF456
... Host ssl:perforce.example.com:1666
... user admin
... ticket XYZ789ABC123
... Host ssl:other-server:1666
... user developer
... ticket DEF456GHI789
... Host perforce.internal:1666`;

    const tickets = parseTicketsOutput(output);

    expect(tickets).toHaveLength(3);
    expect(tickets[0]).toEqual({
      user: "testuser",
      ticket: "ABC123DEF456",
      host: "ssl:perforce.example.com:1666",
    });
    expect(tickets[1]).toEqual({
      user: "admin",
      ticket: "XYZ789ABC123",
      host: "ssl:other-server:1666",
    });
    expect(tickets[2]).toEqual({
      user: "developer",
      ticket: "DEF456GHI789",
      host: "perforce.internal:1666",
    });
  });

  it("should handle malformed output with missing fields", () => {
    const output = `... user testuser
... ticket ABC123DEF456
... Host ssl:perforce.example.com:1666
... user incomplete
... ticket MISSING_HOST`;

    const tickets = parseTicketsOutput(output);

    // Only the complete ticket should be parsed
    expect(tickets).toHaveLength(1);
    expect(tickets[0]).toEqual({
      user: "testuser",
      ticket: "ABC123DEF456",
      host: "ssl:perforce.example.com:1666",
    });
  });

  it("should handle output with extra whitespace", () => {
    const output = `... user testuser
... ticket ABC123DEF456
... Host ssl:perforce.example.com:1666
`;

    const tickets = parseTicketsOutput(output);

    expect(tickets).toHaveLength(1);
    expect(tickets[0]).toEqual({
      user: "testuser",
      ticket: "ABC123DEF456",
      host: "ssl:perforce.example.com:1666",
    });
  });

  it("should handle tickets with special characters in host", () => {
    const output = `... user testuser
... ticket ABC123DEF456
... Host ssl:perforce-server.example.com:1666`;

    const tickets = parseTicketsOutput(output);

    expect(tickets).toHaveLength(1);
    expect(tickets[0].host).toBe("ssl:perforce-server.example.com:1666");
  });

  it("should handle tickets with long ticket values", () => {
    const longTicket =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
    const output = `... user testuser
... ticket ${longTicket}
... Host ssl:perforce.example.com:1666`;

    const tickets = parseTicketsOutput(output);

    expect(tickets).toHaveLength(1);
    expect(tickets[0].ticket).toBe(longTicket);
  });
});
