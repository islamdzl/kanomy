const mailer = require('./iso-mailer.js')
const SCU = require('./SCU.js')
const DBCS = require('./DBCS.js')

module.exports = async(data,ws,codes)=>{
    if (data.creat_user && ! await DBCS.findOne({email:data.creat_user.email})) {

            if (data.creat_user.password.length >= 8) {
            let random_number = Math.floor(Math.random()*100000)
            let info = {
                name:data.creat_user.name,
                email:data.creat_user.email,
                password:data.creat_user.password,
                country:data.creat_user.country,
                age: data.creat_user.age
            }
            let code = {
                info:info,
                email:data.creat_user.email,
                code:random_number
            }
            codes.unshift(code)
            await mailer(data.creat_user.email,{
                subject:"Verify your account",
                text:`
                Welcome to isodpl
                Your verification code is “${random_number}“.`
            }).
            then((info)=>{
                ws.send(JSON.stringify({codeverifystate:true}))
                console.log('send code <'+random_number+'> to : '+data.creat_user.email )
            }).
            catch(()=>{
            	console.log('Error send code to Email : '+data.creat_user.email)
                ws.send(JSON.stringify({codeverifystate:false}))
            })
        }
    }else if (data.creat_user){
    	ws.send(JSON.stringify({codeverifystate:'false'}))
    } 
    if(data.code_verify) {
        for (let i = 0; i < codes.length; i++) {
            if(codes[i].email == data.code_verify.email) {
                if (codes[i].code == data.code_verify.code) {
                    await SCU('creat',codes[i].info).
                    then(()=>{
                        ws.send(JSON.stringify({code_verify:true}))
                    }).
                    catch(()=>{
                        ws.send(JSON.stringify({code_verify:false}))
                    })
                }else{
                    ws.send(JSON.stringify({code_verify:false}))
                }
            }else{console.log('Email Verify Error')}
        }
    }
}
/*---------------> WebSoket <-----------------
              requist to server
send to server data.[ creat_user , code_verify ]
creat_user:{   
    name , email , password , age , country
}
           response to application
    codeverifystate : {true / false}
                     
              requist to server
code_verify:{
    code , email
}
           response to application
    code_verify:{ true / false }


-------------> postman! <-------------------
        //1
   "creat_user":{
        "name":"user",
        "email":"user@gmail.com",
        "password":"12345678",
        "country":"algeria",
        "age": 0
   }
        // 2 
    "codeverify":{
        "code":"000000",
        "email":"user@gmail.com"
    }

*/
