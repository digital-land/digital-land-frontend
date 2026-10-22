import { execSync } from 'node:child_process'
import { repoRoot } from './appFixture.js'

export default function setup () {
  execSync('npm run build:package', { cwd: repoRoot, stdio: 'inherit' })
}
