/* eslint-env mocha */
'use strict'

const { expect } = require('./harness')
const exportNavigationData = require('../lib/export-navigation-data')

describe('exportNavigationData', () => {
  it('should export navigation data to virtual file', () => {
    const components = [
      {
        name: 'the-component',
        title: 'The Component',
        versions: [
          {
            version: '2.0',
            navigation: [
              {
                content: 'The Component',
                url: '/the-component/2.0/index.html',
                urlType: 'internal',
                items: [
                  {
                    content: 'The Page',
                    url: '/the-component/2.0/the-page.html',
                    urlType: 'internal',
                  },
                ],
              },
            ],
          },
        ],
      },
    ]
    const jsFile = exportNavigationData(components)
    expect(jsFile).to.have.property('mediaType', 'application/javascript')
    expect(jsFile).to.have.property('path', 'site-navigation-data.js')
    expect(jsFile).to.have.nested.property('out.path', 'site-navigation-data.js')
    const navData = (() => {
      let siteNavigationData
      eval(jsFile.contents.toString()) // eslint-disable-line no-eval
      return siteNavigationData
    })()
    expect(navData).not.to.be.undefined()
    expect(navData).to.have.lengthOf(1)
    expect(navData[0]).to.eql({
      name: 'the-component',
      title: 'The Component',
      versions: [
        {
          version: '2.0',
          sets: [
            {
              content: 'The Component',
              url: '/the-component/2.0/index.html',
              items: [
                {
                  content: 'The Page',
                  url: '/the-component/2.0/the-page.html',
                },
              ],
            },
          ],
        },
      ],
    })
  })
})
