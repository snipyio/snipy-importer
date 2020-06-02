import * as inquirer from 'inquirer'
import { ImportAnswers } from './types'
import { importSnippets } from './importSnippets'
import { githubImport } from './importers/github'
;(async () => {
  try {
    const importAnswers = await inquirer.prompt<ImportAnswers>([
      {
        type: 'password',
        name: 'snipyApiKey',
        message: 'Enter your Snipy API key',
      },
      // FIXME: For more importers, enable:
      // {
      //   type: 'list',
      //   name: 'service',
      //   message: 'Which service would you like to import from?',
      //   choices: [
      //     {
      //       name: 'GitHub',
      //       value: 'github',
      //     },
      //   ],
      // },
    ])

    // let importer
    // switch (importAnswers.service) {
    //   case 'github':
    //     importer = await githubImport()
    //     break

    //   default:
    //     console.log(chalk.red('Invalid importer'))
    //     return
    // }

    // if (importer) {
    //   await importSnippets(importAnswers.snipyApiKey, importer)
    // }
    const importer = await githubImport()
    await importSnippets(importAnswers.snipyApiKey, importer)
  } catch (e) {
    console.error(e)
  }
})()
