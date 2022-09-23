import { resolve } from "path"
import { Connect, defineConfig } from 'vite'
// import devCerts from 'office-addin-dev-certs'
import VuePlugin from '@vitejs/plugin-vue'
import { ServerResponse } from "http"
import { request } from 'undici'
import WindiCSS from 'vite-plugin-windicss'
const devCerts = require('office-addin-dev-certs')

let cookie = 'MUID=223EE368E37863443D2BF2B9E202627B; ANON=A=9B7A70E711F498DB2EC73A17FFFFFFFF&E=1b00&W=1; NAP=V=1.9&E=1aa6&C=2Sih9Yw-78-WJC2CQBHJVe8PvU2Q-vf1zoNr0BzNe4e4Y4b43w-Ntg&W=1; MSFPC=GUID=5b24e2d34b61427e8ab7e06cb2f17f84&HASH=5b24&LV=202204&V=4&LU=1649946178896; FormsWebSessionId=4e6d355b-1d3c-4c92-9a0d-e4a9f6c48703; usenewauthrollout=True; RpsAuthNonce=fc5f1cf2-55c8-41ed-834c-03af2955517e; __RequestVerificationToken=pKHbBIlDuJXkrxdIdFrTxuHjq7OIor56m-ubMyJtxQ2u8gvxC18W5lt8ZIDuUqFkJf1MKpKJLtmzbSKtvKMHOlsU47HQobwbfA-48Vgz4No1; OhpAuthToken=eyJ0eXAiOiJKV1QiLCJub25jZSI6IktneXNkLUZBSkhQS2xiY3Z1d19hUHFPYjZjblBXUWhzeGZoUE1ibVkyOUUiLCJhbGciOiJSUzI1NiIsIng1dCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiI0MzQ1YTdiOS05YTYzLTQ5MTAtYTQyNi0zNTM2MzIwMWQ1MDMiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwiaWF0IjoxNjYzOTE3OTUwLCJuYmYiOjE2NjM5MTc5NTAsImV4cCI6MTY2MzkyMzYyNCwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhUQUFBQVF0dHptWmZGdFY3dS9mR3U4UVBCSVRSMDZZRDh0VW9lTFAxTG15NkIvcnFLNEZTL0lSWVBnVXFJY2ZZV3VnNUdkWndld0wyanR2Qzd3a2dzMHNwenZlUThVK1F5ZU1TZFpXRllLS2VxTGo0PSIsImFtciI6WyJyc2EiLCJtZmEiXSwiYXBwaWQiOiIwZWM4OTNlMC01Nzg1LTRkZTYtOTlkYS00ZWQxMjRlNTI5NmMiLCJhcHBpZGFjciI6IjAiLCJkZXZpY2VpZCI6IjY2NzY2ZGExLTBmOGQtNGQ1Mi05MWMzLTg3M2Y5MDMyM2I4YSIsImZhbWlseV9uYW1lIjoiSmlhbmciLCJnaXZlbl9uYW1lIjoiR2luZ2VyIiwiaXBhZGRyIjoiMTY3LjIyMC4yMzIuOSIsIm5hbWUiOiJHaW5nZXIgSmlhbmciLCJvaWQiOiI4MGE2YjY0ZS0xMDVjLTQ4YTItYWZhOC02MDllZDNmOWUwMjUiLCJvbnByZW1fc2lkIjoiUy0xLTUtMjEtMjE0Njc3MzA4NS05MDMzNjMyODUtNzE5MzQ0NzA3LTE0MjUxOTAiLCJwdWlkIjoiMTAwMzdGRkU4MUU3NDIxQiIsInJoIjoiMC5BUm9BdjRqNWN2R0dyMEdScXkxODBCSGJSN21uUlVOam1oQkpwQ1kxTmpJQjFRTWFBSHcuIiwic2NwIjoiT2ZmaWNlSG9tZS5BbGwiLCJzaWQiOiI3ZDNkNGM4Yy1iNjYxLTRlY2YtOWFhMi05MzdkZjBiMGViMTgiLCJzdWIiOiJWLURiYzdGOG9pOW5yRmpnMGp6a2J4Y2QwVnVzWnd0Zi13Ym5HTDFXUE53IiwidGlkIjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3IiwidW5pcXVlX25hbWUiOiJnaW5namlhQG1pY3Jvc29mdC5jb20iLCJ1cG4iOiJnaW5namlhQG1pY3Jvc29mdC5jb20iLCJ1dGkiOiIyTnZWNHZjYkUwZVFSNkJCdUZrU0FBIiwidmVyIjoiMS4wIn0.qYPuHq-fIZcZJLbpYeStOHIA9Yte-6UX-MD9-gCdmh5jPwj5MFdDs0AEuD6j_asg6RFLFsDZ1iD0Xrv2IKhGHBG8S8d_cL9W2Njx2HYfz-JdRw1eE6hA9g3S-p2UXuypTAV5YhMIK3oRn3UHHNuvjyEDe3tMiLc3jyYQGfJuOJiXUa5BfbmSlVzWevft1IvgF9iePMWPe4dJ9fLYokwTFIOI8KbxZKq7NzIcwlWwgXVSjua5V4ToFgXdvatDo9pXFP5J_8N2IzyGqD5_AGz0A9HqBuZkmTND90fVMs8KDnuAgsqxEW_0ExqAvVccml6Zq-KiLAHg5JKne_vuJvtiuw; AADAuth.forms=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiJjOWE1NTlkMi03YWFiLTRmMTMtYTZlZC1lN2U5YzUyYWVjODciLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwiaWF0IjoxNjYzOTIwNTI1LCJuYmYiOjE2NjM5MjA1MjUsImV4cCI6MTY2MzkyNDQyNSwiYWlvIjoiQVdRQW0vOFRBQUFBTGRKSlY0UzJXMlZ4MDlwakdiMGUxTFlGNGswWTB4NFNWN1M5NnpESUdlc3I1bllqdjlCdzRLQ3F3V1FraUZwR3JiZHVmR3FzeGhoMHlsdUNVSEdJUEc1Q2dLWlVQdmI2RDFWR2ZYaXh3VnFXUlNkL09HWkllbURVYVVBRVlXUFciLCJhbXIiOlsicnNhIiwibWZhIl0sImNfaGFzaCI6IjlIa2xRdjFiNElQeHFVQmJPSnlJVEEiLCJmYW1pbHlfbmFtZSI6IkppYW5nIiwiZ2l2ZW5fbmFtZSI6IkdpbmdlciIsImlwYWRkciI6IjE2Ny4yMjAuMjMyLjkiLCJuYW1lIjoiR2luZ2VyIEppYW5nIiwibm9uY2UiOiI2Mzc5OTUxNzYyNDYxNTg0ODkuT0RjMFlqTTJNVEF0TkdObFppMDBaak13TFdJM1lqa3ROR1kzTUdVeE56aGtaalUzWlRobFlXVTVNR1l0TVdRNU1TMDBaVEppTFdFeE5HRXRaVGRqWXpGak56QTVNekJpIiwib2lkIjoiODBhNmI2NGUtMTA1Yy00OGEyLWFmYTgtNjA5ZWQzZjllMDI1Iiwib25wcmVtX3NpZCI6IlMtMS01LTIxLTIxNDY3NzMwODUtOTAzMzYzMjg1LTcxOTM0NDcwNy0xNDI1MTkwIiwicHVpZCI6IjEwMDM3RkZFODFFNzQyMUIiLCJyaCI6IjAuQVJvQXY0ajVjdkdHcjBHUnF5MTgwQkhiUjlKWnBjbXJlaE5QcHUzbjZjVXE3SWNhQUh3LiIsInN1YiI6IlNQVDVvZzdQUnU4emg3M2h5TVdDdmVpT1lLM3VWeVB3aFB5MTl0REhzUjAiLCJ0aWQiOiI3MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDciLCJ1bmlxdWVfbmFtZSI6ImdpbmdqaWFAbWljcm9zb2Z0LmNvbSIsInVwbiI6ImdpbmdqaWFAbWljcm9zb2Z0LmNvbSIsInV0aSI6ImdDYk0tTTlDMmtTN0RVWG9aX2NSQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdfQ.bB2wZm_F-DBnIPGDaguuOsytwjzpUVdRzgDQxs2DxeWXnyUx-VEO-p_K7TxbdzdD90rNqHdicqt2r08DUjDhs5qveGmnMh_I_xK_-ml7xx9Qc9qrO-CEIsI5Z0NU6UVXFXLYoittACnTcJ0IIPQw47O1MTfq3dKWoLbfvtcf18fiduesuzFO_KCF31Kz_Jc-O8B8t9jc6emBXqa7UpoFF6Uq-_AlTqXXfplVEwn94AONTeGvTfIQHtrIQANlf-RVctQZGqbnOoGFhmCDVxr1KdnOPEtpvQqhh5DUAYHJUAnE3MTCYRzSUMld2YY5CIsztwBbPm3-tdLhVBdac3mRDQ; AADAuthCode.forms=0.ARoAv4j5cvGGr0GRqy180BHbR9JZpcmrehNPpu3n6cUq7IcaAHw.AgABAAIAAAD--DLA3VO7QrddgJg7WevrAgDs_wQA9P9fGs4-vhvZbRmhtV5NOhe5k8PNaFmSnqrBjVKQ4vyHG1ClYoAFyvOzPSnYNZBRR6ZjcOgSfD31d9sTxqRkrBkz0SfymzYBAKARMRM0b4fGU6-7xsLkGXJwHVmCrdzarrVl1oAV-eNOT4rG3qb5efg-vEOu5Q_njLI04MeMfOhjrDCwxNLh8fLvIRtMV0H1r_ZrPfJU-xU5LYiKhTuTtteh3-o4R5NYI6oPSdwfvqEX5aZu4HIXxz0VMcujW8N69uWgsr1OSMeOBxH-QvA5sGwC91mHQ_nsnsg_RLHgZevwEtLDTPTw6nU7iDC-OU-7VjQUCJnhTIxXwD3YFjJrtlRzXXu32nnRqW1ui50sDGLdylaL0cpIS3k0RKnSA9N7JrYfEE86uXWqdHrD-kclklUrHczgHdxaBMRdtLPbNIGTGc4F4cgwKt9DPg_rdKfXh4xK3Cf-76_NMLSwUHbGbgQrtErgNLVBwj86wEelSyTxzd6x7T2SCjWz-Kt8UiZUJnYqygFpm_Tc6SqIhR1cs0Ig7JXbNp8tUqRSNAbmzVKoEIgddZE0IHopUsEZXsOiZ3h0h1Ob5eNnxRFZs5FHS2LyqDUEnDbd0dvet9PXmF0RlStkfz3cMy5VML6y0Y-RgbbhGmokIVC79n5J-2oAEXe3LoLD0bq_dhsO8WvxvcqrQajQ1o2vaPOqWXey4PHPdj5o8cpB2731-1pqErcICIjKgw_lkrfpmYOXrjddhBQ80niYJc-hHL_Y-QRNfu79IsuPsAatiwrD4PDVB-lFfJNjRZBrdQLZIFDFYhRKJw3SjG0u654kjbqehqUELUiImUquxWMy6nAoYgBN-LKduofe376bybrHDjPIKZuJW48JEXwNQuXiaERXwaLRPS399yi9Mf3wKkeaPUecG0ygrEzT8cWU8reQ8jtANfG08RTrUZw5u6h_fDt0e2mP8tJ8ySDfEaqukabAPg8LR4IlrDcFlqxDXCt7xzKKd_gGaCIFOrjMefk; OIDCAuth.forms=ASYIaNfIcL-eSwsMFPMtAOQxOA-ipO3a-I-ATtkN6D7cQffWpcYzyc7HT1cSN2gPfmOSKj6DlVZnT1XbLK_rxEPIJ-ceAQRmMxX3SyGPUu4N44QfF5FtJvcGhQPGBi_tqWChCphzBiL6dDVpsBXowjLdlFjbUqlCjD5CJdZc9ap9BvnBGcO3tPKjP9S6bBYWaJ0bCqh2Tt0Yd-0_R9sVjFzFmX7dkQ2qnrd_P7nOl1wXEJq8R5V0ott_abJM1GoOTqYHJTNoYQ-vYbZP5t4bo1f6UZYcRKytyOqzZXDKWwzqiKNmPJIY1JkadA7Y7tSsdEZqQ7aqcXK2GVcax_xSJNmIyegGKse9Iuwy2an3_cRV1pjeBiriJZKixJ4AF0OUM_njElyJK68_SzskoaD4RFauPwv-_gbKPFWzjGIbzUZtx5SZWG6QoEvgKth1UDPL3Dp5ydaxLqVJwkmBptHy8jWn5OrGH5nq-hpva1m3JCJuQRAmxetJuhumXwwA4ANfPBqD2Fk4zZ62r8NhjTbH_6TfLQLKE5g39_JBVqffaCgY5IMSJgXmFmaTEs_FozabNiTYHi0uwcLRkSYgDLMwKIG6EP_V5NqH66dJWMsGIp4BJQ-Gji5NKdP6L2ByzCeNhuEPs998nYW8YdJXm-BmjWOIj_WXpFcNoeWdclvswpYhlfl2Tjh3K06c7z5H_4uM_GN2BlHyKgyl_Z6nh2hoX28VBdAlWU5TG8BC6kKbKzf9WlyBQ5s1NmvAdR7iDC_buy2UADzHkHDbs-EtpMmW41ohU532B_2FXEHzthKNDenMdJgYQT40NsXEnUKRyZX3GYk7-JSh31RoTQ9Xh0pwL4H31kSrTJgsS1cAlNNPWdoFjei4Ad8RFNPz8peIrh4WbZl8oW116V_6CR0dSGYiX4xaP9sEXD-GMHyJnTbiGpaQemmEf0LGq3rfSGGcV3kZvIYot9lkcSpv2ujF3nM4wQiRQmP-fSEF4jbMPygAG-2l9Dwjuw4_oo8ynTrJA9p-GMrspQAlGZ6Nv60jloRyzyQe0FPWIV2f5QnT0BRZ0CeqKxqX_PyItzBpav9CJit79MD7yv6gTI62rNhpocGoCp632r6RWIuAtkOmh6w7rEjZQ6xiSJ1bWG3XRr4h7NnGzpQbRfVuTnu_Q4QGqIpEHIPTYGy7Sbd2L_VYVK09gsGZoREz4zHlcP3B2gXsEfVkcAUB-nlOr45Gv1wZVcEbx3WKEGF-pNlSzeplARcehhBbGw4tcgvRt9Zt14Qmp4Xn-yM0rk5VUocm2SgXxgRGC8MX4sreIXIJg1o4FiZ_xbyF3FzhgTBaoShtnTksx2BFQf8LX20D9KASnZVP9DU35_KFkLT38S8MY23QXZZyl6CDNkl3k5ZfmSfidJUWhf7NzyJN2bVlfMo2Ti6leEtZFJQi8I4R1-GQjHRtKUBwrmzozboGfaBBoUgzb9NUfLVAUrqj8Hk7SNEjSBqutGj6AprX1X7_3lG3dasZsdUJjZimk4Vy91PsOyu-Va6QOGFlIRP7zn6ATpOV3usX3NpeliClg4lwDwdOtbUuyKrI6xvdUbwB3TEczxdcKqqeV0IXHjEyupWGHTHsy8PeVmB0G3Rbi1WH_61dSj217Sg34nqW_ZAOkEwyRbXjx-YXud0VNGV9rD6gUwWIliYRJp7BlraxCBoItP3syEtJC8djMsg3svmeFXPXjncQbp1qXJzcixXm7LLL4DlB3gFJduMZkaSyw4a6xublZMfi978Tx-ang5EWze5QjAe_eAVctJxboFaLcm1GVcy9vcnAYlGBy7Z7D5Bp5A2gq7kfcrykGmaT; MicrosoftApplicationsTelemetryDeviceId=6d78adb0-b4aa-4538-83a9-11062bb508ca; ai_session=K7aev3IFP74zCfnA7DVexS|1663920333007|1663921806303'

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