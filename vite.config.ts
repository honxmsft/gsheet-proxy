import { resolve } from "path"
import { Connect, defineConfig } from 'vite'
// import devCerts from 'office-addin-dev-certs'
import VuePlugin from '@vitejs/plugin-vue'
import { ServerResponse } from "http"
import { request } from 'undici'
import WindiCSS from 'vite-plugin-windicss'
const devCerts = require('office-addin-dev-certs')

let cookie = 'MUID=14DB138EE34D6B4A33841CE4E2776AFA; MSFPC=GUID=acd5cf648ebc440e83fd56cc95288391&HASH=acd5&LV=202109&V=4&LU=1632377535065; nps-value=readytoshow; RpsAuthNonce=a046b2f7-112e-40b0-a1b8-5b4e0e9b95ff; FormsWebSessionId=2fa3af11-528c-4d71-ba9c-805cbd224756; usenewauthrollout=True; __RequestVerificationToken=lPrauCYSWKcJq6p8ojZwYQEm7aMACLD_pjqnW7qvx3bcnjIzcGDALFqRAfwFLQ5-rrnxzcxkv4Qp6qgDeoLXFapJRRRggCiJqz_X2BEwE901; OhpAuthToken=eyJ0eXAiOiJKV1QiLCJub25jZSI6InRDbkhaOTBvVmRmeEZPanBfYlJXWDFFa3JOVmpqNUdkMDRGM0E2ZE5NRHciLCJhbGciOiJSUzI1NiIsIng1dCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiI0MzQ1YTdiOS05YTYzLTQ5MTAtYTQyNi0zNTM2MzIwMWQ1MDMiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwiaWF0IjoxNjYzNzYwNTgwLCJuYmYiOjE2NjM3NjA1ODAsImV4cCI6MTY2Mzc2NjA4MSwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhUQUFBQTR5RVdYMzl6dldNQXhYZmJQMnFIUFZ4RjRKUnA0YXZrZnNVektDUE9YTnZUdUZPcGhOVkJralUzQU82RlFTSENFTGs0Rm9ZM00zekpnTjZpRkpMNDkvVWRuK0JZeHRQU1BzRi9FTDYvT0drPSIsImFtciI6WyJwd2QiLCJyc2EiLCJ3aWEiLCJtZmEiXSwiYXBwaWQiOiIwZWM4OTNlMC01Nzg1LTRkZTYtOTlkYS00ZWQxMjRlNTI5NmMiLCJhcHBpZGFjciI6IjAiLCJkZXZpY2VpZCI6IjcwOThjZTMwLTg4YmYtNDIyOC1iZDRiLTk2YjNlZDNjODViZSIsImZhbWlseV9uYW1lIjoiWHUiLCJnaXZlbl9uYW1lIjoiSG9uZ3plIiwiaXBhZGRyIjoiMTY3LjIyMC4yMzMuMjQiLCJuYW1lIjoiSG9uZ3plIFh1Iiwib2lkIjoiNTRkYWFiODItZjYwZi00MGI0LTgwY2EtZDBhODMwNGMwMzY1Iiwib25wcmVtX3NpZCI6IlMtMS01LTIxLTIxNDY3NzMwODUtOTAzMzYzMjg1LTcxOTM0NDcwNy0yNDc2NTM1IiwicHVpZCI6IjEwMDMyMDAwNDBFNUNFMDYiLCJyaCI6IjAuQVFFQXY0ajVjdkdHcjBHUnF5MTgwQkhiUjdtblJVTmptaEJKcENZMU5qSUIxUU1hQUxNLiIsInNjcCI6Ik9mZmljZUhvbWUuQWxsIiwic2lkIjoiZGVkNzZmMmYtN2RlOS00Yzc2LWI1YWEtZDlhMWZiNzA0MTBmIiwic3ViIjoidnFKam92eHdXdk9tT3ptMlVZa1RBZmFBeXhHeGpLRU9oZ2p4Tml4ZEpFWSIsInRpZCI6IjcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0NyIsInVuaXF1ZV9uYW1lIjoiaG9ueEBtaWNyb3NvZnQuY29tIiwidXBuIjoiaG9ueEBtaWNyb3NvZnQuY29tIiwidXRpIjoiSm9wY0Rrdjg1MDI2TWhieVFnOFVBQSIsInZlciI6IjEuMCJ9.tSoUmTjMxbVxV90rkmXvWOX39FdgDwhyJifPP17jtv_J41ab1AYdLUqU8MrTO25NsG_dzknc_NOpv7DoYBItmhUoFmLap3clgfHTsGaoUTamtDI4uqzhcGBIeAvSDvzOVPbdMw3D0iOUZQKnS9xNxXVmpb69r6ypKdHt8OAWpVhoD-VrUPx-JxaR7UgG16SBzMoK5FvSi9To6vhzlTy1y1VF-UaVDK-3XVgsta9Qca1HrpbS7bOoHoo7ro_1VqNXygODLYxdUICH-uYebrlhpxSEIh1_L5EfQ4cRj7-iDDgJx5IfqAvR7_C4z_BFaasEG6quIjYUzSuAzKUf-wJVSQ; ai_session=S5j/5f+mAci9Cvqvkx527R|1663761742936|1663761742936; AADAuth.forms=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiJjOWE1NTlkMi03YWFiLTRmMTMtYTZlZC1lN2U5YzUyYWVjODciLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwiaWF0IjoxNjYzNzYxNDQ5LCJuYmYiOjE2NjM3NjE0NDksImV4cCI6MTY2Mzc2NTM0OSwiYWlvIjoiQVdRQW0vOFRBQUFBN0NnckVrenJ1Zm5JaXBDaG5iVTUzU08vUGl2ckhobnZPOHVLZXVDVk9Zb2FwSkJscG1uZytlenI0MTdnYUVaSitPc3M3QjBOdVVLN1F5TVVrZHNBZXNSbmUzMVE5bG8rS1VqYWU1UXVJYzZTdXo3WktwOGtmNysyRWdRamhBaHkiLCJhbXIiOlsicHdkIiwicnNhIiwibWZhIl0sImNfaGFzaCI6IkloQ0ZFTWNOMl9iZzBUUDRXYVR2bUEiLCJmYW1pbHlfbmFtZSI6Ilh1IiwiZ2l2ZW5fbmFtZSI6Ikhvbmd6ZSIsImlwYWRkciI6IjE2Ny4yMjAuMjMyLjI0IiwibmFtZSI6Ikhvbmd6ZSBYdSIsIm5vbmNlIjoiNjM3OTkzNTg1NDg1MTI1MDY3Lk1UUXpOV0l6TTJRdE16aG1PUzAwTlRJNExXRmpZekl0TkRBMU56RXlaamRrTURZME5qVTBaR0poTmpndE9URXlOaTAwTldRM0xXRmpOMll0T1dFNVpETTNabU5qTXpFMiIsIm9pZCI6IjU0ZGFhYjgyLWY2MGYtNDBiNC04MGNhLWQwYTgzMDRjMDM2NSIsIm9ucHJlbV9zaWQiOiJTLTEtNS0yMS0yMTQ2NzczMDg1LTkwMzM2MzI4NS03MTkzNDQ3MDctMjQ3NjUzNSIsInB1aWQiOiIxMDAzMjAwMDQwRTVDRTA2IiwicmgiOiIwLkFRRUF2NGo1Y3ZHR3IwR1JxeTE4MEJIYlI5SlpwY21yZWhOUHB1M242Y1VxN0ljYUFMTS4iLCJzdWIiOiJfSDRscjBOSEZhd3pMd20wSVB1NmV0Z2ZqOXEwcXI2Mk1zajZZVkZwLVBJIiwidGlkIjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3IiwidW5pcXVlX25hbWUiOiJob254QG1pY3Jvc29mdC5jb20iLCJ1cG4iOiJob254QG1pY3Jvc29mdC5jb20iLCJ1dGkiOiJPYkZaOTFHVGVVT2hkcUlYWGtBUkFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXX0.Id7xp4487dB038TxxOMoo5yphMHH7U_UlWKrn4zouOLaez6dB0XkgnsgUdfNzynzIerXD3s-TAjhnfyMWCusqUt3ADv436ewylGpudYPl4joLvjjK7YhErcpSsyeJWzwFOnVSDlNjswWqc9-m2qwpvtzkQP7G5VrswvWIncJv6xL8JS8MmXJ5H_Ty0E4X6jsGdNjUjzMXsJ3hHv_elWr9nD8JGFGyBWRMiLzzML6PEEgLpqQHSi1u-d4o9UieXezE-S6CAw92_6WS_8rY9Yv6_T8I-UZWreYW4hRQH6ztDlRZNlTfvm9bARzRwRrDNzgc0bBoOiiT4OJXPGkM0oSwg; AADAuthCode.forms=0.AQEAv4j5cvGGr0GRqy180BHbR9JZpcmrehNPpu3n6cUq7IcSAEY.AgABAAIAAAD--DLA3VO7QrddgJg7WevrAgDs_wQA9P-ZPJEDKRVbOpYbYPVbvW2yI6uRPeau2ILnQgZhzlaGqk4q9LMOajEVLvbRKG0CMw8B6BBvjBIeFdb73Ayujzl5TgRfkIC0Ckbqza4vp33IAmyc3rJiTLexNgXhNGtBZr7Q5UTZ7JBIQgdNwjRjGg0GnjCQAonna8oxAMUeOnNt16UWo7qg6HsoA_4Ccq45tH1sFHqR0Y3S9zNNfWkhh5ll7YE7d-afYb2BN0kHlDKBcgWCuNivOPP9Bw8b70olDNsacGH-vc6QA4z1OsAoZRv-PDPUWwJrKyPvSTMskO9pjk3pqgZdOajks2aogpxToAc2mOv_-mki-euouskXOVk6RmsnGpC3_UolTTRgDGw6VSEewPPY6W27XjdF5B2dPgygqf_qK17Kiu8W3PRn8PgCosKxDEByG8xn_4ZYLD-Yt-ArP56DAMfSCyXhkxI1PwulmufE3aogcU8V6fH_xkBuZLVV1kKfEnmOzRt9HoGo3xFPxgMpcJhzH26lp2fFLN2ED5tm-SQVQn7wg70kDwCrX3Luy4d20ARYXZKoiUlgspzjRlGXQIjd90oi3kkM8KqFiVnSVMeCl90TEHsY-mvLpcKZvkuCcjJbPHUIMHXdsoxgXswFEOJTUj375bfONX_aVaVnvHXgKKmEE8eM7yaLJv4BPSgL2ET8AqvrKHobT8LgExk2yib8rBLnamyxOdNnXPyV_upSLZsy0lDAABJJ4w46Wez2cCng4VnJzvv_IM2EUVzcwhYN3Mr1mCPoXYtalzhSuMpiOl11mEFTrz8z4JGfYpMEICh_En1G-9uVbqbu0bhoAlfNlIYJi5vdbCdhFjQw5z_JDftE7JuEN17LK5X_9fjpPGNg4seGI084TQeawKzzVgbqlloWfqTkMXdsACdLJFJAJB2x55uNt2P4Zik5aM6XN4f86fuzKQlnDXVWhmOY0i2I-L1HEs2iWCKps1mIQCoZnZQeVg3xSPBXErtc9C5-B6t5ZzkmHQyeDLP0In8sOn0YMADpVkA; OIDCAuth.forms=AaqGXXhlugGKc_qTQApUWcRbjBYdkYVSZXYkv0D9LQL_6awIpbHEe9qna8YwthGoSFD_oyIJICs_iJT9p_RBQ7aOInuVT_yNTIo1Qw_a5nPlxZkN3y_2jQq10B1RpVDOFoHh-09HEvJCA62AjYUsxi-bXbzkzH5Afv6eQC37F6Cenw3dFNpFi-iwB50p8L4hkeEtdqZdH91U131i_807ONeIoW7Vs1XlbxmGjuNXpCz6jnXIMhOZvxa-WeSY15mGpXCj_tgDh59CKdRllDLTxc2gvGBItMlKDhWiTr58Jx8R0OENe_HYm7s-OK2cwAl_DLPhe5g78j1r1Nj4fxWQk3yF8wqA5ehdlPJhwHFVr6VyKmID5O-GRM52Xuaplzz9P8N80eAaSQWC7tnYl26CLNxuKrx69aHCxW49ZgY9hDr5wrExPSeBv5Ees9FZAUsa66lJlmz5yv8VUMVO7L-MVfWV-06HukTWbwrfxgeofcrp_X-7hLMh1jNIO0080VjX25so98qDbD43BniZOb18X8rHS0qpnW24kao8N_e9fCQkI5-b0dLzKfXQfTbiTLR_ub9h9LJ0wpxCOgScBHAj0Sc8enprxzz3rvTQbUCdoEq0acJ8MhbUXowjS0vCw1klb6mEnMparjBc4g5GmJnMFUUQDC6FPLDxm90qzY7-I1CDEhiV4hczd-zj7a6KFGz6fuGihVpiabyNeRVW3jFNmI-eI-dLJfRp5pVfS1MfIhU0V3eNHV4Lqd2vCkmryHJLuNEojOZOZgvMGwySKsB9lNSltBU6CRRQIq23HLzrQiAN_N7ZoE3rPPnqaQhct5wSZllt0NpExC7j2OBgJ9X7C8SaZ2AgHnFa8faSrHNqktPt7sItQKrgnLGqC8QWZQbgvR_FPCMYxkYj-BtWFSFWW1MHSb4wSqWpQVm6FHngpl3YlmWBJHZ0cWg0KDOjDe1YFYMbknf_-mG7EPmgTkeP_N5zwSSFNQArmLqkz6AuQDNezVyMpnDuwfhX48NCre1mFltW6gA2fj5kazm4Il0gMPQUjJZbUbdkuPUBAZwJbP9LlgtqspFYwGKRJHlV3qfncB8ymfLTmp5P6OZ38Tswk-AslItEguMy8TkOeb67--Kviq-A8WZ8teIlnyCUfoiaHqapw6JOMutCSRAn4XQAluHpgH6XOdNXsIHa3PS-CrIcitVFfS0uBjOVgIdm1oZjtwqVkf5XnhDRlJObilWAYC27Tlmwp5OM2NAJTZhQ1dXqzAjafs3lZHKSpBpa04E-rXW_nkKoVscIlKmAP4ZEc97O65BgR7MJjdMLp7V1R9_K_Wu4Iqj_cs1Ykz8MVYInO249IJhJEj9F91mL300zVdL8uCQuh3IsTbaFEVpNaVkbwNPx3wBfYByq-AcVyPAKTI_rNt4cpmH6EFu7blrqc65IQsWjIrQjob6PDqZe2tmGWpun751LNi49AVLw1o9FOujqAQ9zKk-KmpOQdUNFs5wrmBoIt4Kng2x7Q7zze5ur2tXL9jtD3C6B4lT6MLZEBpwm296h8lX1AWiUqLPx_P9gSa3-Oy8-VwQuaTg7FpNVbAe29I6QB0TAdfQRl1nGtvAFYQcH_wTi-NALlrLHdTo'

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