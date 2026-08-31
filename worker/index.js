export default {
  async fetch(request, environment) {
    const response = await environment.ASSETS.fetch(request);
    const url = new URL(request.url);

    if (!url.pathname.startsWith("/images/") || !response.ok) {
      return response;
    }

    const headers = new Headers(response.headers);
    headers.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
