import { query } from "./_generated/server";
import { v } from "convex/values";

export const searchFilteredEvents = query({
  args: { filters: v.any() },
  handler: async (ctx, args) => {
    const { filters } = args;

    let q = ctx.db.query("events");

    if (filters.state) {
      q = q.filter(e => e.eq(e.field("state"), filters.state));
    }

    if (filters.city) {
      q = q.filter(e => e.eq(e.field("city"), filters.city));
    }

    if (filters.category) {
      q = q.filter(e => e.eq(e.field("category"), filters.category));
    }

    if (filters.price === "free") {
      q = q.filter(e => e.eq(e.field("ticketType"), "free"));
    }

    return q.take(50);
  }
});
