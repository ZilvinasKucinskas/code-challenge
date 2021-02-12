import { DataFetcher, DataParser } from './common'

process.on('unhandledRejection', (reason, p) => {
  console.warn('Unhandled Rejection at: Promise', p, 'reason:', reason)
})

// -- Parameters

const path = '../../files/van-gogh-paintings.html'
// const path = 'https://www.google.com/search?q=van+gogh+painting'
// const path = 'https://www.google.com/search?q=science+fiction+novels&oq=science+fiction+novels'

// -- Implementation

;(async () => {
  const htmlContent = await DataFetcher.getHtmlFromFileOrUrl(path)
  const catalogName = DataParser.getCatalogName(htmlContent)
  const items = DataParser.extractData(htmlContent)

  // // Debugging
  // console.log('htmlContent:', htmlContent)
  // console.log()
  // console.log('catalogName:', catalogName)
  // console.log()
  // console.log('items:', items)
  // console.log()

  process.stdout.write(`"${catalogName}": ${JSON.stringify(items, null, 2)}`)
})()
