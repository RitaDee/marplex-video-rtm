/* eslint-disable */ 
const addMemberToDom = async (MemberId) => {
  let rtmClient;
  const { name } = await rtmClient.getUserAttributesByKeys(MemberId, ['name']);

    let membersWrapper = document.getElementById('member__list');

    let memberItem = `<div class="member__wrapper" id="member__${MemberId}__wrapper">
                        <span class="green__icon"></span>
                        <p class="member_name">${name}</p>
                    </div>`

    membersWrapper.insertAdjacentHTML('beforeend', memberItem);
};

const handleMemberJoined = async (MemberId) => {
  addMemberToDom(MemberId);

    let members = await channel.getMembers();
    updateMemberTotal(members);

    let {name} = await rtmClient.getUserAttributesByKeys(MemberId, ['name']);

    addBotMessageToDom(`Welcome to the room ${name}! 👋`);
};

let updateMemberTotal = async (members) => {
    let total = document.getElementById('members__count');
    total.innerText = members.length;
};
 
let handleMemberLeft = async (MemberId) => {
    removeMemberFromDom(MemberId);

    let members = await channel.getMembers();
    updateMemberTotal(members);
};

//Remove member from the DOM
let removeMemberFromDom = async (MemberId) => {
    let memberWrapper = document.getElementById(`member__${MemberId}__wrapper`);

    let name = memberWrapper.getElementsByClassName('member_name')[0].textContent;

    addBotMessageToDom(`${name} has left the room.`);
        
    memberWrapper.remove();
}

// Get members update
let getMembers = async () => {
    let members = await channel.getMembers();
    updateMemberTotal(members)
    for (let i = 0; members.length > i; i + 1) {
        addMemberToDom(members[i]);
    };
};

// Handle channel messages
let handleChannelMessage = async (messageData, MemberId) => {
    let data = JSON.parse(messageData.text);

    if(data.type === 'chat') {
        addMessageToDom(data.displayName, data.message);
    }

    if(data.type === 'user_left') {
        document.getElementById(`user-container-${data.uid}`).remove()

        if(userIdInDisplayFrame === `user-container-${uid}`){
            displayFrame.style.display = null
    
            for(let i = 0; videoFrames.length > i; i++){
                videoFrames[i].style.height = '300px'
                videoFrames[i].style.width = '300px'
            }
        }
    }
}

let sendMessage = async (e) => {
    e.preventDefault();

    let message = e.target.message.value
    channel.sendMessage({text:JSON.stringify({'type':'chat', 'message':message, 'displayName':displayName})})
    addMessageToDom(displayName, message);
    e.target.reset();
};

let addMessageToDom = (name, message) => {
    let messagesWrapper = document.getElementById('messages');

    let newMessage = `<div class="message__wrapper">
                        <div class="message__body">
                            <strong class="message__author">${name}</strong>
                            <p class="message__text">${message}</p>
                        </div>
                    </div>`

    messagesWrapper.insertAdjacentHTML('beforeend', newMessage);

    let lastMessage = document.querySelector('#messages .message__wrapper:last-child');

    if(lastMessage){
        lastMessage.scrollIntoView()
    };
};

// Add bot message to dom
let addBotMessageToDom = (botMessage) => {
    let messagesWrapper = document.getElementById('messages');

    let newMessage = `<div class="message__wrapper">
                        <div class="message__body__bot">
                            <strong class="message__author__bot">🤖 MarpleX Bot</strong>
                            <p class="message__text__bot">${botMessage}</p>
                        </div>
                    </div>`

    messagesWrapper.insertAdjacentHTML('beforeend', newMessage);

    let lastMessage = document.querySelector('#messages .message__wrapper:last-child');

    if(lastMessage){
        lastMessage.scrollIntoView();
    };
};

let leaveChannel = async () => {
    await channel.leave()
    await rtmClient.logout()
};

window.addEventListener('beforeunload', leaveChannel);
let messageForm = document.getElementById('message__form');
messageForm.addEventListener('submit', sendMessage);