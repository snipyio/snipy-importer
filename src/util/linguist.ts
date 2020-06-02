import hljs from 'highlight.js'
import languages from './languages.json'

export const highlight = (filename: string, contents: string) => {
  const ext = filename.split('.')[1]
  // @ts-ignore
  if (ext !== 'txt' && languages[ext] !== undefined) {
    return hljs.highlight(ext, contents, true)
  }
  return hljs.highlightAuto(contents)
}

export const autoDetectLanguage = (filename: string, contents: string) => {
  const result = highlight(filename, contents)
  const languageCode = result.language || 'txt' // default to plain text
  // @ts-ignore
  const meta = languages[languageCode]

  if (!meta) {
    return {
      languageCode,
    }
  }

  return {
    language: meta.name,
    languageCode,
    mimeType: meta.mimeType,
    aliases: meta.aliases,
  }
}
