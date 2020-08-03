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
    userInfo.innerHTML = "logged in as: " + data.username;
    window.token = data.token;

    loadEvents();
    console.log(data);
    console.log(window);
  } catch (error) {
    console.error(error);
  }
};

const addEvent = async () => {
  const eventName = document.getElementById("name");
  const eventDate = document.getElementById("date");
  const eventTime = document.getElementById("time");

  const eventData = {
    name: eventName.value,
    date: eventDate.value,
    time: eventTime.value,
    token: window.token ? window.token : -1,
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
    console.log(data.name, data.date, data.time);

    eventDate.value = "";
    eventTime.value = "";
    eventName.value = "";
  } catch (error) {
    console.error(error);
  }
};

const loadEvents = async () => {
  const container = document.getElementsByClassName("events")[0];

  try {
    const res = await fetch("loadEvents.php", {
      method: "POST",
    });

    if (!res.ok) {
      console.log("failure");
    }

    const data = await res.json();

    container.innerHTML = "";
    for (const [event, info] of await Object.entries(data)) {
      const item = document.createElement("p");
      const allInfo = `${info.title}: ${info.start_date} @ ${info.start_time}`;
      item.innerHTML = allInfo;

      container.appendChild(item);
    }

    console.log(data);
  } catch (error) {
    console.error(error);
  }
};

document.getElementById("add").onclick = addEvent;
document.getElementById("signup").onclick = signup;
document.getElementById("login").onclick = login;
