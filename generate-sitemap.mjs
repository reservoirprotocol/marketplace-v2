import { writeFileSync } from 'fs'
import { globby } from 'globby'
import { format } from 'prettier'

const CHAINS = ['ethereum', 'polygon', 'goerli']
const HOST_URL = process.env.NEXT_PUBLIC_HOST_URL

const generateSitemap = async () => {
  const pages = await globby([
    './pages/**/*.tsx', // Include all static & dynamic pages
    '!pages/api/**/*.ts', // Exclude API routes
    '!pages/_*.tsx', // Exclude _document.tsx & _app.tsx
    '!pages/404.tsx', // Exclude 404.tsx
  ])

  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${pages
      .map((page) => {
        const route = page
          .replace('./pages', '')
          .replace('.tsx', '')
          .replace('index', '')
        if (route.includes('chain')) {
          return CHAINS.map(
            (chain) => `<url>
              <loc>https://${HOST_URL}${route.replace('[chain]', chain)}</loc>
            </url>`
          ).join('\n')
        } else {
          return `<url>
              <loc>${HOST_URL}${route}</loc>
            </url>`
        }
      })
      .join('\n')}
    </urlset>
  `

  const formattedSitemap = format(sitemap, {
    semi: true,
    trailingComma: 'all',
    singleQuote: true,
    printWidth: 120,
    tabWidth: 2,
    arrowParens: 'avoid',
    htmlWhitespaceSensitivity: 'strict',
    endOfLine: 'auto',
    parser: 'html',
  })

  writeFileSync('public/sitemap.xml', formattedSitemap)
}

generateSitemap()
