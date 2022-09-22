import { resolve } from "path"
import { Connect, defineConfig } from 'vite'
// import devCerts from 'office-addin-dev-certs'
import VuePlugin from '@vitejs/plugin-vue'
import { ServerResponse } from "http"
import { request } from 'undici'
import WindiCSS from 'vite-plugin-windicss'
const devCerts = require('office-addin-dev-certs')

let cookie = 'MUID=14DB138EE34D6B4A33841CE4E2776AFA; MSFPC=GUID=acd5cf648ebc440e83fd56cc95288391&HASH=acd5&LV=202109&V=4&LU=1632377535065; nps-value=readytoshow; RpsAuthNonce=a046b2f7-112e-40b0-a1b8-5b4e0e9b95ff; FormsWebSessionId=2fa3af11-528c-4d71-ba9c-805cbd224756; usenewauthrollout=True; __RequestVerificationToken=lPrauCYSWKcJq6p8ojZwYQEm7aMACLD_pjqnW7qvx3bcnjIzcGDALFqRAfwFLQ5-rrnxzcxkv4Qp6qgDeoLXFapJRRRggCiJqz_X2BEwE901; OhpAuthToken=eyJ0eXAiOiJKV1QiLCJub25jZSI6IjE1UUg2WUFkQ2VkTUNZMW5aMjhQMWhXdHRWaEMzUkNmMHdLcm5RXzJDa2ciLCJhbGciOiJSUzI1NiIsIng1dCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiI0MzQ1YTdiOS05YTYzLTQ5MTAtYTQyNi0zNTM2MzIwMWQ1MDMiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwiaWF0IjoxNjYzODEyNTk2LCJuYmYiOjE2NjM4MTI1OTYsImV4cCI6MTY2MzgxNjc2NywiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhUQUFBQURhQUZCekRqS0pwTlYyK3BXWlFCZnlwdGJWWE5aYjRPQjhvYXU4K0NtaktESDc3ampuVTFISlJYeFd3OHZ3bkZpcDJhV01CV0VidlVRLzZRS1loTFpnTm5KMzY0Ky93WXZWSzh0ajVMZjZ3PSIsImFtciI6WyJwd2QiLCJyc2EiLCJ3aWEiLCJtZmEiXSwiYXBwaWQiOiIwZWM4OTNlMC01Nzg1LTRkZTYtOTlkYS00ZWQxMjRlNTI5NmMiLCJhcHBpZGFjciI6IjAiLCJkZXZpY2VpZCI6IjcwOThjZTMwLTg4YmYtNDIyOC1iZDRiLTk2YjNlZDNjODViZSIsImZhbWlseV9uYW1lIjoiWHUiLCJnaXZlbl9uYW1lIjoiSG9uZ3plIiwiaXBhZGRyIjoiMTY3LjIyMC4yMzMuMjQiLCJuYW1lIjoiSG9uZ3plIFh1Iiwib2lkIjoiNTRkYWFiODItZjYwZi00MGI0LTgwY2EtZDBhODMwNGMwMzY1Iiwib25wcmVtX3NpZCI6IlMtMS01LTIxLTIxNDY3NzMwODUtOTAzMzYzMjg1LTcxOTM0NDcwNy0yNDc2NTM1IiwicHVpZCI6IjEwMDMyMDAwNDBFNUNFMDYiLCJyaCI6IjAuQVFFQXY0ajVjdkdHcjBHUnF5MTgwQkhiUjdtblJVTmptaEJKcENZMU5qSUIxUU1hQUxNLiIsInNjcCI6Ik9mZmljZUhvbWUuQWxsIiwic2lkIjoiZGVkNzZmMmYtN2RlOS00Yzc2LWI1YWEtZDlhMWZiNzA0MTBmIiwic3ViIjoidnFKam92eHdXdk9tT3ptMlVZa1RBZmFBeXhHeGpLRU9oZ2p4Tml4ZEpFWSIsInRpZCI6IjcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0NyIsInVuaXF1ZV9uYW1lIjoiaG9ueEBtaWNyb3NvZnQuY29tIiwidXBuIjoiaG9ueEBtaWNyb3NvZnQuY29tIiwidXRpIjoiRHVlZmNGc2xGMGlQMjZ4WVJXZ1lBQSIsInZlciI6IjEuMCJ9.Hs85X-EoLiUNa178HCvqzycSfcW3JvVI1azF2x2l7gpInGL71l_kDV7bhm3E_Cs_fJ9VikIl9rhhmwwpDOoxzrVQp7vyS8lGQoGNUphH5gXKFcJzPAZMg-oBaQPt0YwXC6jljTKErgOmxNplQjrZ_3KEP1FxekFw38P7XdMqk6GlFeIxSJ_LmKfeEESepctNp8nnrWjnXlUJgLgqqINk6DFxC0HX9JB_pVLVy2s1wROlkT6mEBRR4E1iPbLCZCjeRhu8H-Vt-_5-5VxAubdwFuPVtnsMIpTGIpXzgxXgVHBVpzMa29TufFGRgrkQVSP2i9WLgdfmoxtS5kaapcN4fw; AADAuth.forms=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiJjOWE1NTlkMi03YWFiLTRmMTMtYTZlZC1lN2U5YzUyYWVjODciLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwiaWF0IjoxNjYzODEyODYxLCJuYmYiOjE2NjM4MTI4NjEsImV4cCI6MTY2MzgxNjc2MSwiYWlvIjoiQVdRQW0vOFRBQUFBQW5aSi9HbktjNVptZWlxOURja3J2U3JWNnVtQVpjdE5RS2djWlhlL08zSVF2VDlDMk90c0FMTGhmMnhkTnZZazdYZ1VnaVJGemhJNFUraGd5eHg3UlphMUg3cGIzUU1mSGlObnpEczh5djRCdVBZaHA4dFpxTXhmVlpMeTJ6MzciLCJhbXIiOlsicnNhIiwibWZhIl0sImNfaGFzaCI6Ii15dXZ3THllQ3czdkJLdDJDSGtvbXciLCJmYW1pbHlfbmFtZSI6Ilh1IiwiZ2l2ZW5fbmFtZSI6Ikhvbmd6ZSIsImluX2NvcnAiOiJ0cnVlIiwiaXBhZGRyIjoiMTY3LjIyMC4yMzIuMjQiLCJuYW1lIjoiSG9uZ3plIFh1Iiwibm9uY2UiOiI2Mzc5OTQwOTk2MDM3MDQzMzAuT0dZMVl6VXpZemd0TlRVd1lpMDBNV1ZqTFRobE56UXRabUZoTVRGaVpUZGxPRE5tWVdVNU5XRXpZall0WTJKbE55MDBZMlJrTFRrNVpURXRPV1V3TkRneFptWTNabUU0Iiwib2lkIjoiNTRkYWFiODItZjYwZi00MGI0LTgwY2EtZDBhODMwNGMwMzY1Iiwib25wcmVtX3NpZCI6IlMtMS01LTIxLTIxNDY3NzMwODUtOTAzMzYzMjg1LTcxOTM0NDcwNy0yNDc2NTM1IiwicHVpZCI6IjEwMDMyMDAwNDBFNUNFMDYiLCJyaCI6IjAuQVFFQXY0ajVjdkdHcjBHUnF5MTgwQkhiUjlKWnBjbXJlaE5QcHUzbjZjVXE3SWNhQUxNLiIsInN1YiI6Il9INGxyME5IRmF3ekx3bTBJUHU2ZXRnZmo5cTBxcjYyTXNqNllWRnAtUEkiLCJ0aWQiOiI3MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDciLCJ1bmlxdWVfbmFtZSI6ImhvbnhAbWljcm9zb2Z0LmNvbSIsInVwbiI6ImhvbnhAbWljcm9zb2Z0LmNvbSIsInV0aSI6InlOeWZUUTZXYTB1Z09hbm1XaXdhQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdfQ.oGfU-CenW71ZWS57ANQAwSV_EHpLheQLWgN2t2LRjwX7G0hHxMIPjO6Im2N5PKrEX9McVfrDBuiSzzocJS0-rnIoYycrLqTFfHkJgAV2ZBs0-uRPP1pwqqRg8DynBaLVTcPVIHrni4aplGYrjm4AezGmi2qQr3Uf0-wOnq_OHLuVsS_L0oGJKqlOF-LQh_fQ8IDbOH6U_QaGkhV4Ji8qC4sO_jnDekcFlKDlqnfkWLmke_09gS3JotzkOO8PaC5Gt6FBPJP2vBo7h1ATU4SmhywYT-Dk0yQgD4zPSInMGbJFEg_gBBBd_I2kDfSmwkAdwuLsLTJFx7kqvRPPYQ474Q; AADAuthCode.forms=0.AQEAv4j5cvGGr0GRqy180BHbR9JZpcmrehNPpu3n6cUq7IcSAEY.AgABAAIAAAD--DLA3VO7QrddgJg7WevrAgDs_wQA9P914FvJ607-LPv-tKce3KtI_ofCVVs6Fr1pm_DJhcb13s8umfpFJOpF2r53g9-aSKoKw_Uzk9u2PKPTmYoxF3No27ri53M9SNARt8OkkGOjBXG5-SZgdSnb3uMyTDWvio0DsRru3HUgCaY4pER7bNcDvC0-CitrI8KCwW0JGJqg0wmZBfexP9GLO88l2qPVzSTO-l_niVKYoPf0H_CoOtf8JUJJLuj_vjPt8OcnjAGjnbr9I2J73MEauCrF06SCB_iuS_btoNJc0uYzlvoU_jr84G_WY_8DKzCmas_p3Y9QZsFpV_l0nkc1ruOlc17ZCDbE42cPH7bH9w8ukbffozDmrh5NsDX-NO4gem9eug1PyNE6F038XbK3cO8WHfAHrtoVC8dNzruwZXCClaqquzBDLTkSNXSkeBBn_4Zo5W58GxsxNN8ft74_d-x-C8UXM8WyXzj9do8POnqmDjx5Su2-xERP80pX9EDW0GLnVg-CAfltE4QjJVYTXrFedigDPS2sg61GvQ1O0t7MwUgvYZ24nrghYosCIZ8LeLLNONsTlvHPk5BdiPrLyco2APg3zSGfKynlJFwtyw934LFnnhaSWHtLRBgDyEIhpbtfktYbrnMwcnyLraLS9406xNc_qs1z6GiCm5u1n1igKbTboRSg5jR71OXhCiH7kZpJtO7Gz9xDQiIy2DfhV0CMtqMiTp2m0KhvMTO1iz2Ccmp9LPacBJPycBcd9WEGeuHtTqgR9ZtHA0RdCqQliZCol2YGqTxDPtJZnvekn9Ih7xFYd3_9l-7CbBNINeWWDcI7xjEEjp0gMunG-5-3jJZOskTJYpiYTJTpbi9DYComWhqanpu4f4pZJG9uKU_o_aCW9m1QnK83-wp8AnPuNgNfujFRllLaQtUSdM-EAdHH80TVxEsyzz1KP6u5KNh8z2PRvy-sU6cPpHegkJ_of33HEYSlSPZ4qRFVCkYlTlZTGtfqujL-yqFQ4XBQvLfPYHlyz5ns0esk; OIDCAuth.forms=AVpjjRRc7jsNwrvE_e3odrm0DfmQW1tn4vEvLdIeesE3lUtXj2bof0qjquMJZDT6oEMYVyu29c_8J30sJlUQwnxk2inyxema96lID7QXNmZZeduFw_xLPbemQCgKEkUptt6jrRi12LZYiqFimkIdNZLpEahYijFqg19MHcqGGqrtGEylpqV9ABuz8by7hQsXr4CopVtd-KIFUyGr0spe85bEtoPBWLmJohpgZQJ-k4L6UxASAOrNAgfjdcDjkhWFNiJx8b2-mG66hRGr-WT0kDBsrigH-ZU5NlrCdmnbSTf3dhmvMZ6nBuSLv-SyM3m9RT3NHi_BcZujFlQ-7bMrbPFDDOoN3qOAcePM-oCPB8UeVDdoFk2rQEtlI7B4yiucMW8SY68IDPJ2fhEUUf-L2NjWxr_RMcOMPOq6ekOUfzQHJptIlAbgWdDfyKOTbGnpAagXSG_5ZcC_ZX9iRkc0Oae2WXDNd2R9qtTfbZSrla32-uvXASnlVzVitJlIDOiaxrTdwiiZKeqIJiGFML06u3AfFVq8--eQBxU5RTwbEv7FQD6NlkFCYJ29-dbT85Fv2wDZO1eWyLsENdXMnzqKVKM3wU9Vd2nxgDDG_EXIlcq_IDpO_-hJ_YWpw7QN0dQK6V4usvs8qF110lPJ69SNijOPTxPDPc0TjKmYUfuHUggVbXR4POV6kPSetU0GMcB9PLTBYI1z661x36s8ZI2NRpu3Z6YmAtoVpH7A0Kh2Bo6E4K7xT17_eBlHflIelkPB-g4ANA_jImqzvzYexHAQQs4uKCcH-KMjAQ761kSg658w09lk2h6DSF3MPz9t0Nb4J5WkjOguzsbwlB7BJSJ_Rtvkz2d8HXXhjwL7Xb6HhfzaiaJDuYMHJVv1wRV0DVROtMuKBaVNKJA_5UX1s_o16o2t7ZuH0d2N5CfOpdPCS1ayj38LwxZZ7sV60fWrqcnIhb0PraOavoGhP7MkWpQrlj8OgEujfa-NopW81nuo3vroohvIwMFYy9f6aoVzN9LygDqnh2d19AQ9DMCInGnprkXDa6_tzGFhk49owcD7XgoP69S2N2x9t-cpX5zwxCUW62fNtr4VEJqSJH6yRoSQj3VJ26e_nDA9fy0apX4CYiRCeUWhdrXYejQWOcNdjOdCbncymGTC5GVsvtIRGvwfLKJOnWV3XcXN-_EcyWy-2cwrRQ7hIsTBK5uPnvSaLQMTPytWDvMFVltSofiQRKDL8oqa6Iu0yyyp6SBTfoBPawI7ZpmKrZ-Fbbfccw-TYLkndEKvsbZaDctZGo0k5yn2kuxpFDPmldF55GyjYRK9fOP5RCQa2o44ujBHHq1tMmOmI_KlAAeZm0x1kOEf-LhMtrnOlgWzMVyxRthA8ofFUA5p5DVnyn4sWgdoeWE5-YDZCjcUpYe9Rp9C7o8KT4ih_z5_XKdV5SPMpvJwIi-miE4wsi00kOhCg-CqxgN7rQWnG6xnlv2RyXWFnMiiBrJpk55KV03wJBCdjRkEyXMigix-xo8jh4HngSYjlly9spy9qfdfEte8IoTIrO2RDGsgUg75IcU3uCgSOHioRLMHLqzqkio5cKrbcdKBsNUE_xP-6pgH_9QHW394qzfhpnlydWAbEm1pwc812czmjsrXnCk2; MicrosoftApplicationsTelemetryDeviceId=02ea8601-5fd7-4f6b-8f41-388c1962ae9b; ai_session=SVqO1oYmfRRCxJaX1JK7zM|1663813153207|1663813165735'

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