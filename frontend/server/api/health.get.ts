export default defineEventHandler(() => {
  const config = useRuntimeConfig();
  return {
    status: 'ok',
    service: 'titan-logistics-nuxt4-gateway',
    upstreamApiBaseUrl: config.public.apiBaseUrl,
    timestamp: new Date().toISOString(),
  };
});
