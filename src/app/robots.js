export default function robots() {
const baseUrl = 'https://vorschlag-blog.vercel.app'

return {
    rules: {
    userAgent: '*',
    allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
}
}