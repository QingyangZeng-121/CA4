const socket = io();

const inboxPeople = document.querySelector(".inbox__people");

// 从本地存储中获取用户名
let userName = localStorage.getItem("username");

// 如果本地存储中没有用户名，则默认为空字符串
if (!userName) {
    userName = "";
}

const newUserConnected = function () {
    // 如果没有用户名，则不执行下面的逻辑
    if (!userName) {
        return;
    }

    // 发送用户名给服务器
    socket.emit("new user", userName);

    // 添加用户名到用户列表
    addToUsersBox(userName);
};

// ... 其他代码不变 ...

const addToUsersBox = function (userName) {
    //This if statement checks whether an element of the user-userlist
    //exists and then inverts the result of the expression in the condition
    //to true, while also casting from an object to boolean
    if (!!document.querySelector(`.${userName}-userlist`)) {
        return;
    
    }
    
    //setup the divs for displaying the connected users
    //id is set to a string including the username
    const userBox = `
    <div class="chat_id ${userName}-userlist">
      <h5>${userName}</h5>
    </div>
  `;
    //set the inboxPeople div with the value of userbox
    inboxPeople.innerHTML += userBox;
};

//call 
newUserConnected();

//when a new user event is detected
socket.on("new user", function (data) {
  data.map(function (user) {
          return addToUsersBox(user);
      });
});

//when a user leaves
socket.on("user disconnected", function (userName) {
  document.querySelector(`.${userName}-userlist`).remove();
});


const inputField = document.querySelector(".message_form__input");
const messageForm = document.querySelector(".message_form");
const messageBox = document.querySelector(".messages__history");

const addNewMessage = ({ user, message, timestamp }) => {
  const time = new Date();
   const formattedTime = time.toLocaleString("en-US", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  const receivedMsg = `
  <div class="incoming__message">
    <div class="received__message">
      <p>${message}</p>
      <div class="message__info">
        <span class="message__author">${user}</span>
        <span class="time_date">${formattedTime}</span>
      </div>
    </div>
  </div>`;

  const myMsg = `
  <div class="outgoing__message">
    <div class="sent__message">
      <p>${message}</p>
      <div class="message__info">
        <span class="time_date">${formattedTime}</span>
      </div>
    </div>
  </div>`;

  //is the message sent or received
  messageBox.innerHTML += user === userName ? myMsg : receivedMsg;
};

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!inputField.value) {
    return;
  }

  socket.emit("chat message", {
    message: inputField.value,
    nick: userName,
  });

  inputField.value = "";
});

socket.on("chat message", function (data) {
  addNewMessage({ user: data.nick, message: data.message, timestamp: data.timestamp });
});
