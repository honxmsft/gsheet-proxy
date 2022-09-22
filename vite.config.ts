import { resolve } from "path"
import { Connect, defineConfig } from 'vite'
// import devCerts from 'office-addin-dev-certs'
import VuePlugin from '@vitejs/plugin-vue'
import { ServerResponse } from "http"
import { request } from 'undici'
import WindiCSS from 'vite-plugin-windicss'
const devCerts = require('office-addin-dev-certs')

let cookie = 'MUID=14DB138EE34D6B4A33841CE4E2776AFA; MSFPC=GUID=acd5cf648ebc440e83fd56cc95288391&HASH=acd5&LV=202109&V=4&LU=1632377535065; nps-value=readytoshow; RpsAuthNonce=a046b2f7-112e-40b0-a1b8-5b4e0e9b95ff; FormsWebSessionId=2fa3af11-528c-4d71-ba9c-805cbd224756; usenewauthrollout=True; __RequestVerificationToken=lPrauCYSWKcJq6p8ojZwYQEm7aMACLD_pjqnW7qvx3bcnjIzcGDALFqRAfwFLQ5-rrnxzcxkv4Qp6qgDeoLXFapJRRRggCiJqz_X2BEwE901; MSCC=NR; OhpAuthToken=eyJ0eXAiOiJKV1QiLCJub25jZSI6IkMxM1czcHlRRWw2Z1d2WmVWaVZCX2F5cDFIUjNjSVRia25OUkFvV2I4T2siLCJhbGciOiJSUzI1NiIsIng1dCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiI0MzQ1YTdiOS05YTYzLTQ5MTAtYTQyNi0zNTM2MzIwMWQ1MDMiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwiaWF0IjoxNjYzODQyNjEzLCJuYmYiOjE2NjM4NDI2MTMsImV4cCI6MTY2Mzg0Njg4MSwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhUQUFBQUt6Y2wvc3hIS1RpdGhaQTB2YmV5ZVRWbnorTllOM2xFMEpZMXFCVVRBQU11QVVFVnRETytmUDh2aVplS094VVhseTVvNzZnZytkaDZHRlA0WmRqeGFqZmFXdExUWmljYk9wUHpyR1V1OUZVPSIsImFtciI6WyJwd2QiLCJyc2EiLCJ3aWEiLCJtZmEiXSwiYXBwaWQiOiIwZWM4OTNlMC01Nzg1LTRkZTYtOTlkYS00ZWQxMjRlNTI5NmMiLCJhcHBpZGFjciI6IjAiLCJkZXZpY2VpZCI6IjcwOThjZTMwLTg4YmYtNDIyOC1iZDRiLTk2YjNlZDNjODViZSIsImZhbWlseV9uYW1lIjoiWHUiLCJnaXZlbl9uYW1lIjoiSG9uZ3plIiwiaXBhZGRyIjoiMTY3LjIyMC4yMzIuMjQiLCJuYW1lIjoiSG9uZ3plIFh1Iiwib2lkIjoiNTRkYWFiODItZjYwZi00MGI0LTgwY2EtZDBhODMwNGMwMzY1Iiwib25wcmVtX3NpZCI6IlMtMS01LTIxLTIxNDY3NzMwODUtOTAzMzYzMjg1LTcxOTM0NDcwNy0yNDc2NTM1IiwicHVpZCI6IjEwMDMyMDAwNDBFNUNFMDYiLCJyaCI6IjAuQVFFQXY0ajVjdkdHcjBHUnF5MTgwQkhiUjdtblJVTmptaEJKcENZMU5qSUIxUU1hQUxNLiIsInNjcCI6Ik9mZmljZUhvbWUuQWxsIiwic2lkIjoiZGVkNzZmMmYtN2RlOS00Yzc2LWI1YWEtZDlhMWZiNzA0MTBmIiwic3ViIjoidnFKam92eHdXdk9tT3ptMlVZa1RBZmFBeXhHeGpLRU9oZ2p4Tml4ZEpFWSIsInRpZCI6IjcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0NyIsInVuaXF1ZV9uYW1lIjoiaG9ueEBtaWNyb3NvZnQuY29tIiwidXBuIjoiaG9ueEBtaWNyb3NvZnQuY29tIiwidXRpIjoiRFlIVzFHSDJrVUtSeG5uWVlqTWJBQSIsInZlciI6IjEuMCJ9.iDp5BUkZ6yqphIGMeG0LSIJnM8z1jMgBd0QN-mISrFzrap1ccl-lhT_Nefvs6zxWlYa4AKc3nNgO28IdUK3FDLAsdI8S7xdD3M3HOosikotuMsA3VTF0U5NG8CRi3UGtVoQNCbBjHBmcwHa4ZUU683pGKF6ka5KxlJPC2SEOaxF9JpFMRibFBXiSTg4k98VZFGXoZQSQZU7uey9ZtxZgo4CIuseowj60sbVmBFDJ08lx31VHIFefTpwjchgArwNHQbDaahsG7wmxY0IY64W-EQ0ofNbuMl5BFze_GXi9tsv-LPPdcLA1Zx70MvFoarXTQMMh98IRbnIGixmpLaD28w; ai_session=uvJX8fLpDj+t0YlMcBJxYn|1663846356081|1663846356081; AADAuth.forms=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiJjOWE1NTlkMi03YWFiLTRmMTMtYTZlZC1lN2U5YzUyYWVjODciLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwiaWF0IjoxNjYzODQ2MDYyLCJuYmYiOjE2NjM4NDYwNjIsImV4cCI6MTY2Mzg0OTk2MiwiYWlvIjoiQVdRQW0vOFRBQUFBQW5aSi9HbktjNVptZWlxOURja3J2Y2Rzd2Q5Tlh5VDNHdytJb0lrZkNOeFhzM0l0RVFCUVpJOHM3VXZ5VUZtMWh6K2hubzRjK2M3R3NiVVk1eDV2WHk3SmZ0UmZZa0FBU3JaNFlQbDJvMzk2QUN6elo1R3Vjc3ZnZmh5cUtHenciLCJhbXIiOlsicHdkIiwicnNhIiwibWZhIl0sImNfaGFzaCI6IllheFVWQ3g4bTBvUWFXQTlLaFltalEiLCJjYyI6IkNnRUFFZzF0YVdOeWIzTnZablF1WTI5dEdoSUtFQmo5alFuZkZxUkl2bUpCVVdscWJGQWlFZ29RalZiWFZGaEk1MFM3MFhBWk5ua2pBQ2dCTWdKWFZ6Z0EiLCJmYW1pbHlfbmFtZSI6Ilh1IiwiZ2l2ZW5fbmFtZSI6Ikhvbmd6ZSIsImlwYWRkciI6IjE2Ny4yMjAuMjMzLjI0IiwibmFtZSI6Ikhvbmd6ZSBYdSIsIm5vbmNlIjoiNjM3OTk0NDMxNjIxNjY3MzkxLlptVXdNakZpTlRJdE9HWXlOQzAwWXpnd0xUa3hNelF0T0Rrd05tRmxNekZrTVRKbE16QTRPRE14T0dVdE1EWmpOQzAwWWpkbExUazVORFV0TW1JM1kySTNaRGMyWlRobCIsIm9pZCI6IjU0ZGFhYjgyLWY2MGYtNDBiNC04MGNhLWQwYTgzMDRjMDM2NSIsIm9ucHJlbV9zaWQiOiJTLTEtNS0yMS0yMTQ2NzczMDg1LTkwMzM2MzI4NS03MTkzNDQ3MDctMjQ3NjUzNSIsInB1aWQiOiIxMDAzMjAwMDQwRTVDRTA2IiwicmgiOiIwLkFRRUF2NGo1Y3ZHR3IwR1JxeTE4MEJIYlI5SlpwY21yZWhOUHB1M242Y1VxN0ljYUFMTS4iLCJzdWIiOiJfSDRscjBOSEZhd3pMd20wSVB1NmV0Z2ZqOXEwcXI2Mk1zajZZVkZwLVBJIiwidGlkIjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3IiwidW5pcXVlX25hbWUiOiJob254QG1pY3Jvc29mdC5jb20iLCJ1cG4iOiJob254QG1pY3Jvc29mdC5jb20iLCJ1dGkiOiJqVmJYVkZoSTUwUzcwWEFaTm5rakFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXX0.gZAKm85sBdAYWhkx1_WWYMe9zMGGj5Lut__co5NG_jvSdRCYUDADC9xC9OuHT-Zve7302qvtNhoMJcIbvptROM1xbykAXKVeT90Z5AOHp06DzluyjUXDsWAoXxqSlRYbVITvr1-xhHpSHdJklynSR_aLJuYUC7VctacCw1cm3mbEP_34RhBMXLQHzOuO0wk8yq7Yx-jexIYm2ZaK8wIgofyBiTXuNA9aeoURyaXhlfQP7kDIvGK6dVvZpsGLLjfaMJpi8Wic72YrOe3gS9ikAdj-VAnt2CNXiY47bt9iqAjKAtT0gOnlhpowNdvm4G5C_5qCcuiiOnejoCdISAyViw; AADAuthCode.forms=0.AQEAv4j5cvGGr0GRqy180BHbR9JZpcmrehNPpu3n6cUq7IcSAEY.AgABAAIAAAD--DLA3VO7QrddgJg7WevrAgDs_wQA9P8hImhDbHFTYovqkzk-Kj4iCPgl_fByOh4yGK7O7aZWnLfHBbsobsxdYMWSthsbICO68CVwE_0ixekOk4lnZUv5ZcHO4MDWOonSDfm0mA9-bTVoptytpcu0qGQ5j27HL5Ct0Jys1a0WwzDX05drIz44rOSLQviOYtaG4cAiExz-CRGWIYAXut9s58--xtfpa_dkfPCzcDI0ZoHDKllP_xjmlwHefs797lxua-gM7DCWq6eVgi1Uoqb7v9cc-b4f4Y1vvCdTJeruCpeTHmG8w0vj9fnbDDhbI3_sdek41ryf5nYq-_t7xlhW-Yvfbw49LCAfowWxMkK_zf4pYzFYGqZmPkj2tX-lleRYC-MzyVnyVr88J8-0pukL7GJBaWBuKeNLHJTcIZHMyAM4blOKBW_EskzRAcN4mNS1C28zT_Kpjbxv1FTfX4PqVrhyir2-91QpJAmZJ3EoxhtAbkI3sKBEZFnHB08FSZSNWL1bu1V5ipL7NwqXaozU_KGAMwyjbZjf2OmfV3VmO3A4hGAqqGi2BLAYZumcRtDbCXrQJZPuZ20HMx7yJWyEB_fRE_9sgOvBWxswLUit-v-rbR6dp4--lO3AE2xcnpDByFlWXAKZbLU8MPsgD5UNby6CpLWFeKU9fuAR_ifWymui_mv7ekniPsYJWJ3ST98WBWA7wiffsq3pKrt7IK5copoHATNTfMSGksJ9CnRlZ-vfd9LeBkpN22dOtQFShzvOfSHiyngZk9IU963s1uf9-H2Kg4ruIhJ7J9RH2PWlPyJrbuekTbRm0hJfi56XtTQVirtExqLIM9uK0APyPBgVFz7G6gFer9Aag92EnWd_ruj6xhU3MQtcpuerK65eciRR0cK0w5y7_wRLiZ4eJ5oRRh0gSkxFreyOk9XbEJHtu3B9zRi56-gpzKx5csPgR7ioyROJB3h9nAlRlggaEJ_9-u-0bS3JM0H5V3o_TT66eN2FrTyo342Ojebn7dlQ0sUnaq2RPuPnhe7k1oaY; OIDCAuth.forms=AShEa45a1mfPPEbqzRq_XiGE0EAz3f8laCOSXejtVPvrS2tRG8bvkx5G-ouMTCcuNffWz4XwCKhcn2qbuEjiu6Jy2uw_iQsMJ_Zq5Cz8qDi5GTpQJ0gjF8u0e6uDFuTOYOf16kLSIwdOudvortVjsJQRa7dR9d7aDeA8LnPGlwOeixAAW_mIdtVxNr2BUHfRPcANyrABk7JZDWJFmIe19tKxHqJeQpRmekrU0ivAATcQCyCxHwcdPHuv3PQTOYqtuAvrrg2YhwTrrNN5f_ZIhQQrAsRv3sp-bFzh4O842uMZ6G3zsW8qOsGKMMZDHab4UL2S5qze8EHeg906tYO-qqHI43PH8Rbsv_9VFoho9-Ms8fsnXSaJBOmNRrmvowMqmHzo1Vrxcf8rmGt4Pt4MxTQQQnM2Y4wXWOHFhB3iFqfAsiH1xjBXbjpLJ91cyrc9Dt-HMiVXUr76I57VEHzBz6psTlLrzszw6__p78pH0cr28TStMYNaZQwGH8Ns46aaFMLo8lnQJfJ2ag9VFT0USzlFjDAOBDMx3jz2ElrmnGTBF0ctPIVzCI1imc_zPyX0gWHgxuTi_z9E3rQvkZ9V5Vu6bCtWd7uTkWJpMGVA539XEvTZLHVy-JJg3JMjXoxx_jBXxt-4AuemFWBSjfc1XNJ0C8SUpXEd6Qr4KNDHVMoacl-4aDThy50aiAcPIJ5VqLnHi1hCXaDpqbETX-U2B7CeagywhzG48Ug94wZ7WzMvTdtvBrTCdlxV3Hnur8E4wMxwn3XU3a0NY6LpT0Qw8moZbrehDb9HKUiGn3nJC1zk34vamKWo9LZ6qu3QGajCepICLYKI8_oIJgxjZcih_A-f5KF19S_1vPreBp-8r_SbYYK6bwlfKProJtrPs175Mplwwpeu6AfkPGG4iblBO8Q5n7iwLDeyMcYt887sJU1B6gtPpibIil67Ce4fccBNOlw7m-47zI2X0F-Qo_hlbfXnp8Cq_gp9b1XEyqHl6tu-MN5ELvapCPC7mCTrb3xw2Dzw8ehsaF1F6ppWRRYd42b8w7qF9QBFmGeapFo83SiVLxGLhlQx-Hk9_st5Le8BepRceRMR8zdtZwY8TU6tw9Vn_OZbx_eCmHU5TVlU563NjY90en1PLekz3IZ0c55rlRMrNVb0vcDfnJEZB3BpJWeK9rXQ_4lffcDiOaVkYOA5-hjY2SkzJzzm-wJZAym-DlOxLVJ-8F0InImP25cx8rJ6fBb74qRGEFIe8zl0-gxYlvhNUJc9xrX5X9UJ9WqbDGFiXtbj7VKwjv514oFuksS0ZCWUkGJLbLcOnwfUvnZB0Ujn5PBe_m-Qo8NJcctQkp8nEBbCacEBubZkyApgdbYONv2NMlGXvujJPkZeJAnQ2MzT93n8qxEcGzp_Q9-Ma1GbLuYPC6uzf_irpEuJT7ALwOojz7JyoIZrU7h8ccIWr0ZxPFJqAS9KOYAEM-5eK6YMjjAR9L0FtsqbpaC0W3Oy8PjYGgLTewPIbYOE15bXzEiPnWlr1sO-UHkVAI75JMo3rvilBInfri5Z4S2TPVyVhy39mAFhrnaOciB7-328nsm7IoOEk7LxjWR-aiwQApQx2Y9mKGQ8poWJZ5vG3CUERULMRED_nPXIVaeLSzrS2Kp5GYMmtR54tn2SOgGjTQd9Q8dYTuJV1sHcRdU6MQULhxfaSCYN9yle47ejJvRL'

async function handleFormsApi(u: URL, res: ServerResponse, next: Connect.NextFunction): Promise<void> {
  const response = await request(u, {
    headers: {
      'cookie': cookie,
    },
  })

  console.log(`request header ${u.href}: ${response.statusCode}`)
  for (const [k, v] of Object.entries(response.headers)) {
    if (v && k !== 'transfer-encoding') {
      res.setHeader(k, v)
    }
  }
  const body = await response.body.text()

  console.log(`request body ${u.href}: ${body.length}`)
  res.end(body)
}

export default defineConfig(async () => {
  // await devCerts.uninstallCaCertificate()
  const certs = await devCerts.getHttpsServerOptions()
  return {
    publicDir: 'public',
    server: {
      port: 3000,
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
    plugins: [
      WindiCSS(),
      VuePlugin(),
      {
        name: 'test',
        configureServer: (server) => {
          server.middlewares
            .use((req, res, next) => {
              if (req.url && req.url.startsWith('/formapi')) {
                const u = new URL(req.url, 'https://forms.office.com/')
                console.log(`request ${u.href}`)
                handleFormsApi(u, res, next).catch((e: any) => {
                  console.error(e)
                  next(e)
                })
              } else {
                next()
              }
            })
        }
      }
    ],
  }
})