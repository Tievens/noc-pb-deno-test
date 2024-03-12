// routes/api/notes/[id]/delete.ts
import { Handlers } from "$fresh/server.ts";
import { redirect } from "$/shared/helpers.ts";
import { State } from "$/shared/types.ts";

export const handler: Handlers<never, State> = {
  POST: async (_req, ctx) => {
    const { id } = ctx.params;

    await ctx.state.pb.collection("notes").delete(id);
    return redirect("/notes");
  },
};