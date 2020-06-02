import chalk from 'chalk'
import { githubClient } from './client'
import { Importer, ImportResult } from '../../types'
import { autoDetectLanguage } from '../../util/linguist'
import { truncate, humanize } from '../../util/strings'

interface GITHUB_GIST {
  id: string
  description: string
  url: string
  files?: {
    name: string
    isImage: boolean
    text: string
    language: {
      name: string
    }
  }[]
}

/**
 * Fetch and paginate through all users Gists.
 *
 * @param apiKey GitHub api key for authentication
 */
export class GithubImporter implements Importer {
  public constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  public get name() {
    return 'GitHub Gist'
  }

  public import = async (): Promise<ImportResult> => {
    let gistsData: GITHUB_GIST[] = []
    let cursor = undefined
    const github = githubClient(this.apiKey)

    while (true) {
      try {
        const data = (await github(
          `query($perPage: Int, $cursor: String) {
              viewer {
                gists(first: $perPage, after: $cursor) {
                  edges {
                    node {
                      id
                      description
                      url
                      files {
                        name
                        isImage
                        text
                        language {
                          name
                        }
                      }
                    }
                  }
                  pageInfo {
                    hasNextPage
                    endCursor
                  }
                }
              }
            }
          `,
          {
            perPage: 25,
            cursor,
          }
        )) as any

        // User didn't select gist scope
        if (!data || !data?.viewer?.gists) {
          throw new Error(
            'Unable to find any gists. Did you select `gist` scope for your GitHub token?'
          )
        }

        cursor = data.viewer.gists.pageInfo.endCursor

        const fetchedGists = data.viewer.gists.edges.map(
          (data: any) => data.node
        ) as GITHUB_GIST[]

        gistsData = gistsData.concat(fetchedGists)

        if (!data.viewer.gists.pageInfo.hasNextPage) {
          break
        }
      } catch (err) {
        console.log(chalk.red('Error occurred while importing:'))
        throw err
      }
    }

    const importData: ImportResult = {
      snippets: [],
    }

    for (const gist of gistsData) {
      const title = gist.description
        ? truncate(gist.description, 28)
        : gist.files && gist.files.length > 0
        ? humanize(gist.files[0].name)
        : 'Untitled'

      // normalize
      importData.snippets.push({
        title,
        description: gist.description,
        importUrl: gist.url,
        chunks: gist.files
          ?.filter(f => !f.isImage)
          .map(file => ({
            filename: file.name,
            language: file.language.name,
            contents: file.text,
            ...autoDetectLanguage(file.name, file.text),
          })),
      })
    }

    return importData
  }

  // -- Private interface
  private apiKey: string
}
