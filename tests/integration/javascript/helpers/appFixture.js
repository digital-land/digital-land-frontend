import { execFileSync, execSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..')

const packageName = '@digital-land-gov-uk/digital-land-frontend'

// Creates a temporary app that uses the npm package the way a real app does: the built package and
// govuk-frontend are linked into its node_modules, so the default config paths work unchanged.
// Pass `config` to write a digital-land-frontend.config.json for the app.
export function createApp (config) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dl-frontend-app-'))
  const nodeModules = path.join(dir, 'node_modules')
  fs.mkdirSync(path.join(nodeModules, '@digital-land-gov-uk'), { recursive: true })
  fs.symlinkSync(path.join(repoRoot, 'package'), path.join(nodeModules, packageName), 'dir')
  fs.symlinkSync(path.join(repoRoot, 'node_modules', 'govuk-frontend'), path.join(nodeModules, 'govuk-frontend'), 'dir')
  // the tools the scripts run, such as copyfiles and sass, come from this repo's devDependencies
  fs.symlinkSync(path.join(repoRoot, 'node_modules', '.bin'), path.join(nodeModules, '.bin'), 'dir')

  if (config) {
    fs.writeFileSync(path.join(dir, 'digital-land-frontend.config.json'), JSON.stringify(config))
  }

  const scriptsFile = path.join(nodeModules, packageName, 'package-scripts.js')

  return {
    dir,

    path: (...parts) => path.join(dir, ...parts),

    writeFile (file, contents) {
      fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true })
      fs.writeFileSync(path.join(dir, file), contents)
    },

    // the commands package-scripts.js gives this app. It reads the app's config from the working
    // directory when it's loaded, so it's loaded in a separate process started in the app.
    scripts () {
      const output = execFileSync(process.execPath, ['-e', `process.stdout.write(JSON.stringify(require(${JSON.stringify(scriptsFile)}).scripts))`], { cwd: dir })
      return JSON.parse(output)
    },

    // runs a script, for example run('copy.govukAssets'), the same way `npm run nps copy.govukAssets` would
    run (name) {
      const [group, task] = name.split('.')
      const command = this.scripts()[group][task]
      try {
        execSync(command, { cwd: dir, stdio: 'pipe', maxBuffer: 64 * 1024 * 1024 })
      } catch (error) {
        throw new Error(`${name} failed: ${command}\n${error.stderr}`)
      }
    },

    remove () {
      fs.rmSync(dir, { recursive: true, force: true })
    }
  }
}

// every file under a folder, as paths relative to it
export function listFiles (folder) {
  if (!fs.existsSync(folder)) return []
  return fs.readdirSync(folder, { recursive: true })
    .filter(file => fs.statSync(path.join(folder, file)).isFile())
    .map(file => file.split(path.sep).join('/'))
    .sort()
}
