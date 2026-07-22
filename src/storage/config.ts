import Conf from 'conf'
import { Config } from '../types'

const store = new Conf<Config>({ projectName: 'openply' })

const DEFAULTS: Config = {
  model: 'deepseek/deepseek-v4-flash',
  localModel: 'deepseek-coder-v2',
  mode: 'auto',
  theme: 'dark',
  adEnabled: true,
}

export function getConfig(): Config {
  return { ...DEFAULTS, ...store.store }
}

export function updateConfig(partial: Partial<Config>): Config {
  const current = getConfig()
  const updated = { ...current, ...partial }
  store.store = updated
  return updated
}

export function resetConfig(): void {
  store.clear()
}
