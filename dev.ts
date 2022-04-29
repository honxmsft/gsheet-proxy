import { createServer, UserConfig } from 'vite'
import viteConfig from './vite.config'
import { AppType, startDebugging, waitUntilDevServerIsRunning } from 'office-addin-debugging'
import { join } from 'path'
import { spawn } from 'child_process'

async function startVite() {
    const cfg = await viteConfig
    const server = await createServer(cfg as UserConfig)
    console.log('start vite server')
    await server.listen(3000)
    server.printUrls()
}

async function startWatchLibraries() {
    await new Promise<void>((resolve, reject) => {
        const process = spawn(join('node_modules', '.bin', 'tsc.CMD'), ['-w', '--project', join(__dirname, 'libs', 'tsconfig.json')])
        process.on('spawn', () => {
            resolve()
        })
        process.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`tsc error code: ${code}`))
            }
        })
        process.on('error', (e) => {
            reject(e)
        })
    })
    // const host = createWatchCompilerHost(join(__dirname, 'tsconfig.json'))
    // const program = createWatchProgram(host)
    // console.log('Started typescript watch')
}

async function startExcel() {
    const manifestPath = join(__dirname, 'public', 'manifest.xml')
    console.log(`Use manifest: ${manifestPath} to start office`)
    await startDebugging(manifestPath, {
        devServerPort: 3000,
        appType: AppType.Web,
        enableSideload: true,
        document: 'https://microsoft-my.sharepoint.com/:x:/p/honx/EbbVp2thw45EnX328JoXCwEB7AjnHDHTVwDRpE4vQSLrJg?e=VW1bz3'
    })
}

async function main() {
    await startVite()
    await startWatchLibraries()
    await startExcel()
}

main()
