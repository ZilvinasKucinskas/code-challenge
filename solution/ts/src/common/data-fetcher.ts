import axios from 'axios'
import fs from 'fs'

export class DataFetcher {
  static isPathUrl(path: string): boolean {
    // TODO: improve common protocol recognition
    if (path.indexOf('https://') === 0) {
      return true
    }
    return false
  }

  static async getHtmlFromFileOrUrl(path: string): Promise<string> {
    if (DataFetcher.isPathUrl(path)) {
      return DataFetcher.getHtmlFromUrl(path)
    }
    return DataFetcher.getHtmlFromFile(path)
  }

  static async getHtmlFromUrl(path: string): Promise<string> {
    const res = await axios.get(path)
    return res.data
  }

  static async getHtmlFromFile(path: string, encoding = 'utf-8'): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(path, encoding, (err, data) => {
        if (err) {
          return reject(err)
        }
        return resolve(data)
      })
    })
  }
}
