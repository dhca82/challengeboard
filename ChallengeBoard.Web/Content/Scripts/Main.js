import ChallengeCards from "./Modules/ChallengeCards";
import UserInfo from "./Modules/UserInfo";

document.addEventListener("DOMContentLoaded", function(event) {

    setTimeout(function() {
        document.getElementById("wrap").classList.add('wrap--init');
    }, 400);


    var placeholders = $('.form__item__textbox');
    $('.form__item__textbox').each(function() {
        if ($(this).val().length > 0) {
            $(this).addClass("form__item__textbox--hasvalue");
        }
    });
    placeholders.keypress(function() {
        $(this).addClass("form__item__textbox--hasvalue");
    });
    placeholders.keyup(function() {
        if ($(this).val().length == 0) {
            $(this).removeClass("form__item__textbox--hasvalue")
        }
        if ($(this).hasClass('lowercase')) {
            $(this).val($(this).val().toLowerCase());
        }
    });


    var username = document.getElementById("user-hide");

    if (!username) {
        return;
    }

    var challengeCards = new ChallengeCards(username.textContent);
    var userInfo = new UserInfo(username.textContent);

    userInfo.init();

    var cards = document.getElementById('Cards');

    document.getElementById("notifications-toggle").addEventListener("click", function(e) {
        e.preventDefault();
        var container = document.getElementById('history-feed');
        if (container.classList.contains('hidden')) {
            this.classList.add('header__actions__icon--expanded');
            container.classList.remove('hidden');
            setTimeout(function() {
                container.classList.add("notifications--init");
            }, 50);
        } else {
            this.classList.remove('header__actions__icon--expanded');
            container.classList.remove("notifications--init");
            setTimeout(function() {
                container.classList.add('hidden');
            }, 300);
        }
    });


    document.getElementById("leaderboard-toggle").addEventListener("click", function(e) {
        e.preventDefault();


        if (document.getElementsByClassName("leaderboard").length > 0) {
            this.classList.remove('header__actions__icon--expanded');
            var leaderboard = document.getElementById("leaderboard");
            leaderboard.classList.remove("leaderboard--init");
            setTimeout(function() {
                leaderboard.parentElement.removeChild(leaderboard);
            }, 300);
        } else {
            this.classList.add('header__actions__icon--expanded');
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    document.body.insertAdjacentHTML("beforeend", xhr.responseText);
                    setTimeout(function() {
                        document.getElementById("leaderboard").classList.add("leaderboard--init");
                    }, 50);
                }
            }
            xhr.open('POST', '/leaderboard/index', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
                id: document.getElementById("Cards").dataset.boardid
            }));
        }
    });
});