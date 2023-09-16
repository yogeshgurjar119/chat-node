//TODO: Using cdn socket io use this io function 
const socket = io()

const inboxPeople = document.querySelector(".inbox__people")
const inputField = document.querySelector(".message_form_input")
const messageForm = document.querySelector(".message_form")
const messageBox = document.querySelector(".message__history")
const typingMsg = document.querySelector(".typing")


let userName = "";

//For New User Connect Show 
const newuserConnected = ()=>{
    let name = prompt("Please enter your name")   //first time websit reload
    userName = name || `User-${Math.floor(Math.random() * 1000)}`;
    socket.emit("new user",userName) //function trigger wher new user event call
}

const addToUserBox = (userName)=>{
    if(document.querySelector(`.${userName}-userlist`)){
        return;
    }
    const userBox = `<div class="${userName}-userlist">
    <p>${userName}
    </div>`
    inboxPeople.innerHTML += userBox;
}

const addMessage = ({user,message})=>{
    const time =  new Date();
    const formattedTime = time.toLocaleTimeString({hour :"number", minute: "numeric"})

    const recievedMsg = `<div class="incoming__message">
    <div class= "recieved__message">
    <div class ="message_info">
    <span class="message_author">${user} </span>
    <span class="message_time">${formattedTime} </span>
    </div>
    <p> ${message}</p>
    </div>
    </div>` 

    const myMsg = `<div class="incoming__message">
    <div class= "recieved__message">
    <div class ="message_info">
    <span class="message_author">${user} </span>
    <span class="message_time">${formattedTime} </span>
    </div>
    <p> ${message}</p>
    </div>
    </div>` 
    
    messageBox.innerHTML += user === userName ? myMsg:recievedMsg  // for check messages received or send
}

messageForm.addEventListener("submit",(event)=>{
    event.preventDefault()
    if(!inputField.value){
        return
    }
    socket.emit("chat message",{
        message : inputField.value,
        name:userName
    })
    inputField.value = ""   //empty after  send msg
})

inputField.addEventListener("keyup",()=>{
    socket.emit("typing",{
        isTyping : inputField.value.length>0,
        name :userName
    })
})

newuserConnected();

//client side handle events
socket.on("new user",(data)=>{
    data.map((user)=>addToUserBox(user))
})

socket.on("chat message",(data)=>{
    console.log(data)
    addMessage({user:data.name,message:data.message})
})

socket.on("typing",(data)=>{
    if(data.isTyping){
        typingMsg.innerHTML = `<p> ${data.name} is typing....  </p>`
    }else{
        typingMsg.innerHTML =""
        return
    }
})

socket.on("user disconnected",(userName)=>{
    document.querySelector(`.${userName}-userlist`).remove();
})