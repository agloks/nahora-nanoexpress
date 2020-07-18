require('dotenv').config();

// https://github.com/axios/axios

const axios = require("axios")
const qs = require("qs")

const PARAMS = {
  fname: "Agloks",
  sname: "Ana"
}
const BASEURL = `https://love-calculator.p.rapidapi.com/getPercentage?${qs.stringify(PARAMS)}`
const HEADERS = {
  "Accept": "application/json",
  "x-rapidapi-host": "love-calculator.p.rapidapi.com",
  "x-rapidapi-key": process.env.KEY_API
}

const baseAxios = axios.create({
  baseURL: BASEURL,
  timeout: 10000, //ms
  headers: HEADERS,
});

// (async () => {
//   const result = await baseAxios.get()
//   console.log(result)
// })()

module.exports = {getPesquisa: baseAxios}