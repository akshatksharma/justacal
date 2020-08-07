import { Week, Month } from "./calendar";

const d = new Date();
const m = d.getMonth();
const y = d.getFullYear();
let currMonth = new Month(y, m);

const monthMap = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function nextMonth() {
  currMonth = currMonth.nextMonth();
  loadEvents(currMonth);
}
function prevMonth() {
  currMonth = currMonth.prevMonth();
  loadEvents(currMonth);
}

const signup = async () => {
  const signupOpen = document.getElementsByClassName("button--signup")[0];
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
    signupOpen.classList.add("hidden");
  } catch (error) {
    console.error(error);
  }
};

const login = async () => {
  const signUp = document.getElementsByClassName("button--signup")[0];
  const loginOpen = document.getElementsByClassName("button--login")[0];
  const logout = document.getElementsByClassName("button--logout")[0];
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
    loadEvents(currMonth);

    signUp.classList.add("hidden");
    loginOpen.classList.add("hidden");
    logout.classList.remove("hidden");
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
    const [year, month, day] = await data.start_date.split("-");

    console.log(currMonth.month);
    console.log(parseInt(month));

    if (parseInt(month) - 1 === currMonth.month) {
      const domDate = document.getElementById(`${month}-${day}`);
      const banner = makeBanner(await data);
      domDate.appendChild(banner);

      eventDate.value = "";
      eventTime.value = "";
      eventName.value = "";
    } else return;
  } catch (error) {
    console.error(error);
  }
};

async function deleteEvent() {
  const userid = document.getElementsByClassName("loggeduser")[0].id;
  const comment = this.parentElement.parentElement;
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
  const event = this.parentElement.parentElement.parentElement.parentElement;
  const commentId = event.classList.item(2);
  const updateText = event.getElementsByClassName("update__title")[0].value;
  const updateDate = event.getElementsByClassName("update__date")[0].value;
  const updateTime = event.getElementsByClassName("update__time")[0].value;
  const token = document.getElementsByName("csrf-token")[0].content;

  const userData = {
    userId: userid,
    commentId: commentId,
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
    const data = await response.json();
    console.log(data);

    if (data.success == true) {
      const [year, month, day] = await data.start_date.split("-");
      if (parseInt(month) - 1 === currMonth.month) {
        const event_ = document.getElementById(commentId);
        const domDate = document.getElementById(`${month}-${day}`);
        console.log(event_, domDate);
        event_.remove();
        const banner = makeBanner(await data);
        domDate.appendChild(banner);
      }
      console.log(currMonth);
      console.log(year, month, day);
    }
  } catch (error) {
    console.error(error);
  }
}

const loadEvents = async (month) => {
  document.getElementsByClassName("year")[0].textContent = month.year;
  document.getElementsByClassName("month")[0].textContent =
    monthMap[month.month];

  const dates = [];
  const weeks = month.getWeeks();
  weeks.forEach((week) => {
    const days = week.getDates();
    days.forEach((day) => {
      dates.push(day.toISOString());
    });
  });

  const days = dates.map((date) => date.match(/-(\d\d)T/)[1]);
  const months = dates.map((date) => date.match(/-(\d\d)-/)[1]);
  const years = dates.map((date) => date.match(/^(\d*)-/)[1]);

  const calendarContainer = document.getElementsByClassName("calendar")[0];
  calendarContainer.innerHTML = "";
  days.forEach((day, i) => {
    const domDay = document.createElement("div");
    domDay.className = "calendar__day";
    domDay.innerHTML = "";
    domDay.id = `${months[i]}-${day}`;

    const num = document.createElement("p");
    num.textContent = day;
    domDay.appendChild(num);
    calendarContainer.appendChild(domDay);
  });

  const formattedDates = days.map((day, i) => [
    `${years[i]}-${months[i]}-${day}`,
    years[i],
    months[i],
    day,
  ]);

  console.log(formattedDates);

  try {
    const res = await fetch("loadEvents.php", {
      method: "POST",
    });

    if (!res.ok) {
      console.log("failure");
    }

    const data = await res.json();
    console.log(data);
    console.time("test");

    formattedDates.forEach((date) => {
      const formattedDate = date[0];
      const month = date[2];
      const day = date[3];

      if (data[formattedDate]) {
        const domDate = document.getElementById(`${month}-${day}`);
        const events = data[formattedDate];

        events.sort((e1, e2) => {
          if (e1.start_time < e2.start_time) return -1;
          else if (e1.start_time > e2.start_time) return 1;
          return 0;
        });

        for (const event of events) {
          const banner = makeBanner(event);
          domDate.appendChild(banner);
        }
      }
    });

    console.log(data);
    console.timeEnd("test");
  } catch (error) {
    console.error(error);
  }
};

