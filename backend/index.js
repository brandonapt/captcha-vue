const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const fun = require("funcaptcha")
const fetch = require('cross-fetch');

app.use(bodyParser.json());
app.use(cors());

async function getCsrf () {
    const raw = await fetch('https://auth.roblox.com/v2/login', {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': ''
        }
    })
    const json = await raw.json()
   // console.log(raw.headers.get('x-csrf-token')) check dms check d
    return raw.headers.get('x-csrf-token')
}

async function getFieldData() {
    const c = await getCsrf()
    const headers = {
        'authority': 'auth.roblox.com',
        'x-csrf-token': c,
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/536.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36',
        'content-type': 'application/json;charset=UTF-8',
        'accept': 'application/json, text/plain, */*'
    }
    
    const data = await axios.post('https://auth.roblox.com/v2/signup', {

      
    }, {
        headers: headers,
    }).catch(e => e.response)

    const json = data.data;
    if (data.status === 429) {
        throw 'ratelimoted'
    
    }
    return json['failureDetails'][0]['fieldData']
}


app.get('/api/geturl', (req, res) => {
    const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36'
    
    fun.getToken({
        pkey: "476068BF-9607-4799-B53D-966BE98E2B81",
        surl: "https://roblox-api.arkoselabs.com",
        headers: {
            "User-Agent": UA
        }
    }).then(async(token) => {
        let s = new fun.Session(token, {userAgent: UA});
        console.log(s.getEmbedUrl());
        res.json({ url: s.getEmbedUrl() });
    });
})


app.listen(3000, () => {
    console.log('Server started on port 3000');
})