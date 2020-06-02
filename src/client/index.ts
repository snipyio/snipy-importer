import { Variables, ClientError, GraphQLClientRequest } from './types'
import fetch from 'node-fetch'
import chalk from 'chalk'

interface ClientOptions {
  url?: string
  headers?: { [key: string]: any }
}

/**
 * Snipy GraphQL client.
 */
export class GraphQLClient {
  constructor(apiKey: string, options: ClientOptions = {}) {
    this.apiKey = apiKey
    this.url = options.url || 'https://api.snipy.io/graphql'
    this.options = options || {}
  }

  public request = async <T extends any>(
    query: string,
    variables?: Variables
  ): Promise<T> => {
    const { headers, ...others } = this.options

    const body = JSON.stringify({
      query,
      variables: variables ? variables : undefined,
    })

    const response = await fetch(this.url, {
      method: 'POST',
      headers: {
        Authorization: this.apiKey,
        'Content-Type': 'application/json',
        ...headers,
      },
      body,
      ...others,
    })

    const result = await response.json()

    if (response.ok && !result.errors && result.data) {
      return result.data
    } else {
      const errorResult =
        typeof result === 'string' ? { error: result } : result

      if (
        response.status === 200 &&
        result.errors &&
        result.errors.length > 0
      ) {
        console.log(chalk.red('Error occurred while importing:\n'))
        console.log(chalk.blue(JSON.stringify(result, undefined, 2)))
      }

      throw new ClientError(
        { ...errorResult, status: response.status },
        { query, variables }
      )
    }
  }

  // -- Private interface
  private apiKey: string
  private url: string
  private options: ClientOptions
}

/**
 * Create a new Snipy API client.
 *
 * Example:
 *
 * ```
 * import snipyClient from '.';
 * const snipy = snipyClient(SNIPY_API_KEY);
 * snipy(`
 *   query { ... }
 * `, { ...attrs });
 * ```
 */
export default (
  apiKey: string,
  options?: ClientOptions
): GraphQLClientRequest => {
  const client = new GraphQLClient(apiKey, options)
  return client.request
}
