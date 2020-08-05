import { Week, Month } from "./calendar";

const signup = async () => {
  const username = document.getElementById("username__signup").value; // Get the username from the form
  const password = document.getElementById("password__signup").value;

  const signupData = {
    username: username,
    password: password,
  };

  try {
    const res = await fetch("signup.php", {
      method: "POST",
      body: JSON.stringify(signupData),
      headers: { "content-type": "application/json" },
    });
    if (!res.ok) console.log("failure");
    const data = await res.json();

    console.log(data);
  } catch (error) {
    console.error(error);
  }
};

const login = async () => {
  const userInfo = document.getElementsByClassName("loggeduser")[0];
  const username = document.getElementById("username__login").value; // Get the username from the form
  const password = document.getElementById("password__login").value;

  const loginData = {
    username: username,
    password: password,
  };

  try {
    const res = await fetch("login.php", {
      method: "POST",
      body: JSON.stringify(loginData),
      headers: { "content-type": "application/json" },
    });
    if (!res.ok) console.log("failure");
    const data = await res.json();
    userInfo.id = data.userid;
    userInfo.innerHTML = data.username;
    document.getElementsByName("csrf-token")[0].content = data.token;

    loadEvents();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};

const addEvent = async () => {
  const eventName = document.getElementById("name");
  const eventDate = document.getElementById("date");
  const eventTime = document.getElementById("time");
  const token = document.getElementsByName("csrf-token")[0].content;

  const eventData = {
    name: eventName.value || "",
    date: eventDate.value || "",
    time: eventTime.value || "",
    token: token || -1,
  };

  try {
    const response = await fetch("addEvent.php", {
      method: "POST",
      body: JSON.stringify(eventData),
      headers: { "content-type": "application/json" },
    });

    if (!response.ok) console.log("failure");

    const data = await response.json();
    loadEvents();
    console.log(data);

    eventDate.value = "";
    eventTime.value = "";
    eventName.value = "";
  } catch (error) {
    console.error(error);
  }
};

async function deleteEvent() {
  const userid = document.getElementsByClassName("loggeduser")[0].id;
  const comment = this.parentElement;
  const token = document.getElementsByName("csrf-token")[0].content;

  const userData = {
    userId: userid,
    commentId: comment.id,
    token: token ? token : -1,
  };

  try {
    const response = await fetch("deleteEvent.php", {
      method: "POST",
      body: JSON.stringify(userData),
      headers: { "content-type": "application/json" },
    });

    if (!response.ok) console.log("failure");
    const data = await response.json();
    console.log(data);

    if (data.success == true) comment.remove();
  } catch (error) {
    console.error(error);
  }
}

async function updateEvent() {
  const userid = document.getElementsByClassName("loggeduser")[0].id;
  const event = this.parentElement;
  const updateText = event.getElementsByClassName("changeName")[0].value;
  const updateDate = event.getElementsByClassName("changeDate")[0].value;
  const updateTime = event.getElementsByClassName("changeTime")[0].value;
  const token = document.getElementsByName("csrf-token")[0].content;

  const userData = {
    userId: userid,
    commentId: event.id,
    updateText: updateText,
    updateDate: updateDate,
    updateTime: updateTime,
    token: token ? token : -1,
  };

  try {
    const response = await fetch("updateEvent.php", {
      method: "POST",
      body: JSON.stringify(userData),
      headers: { "content-type": "application/json" },
    });

    if (!response.ok) console.log("failure");
    // const text = await response.text();
    // console.log(text);
    const data = await response.json();
    console.log(data);

    if (data.success == true) {
    }
  } catch (error) {
    console.error(error);
  }
}

const loadDOM = () => {
  const calItems = document.getElementsByClassName("calendar")[0].children;

  for (let i = 0; i < calItems.length; i++) {
    const calItem = calItems[i];

    const day = document.createElement("p");
    day.textContent = `${i + 1}`;
    calItem.appendChild(day);
  }
};

const loadEvents = async () => {
  try {
    const res = await fetch("loadEvents.php", {
      method: "POST",
    });

    if (!res.ok) {
      console.log("failure");
    }

    const data = await res.json();

    console.time("test");
    for (const [date, info] of await Object.entries(data)) {
      const [year, month, day] = info.start_date.split("-");

      const domDate = document.getElementById(day);
      domDate.innerHTML = `${day}`;

      const event = document.createElement("div");
      event.id = info.id;

      const item = document.createElement("p");
      item.innerHTML = `${info.title}: ${info.start_date} @ ${info.start_time}`;

      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = "delete";
      deleteButton.onclick = deleteEvent;

      const editButton = document.createElement("button");
      editButton.innerHTML = "edit";
      editButton.onclick = updateEvent;

      const updater = document.createElement("div");
      const updateName = document.createElement("input");
      updateName.type = "text";
      updateName.className = "changeName";
      const updateDate = document.createElement("input");
      updateDate.type = "date";
      updateDate.className = "changeDate";
      const updateTime = document.createElement("input");
      updateTime.type = "time";
      updateTime.className = "changeTime";

      updater.appendChild(updateName);
      updater.appendChild(updateDate);
      updater.appendChild(updateTime);

      event.appendChild(item);
      event.appendChild(deleteButton);
      event.appendChild(editButton);
      event.appendChild(updater);

      domDate.appendChild(event);
    }
    console.log(data);
    console.timeEnd("test");
  } catch (error) {
    console.error(error);
  }
};
loadDOM();
loadEvents();
document.getElementById("add").onclick = addEvent;
document.getElementById("signup").onclick = signup;
document.getElementById("login").onclick = login;
