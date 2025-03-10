export type Profiler = {
  NAME: string
  FRAMEWORK: string | undefined
  SAFE_NAME: string
  LANGUAGE: 'TypeScript' | 'JavaScript'
  PORT?: number
  CSS_EXTENSION?: 'css' | 'scss' | 'less'
  CSS?: 'Tailwind' | 'Empty CSS'
  CONTAINER?: string
}

export type Project = {
  framework?: string
  language?: 'javascript' | 'typescript'
  css?: 'CSS' | 'Tailwind'
  port?: number
  name: string
  type: 'Application' | 'Library' | 'API Server'
  version?: string
}

export interface BuildArgs {
  project: Project;
  profiler?: Profiler
}
export interface BuildStrategy {
  build: () => Promise<void>
}