const makeBanner = (event_) => {
  const banner = document.createElement("div");
  banner.classList.add("event");
  banner.id = event_.id;

  const info = document.createElement("span");
  info.classList.add("info");

  const timeDiv = document.createElement("span");
  const eventTime = event_.start_time.split(":00")[0];
  timeDiv.textContent = eventTime;
  timeDiv.classList.add("time");

  const titleDiv = document.createElement("span");
  titleDiv.classList.add("title");
  titleDiv.textContent = event_.title;

  const controls = document.createElement("span");
  controls.classList.add("controls");

  const close = document.createElement("button");
  close.innerHTML = "x";
  close.onclick = deleteEvent;
  const edit = document.createElement("button");
  edit.classList.add("button--edit");
  edit.innerHTML = "e";

  const editModal = document.getElementsByClassName("modal--edit")[0];
  const editClose = document.getElementsByClassName("close__button--edit")[0];

  edit.addEventListener("click", (event) => {
    editModal.style.display = "block";
    editModal.classList.add(event_.id);
  });

  editClose.addEventListener("click", (event) => {
    editModal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target == editModal) {
      editModal.style.display = "none";
      editModal.getElementsByClassName("modal__body")[0].focus();
    }
  });

  controls.appendChild(close);
  controls.appendChild(edit);
  info.appendChild(timeDiv);
  info.appendChild(titleDiv);
  banner.appendChild(info);
  banner.appendChild(controls);

  return banner;
};

const controlModals = () => {
  const signupModal = document.getElementsByClassName("modal--signup")[0];
  const signupOpen = document.getElementsByClassName("button--signup")[0];
  const signupClose = document.getElementsByClassName(
    "close__button--signup"
  )[0];

  const loginModal = document.getElementsByClassName("modal--login")[0];
  const loginOpen = document.getElementsByClassName("button--login")[0];
  const loginClose = document.getElementsByClassName("close__button--login")[0];

  if (!signupOpen || !loginOpen) return;

  signupOpen.addEventListener("click", (event) => {
    signupModal.style.display = "block";
  });

  signupClose.addEventListener("click", (event) => {
    signupModal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target == signupModal) {
      signupModal.style.display = "none";
      signupModal.getElementsByClassName("modal__body")[0].focus();
    }
  });

  loginOpen.addEventListener("click", (event) => {
    loginModal.style.display = "block";
  });

  loginClose.addEventListener("click", (event) => {
    loginModal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target == loginModal) {
      loginModal.style.display = "none";
      loginModal.getElementsByClassName("modal__body")[0].focus();
    }
  });
};

const main = () => {
  document.getElementsByClassName("prev")[0].onclick = prevMonth;
  document.getElementsByClassName("next")[0].onclick = nextMonth;
  document.getElementById("add").onclick = addEvent;

  document.getElementsByClassName("update__submit")[0].onclick = updateEvent;

  const userid = document.getElementsByClassName("loggeduser")[0].id;
  const signupButton = document.getElementsByClassName("button--signup")[0];
  const loginButton = document.getElementsByClassName("button--login")[0];
  const logoutButton = document.getElementsByClassName("button--logout")[0];

  if (userid) {
    signupButton.classList.add("hidden");
    loginButton.classList.add("hidden");
    logoutButton.classList.remove("hidden");
  }

  const submitLogin = document.getElementById("login");
  const submitSignup = document.getElementById("signup");
  submitSignup.onclick = signup;
  submitLogin.onclick = login;

  loadEvents(currMonth);
  controlModals();
};

main();
