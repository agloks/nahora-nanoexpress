// https://github.com/axios/axios
const axios = require("axios")

const BASEURL = "https://gateway.gr1d.io/sandbox/emtu/dados-abertos/v2"
const XAPIKEY = "c10b971d-b55a-45dd-8b4e-29c8945ec5a0"

const HEADERS = {
  "x-api-key": XAPIKEY
}

const PARAMS = {
  name: "São Paulo",
  state: "SP"
}

const baseAxios = axios.create({
  baseURL: BASEURL,
  timeout: 30000, //ms
  headers: HEADERS,
  // params: PARAMS
});

// (async () => {
//   const result = await baseAxios.get("/linhas")
//   console.log(result)
// })()

module.exports = {getPesquisa: baseAxios}