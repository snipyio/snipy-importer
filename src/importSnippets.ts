import * as inquirer from 'inquirer'
import chalk from 'chalk'
import { Importer } from './types'
import snipyClient from './client'

interface ImportAnswers {
  targetWorkspaceId: string
  collectionName: string
}

interface WorkspacesResponse {
  workspaces: {
    id: string
    name: string
  }[]
}

interface CollectionResponse {
  createCollection: {
    id: string
  }
}

export const importSnippets = async (apiKey: string, importer: Importer) => {
  const snipy = snipyClient(apiKey)
  const importData = await importer.import()

  const queryInfo = (await snipy(
    `query {
      workspaces {
        id
        name
      }
      memberships {
        workspaceId
        role
      }
    }`
  )) as WorkspacesResponse

  const workspaces = queryInfo.workspaces

  // Prompt the user to choose a workspace and create a collection
  const importAnswers = await inquirer.prompt<ImportAnswers>([
    {
      type: 'list',
      name: 'targetWorkspaceId',
      message: 'Import into workspace:',
      choices: async () => {
        return workspaces.map((workspace: { id: string; name: string }) => ({
          name: workspace.name,
          value: workspace.id,
        }))
      },
    },
    {
      type: 'input',
      name: 'collectionName',
      message: 'Name of the collection (will be created):',
      default: importer.name,
    },
  ])

  const collectionResponse = (await snipy(
    `mutation CreateCollection($input: CreateCollectionInput!) {
      createCollection(input: $input) {
        id
      }
    }`,
    {
      input: {
        workspaceId: importAnswers.targetWorkspaceId as string,
        name: importAnswers.collectionName as string,
        visibility: 'private',
      },
    }
  )) as CollectionResponse

  const collectionId = collectionResponse.createCollection.id

  // Create snippets
  for (const snippet of importData.snippets) {
    await snipy(
      `mutation CreateSnippet($input: CreateSnippetInput!) {
        createSnippet(input: $input) {
          id
        }
      }`,
      {
        input: {
          workspaceId: importAnswers.targetWorkspaceId,
          collectionId,
          ...snippet,
        },
      }
    )
  }

  console.error(
    chalk.green(
      `🎉 We've imported ${importData.snippets.length} snippets from ${importer.name}!`
    )
  )
}
