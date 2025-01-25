import {createWithCache, CacheLong, type CachingStrategy} from '@shopify/hydrogen';

export function createRickAndMortyClient({
    cache,
    waitUntil,
    request,
  }: {
    cache: Cache;
    waitUntil: ExecutionContext['waitUntil'];
    request: Request;
  }) {
    const withCache = createWithCache({cache, waitUntil, request});
  
    async function query<T = any>(
      query: `#graphql:rickAndMorty${string}`,
      options: {
        variables?: object;
        cacheStrategy?: CachingStrategy;
      } = {variables: {}, cacheStrategy: CacheLong()},
    ) {
      const result = await withCache.fetch<{data: T; error: string}>(
        'https://rickandmortyapi.com/graphql',
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
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
  
    return {query};
  }