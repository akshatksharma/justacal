<!DOCTYPE html>
<html lang="en">

<head>
    <?php
session_id("user");
session_start();
?>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="csrf-token" content=<?php echo empty($_SESSION['token']) ? "" : $_SESSION['token'] ?>>
    <title>Calendar</title>
    <script type="module" src="./index.js" defer></script>
    <link rel="stylesheet" href="resetstyles.css">
    <link rel="stylesheet" href="styles.css">
</head>

<body>
    <div class="page">
        <div class="auth">
            <p id="<?php echo empty($_SESSION['userid']) ? "" : $_SESSION['userid'] ?>" class="loggeduser">
                <?php echo empty($_SESSION['username']) ? "" : $_SESSION['username'] ?></p>
            <div class="signup">
                <h2>signup</h2>
                <label for="username__signup">username</label>
                <input type="text" name="username" id="username__signup" />
                <label for=" password">password</label>
                <input type="password" name="password" id="password__signup" />
                <button id="signup" class="signup">Signup</button>
            </div>
            <div class="login">
                <h2>login</h2>
                <label for="username__login">username</label>
                <input type="text" name="username" id="username__login" />
                <label for="password">password</label>
                <input type="password" name="password" id="password__login" />
                <button id="login" class="login">Login</button>
            </div>
            <form action="logout.php" method="post">
                <button type="submit">Logout</button>
            </form>
        </div>
        <div class="addEvents">
            <h2>add events</h2>
            <label for="name">Add event</label>
            <input id="name" type="text" placeholder="Event Name" />
            <label for="date">Date</label>
            <input type="date" id="date" name="start-date" />
            <label for="time">Time</label>
            <input type="time" id="time" name="start-time" />
            <button id="add" class="add">Submit</button>
        </div>
        <div class="test">
            <div class="calendar">
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>
                <div class="calendar__day"></div>

            </div>
        </div>
    </div>
</body>

</html>