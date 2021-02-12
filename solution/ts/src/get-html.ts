import { DataFetcher } from './common'

process.on('unhandledRejection', (reason, p) => {
  console.warn('Unhandled Rejection at: Promise', p, 'reason:', reason)
})

// -- Parameters

const path = 'https://www.google.com/search?q=van+gogh+painting'
// const path = 'https://www.google.com/search?q=science+fiction+novels&oq=science+fiction+novels'

// -- Implementation

;(async () => {
  const htmlContent = await DataFetcher.getHtmlFromFileOrUrl(path)
  process.stdout.write(htmlContent)
})()
