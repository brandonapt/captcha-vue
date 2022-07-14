const express = require('express');
const app = express();
const port = process.env.PORT || 8081;
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('cross-fetch');
const path  = require('path');
const axios = require('axios')
const funcaptcha = require('funcaptcha')



app.use(bodyParser.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
}));

let staticFileMiddleware = express.static(path.join(__dirname, '../dist'));
app.use('/', staticFileMiddleware);
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

app.get('/loginthing', async (req, res) => {
    let data= await getFieldData()
    const token = await funcaptcha.getToken({
        pkey: "476068BF-9607-4799-B53D-966BE98E2B81", // The public key
        surl: "https://roblox-api.arkoselabs.com", // Some websites can have a custom service URL
        data: {
            blob: data.split(',')[1] // Some websites can have custom data passed: here it is data[blob]
        },
        headers: {
            // You can pass custom headers if you have to, but keep
            // in mind to pass a user agent when doing that
            "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36'
        },
        site: "https://www.roblox.com", // The site parameter, usually not required
        // NOTE: The proxy will only be used for fetching the token, and not future requests such as getting images and answering captchas
    })

    const session = new funcaptcha.Session(token, {
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36" // Custom user agent for all future requests
    })
    console.log(session)
    console.log(session.getEmbedUrl())
    let challenge = await session.getChallenge()
})

async function getKey(type) {
    if (type == null) {
        type = 'ACTION_TYPE_WEB_LOGIN'
    }
    const raw = await fetch("https://apis.rbxcdn.com/captcha/v1/metadata")
    const json = await raw.json()
   // console.log(json)
    const key = json.funCaptchaPublicKeys[type]
    console.log(json.funCaptchaPublicKeys)
    return key
}

app.get('/api/script', async (req, res) => {
    let main = await axios.get('https://roblox-api.funcaptcha.com/fc/api/?onload=fcl')
    console.log('send')
    res.send(main.data)
})

app.get('/api/publickeys/:type', async (req, res) => {
    const key = await getKey(req.params.type)
    res.send({ key: key })
})

app.get('/api/getdata', async (req, res) => {
    let data
    try {
        data = await getFieldData()
    } catch(e) {
        return res.send({ error: e })
    }
    res.send({ data: data.split(',')[1], id: data.split(',')[0] })
})


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})

