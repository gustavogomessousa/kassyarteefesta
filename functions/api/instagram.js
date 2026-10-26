// Cloudflare Pages Function. Secrets are configured in the hosting dashboard.
export async function onRequestGet({env, request}) {
  const headers = {'Content-Type':'application/json; charset=utf-8'};
  if (!env.INSTAGRAM_ACCESS_TOKEN || !env.INSTAGRAM_USER_ID || !/^v\d+\.\d+$/.test(env.INSTAGRAM_API_VERSION || '')) {
    return new Response(JSON.stringify({posts:[]}), {status:503,headers});
  }
  const cache = caches.default;
  const key = new Request(new URL('/api/instagram',request.url),{method:'GET'});
  const cached = await cache.match(key);
  if (cached) return cached;
  try {
    const url = new URL(`https://graph.instagram.com/${env.INSTAGRAM_API_VERSION}/${encodeURIComponent(env.INSTAGRAM_USER_ID)}/media`);
    url.searchParams.set('fields','id,caption,media_type,media_url,thumbnail_url,permalink,timestamp');
    url.searchParams.set('limit','9');
    const result = await fetch(url, {headers:{Authorization:`Bearer ${env.INSTAGRAM_ACCESS_TOKEN}`},signal:AbortSignal.timeout(8000)});
    if (!result.ok) throw new Error('Instagram unavailable');
    const body = await result.json();
    if (!Array.isArray(body.data)) throw new Error('Invalid media response');
    const posts = body.data.map(p => ({src:p.media_type==='VIDEO' ? p.thumbnail_url : p.media_url,permalink:p.permalink,alt:p.caption?.slice(0,240) || 'Decoração da Kassy Arte & Festa'})).filter(p => p.src && p.permalink);
    const response = new Response(JSON.stringify({posts}),{headers:{...headers,'Cache-Control':'public, max-age=900, s-maxage=3600'}});
    await cache.put(key,response.clone());
    return response;
  } catch {
    return new Response(JSON.stringify({posts:[]}),{status:502,headers:{...headers,'Cache-Control':'no-store'}});
  }
}
