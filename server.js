const express = require('express')
const http = require('http')
const cors = require('cors')
const websoket = require('ws')
const DBCS = require('./sourse/DBCS.js') 
const SCuser = require('./sourse/SCU.js')
const WS = require('./sourse/WS.js')
const PORT = 2007
const app = express() 
const server = http.createServer(app)
WS(app,server)
app.use(express.json())
app.use(cors({origin:"*"}))

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'//GUI//index.html') // index file GUI
})


app.post('/creat-user',async(req,res)=> {
    await SCuser('creat',req.body).
    then((info)=>{
        res.send(info)
    }).catch((info)=>{
        res.send(info)
    })
}) 
app.post('/login-user',async(req,res)=>{
    await SCuser('get-s',req.body).then((user)=>{
        res.send(user)
    }).catch((err)=>{
        res.send(err)
    })
})
//**************************************************** */
app.get('/get-logo',(req,res)=>{
    res.sendFile(__dirname + "//sourse//img//logo.png")
})
app.get('/get-background',(req,res)=>{
    res.sendFile(__dirname + "//sourse//img//background.png")
})
//**************************************************** */
server.listen(2007,()=>{
    console.log(`isodpl Server listen in port > ${PORT}`)
})
app.get('/GET_FILE/:I1/:I2/:I3/:I4/:I5',(req,res)=>{
    var I1 = '//' + req.params.I1
    var I2 = '//' + req.params.I2
    var I3 = '//' + req.params.I3
    var I4 = '//' + req.params.I4       
    var I5 = '//' + req.params.I5       
    if (I2 == '//n') {
        I2 = ""
        I3 = ""
        I4 = "" 
        I5 = ""
    }else if (I3 == '//n'){
        I3 = ""   
        I4 = ""
        I5 = ""
    }else if (I4 == '//n') {
        I4 = ""
        I5 = ""
    }else if (I5 == '//n'){
        I5 = ""
    }
    res.sendFile(__dirname+`//GUI${I1}${I2}${I3}${I4}${I5}`)
})
/* 
version : 1.0.0
send mail : iso-mailer  module
                        WEB APPLICATION *** 

creat user >>> post() >> {email, password , name , age , conutry} ***
get user >>> post() >> {email , password} ***

--------------------------> WebSoket <-------------v
*** >>> on open() >v                               |
    "diclar":{                                     |
        "email":"Yor email",                       |
        "password":"Yor password"                  |
    }                                              |
                                                   |
*** >>> on send to >v                              |
    "send_to":{                                    |
        "to":"1",                                  |
        "data":{                                   |
            "message":"mn 2"                       |
        }                                          |
    },                                             |
                                                   |
*** >>> on random >v                               |
    "random":true        >respons auto<            |
___________________________________________________|
*/
