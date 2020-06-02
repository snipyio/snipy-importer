import { GithubImporter } from './GithubImporter'
import * as inquirer from 'inquirer'
import { Importer } from '../../types'

export const githubImport = async (): Promise<Importer> => {
  const answers = await inquirer.prompt<GithubImportAnswers>(questions)
  const githubImporter = new GithubImporter(answers.githubApiKey)

  return githubImporter
}

interface GithubImportAnswers {
  githubApiKey: string
}

const questions = [
  {
    type: 'password',
    name: 'githubApiKey',
    message:
      'Enter your personal GitHub access token (https://github.com/settings/tokens, select `gist` scope)',
  },
]
