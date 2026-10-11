const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.VERCEL_PROJECT_PRODUCTION_URL ??
  process.env.VERCEL_URL;

export const siteUrl = (() => {
  if (!configuredSiteUrl) {
    return process.env.NODE_ENV === 'development'
      ? new URL('http://localhost:3000')
      : null;
  }

  try {
    const value = /^https?:\/\//i.test(configuredSiteUrl)
      ? configuredSiteUrl
      : `https://${configuredSiteUrl}`;
    return new URL(new URL(value).origin);
  } catch {
    return null;
  }
})();
