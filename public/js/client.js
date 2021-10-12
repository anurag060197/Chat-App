const socket = io();

let username;
let chats = document.querySelector(".chats");
let user_list = document.querySelector(".users-list");
let user_count = document.querySelector(".users-count");
let user_name = document.querySelector(".users-name");
let msg_send = document.querySelector("#user-btn");
let user_msg = document.querySelector("#user-msg");

do{
    username = prompt("Enter your name...");
}while(!username);

user_name.innerHTML = `People (${username})`

socket.emit("new-user-joined", username);

socket.on("user-connected", (socket_name)=>{
    userJoinLeft(socket_name, "joined");
})

socket.on("user-disconnected", (socket_name)=>{
    userJoinLeft(socket_name, "left");
})

function userJoinLeft(name, status){
    let div = document.createElement("div");
    div.classList.add("user-join");
    let content = `<p><b>${name} </b>${status}</p>`;
    div.innerHTML = content;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;
} 

socket.on("user-list", (users)=>{
    user_list.innerHTML = "";
    let arr = Object.values(users);
    arr.forEach((user)=>{
        let p = document.createElement("p");
        p.innerHTML = user;
        user_list.appendChild(p);
    })
    user_count.innerHTML = arr.length;
})

msg_send.addEventListener('click', (e)=>{
    e.preventDefault();
    let data = {
        user: username,
        msg: user_msg.value
    };
    if(user_msg.value != ''){
        socket.emit("message", data)
        user_msg.value = "";
    }
})

function appendMessage(data, status){
    let div = document.createElement("div");
    div.classList.add("message", status);
    let content = `
        <h5>${data.username}</h5>
        <p>${data.message}</p>
    `;
    div.innerHTML = content;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;
}

socket.on("message", (data, status)=>{
    appendMessage(data, status);
})

socket.on("load messages", (results)=>{
    results.forEach(data=>{
        if(data.status === 'Joined'){
            userJoinLeft(data.username, "joined");
        }
        else if(data.status === 'Left'){
            userJoinLeft(data.username, "left");
        }
        else{
            if(data.username === username)
                appendMessage(data, 'outgoing');
            else
                appendMessage(data, 'incoming');
        }
    })
})