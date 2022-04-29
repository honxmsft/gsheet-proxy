import { join, resolve } from "path"
import { defineConfig } from 'vite'
// import devCerts from 'office-addin-dev-certs'
const devCerts = require('office-addin-dev-certs')

export default defineConfig(async () => {
  // await devCerts.uninstallCaCertificate()
  const certs = await devCerts.getHttpsServerOptions()
  return {
    publicDir: 'public',
    server: {
      https: {
        key: certs.key,
        cert: certs.cert,
        ca: certs.ca,
      },
    },
    build: {
      outDir: resolve(__dirname, "dist"),
      assetsInlineLimit: 0,
    },
  }
})