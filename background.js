import { LANGUAGES, DEFAULT_LANGUAGE_CODE } from './constants.js'

let preferredLanguage
chrome.storage.sync.get({ preferredLanguage: DEFAULT_LANGUAGE_CODE }, data => {
  preferredLanguage = data.preferredLanguage
})

chrome.webRequest.onBeforeRequest.addListener(
  details => {
    const url = new URL(details.url)
    const [languageCode, ...rest] = splitPathname(url.pathname)

    if (
      !isLanguageCode(languageCode) ||
      languageCode === preferredLanguage ||
      !preferredLanguage
    )
      return

    url.pathname = concatPathname([preferredLanguage, ...rest])

    return { redirectUrl: url.href }
  },
  {
    urls: ['*://developer.mozilla.org/*'],
    types: ['main_frame', 'sub_frame']
  },
  ['blocking']
)

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && 'preferredLanguage' in changes) {
    preferredLanguage = changes.preferredLanguage.newValue
  }
})

function splitPathname(pathname) {
  return pathname.split('/').filter(filterEmptyString)
}

function filterEmptyString(str) {
  return str !== ''
}

function isLanguageCode(languageCode) {
  return Object.keys(LANGUAGES).includes(languageCode)
}

function concatPathname(parts) {
  if (parts.length <= 0) return '/'

  return '/' + parts.join('/')
}
