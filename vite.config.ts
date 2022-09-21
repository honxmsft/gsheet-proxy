import { resolve } from "path"
import { Connect, defineConfig } from 'vite'
// import devCerts from 'office-addin-dev-certs'
import VuePlugin from '@vitejs/plugin-vue'
import { ServerResponse } from "http"
import { request } from 'undici'
import WindiCSS from 'vite-plugin-windicss'
const devCerts = require('office-addin-dev-certs')

let cookie = 'MUID=14DB138EE34D6B4A33841CE4E2776AFA; MSFPC=GUID=acd5cf648ebc440e83fd56cc95288391&HASH=acd5&LV=202109&V=4&LU=1632377535065; nps-value=readytoshow; RpsAuthNonce=a046b2f7-112e-40b0-a1b8-5b4e0e9b95ff; FormsWebSessionId=2fa3af11-528c-4d71-ba9c-805cbd224756; usenewauthrollout=True; __RequestVerificationToken=lPrauCYSWKcJq6p8ojZwYQEm7aMACLD_pjqnW7qvx3bcnjIzcGDALFqRAfwFLQ5-rrnxzcxkv4Qp6qgDeoLXFapJRRRggCiJqz_X2BEwE901; OhpAuthToken=eyJ0eXAiOiJKV1QiLCJub25jZSI6IkdMd0ZOUmlMMzF1TFZuYTY4dUIzQ3dqUjVwbE1RR01tRHVnZVg5eDFCdGciLCJhbGciOiJSUzI1NiIsIng1dCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiI0MzQ1YTdiOS05YTYzLTQ5MTAtYTQyNi0zNTM2MzIwMWQ1MDMiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwiaWF0IjoxNjYzNzM5NTcwLCJuYmYiOjE2NjM3Mzk1NzAsImV4cCI6MTY2Mzc0Mzk3NSwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhUQUFBQXpZamNhOEJjUGJUcmtZZHk2ZXBOd3BFRm5BWmM0QXM4OEVlNzFiL2JQaU9CaTVFUnU4SDM2MllGNDhLNHY4VllzVElCNitKOGJteGVsdWxIL3VoTm16MmZ2dGxtN25LN3UrdmlQS1NvQzFrPSIsImFtciI6WyJwd2QiLCJyc2EiLCJ3aWEiLCJtZmEiXSwiYXBwaWQiOiIwZWM4OTNlMC01Nzg1LTRkZTYtOTlkYS00ZWQxMjRlNTI5NmMiLCJhcHBpZGFjciI6IjAiLCJkZXZpY2VpZCI6IjcwOThjZTMwLTg4YmYtNDIyOC1iZDRiLTk2YjNlZDNjODViZSIsImZhbWlseV9uYW1lIjoiWHUiLCJnaXZlbl9uYW1lIjoiSG9uZ3plIiwiaXBhZGRyIjoiMTY3LjIyMC4yMzIuMjQiLCJuYW1lIjoiSG9uZ3plIFh1Iiwib2lkIjoiNTRkYWFiODItZjYwZi00MGI0LTgwY2EtZDBhODMwNGMwMzY1Iiwib25wcmVtX3NpZCI6IlMtMS01LTIxLTIxNDY3NzMwODUtOTAzMzYzMjg1LTcxOTM0NDcwNy0yNDc2NTM1IiwicHVpZCI6IjEwMDMyMDAwNDBFNUNFMDYiLCJyaCI6IjAuQVFFQXY0ajVjdkdHcjBHUnF5MTgwQkhiUjdtblJVTmptaEJKcENZMU5qSUIxUU1hQUxNLiIsInNjcCI6Ik9mZmljZUhvbWUuQWxsIiwic2lkIjoiZGVkNzZmMmYtN2RlOS00Yzc2LWI1YWEtZDlhMWZiNzA0MTBmIiwic3ViIjoidnFKam92eHdXdk9tT3ptMlVZa1RBZmFBeXhHeGpLRU9oZ2p4Tml4ZEpFWSIsInRpZCI6IjcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0NyIsInVuaXF1ZV9uYW1lIjoiaG9ueEBtaWNyb3NvZnQuY29tIiwidXBuIjoiaG9ueEBtaWNyb3NvZnQuY29tIiwidXRpIjoiSm9wY0Rrdjg1MDI2TWhieUlMTVBBQSIsInZlciI6IjEuMCJ9.tbycwE5YZR7SekZwuBHBMgkiphNZrcv2NeUxLtunzsJp10TxkB1h-c8JYqizzeu1OQwxTJi7NYRk6-xBfUkmKvJeLca1jB_kSs10DseRsiKbdazQAGEZB-MkLdNsdmOUrRsSyAMA1ZzfiFquMjnuLHE_ccbM7K3BTdH5L0ihaPlD_EbcOqfhBAT1900w1F17dkzJp2DbQ-LYx4U_0kJO0vzVIppxe178LcP4BUDmCw4OE38Fd-vF6qjwhfrCtSpPxoAIobtrELqB7wQWRQcvwZgEn78YHkTg5ttynHuleHGTS6Wa51DbMtDKGDePZOXIHaDoSLTY5SthbVKgl9tcyQ; AADAuth.forms=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiJjOWE1NTlkMi03YWFiLTRmMTMtYTZlZC1lN2U5YzUyYWVjODciLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwiaWF0IjoxNjYzNzQzNDQ0LCJuYmYiOjE2NjM3NDM0NDQsImV4cCI6MTY2Mzc0NzM0NCwiYWlvIjoiQVdRQW0vOFRBQUFBcFdmek1mSXlXU29JbE91eThNMTA0VG5vT1lramFIRE5tc3VKNXROM1d0bDRVa0lFTUNEaHVITlJ4VmExTTNKYkhsQzV1dVlzWndWTFgra1lleGVFSS9MYlJUQXk3VHNtK3VyRVV6c29nRFhFVGNPZW1HUFFKWlFYWEljR2FOL3UiLCJhbXIiOlsicHdkIiwicnNhIiwibWZhIl0sImNfaGFzaCI6IjNrTEE0eWdxZFNzaGo4SXJGZ3Z0YVEiLCJmYW1pbHlfbmFtZSI6Ilh1IiwiZ2l2ZW5fbmFtZSI6Ikhvbmd6ZSIsImlwYWRkciI6IjE2Ny4yMjAuMjMzLjI0IiwibmFtZSI6Ikhvbmd6ZSBYdSIsIm5vbmNlIjoiNjM3OTkzNDA1NDQyNTQ2MzA4Lk0yWXhNR1JpTVRZdE16TTBPQzAwWm1SbExXRXhabVF0T1RaaFptWTVPRE0wWldZNU1EZzJaRE5oWWpndE56QXdNQzAwTURGa0xXRTFNV1l0TlRKaU5HRmtNV0ZsWWpFNSIsIm9pZCI6IjU0ZGFhYjgyLWY2MGYtNDBiNC04MGNhLWQwYTgzMDRjMDM2NSIsIm9ucHJlbV9zaWQiOiJTLTEtNS0yMS0yMTQ2NzczMDg1LTkwMzM2MzI4NS03MTkzNDQ3MDctMjQ3NjUzNSIsInB1aWQiOiIxMDAzMjAwMDQwRTVDRTA2IiwicmgiOiIwLkFRRUF2NGo1Y3ZHR3IwR1JxeTE4MEJIYlI5SlpwY21yZWhOUHB1M242Y1VxN0ljYUFMTS4iLCJzdWIiOiJfSDRscjBOSEZhd3pMd20wSVB1NmV0Z2ZqOXEwcXI2Mk1zajZZVkZwLVBJIiwidGlkIjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3IiwidW5pcXVlX25hbWUiOiJob254QG1pY3Jvc29mdC5jb20iLCJ1cG4iOiJob254QG1pY3Jvc29mdC5jb20iLCJ1dGkiOiJPYmpaSzQ4V0owT1E5RkVyeFE0UUFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXX0.UPp2w7qd2rZJH4FY4K_FFnmBD7KrR5AVF8_lR6bWOcT127G_gP_GL1FiUZoPyNzFfW3xV1-SCVD4uqXGKRPqEu5kzkohLW3fWNcQV2jdRIVk8j9mpgOkslpuuvOqtSfONpXJj3Jz3FJ3YXLPnm9xxWBihO7619pBr6rFfIfs0_ZcZhF3ZV9HxqhgvY5IjAT6Ose-U8Y55Wn5Nexi24fSE0DJzqFPSCymLw8w5-Ve99kDYM8napkB0tuJh8wwHKlQ_liDeqZMG0HF6ETlLveDnvu9-Dj5oXlYwrngkKAwWGtAPNVylvI8kefMuO2Jo3axuThW8X7g07TP1mEaraQWkg; AADAuthCode.forms=0.AQEAv4j5cvGGr0GRqy180BHbR9JZpcmrehNPpu3n6cUq7IcSAEY.AgABAAIAAAD--DLA3VO7QrddgJg7WevrAgDs_wQA9P9wP5QkUQM8MoOOcJpPi58Ji7JB_3Db9xpDUCl72HFNiKd13xB0WoU4gLHysJzsj2POF4W2jeBhpwQsNITcIWSvY6ee3etb_7R_Th8yxtypfWbSIP3_4Cz0rzBj44QfvgAE4Jry4h2rY_A1gKHgQx4K9A7FA0Qp1mph6uCCc8gOACTkgjV2dGmTOFeYI5ozmpo9SCmk3j0mcCtLPoav691zmv3t2Z9Egrd8iTXIQ5j2mHKsltIuQb7FCKxyXd2b4Fq4qaL8h_ruSGOAmLkLaom20MEsojiEXbMtlByVNNbnZYRUNQnmXLAH4Hytg7yeCAFZuc8IEEaMHchAMI2KG-ZnoMYcYvlyLRXZHmrj8r9VYlvayY6H--2MVNpxaBmbGiT0e4oCyOn1tOXOVzFsiq6ZrY0QmInpDaWeqJWkKRiEsrwMv5A1d_ItJlqqDUD8USdNoV7uDNLF1VhHJMN3egnyY7gtx3d5CMuTl6_03UD9pE5ZLTI9K009F4pH1_Z7ugO2E764DwHGKWENGeKpWhU5ldcmN_j1EIPsTLPO2MpHKepKfHzqJtZtoHLXOupl-a9o7bjNgOCheJClBQaJMSkReXInuDbuwXpW5WGBNrzAFqmxfDFJTuIwzhujYu10hT98uu0Dt4ehpcXpDiw_wq9DF1W6Jm22fXKsBGRokxWZxc6743v01pvawu6hoFpUy7j0G3Qj22HZQLqAYBA7cJhmERqRZ5bWg4p3z5pb-7hwvuIn-olOIp1i1Seo77A02HJzrpxLKCpG71P0wL3aZUDgfQXT9k6oDOjBuvCKSDEcXqZxNZigUOjypfZsge8qu2GmZ0ZzVEBHHdX-jMYkKSK4XdiWfQTnI_QT2NbrmTOK-heiVG7-KVkBAgWV-QQXEwkJHQU0IWSvBDuiDecbteZXM3QG9uAzMx5FaNJ9sUQ2F3_3fpuGNpUe_fJ6NlqfJnBPhKaL87tHqzNKjMQ2wSYz7sCbJbSn6bN1bDiL7Ucjt8QXZDBCa28Cqk-I7Q; OIDCAuth.forms=AUSPMKscXWBOhzUW-ynPxLDsij79u7CrpkZiDmg33S3_NBxIW83va-wk02q1mmBdnDJYzYVgU61CGIr1t1HC6beZLwj0icYRUW4a6_3_wCaQ4Jcdxya9VQ1rr1smVdl8WIhgyeJn5SSKexMbyrLDpmllUX-nbkq1i2OiSyMqiaqdDLgcOeqVOMMhG9dj5JfLQoNomNMuH_xQKee-fbaSgiPOgl6vku_5lTTghaoIrp9FIBSs8z1hUmumeyPQ8Qxnru6q658YdT5I1oHZoopIVzCi7nnVUtsg0BjeUtx0CRYHlU3U3KKBPNmWMToioJQthOs6mMOyqg2uPwjvyYy-eDGgcgvk2XY7KYAhHfULazn0LMN4uqk45vP_wWkLNWWeHZqYfPkfEoND85Eb1UZYTvLVveVmgv-B7D4I6S2UWnGJvsdEgkQ0kwLxG4dThjBpV8Sp16s_XvWlKlC766HE-qwroCDgcJcDgYTvporUcX35XhDRRAYx7mAMAo6ABIX8W6WKomZ4tjm_iAwrOotTtjaAGQ5wzOWVEv10O9n0qIdfBlezA_do70D0f2Bt-bQGwTpic_J8sa7RPqq3IGTNrGthGiWC5Ti8Mb8U-T6Ne2sFa_5yqk_J-iSsYosIPxYbliSvGQmCQyl9OGilyd50F3qo7aKG1xlIv0d89RTkmDoWV-Q3PiFvKjwmMq0rdfRiW9Wh3dBH0pTWUNa1c365p_ld131D6H8PwQ5I2_PdVbGECIBwWCIjRhB4-hDfAzibJMT-zLT2LUxsGIjF8Ea5Bod-4FWO7Dd4qN2kOzW79ifuMNCSyAu61cFdeJJcOP2UK65EK12794u_pkTwamN1ldW4hQeMmtDmcEE-jaZFHtTeCOonWWHlcrqXW9735UYdqZ1yvLSHehVXwsAvDvKLP-ujzNOqSzJhjwlh3QGoyYcIwRBqGJWLz-Wu3RBMeWz_QCNndw8yTWBK91K9YELmuAEg53HahC2S6EIuFzRaCFWKA7ThBbyxN1qo-u-XsDA4RJxueAbyR78NG_2T_FStJFwH16LxPPQm96dFJD9mG_dyekF1vO-WnSytpskYZp5Hrvv5mJmrP_DMOB3uRGQ4SIrbYqRQViXnBUHNjNcP9F9PpS3cpWjl05Q5jSde1KHzi6eXSPyYkj9RAO_k3knfXR8XtzH4rsbT89Wn6pb0Pca-tJex5fwjOz-51jAV9bpoPoTYDXdwAqyVG5LO5eM7F17hLn2NAfoPxeU-oFNMPFsCx6dcaGwXrkEHxwXD-pBm-z_BwebrFNJ0FCdGmNl7nHuZHX0zzjap3qCQsn1ohTB8JETfpk3wKiHCKr2B5NF-SYIIAXfb7XVGMCnRjF7CbU2-ZQr6VGVrATfJ9kIuP9LhB6BXE9er2Rm7FBfggSxJLs8a2bHep8CqCzG1MngRmcKmlXYfEahUqZrKsM8tfeqiX2hJOSn6yas6JgfiDCapzCBWupGqwnWJDp0pCu8Jyw8M7U-XEpcnTf-ja51nh8fSagPrjSJDsj3xocjSQ-fmSungopImG35OG2kB6q9vhC5VhqkVs-R5uKMe7si6rSIYmAXbVpzRsiN3gc0JxsbWwuTvZDpCFPkoP0SybpDgRlO2DDQnX8jqFprskXzh3lYlACBRJeVgn6bi2RVTTzfbC9uIhnbylLxXOIsOJ7XKBfhNLhF9Ryd7pWBZMeI6SYdXpj5iP0EYBZOHkIexpJ8hLkOIhYWWTLiiluq9TUoe-8E; MicrosoftApplicationsTelemetryDeviceId=c3af2006-aca8-4014-acc8-7b2e81426bce; ai_session=eejdmN3v1WD9SxoynTtrUu|1663743711645|1663743748987'

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