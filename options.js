import { LANGUAGES, DEFAULT_LANGUAGE_CODE } from './constants.js'

function saveOptions() {
  const preferredLanguage = document.getElementById('preferredLanguage').value

  chrome.storage.sync.set({ preferredLanguage }, () => {
    const status = document.getElementById('status')
    status.textContent = 'Options saved.'
    setTimeout(() => {
      status.textContent = ''
    }, 750)
  })
}

function restoreOptions() {
  chrome.storage.sync.get(
    { preferredLanguage: DEFAULT_LANGUAGE_CODE },
    ({ preferredLanguage }) => {
      document.getElementById('preferredLanguage').value = preferredLanguage
    }
  )
}

function init() {
  const preferredLanguageSelect = document.getElementById('preferredLanguage')
  const optionsFragment = document.createDocumentFragment()

  Object.keys(LANGUAGES).forEach(languageCode => {
    const option = document.createElement('option')
    option.value = languageCode
    option.text = LANGUAGES[languageCode]
    optionsFragment.appendChild(option)
  })

  preferredLanguageSelect.appendChild(optionsFragment)

  restoreOptions()
}

document.addEventListener('DOMContentLoaded', init)
document.getElementById('save').addEventListener('click', saveOptions)
