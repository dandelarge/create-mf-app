import util from 'util'
import fs from 'fs'
import path from 'path'
import glob from 'glob'
import { Profiler, Project } from './types'
import BuildContext from './build-context'
import BuildLibraryStrategy from './build-strategies/build-library.strategy'
import BuildApplicationStrategy from './build-strategies/build-application.strategy'
import BuildApiServerStrategy from './build-strategies/build-api-server.strategy'

const templateFile = (fileName: string, replacements: Profiler) => {
  const fileContent = fs.readFileSync(fileName, 'utf8').toString()

  const template = Object.entries(replacements).reduce((acc, [key, value]) => {
    return acc.replace(
      new RegExp(`(\{\{${key}\}\}|\{\{ ${key} \}\})`, 'g'),
      value?.toString() ?? ''
    )
  }, fileContent)
  fs.writeFileSync(fileName, template)
}

// required for npm publish
const renameGitignore = (projectName: string) => {
  if (fs.existsSync(path.normalize(`${projectName}/gitignore`))) {
    fs.renameSync(
      path.normalize(`${projectName}/gitignore`),
      path.normalize(`${projectName}/.gitignore`)
    )
  }
}

const buildProfiler = ({
  type,
  framework,
  language,
  name,
  css,
  port,
}: Project) => {
  const profiler: Profiler = {
    NAME: name,
    FRAMEWORK: framework,
    SAFE_NAME: name.replace(/-/g, '_').trim(),
    LANGUAGE: language === 'typescript' ? 'TypeScript' : 'JavaScript',
  }

  if (type === 'API Server' || type === 'Application') {
    profiler.PORT = port
  }

  if (type === 'Application') {
    const isTailwind = css === 'Tailwind'
    profiler.CSS_EXTENSION = isTailwind ? 'scss' : 'css'
    profiler.CONTAINER = isTailwind
      ? 'mt-10 text-3xl mx-auto max-w-6xl'
      : 'container'
    profiler.CSS = isTailwind ? 'Tailwind' : 'Empty CSS'
  }
  return profiler
}

// Options:
//   - type: "Application", "Library", "Server"
//   - name: Name of the project
//   - framework: Name of the framework
//   - language: Language of the project
//   - css: CSS framework
//   - port: Port to run the project on

export const buildProject = async (project: Project) => {

  let buildContext = new BuildContext();
  const { name, type } = project

  const profiler = buildProfiler(project)

  switch (type) {
    case 'Library':
      buildContext.setStrategy(new BuildLibraryStrategy(project));
      break
    case 'API Server':
      buildContext.setStrategy(new BuildApiServerStrategy(project));
      break
    case 'Application':
      buildContext.setStrategy(new BuildApplicationStrategy(project, profiler));
      break
    default:
      buildContext.setStrategy(new BuildApplicationStrategy(project, profiler));
  }

  await buildContext.exec();
  renameGitignore(name)

  glob.sync(`${name}/**/*`).forEach((file) => {
    if (fs.lstatSync(file).isFile()) {
      templateFile(file, profiler)
    }
  })
}
