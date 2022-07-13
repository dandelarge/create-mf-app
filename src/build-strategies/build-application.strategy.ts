import fs from 'fs'
import path from 'path'
import util from 'util'

import { BuildStrategy, Profiler, Project } from "../types";

const ncp = util.promisify(require('ncp').ncp)

export default class BuildApplicationStrategy implements BuildStrategy {
  project: Project;
  profiler: Profiler;

  constructor(project: Project, profiler: Profiler) {
    this.project = project;
    this.profiler = profiler;
  }

  async build() {

    const { language, name, framework, type, version } = this.project
    const lang = language === 'typescript' ? 'ts' : 'js'
    const tempDir = type.toLowerCase()

    console.log(version, 'version on the strategy');


    try {
    await ncp(
      path.join(__dirname, `../../templates/${tempDir}/${framework}/base`),
      name
    )
    await ncp(
      path.join(__dirname, `../../templates/${tempDir}/${framework}/${lang}/versions/${version}`),
      name
    )
    }
    catch (error) {
      console.log(error, 'This shit broke yo');
    }

    if (this.profiler.CSS_EXTENSION === 'scss') {
      fs.unlinkSync(path.normalize(`${name}/src/index.css`))

      try {
      await ncp(
          path.join(__dirname, '../../templates/application-extras/tailwind'),
          name
      )
      }
      catch (error) {
        console.log(error, 'This shit broke in tailwind yo');
      }

      const packageJSON = JSON.parse(
          fs.readFileSync(path.join(name, 'package.json'), 'utf8')
      )
      packageJSON.devDependencies.tailwindcss = '^2.0.2'
      fs.writeFileSync(
          path.join(name, 'package.json'),
          JSON.stringify(packageJSON, null, 2)
      )
    }
  }
}