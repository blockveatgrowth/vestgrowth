import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXTAUTH_URL || 'https://investoboost.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: siteUrl,                          lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${siteUrl}/auth/signup`,         lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${siteUrl}/auth/signin`,         lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/#plans`,              lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${siteUrl}/#features`,           lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/#referral`,           lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];
}
