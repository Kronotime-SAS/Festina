import {createWithCache, CacheLong, type CachingStrategy} from '@shopify/hydrogen';

export function createAdminAPI({
    env,
    cache,
    waitUntil,
    request,
  }: {
    env: Env;
    cache: Cache;
    waitUntil: ExecutionContext['waitUntil'];
    request: Request;
  }) {
    const withCache = createWithCache({cache, waitUntil, request});
  
    async function query<T = any>(
      query: `#graphql:adminAPI${string}`,
      options: {
        variables?: object;
        cacheStrategy?: CachingStrategy;
      } = {variables: {}, cacheStrategy: CacheLong()},
    ) {
      const result = await withCache.fetch<{data: T; error: string}>(
        `https://${env.PUBLIC_STORE_DOMAIN}/admin/api/${env.PUBLIC_API_VERSION}/graphql.json`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            'X-Shopify-Access-Token': env.PRIVATE_ADMIN_API_TOKEN
          },
          body: JSON.stringify({
            query,
            variables: options.variables,
          }),
        },
        {
          cacheKey: ['r&m', query, JSON.stringify(options.variables)],
          cacheStrategy: options.cacheStrategy,
          shouldCacheResponse: (body: {data: T; error: string}) =>
            body.error == null || body.error.length === 0,
        },
      );
      return result.data;
    }
    const mutate = query;
    return {query, mutate};
  }