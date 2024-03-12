// routes/_middleware.ts
import { FreshContext } from "$fresh/server.ts";
import { createState } from "$/shared/auth.ts";
import { redirect } from "$/shared/helpers.ts";
import { State } from "$/shared/types.ts";

export async function handler(req: Request, ctx: FreshContext<State>) {
  /**
   * If we're requesting anything other than a route, we don't need to check
   * for the user session. E.g. static files.
   */
  if (ctx.destination !== "route") {
    return ctx.next();
  }

  ctx.state = await createState(req.headers);

  const isLoginRoute = ctx.url.pathname === "/login";

  if (!ctx.state.user) {
    /**
     * If the user is not logged in and the route is not the login route, we
     * redirect the user to the login page. Otherwise, we continue to the next
     * handler.
     */
    return isLoginRoute ? ctx.next() : redirect("/login");
  }

  /**
   * If the user is logged in and the route is the login route, we redirect the
   * user to the home page. Otherwise, we continue to the next handler.
   */
  return isLoginRoute ? redirect("/") : ctx.next();
}