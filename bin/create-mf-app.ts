#!/usr/bin/env node
import inquirer from 'inquirer'
import shell from 'shelljs'
import fs from 'fs'
import path from 'path'
import { buildProject } from '../src/index'
import { Project } from '../src/types'
;(async function () {
  const answers = await inquirer.prompt<Project>([
    {
      type: 'input',
      message: 'Pick the name of your app:',
      name: 'name',
      default: 'host',
    },
    {
      type: 'list',
      message: 'Project Type:',
      name: 'type',
      choices: ['Application', 'API Server', 'Library'],
      default: 'Application',
    },
  ])

  if (answers.type === 'Library') {
    await buildProject(answers)
  }

  if (answers.type === 'API Server') {
    const templates = fs
      .readdirSync(path.join(__dirname, '../templates/server'))
      .sort()

    const serverAnswers = await inquirer.prompt<Project>([
      {
        type: 'input',
        message: 'Port number:',
        name: 'port',
        default: '8080',
      },
      {
        type: 'list',
        message: 'Template:',
        name: 'framework',
        choices: templates,
        default: 'express',
      },
    ])

    await buildProject({
      ...answers,
      ...serverAnswers,
      language: 'typescript',
    })
  }

  if (answers.type === 'Application') {
    const templates = fs
      .readdirSync(path.join(__dirname, '../templates/application'))
      .sort()

    const appAnswers = await inquirer.prompt<Project>([
      {
        type: 'input',
        message: 'Port number:',
        name: 'port',
        default: '8080',
      },
      {
        type: 'list',
        message: 'Framework:',
        name: 'framework',
        choices: templates,
        default: 'react',
      },
      {
        type: 'list',
        message: 'Language:',
        name: 'language',
        choices: ['typescript', 'javascript'],
        default: 'javascript',
      },
      {
        type: 'list',
        message: 'CSS:',
        name: 'css',
        choices: ['CSS', 'Tailwind'],
        default: 'CSS',
      },
    ])

    let version: Project | undefined;
    const lang = appAnswers.language === 'typescript' ? 'ts' : 'js';
    try {
      const versions = fs
        .readdirSync(path.join(__dirname, `../templates/application/${appAnswers.framework}/${lang}/versions`))
        .sort()

        version = await inquirer.prompt<Project>([
          {
            type: 'list',
            message: 'Version:',
            name: 'version',
            choices: versions,
            default: 'v17',
          },
        ])
    }
    catch (error) {
      console.log(`there aren't multiple versions of ${appAnswers.framework}`);
    }

    console.log(version, 'version on the cli part');

    await buildProject({
      ...answers,
      ...appAnswers,
      ...version
    })
  }

  shell.echo(`Your '${answers.name}' project is ready to go.

Next steps:

▶️ cd ${answers.name}
▶️ npm install
▶️ npm start
`)
})()
