// routes/login.tsx
import { Handlers, PageProps } from "$fresh/server.ts";
import { createAuthCookieHeaders } from "$/shared/auth.ts";
import { redirect } from "$/shared/helpers.ts";
import { State } from "$/shared/types.ts";

type LoginResult = {
  errorMessage?: string;
};

export default function Login({ data }: PageProps<LoginResult>) {
  return (
    <main>
      <h1>Login</h1>
      <form method="POST">
        <input
          name="identity"
          type="text"
          aria-label="Email or username"
          placeholder="Enter your email or username"
          required
        />
        <input
          name="password"
          type="password"
          aria-label="Password"
          placeholder="Enter your password"
          required
        />
        <button type="submit">Login</button>
        {data?.errorMessage && <p>{data.errorMessage}</p>}
      </form>
    </main>
  );
}

export const handler: Handlers<LoginResult, State> = {
  POST: async (req, ctx) => {
    const formData = await req.formData();

    const identity = formData.get("identity")?.toString();
    const password = formData.get("password")?.toString();

    if (!identity || !password) {
      return ctx.render({
        errorMessage: "Missing identity or password",
      });
    }

    try {
      await ctx.state.pb
        .collection("users")
        .authWithPassword(identity, password);

      const headers = createAuthCookieHeaders(ctx);

      return redirect("/", headers);
    } catch (error) {
      console.error(error);
      return ctx.render({
        errorMessage: error.message,
      });
    }
  },
};