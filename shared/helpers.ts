// shared/helpers.ts
export function redirect(path: string, headers = new Headers()) {
    headers.set("Location", path);
  
    return new Response(null, {
      headers,
      status: 303,
    });
  }