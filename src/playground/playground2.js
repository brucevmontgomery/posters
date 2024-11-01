//const cheerio = require('cheerio')
//import * as fs from 'fs'


//const axios = require("axios").default;

import axios from 'axios'

axios.get()
//let filename = __dirname + '\\test.html'
//const buffer = fs.readFileSync(filename);
//const $ = cheerio.loadBuffer(buffer)
function test() {
   return axios.get('https://jsonplaceholder.typicode.com/users/1')
}

Promise.all([test()])
.then(function (results) {
    console.log(results[0]) 
})



