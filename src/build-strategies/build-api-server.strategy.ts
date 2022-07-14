import { BuildStrategy, Project } from "../types";
import path from 'path'
import util from 'util'

const ncp = util.promisify(require('ncp').ncp)
export default class BuildApiServerStrategy implements BuildStrategy {
  project: Project;

  constructor(project: Project) {
    this.project = project;
  }

  async build() {
    const { name, framework, type } = this.project
    const tempDir = type.toLowerCase()

    await ncp(
      path.join(__dirname, `../../templates/${tempDir}/${framework}`),
      name
    )

  }
}