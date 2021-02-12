import fs from 'fs'
import _ from 'lodash'
import { ResultItem } from './common'

// -- Parameters

const expectedDataPath = '../../files/expected-array.json'
const actualDataPath = './results/actual-array.json'

// -- Implementation

async function getDataArray(path: string, encoding = 'utf-8'): Promise<ResultItem[]> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, encoding, (err, data) => {
      if (err) {
        return reject(err)
      }
      const jsonString = data.replace(`"artworks":`, '').trim()
      const obj = JSON.parse(jsonString)
      return resolve(obj)
    })
  })
}

;(async () => {
  console.log('=== START ===')

  const expectedDataArray = await getDataArray(expectedDataPath)
  const actualDataArray = await getDataArray(actualDataPath)

  console.log('expectedDataArray.length:', expectedDataArray.length)
  console.log('actualDataArray.length:', actualDataArray.length)
  console.log()

  // -- item matching
  let hasError = false
  console.log('Compare each data item...')
  for (let i = 0; i < expectedDataArray.length; i++) {
    const expectedDataItem = expectedDataArray[i]
    const actualDataItem = actualDataArray[i]
    const isEqual = _.isEqual(expectedDataItem, actualDataItem)

    if (!isEqual) {
      console.log('=== i:', i, `(${expectedDataItem.name})`)

      if (expectedDataItem.name !== actualDataItem.name) {
        console.log('> [name] mismatch!')
        console.log('Expect:', expectedDataItem.name)
        console.log('Actual:', actualDataItem.name)
        hasError = true
      }

      if (!_.isEqual(expectedDataItem.extensions, actualDataItem.extensions)) {
        console.log('> [extensions] mismatch!')
        console.log('Expect:', expectedDataItem.extensions)
        console.log('Actual:', actualDataItem.extensions)
        hasError = true
      }

      if (expectedDataItem.link !== actualDataItem.link) {
        console.log('> [link] mismatch!')
        console.log('Expect:', expectedDataItem.link)
        console.log('Actual:', actualDataItem.link)
        hasError = true
      }

      if (expectedDataItem.image !== actualDataItem.image) {
        console.log('> [image] mismatch!')
        // console.log('Expect:', expectedDataItem.image)
        // console.log('Actual:', actualDataItem.image)
        hasError = true
      }

      console.log()
    }
  }

  if (!hasError) {
    console.log('All data match up as as expected!')
  }

  console.log()

  console.log('=== END ===')
})()
