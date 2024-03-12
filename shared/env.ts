import { load } from "$std/dotenv/mod.ts";
import { parse } from "zodenv";

await load({
  export: true,
});

export const [config, env] = parse((e) => ({
  POCKET_BASE_URL: e.url(),
}));