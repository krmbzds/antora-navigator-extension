'use strict'

const exportNavigationData = require('./export-navigation-data')

module.exports.register = function () {
  this.once('beforePublish', ({ siteAsciiDocConfig, contentCatalog, siteCatalog }) => {
    const { 'site-component-order': siteComponentOrder, 'site-navigation-data-path': siteNavigationDataPath } =
      siteAsciiDocConfig.attributes
    const localComponents = contentCatalog.getComponents().filter(({ site }) => !site)
    siteCatalog.addFile(exportNavigationData(localComponents, siteComponentOrder, siteNavigationDataPath))
  })
}
