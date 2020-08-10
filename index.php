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
        <nav class="auth">
            <div class="auth__info">
                <p id="<?php echo empty($_SESSION['userid']) ? "" : $_SESSION['userid'] ?>" class="loggeduser">
                    <?php echo empty($_SESSION['username']) ? "" : $_SESSION['username'] ?></p>

                <button class="button--login">Login</button>
                <button class="button--signup">Signup</button>
                <form action="logout.php" method="post">
                    <button class="button--logout hidden" type="submit">Logout</button>
                </form>
            </div>
            <h1 class="pagetitle">calendar.</h1>
        </nav>
        <main class="main">
            <div class="controlBar">
                <div class="changeDate">
                    <div class="year"></div>
                    <div class="month"></div>
                    <span class="main__controls">
                        <button class="prev">&lt </button>
                        <button class="next">&gt</button>
                    </span>
                </div>
                <div class="addData">
                    <div class="addTags">
                        <label class="hidden" for="tag">Add Tag</label>
                        <input id="tag" type="text" placeholder="Tag name" />
                        <label class="hidden" for="color">Choose color</label>
                        <input type="color" id="color" value="#7FAD81">
                        <button id="addTag" class="add">Add tag</button>
                    </div>
                    <div class="addEvents">
                        <label class="hidden" for="name">Add event</label>
                        <input id="name" type="text" placeholder="Event name" />
                        <label class="hidden" for="tags">Choose tag</label>
                        <select name="tags" id="tags">
                            <option selected disabled value="">Choose tag</option>
                            <option value="">None</option>
                        </select>
                        <label class="hidden" for="date">Date</label>
                        <input type="date" id="date" name="start-date" />
                        <label class="hidden" for="time">Time</label>
                        <input type="time" id="time" name="start-time" />
                        <button id="addEvent" class="add">Add event</button>
                    </div>
                </div>
            </div>
            <div class="filterEvents">
                <label class="hidden" for="filter">Choose filter</label>
                <select name="" id="filter">
                    <option selected disabled value="">Choose filter</option>
                    <option value="">None</option>
                </select>
            </div>
            <div class="calendar"></div>
        </main>
        <div role="dialog" class="modal modal--signup">
            <div class="modal__content">
                <div class="modal__header">
                    <div class="close">
                        <svg class="close__button close__button--signup" viewBox=" 0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg" class="_14dkERGUnSwisNWFcFX-0T">
                            <polygon fill="inherit"
                                points="11.649 9.882 18.262 3.267 16.495 1.5 9.881 8.114 3.267 1.5 1.5 3.267 8.114 9.883 1.5 16.497 3.267 18.264 9.881 11.65 16.495 18.264 18.262 16.497">
                            </polygon>
                        </svg>
                    </div>
                    <h2 class="header__title">Signup</h2>
                </div>
                <div class="modal__body">
                    <div class="form__inputs">
                        <input type="text" name="username" id="username__signup" placeholder="username" />
                        <input type="password" name="password" id="password__signup" placeholder="password" />
                        <button id="signup" class="signup">Signup</button>
                    </div>
                    </form>
                </div>
            </div>
        </div>
        <div role="dialog" class="modal modal--login">
            <div class="modal__content">
                <div class="modal__header">
                    <div class="close">
                        <svg class="close__button close__button--login" viewBox=" 0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg" class="_14dkERGUnSwisNWFcFX-0T">
                            <polygon fill="inherit"
                                points="11.649 9.882 18.262 3.267 16.495 1.5 9.881 8.114 3.267 1.5 1.5 3.267 8.114 9.883 1.5 16.497 3.267 18.264 9.881 11.65 16.495 18.264 18.262 16.497">
                            </polygon>
                        </svg>
                    </div>
                    <h2 class="header__title">Login</h2>
                </div>
                <div class="modal__body">
                    <div class="form__inputs">
                        <input type="text" name="username" id="username__login" placeholder="username" />
                        <input type=" password" name="password" id="password__login" placeholder="password" />
                        <button id="login" class="login">Login</button>
                    </div>
                </div>
            </div>
        </div>
        <div role="dialog" class="modal modal--edit">
            <div class="modal__content">
                <div class="modal__header">
                    <div class="close">
                        <svg class="close__button close__button--edit" viewBox=" 0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg" class="_14dkERGUnSwisNWFcFX-0T">
                            <polygon fill="inherit"
                                points="11.649 9.882 18.262 3.267 16.495 1.5 9.881 8.114 3.267 1.5 1.5 3.267 8.114 9.883 1.5 16.497 3.267 18.264 9.881 11.65 16.495 18.264 18.262 16.497">
                            </polygon>
                        </svg>
                    </div>
                    <h2 class="header__title">Edit Event</h2>
                </div>
                <div class="modal__body">
                    <div class="updater">
                        <input class="update__title" type="text" placeholder="Event Name" />
                        <select name="tags" class="update__tags">
                            <option selected disabled value="">Choose tag</option>
                            <option value="">None</option>
                        </select>
                        <input class="update__date" type="date" name="start-date" />
                        <input class="update__time" type="time" name="start-time" />
                        <button class="update__submit" class="add">Edit</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>

</html>