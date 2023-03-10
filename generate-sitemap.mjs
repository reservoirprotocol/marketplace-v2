import { writeFileSync } from 'fs'
import { globby } from 'globby'
import { format } from 'prettier'

const chains = ['ethereum', 'polygon', 'goerli']

const generate = async () => {
  const pages = await globby([
    './pages/**/*.tsx', // Include all static & dynamic pages
    '!pages/api/**/*.ts', // Exclude API routes
    '!pages/_*.tsx', // Exclude _document.tsx & _app.tsx
    '!pages/404.tsx', // Excluse 404.tsx
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
                return `
                  <url>
                      <loc>${`http://localhost:3000${route}`}</loc>
                  </url>
                `
              })
              .join('')}
        </urlset>
        `

  const formatted = format(sitemap, {
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

  writeFileSync('public/sitemap.xml', formatted)
}

generate()
