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

    loadEvents(currMonth);
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
    const [year, month, day] = await data.start_date.split("-");

    if (parseInt(month) + 1 === currMonth.month) {
      const domDate = document.getElementById(day);
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
    const data = await response.json();
    console.log(data);

    if (data.success == true) {
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
  days.forEach((day) => {
    const domDay = document.createElement("div");
    domDay.className = "calendar__day";
    domDay.innerHTML = "";
    domDay.id = day;

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
      const day = date[3];

      if (data[formattedDate]) {
        const domDate = document.getElementById(day);
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

    // for (const [date, events] of await Object.entries(data)) {
    //   const [year, month, day] = date.split("-");
    //   const domDate = document.getElementById(day);
    //   domDate.innerHTML = `${day}`;

    // events.sort((e1, e2) => {
    //   if (e1.start_time < e2.start_time) return -1;
    //   else if (e1.start_time > e2.start_time) return 1;
    //   return 0;
    // });

    //   for (const event of events) {
    //     const banner = makeBanner(event);
    //     domDate.appendChild(banner);
    //   }

    //   const deleteButton = document.createElement("button");
    //   deleteButton.innerHTML = "delete";
    //   deleteButton.onclick = deleteEvent;

    //   const editButton = document.createElement("button");
    //   editButton.innerHTML = "edit";
    //   editButton.onclick = updateEvent;

    //   const updater = document.createElement("div");
    //   const updateName = document.createElement("input");
    //   updateName.type = "text";
    //   updateName.className = "changeName";
    //   const updateDate = document.createElement("input");
    //   updateDate.type = "date";
    //   updateDate.className = "changeDate";
    //   const updateTime = document.createElement("input");
    //   updateTime.type = "time";
    //   updateTime.className = "changeTime";

    //   updater.appendChild(updateName);
    //   updater.appendChild(updateDate);
    //   updater.appendChild(updateTime);

    //   event.appendChild(item);
    //   event.appendChild(deleteButton);
    //   event.appendChild(editButton);
    //   event.appendChild(updater);

    //   domDate.appendChild(event);
    // }

    console.log(data);
    console.timeEnd("test");
  } catch (error) {
    console.error(error);
  }
};

const makeBanner = (event) => {
  const banner = document.createElement("div");
  banner.id = event.id;
  const info = document.createElement("p");
  const eventTime = event.start_time.split(":00")[0];
  info.innerHTML = `${event.title} @ ${eventTime}`;
  banner.appendChild(info);
  return banner;
};

loadEvents(currMonth);
document.getElementsByClassName("prev")[0].onclick = prevMonth;
document.getElementsByClassName("next")[0].onclick = nextMonth;
document.getElementById("add").onclick = addEvent;
document.getElementById("signup").onclick = signup;
document.getElementById("login").onclick = login;
