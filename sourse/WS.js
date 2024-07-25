/*
           WebSoket module ***

----------------------------------------------------------------*/
const websoket = require('ws')
const DBCS = require('./DBCS')
const SCuser = require('./SCU')
const mailer = require('./mailer')
module.exports = (app,server)=>{
    const wss = new websoket.Server({server})
    const clients = new Map()
    var RANDOMC = []
    var RANDOMV = []
    var codes = []
    wss.on('connection',(ws)=>{
        console.log('new client!')
        ws.on('message',(message)=>{
            const response = message.toString('utf-8')
            const MES = async()=>{
            try{
                const data = JSON.parse(response)
                await mailer(data,ws,codes)
                if (data.diclar) {
                    if (! ws.id) {
                        await DBCS.findOne({email:data.diclar.email}).
                        then(async(client)=>{
                            if (client.email == data.diclar.email && client.password == data.diclar.password) {
                                    ws.id = await SCuser('get-ws',{email:data.diclar.email})
                                    clients.set(ws.id ,ws)
                                    console.log('diclared !' + ws.id)
                                    //  <----
                            }
                        })
                    }
                }
                if (data.send_to) {
                    try{
                        let to_sw = clients.get(data.send_to.to)
                        let data_to = data.send_to.data
                        let from = ws.id
                        to_sw.send(JSON.stringify({
                            from:{
                                from:from,
                                data:data_to
                            }
                        }))
                        if (data.send_to == true) {
                            ws.send(JSON.stringify({send_to_state:true,to:data.send_to.to}))
                        }
                    }catch{
                        ws.send(JSON.stringify({send_to_state:false,to:data.send_to.to}))
                    }
                }
                if(data.random == 'chat') {
                console.log('random chat from',ws.id)
                    if (RANDOMC.length == 0) {
                        RANDOMC.push(ws)
                    }else{
                        if (RANDOMC[0].id != ws.id) {
                            let RAN = RANDOMC[0]
                            await SCuser('get-p',{ws:ws.id}).
                            then((info)=>{let inf = {};inf.type = 'chat'; inf.ws=info.ws; inf.user = info;RAN.send(JSON.stringify({random:inf}))})
                            await SCuser('get-p',{ws:RAN.id}).
                            then((info)=>{let inf = {};inf.type = 'chat'; inf.ws=info.ws; inf.user = info;ws.send(JSON.stringify({random:inf}))})
                            RANDOMC = [] 
                        }
                    }
                    console.log('>> ',RANDOMC.length+' >> '+ws.id)
                }else if (data.random == 'video' ){
                    console.log('random video from',ws.id)
                    if (RANDOMV.length == 0) {
                        RANDOMV.push(ws)
                    }else{
                        if (RANDOMV[0].id != ws.id) {
                            let RAN = RANDOMV[0]
                            await SCuser('get-p',{ws:ws.id}).
                            then((info)=>{let inf = {};inf.type = 'video'; inf.ws=info.ws; inf.user = info; RAN.send(JSON.stringify({random:inf}))})
                            await SCuser('get-p',{ws:RAN.id}).
                            then((info)=>{let inf = {};inf.type = 'video'; inf.ws=info.ws; inf.user = info; ws.send(JSON.stringify({random:inf}))})
                            RANDOMV = [] 
                        }
                    }
                    console.log('>> ',RANDOMV.length+' >> '+ws.id)
                }
            }catch{}
            }
            MES()
        })
        ws.on('close',()=>{
            clients.delete(ws.id)
            console.log('client disconnects : ',ws.id)
        })
    })


}

// message instanceof Buffer
/*
 _____________________________________________
|///////////////////////\\\\\\\\\\\\\\\\\\\\\\|
|                Diclaration                  |
|----------> reqiuste to server v <-----------|
|                                             |
|    "diclar":{                               |
|        "email":"legbedjisla",               |
|        "password":"1234567"                 |
|    }                                        |
|                                             |
|_____________________________________________|
|///////////////////////\\\\\\\\\\\\\\\\\\\\\\|
|                Send To                      |
|----------> reqiuste to server v <-----------|
|                                             |
|    "send_to":{                              |
|        "resend": true / false,              |
|        "to":"1",                            |
|        "data":{                             |
|            "type":""                        |
|        }                                    |
|    },                                       |
|                                             |
|----------> response To To v <---------------|
|                                             |
|         from:{                              |
|            from:" ",                        |
|            data:{}                          |
|        }                                    |
|                                             |
|----------> response v <---------------------|
|                         if resend == true|
|            send_to_state: true / false ,    |
|            to:" "                           |
|_____________________________________________|
|///////////////////////\\\\\\\\\\\\\\\\\\\\\\|
|                > Random <                   |
|----------> reqiuste to server v <-----------|
|                                             |
|    "random": "video / chat"                 |
|                                             |
|----------> response To clients v <----------|
|                                             |
|        random:{                             |
|            type:"video / chat",             |
|            user:" name, age, country, ws",  |
|            ws:""                            |
|        }                                    |
|_____________________________________________|
|///////////////////////\\\\\\\\\\\\\\\\\\\\\\|

*/
