// routes/logout.ts
import { Handlers } from "$fresh/server.ts";
import { createAuthCookieClearHeaders } from "$/shared/auth.ts";
import { redirect } from "$/shared/helpers.ts";
import { State } from "$/shared/types.ts";

export const handler: Handlers<never, State> = {
  GET: () => redirect("/"),
  POST: () => {
    /**
     * We clear the auth cookie and redirect the user to the login page.
     */
    return redirect("/login", createAuthCookieClearHeaders());
  },
};