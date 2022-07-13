import { BuildArgs, BuildStrategy, Project } from "../types";
import util from 'util'
import path from 'path'

const ncp = util.promisify(require('ncp').ncp)

export default class BuildLibraryStrategy implements BuildStrategy {
  project: Project;

  constructor(project: Project) {
    this.project = project;
  }

  async build() {
    const { type } = this.project
    const tempDir = type.toLowerCase()
    await ncp(
      path.join(__dirname, `../../templates/${tempDir}/typescript`),
      this.project.name
    )
  }
}