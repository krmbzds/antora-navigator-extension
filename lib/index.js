'use strict'

const expandPath = require('@antora/expand-path-helper')
const exportNavigationData = require('./export-navigation-data')
const { promises: fsp } = require('fs')

module.exports.register = function ({ config: { configFile = './antora-navigator.yml' } }) {
  this.once('beforePublish', async ({ playbook, siteAsciiDocConfig, contentCatalog, siteCatalog }) => {
    const { 'site-component-order': siteComponentOrder, 'site-navigation-data-path': siteNavigationDataPath } =
      siteAsciiDocConfig.attributes
    const ownComponents = contentCatalog.getComponents().filter(({ site }) => !site)
    const navConfig = await loadYamlFile.call(this, expandPath(configFile, '~+', playbook.dir))
    if ('output_file' in navConfig) {
      navConfig.outputFile = navConfig.output_file
      delete navConfig.output_file
    }
    if (!navConfig.outputFile) navConfig.outputFile = siteNavigationDataPath || 'site-navigation-data.js'
    if (siteComponentOrder && !('components' in navConfig)) navConfig.components = siteComponentOrder
    const startPage = contentCatalog.getSiteStartPage()
    siteCatalog.addFile(exportNavigationData(ownComponents, navConfig, startPage && startPage.pub.url))
  })
}

function loadYamlFile (path) {
  const yaml = require(require.resolve('js-yaml', {
    paths: [require.resolve('@antora/playbook-builder', { paths: this.module.paths }) + '/..'],
  }))
  return fsp.readFile(path).then(
    (contents) => yaml.load(contents, { schema: yaml.CORE_SCHEMA }),
    () => ({})
  )
}
