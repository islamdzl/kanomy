
const loading = `
<div class="loading"><img src="GET_FILE/img/loading.png/n/n/n"></div>
`
const p_login = `
<img class="imgb" src="GET_FILE/img/background.jpg/n/n/n">
    <div class="bd1">
        <input type="email" id="email1" class="inputinfo1" placeholder="Email">
        <input type="password" id="password1" class="inputinfo1" placeholder="Password">
        <input type="button" value="log in" id="button11" onclick="LOGIN()">
        <input type="button" value="Create an account" id="button12" onclick="GO_TO_P(null, 2)">
    </div>
<img>
`
const p_creat_user = `    
<img class="imgb" src="GET_FILE/img/background.jpg/n/n/n">
    <div class="bd2">
        <input type="email" id="email2" class="inputinfo2" placeholder="Email">
        <input type="text" id="password2" class="inputinfo2" placeholder="Password">
        <input type="text" id="name2" class="inputinfo2" placeholder="name">
        <input type="number" id="age2" class="inputinfo2" placeholder="age">
        <input type="text" id="country2" class="inputinfo2" placeholder="country">
        <input type="button" value="Create an account" id="button21" onclick="CREATE_USER()">
        <input type="button" value="log in" id="button22" onclick="GO_TO_P(null, 1)">
    </div>
<img>
`
const p_code_verify = `
<img class="imgb" src="GET_FILE/img/background.jpg/n/n/n">
    <div class="bd3">
        <input type="number" id="code_verify" class="inputinfo3" placeholder="* * * * * * ">
        <input type="button" value="Create an account" id="button31" onclick="SEND_CODE_VERIFY()">
        <input type="button" value="Resend the code" id="button32" onclick="RESEND_CODE()">
    </div>
<img>
`
const p_home = `
<img class="imgb" src="GET_FILE/img/background.jpg/n/n/n">
    <input type="button" value="log out" id="button41" onclick="localStorage.clear(); GO_TO_P(null,1)">
    <div class="bd4">
        <input type="button" value="chat mesage" id="button42" onclick="CHAT()">
        <input type="button" value="chat video" id="button43" onclick="VIDEO()">
    </div>
<img>
`
const p_video = ` 
<img class="imgb" src="GET_FILE/img/background.jpg/n/n/n">
<div class="bd5">
    <video id="video_me" autoplay ></video>
    <video id="video" autoplay ></video>
    <div id="btns5">
        <input type="button" value="Random" id="button51" onclick="VIDEO_random()">
        <input type="button" value="Exit" id="button52" onclick="GO_TO_P(null,4);__LIVE = false">
    </div>
    <input type="button" value="Change camera" id="button53" onclick="window.alert('قريبا !')">
</div>
</img>
`
/* //////////////////////////////////////////////////////////////////////////////////////////////////////////// */
const URL_WEBSOCKET       = "wss://kanomy.onrender.com" // "ws//:192.168.178.90:2007" 
const URL_XHR             =  "https://kanomy.onrender.com" // "http://192.168.178.90:2007"
/* //////////////////////////////////////////////////////////////////////////////////////////////////////////// */
const lod = document.getElementById('loading')
const body = document.getElementById('contuner')
const socket = new WebSocket(URL_WEBSOCKET) 
var __USER_CREAT;
var __COMAND_RANDOM;
var __USER_INFO;
var __LIVE
var user_info;
var mediaRecorder;
socket.onopen = ()=>{console.log('connection in WebSocket Server');DICLAR()}
const DICLAR = ()=>{
    if (user_info) {  
        socket.send(JSON.stringify({
            diclar:{
                email:user_info.email,
                password:user_info.password
            }
        }))
    }
}
socket.onmessage = async(message)=>{
    try{
        let data = JSON.parse(message.data)
        console.log(data)
        if (data.from && data.from.from == __USER_INFO.ws) {
            if (__LIVE && data.from.data.type == 'video') {
                console.log('video acsept')
                const videoPlayer = document.getElementById('video')
                const videoBlob = new Blob([data.from.data.stream], { type: 'video/webm' });
                const videoUrl = URL.createObjectURL(videoBlob);
                videoPlayer.src = videoUrl;
                videoPlayer.play();
            }
        }
        if (data.random) {
            lod.style.display = 'none'
            if (data.random.type == 'chat' && __COMAND_RANDOM == 'chat') {
                __USER_INFO = data.random.user
                __LIVE = true
            }
            if (data.random.type == 'video' && __COMAND_RANDOM == 'video') {
                __USER_INFO = data.random.user
                __LIVE = true
                let video_me = document.getElementById('video_me');
                let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio:true})
                video_me.srcObject = stream
                mediaRecorder = new MediaRecorder(stream)
                mediaRecorder.ondataavailable = (event)=>{
                    if (__LIVE) {
                        socket.send(JSON.stringify({
                            send_to:{
                                to:__USER_INFO.ws,
                                resend:false,
                                type:'video',
                                data:{
                                    stream:event.data
                                }
                            }
                        }))
                    }
                    }
                mediaRecorder.start(100)
            }
        }
        if (data.codeverifystate == false || data.codeverifystate) {
            lod.style.display = 'none'
            if (data.codeverifystate == true) {
                GO_TO_P(p_code_verify,null)
            }else{
                window.alert('Eroor send code')
            }
        }
        if (data.code_verify == false || data.code_verify) {
            lod.style.display = 'none'
            if (data.code_verify == true) {
                window.alert('OK')
                GO_TO_P(null, 1)
            }else{
                window.alert('Error Code !')
                document.getElementById('code_verify').value = ''
            }
        }
        
    }catch{
        console.info('Error parsing response in server > ', message.data)     
    }
}
window.onload = async()=>{
    console.log('page loded!')
    user_info = JSON.parse(localStorage.getItem('user_info'))
        if (user_info) {
            body.innerHTML = p_home
        }else{
            body.innerHTML = p_login
        }
}
const GO_TO_P = (P,I)=>{
    if (I) {
        body.innerHTML=[p_login, p_creat_user, p_code_verify, p_home, p_video][I-1]
    }else{
        body.innerHTML = P
    }
}
const LOGIN = ()=>{
    lod.style.display = 'block'
    let email = document.getElementById('email1').value
    let password = document.getElementById('password1').value
    console.log('login')
    let xhr =  new XMLHttpRequest()
    xhr.open('POST',URL_XHR+'/login-user')
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = ()=>{
        if (xhr.readyState === 4) {
            try{
                console.log(JSON.parse(xhr.responseText))
                localStorage.setItem('user_info',xhr.responseText)
                user_info = JSON.parse(localStorage.getItem('user_info'))
                DICLAR()
                GO_TO_P(p_home)
            }catch{
                window.alert(xhr.responseText)
            }
            lod.style.display = 'none'
        }
    }
    xhr.send(JSON.stringify({
        email:email, 
        password:password
    })) 
}
const CREATE_USER = ()=>{
    let email = document.getElementById('email2').value
    let password = document.getElementById('password2').value
    let name = document.getElementById('name2').value
    let age = document.getElementById('age2').value
    let country = document.getElementById('country2').value
    __USER_CREAT = {
        email:email,
        password:password,
        name:name,
        age:age,
        country:country
    }
    let verify = (item, length)=>{
        if (item.length >= length) {
            return true
        }else{return false}
    }
    let ERR = '==='
    verify(country, 3) ?console.log('yes'):ERR = 'Country Error'
    age >= 18 && age <= 60 ?console.log('yes'):ERR = 'Age Error'
    verify(name, 4) ?console.log('yes'):ERR = 'Name Error'
    verify(password, 8) ?console.log('yes'):ERR = 'Password Error'
    verify(email, 11) ?console.log('yes'):ERR = 'Email Error'
    if (ERR == '===') {
        lod.style.display = 'block'
        console.log('cooontunue')
        socket.send(JSON.stringify({
            creat_user:{
                email:email,
                password:password,
                name:name,
                age:age,
                country:country
            }
        }))
    }else{window.alert(ERR)}
}
const SEND_CODE_VERIFY = ()=>{
    let code = document.getElementById('code_verify').value
    console.log(code.length)
    if (code.length == 5 || code.length == 6) {
        socket.send(JSON.stringify({ 
            code_verify:{
                code:code,
                email:__USER_CREAT.email
            }
        }))
        lod.style.display = 'block'
    }else{window.alert('Code Error')}
}
const RESEND_CODE = ()=>{
    console.log('resend code')
    socket.send(JSON.stringify({
        creat_user:{
            email:__USER_CREAT.email,
            password:__USER_CREAT.password,
            name:__USER_CREAT.name,
            age:__USER_CREAT.age,
            country:__USER_CREAT.country
        }
    }))
    lod.style.display = 'block'
}
let VIDEO_random = ()=>{
    __LIVE = false
    __COMAND_RANDOM = 'video'
    socket.send(JSON.stringify({
        random:'video'
    }))
    lod.style.display = 'block'
}
const VIDEO = ()=>{
    console.log('go to video')
    GO_TO_P(null, 5)
    VIDEO_random()
}
const CHAT = ()=>{
    window.alert('قريبا !')
}
