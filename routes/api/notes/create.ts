import { redirect } from "$/shared/helpers.ts";
import { Handlers } from "$fresh/server.ts";
import { State } from "$/shared/types.ts";

export const handler: Handlers<never, State> = {
  POST: async (_req, ctx) => {
    if (!ctx.state.user) {
      return new Response(null, { status: 401, statusText: "Unauthorized" } );
    }

    const data = new FormData();

    data.append("title", "New Note");
    data.append("user", ctx.state.user.id);

    const note = await ctx.state.pb.collection("notes").create(data);

    return redirect(`/notes/${note.id}/edit`);
  },
};