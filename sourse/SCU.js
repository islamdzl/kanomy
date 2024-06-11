const DBC = require('./DBCS.js')
module.exports = async(M,D)=>{
    return new Promise(async(resolve,reject)=>{
        if (M == 'creat') {
                await DBC.findOne({email:D.email}).
                then(async(user)=>{
                if (user) {
                    reject('The account already exists')
                }else{
                    DBC.countDocuments({}).
                    then(async(len)=>{
                        let newuser = new DBC({
                            name:D.name,
                            email:D.email,
                            password:D.password,
                            country:D.country,
                            age:D.age,
                            ws:len+1
                        })
                        await newuser.save()
                        resolve('Your account has been created')
                    })

                }
                })
        }if (M == 'get-ws') {
            DBC.findOne({email:D.email}).
            then((user)=>{
                resolve(user.ws)
            })
        }else if(M == 'get-s') {
            await DBC.findOne({email:D.email}).
            then((user)=>{
                if (user) {
                    if (user.password === D.password) {
                        let res = user
                        res.__v = undefined
                        resolve(res)
                    }else{reject('The password is incorrect')}
                }else{
                    reject('Account not found')
                }
            })
        }else if(M == 'get-p') {
            await DBC.findOne({ws:D.ws}).
            then((user)=>{
                if (user) {
                    let info = {
                        _id:undefined,
                        __v:undefined,
                        name:user.name,
                        age:user.age,
                        country:user.country,
                        ws:user.ws
                    }
                    resolve(info)
                }else{
                    reject('Account not found')
                }
            })
        }else if (M == 'get') {
            await DBC.findOne({email:D.email}).
            then((user)=>{
                if (user) {
                    resolve(user)
                }else{
                    reject(false)
                }
            })
        }
    })

}
/* 
let user = new DBCS({
    name:"islam",
    age:17,
    country:"algeria",
    email:"legbedjislam",
    password:"123456"
})
user.save() 
*/