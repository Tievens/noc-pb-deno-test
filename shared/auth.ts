// shared/auth.ts
import Pocketbase from "pocketbase";
import { FreshContext } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import { env } from "$/shared/env.ts";
import { AuthCookie, State, User } from "$/shared/types.ts";
import { record } from "https://deno.land/x/zod@v3.22.4/types.ts";

export async function createState(headers: Headers): Promise<State> {
  const pb = new Pocketbase(env("POCKET_BASE_URL"));

  let user: User | undefined;

  getUser: {
    pb.authStore.loadFromCookie(headers.get("cookie") ?? "", AuthCookie.Name);

    if (!pb.authStore.isValid) {
      break getUser;
    }

    try {
      /**
       * We need to refresh the user record to get the latest data. This is
       * because the user's data might have changed since the last time the user
       * logged in.
       */
      const { record } = await pb.collection("users").authRefresh<User>();

      user = record;
      user.avatarUrl = new URL(
        `/api/files/users/${user.id}/${user.avatar}`,
        env("POCKET_BASE_URL")
      ).toString();
    } catch (error) {
      console.error(error);
    }
  }

  return { pb, user };
}

export function createAuthCookieHeaders(ctx: FreshContext<State>): Headers {
  const headers = new Headers();

  const { pb } = ctx.state;
  const { hostname } = ctx.url;

  const authCookie = pb.authStore.exportToCookie(
    {
      maxAge: Number(AuthCookie.MaxAge),
      sameSite: String(AuthCookie.SameSite),
      secure: !hostname.startsWith("localhost"), // Safari...
    },
    AuthCookie.Name
  );

  headers.set("set-cookie", authCookie);
  return headers;
}

export function createAuthCookieClearHeaders(): Headers {
  const headers = new Headers();

  setCookie(headers, {
    name: String(AuthCookie.Name),
    value: "",
    maxAge: 0,
  });

  return headers;
}