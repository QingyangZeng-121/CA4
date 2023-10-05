const socket = io();

const inboxPeople = document.querySelector(".inbox__people");
const messageBox = document.querySelector(".messages__history");

// Get username from local storage.
let userName = localStorage.getItem("username");

// Defaults to an empty string if there is no username in local storage.
if (!userName) {
    userName = "";
}

const newUserConnected = function () {
    // If there is no username, the following logic is not executed.
    if (!userName) {
        return;
    }

    // Send the username to the server.
    socket.emit("new user", userName);

    // Add a username to the user list.
    addToUsersBox(userName);
};

const addToUsersBox = function (userName) {
    //This if statement checks whether an element of the user-userlist
    //exists and then inverts the result of the expression in the condition
    //to true, while also casting from an object to boolean
    if (!!document.querySelector(`.${userName}-userlist`)) {
        return;
    }
    
    // Setup the divs for displaying the connected users
    // id is set to a string including the username
    const userBox = `
    <div class="chat_id ${userName}-userlist">
      <h5>${userName}</h5>
    </div>
  `;

    // Set the inboxPeople div with the value of userbox
    inboxPeople.innerHTML += userBox;
};

// Call newUserConnected
newUserConnected();

// When a new user event is detected
socket.on("new user", function (data) {
  data.map(function (user) {
      // Display information about new user connections on the console.
      console.log(`New user connected: ${user}`);
      return addToUsersBox(user);
  });
});

// When a user leaves
socket.on("user disconnected", function (userName) {
  console.log(`User disconnected: ${userName}`);
  document.querySelector(`.${userName}-userlist`).remove();
});

const inputField = document.querySelector(".message_form__input");
const messageForm = document.querySelector(".message_form");

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

  // Determine if the message is from the current user
  const isMyMessage = user === userName;

  // Create a new message element
  const messageElement = document.createElement("div");
  messageElement.className = isMyMessage ? "outgoing__message" : "incoming__message";
  messageElement.innerHTML = isMyMessage ? myMsg : receivedMsg;

  // Append the message element to the messageBox
  messageBox.appendChild(messageElement);

  // Scroll to the bottom of the messageBox
  messageBox.scrollTop = messageBox.scrollHeight;
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
