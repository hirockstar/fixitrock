import fs from 'fs'
import path from 'path'

const pkgPath = path.join(process.cwd(), 'package.json')
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))

// Use version + timestamp for uniqueness
const version = pkg.version + '-' + Date.now()
const swPath = path.join(process.cwd(), 'public/sw.js')
let sw = fs.readFileSync(swPath, 'utf8')

sw = sw.replace(/__CACHE_VERSION__/, version)
fs.writeFileSync(swPath, sw, 'utf8')
