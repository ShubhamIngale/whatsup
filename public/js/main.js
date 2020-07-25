const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const usersList = document.getElementById('users');


// get user and room from url
const {username, room} = Qs.parse(location.search, {
        ignoreQueryPrefix: true
});

console.log(username, room)

const socket = io();

// join chatroom
socket.emit('joinRoom', {username, room});

// get room and users
socket.on('roomUsers', ({room, users}) => {
        outputRoomName(room);
        outputUsers(users);
})

// message from server
socket.on('message', message => {
        console.log(message);
        outputMessage(message);
        if(!document.hasFocus()) {
                notify(message);
            }
        // scroll down
        chatMessages.scrollTop = chatMessages.scrollHeight;
});

// message submit 
chatForm.addEventListener('submit', (e) => {
        e.preventDefault();

        //get msg test
        const msg  = e.target.elements.msg.value;

        // emitting msg to server
        socket.emit('chatMessage', msg);

        // clear input
        e.target.elements.msg.value = '';
        e.target.elements.msg.focus;
});

// output message to dom
function outputMessage(message) {
        const div = document.createElement('div');
        div.classList.add('message');
        div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">
                ${message.text}
        </p>`;
        document.querySelector('.chat-messages').appendChild(div);
}

// add room name to DOM
function outputRoomName (room) {
        roomName.innerText = room;
}

// add users to DOM
function outputUsers(users) {
        usersList.innerHTML = `
                ${users.map(user => `<li>${user.username}</li>`).join('')}
        `;
}

// notification
function notify(message) {

        if (!window.Notification) {
                console.log('Browser does not support notifications.');
            } else {
                // check if permission is already granted
                if (Notification.permission === 'granted') {
                    // show notification here
                var notify = new Notification(`from ${message.username}`, {
                        body: message.text,
                        // icon: 'https://bit.ly/2DYqRrh',
                    });
                    
                } else {
                    // request permission from user
                    Notification.requestPermission().then(function(p) {
                       if(p === 'granted') {
                               console.log('You will get Message Notification');
                       } else {
                           console.log('User blocked notifications.');
                       }
                    }).catch(function(err) {
                        console.error(err);
                    });
                }
            }
}