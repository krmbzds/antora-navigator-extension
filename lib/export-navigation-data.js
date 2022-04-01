'use strict'

const customSortComponents = require('./custom-sort-components')
const uglify = require('uglify-js')

function exportNavigationData (components, componentOrder = undefined, relativePath = 'site-navigation-data.js') {
  const navigationData = customSortComponents(components, componentOrder).map(({ name, title, versions }) => ({
    name,
    title,
    versions: versions
      .filter(({ site }) => !site)
      .map(({ version, displayVersion, navigation = [], prerelease }) => {
        if (displayVersion === version) displayVersion = undefined
        return { version, displayVersion, prerelease: prerelease && true, sets: strain(navigation) }
      }),
  }))
  const navigationDataSource = uglify.minify(`siteNavigationData = ${JSON.stringify(navigationData)}`, {
    compress: false,
    mangle: false,
    output: { max_line_len: 500 },
  }).code
  return {
    contents: Buffer.from(navigationDataSource),
    mediaType: 'application/javascript',
    out: { path: relativePath },
    path: relativePath,
    pub: { url: '/' + relativePath, rootPath: '' },
    src: { stem: relativePath.slice(0, relativePath.lastIndexOf('.')) },
  }
}

function strain (items) {
  return items.map((item) => {
    const strainedItem = { content: item.content }
    const urlType = item.urlType
    if (urlType) {
      strainedItem.url = item.url
      if (urlType !== 'internal') strainedItem.urlType = item.urlType
    }
    if (item.items) strainedItem.items = strain(item.items)
    return strainedItem
  })
}

module.exports = exportNavigationData
