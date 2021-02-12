import cheerio from 'cheerio'
import { ResultItem } from './interfaces'

export class DataParser {
  /**
   * Get grouping name in lower case.
   * Returns empty string if not found.
   */
  static getCatalogName(htmlContent: string): string {
    const $ = cheerio.load(htmlContent)
    const name = $('.kxbc[jsaction="llc.sbc"]').attr('data-elabel')
    if (!name) {
      return ''
    }
    return name.toLowerCase()
  }

  static extractData(htmlContent: string): ResultItem[] {
    const $ = cheerio.load(htmlContent)
    const items: ResultItem[] = []

    $('.klitem-tr .klitem[aria-label]').each((i, el) => {
      const elem = $(el)
      const item: ResultItem = {
        name: elem.prop('aria-label'),
        extensions: DataParser.getExtensions(elem),
        link: `https://www.google.com${elem.prop('href')}`,
        image: DataParser.getImageLinkByIndex($, i),
      }
      items.push(item)
    })

    return items
  }

  private static getImageLinks($: cheerio.Root): string[] {
    const imgScripts: cheerio.Cheerio[] = []
    $('script').each((i, el) => {
      const elem = $(el)
      const elemHtml = elem.html()
      if (!!elemHtml && elemHtml.indexOf('kximg') > 0) {
        imgScripts.push(elem)
      }
    })

    const imageLinks: string[] = []
    const matchExpr = /vars='(.*?)';varii=\['kximg/g
    const imageLinksString = imgScripts.join('').replace(/\s/gi, '')
    const validLinks = imageLinksString.matchAll(matchExpr)
    for (const link of validLinks) {
      const targetValue = link[1].replace(/\\/g, '')
      imageLinks.push(targetValue)
    }
    return imageLinks
  }

  private static getImageLinkByIndex($: cheerio.Root, index: number): string | null {
    const imageLinks = DataParser.getImageLinks($)
    if (imageLinks.length < index) {
      return null
    }

    const imageLink = imageLinks[index]
    if (!imageLink) {
      return null
    }
    return imageLink
  }

  private static getExtensions(elem: cheerio.Cheerio): string[] | undefined {
    const extension = elem.find('.klmeta').text().trim()
    if (!extension) {
      return undefined
    }
    return [extension]
  }
}
