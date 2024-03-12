// routes/api/notes/[id]/unlink.ts
import { Handlers } from "$fresh/server.ts";
import { redirect } from "$/shared/helpers.ts";
import { State } from "$/shared/types.ts";

export const handler: Handlers<never, State> = {
  POST: async (_req, ctx) => {
    const { id } = ctx.params;

    await ctx.state.pb.collection("notes").update(id, {
      links: [],
    });

    return redirect(`/notes/${id}/edit`);
  },
};