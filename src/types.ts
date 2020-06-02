export type Maybe<T> = T | null
export type Scalars = {
  String: string
}

/** A Snippet */
export type Snippet = {
  description?: Maybe<Scalars['String']>
  title: Scalars['String']
  importUrl: Maybe<Scalars['String']>
  /** Snippet chunks */
  chunks?: Maybe<Array<Chunk>>
}

/** A Chunk */
export type Chunk = {
  aliases?: Maybe<Array<Scalars['String']>>
  contents: Scalars['String']
  filename: Scalars['String']
  language?: Maybe<Scalars['String']>
  languageCode?: Maybe<Scalars['String']>
  mimeType?: Maybe<Scalars['String']>
}

/** Import response. */
export interface ImportResult {
  snippets: Snippet[]
}

/**
 * Generic importer interface.
 */
export interface Importer {
  // Import source name (e.g. 'GitHub')
  name: string
  // Gets snippets from the import source
  import(): Promise<ImportResult>
}

export interface ImportAnswers {
  // Snipy API key
  snipyApiKey: string
  // Import service type
  service: string
}
