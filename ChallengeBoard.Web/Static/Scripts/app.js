(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChallengeCards = (function () {
    function ChallengeCards(user) {
        _classCallCheck(this, ChallengeCards);

        this.user = user;
        this.registerClickEvent();
    }

    _createClass(ChallengeCards, [{
        key: "registerClickEvent",
        value: function registerClickEvent() {
            var self = this;
            var cards = document.getElementsByClassName("card");
            for (var i = 0; i < cards.length; i++) {
                (function () {
                    cards[i].addEventListener("click", function (e) {
                        e.preventDefault();

                        self.updateChallengeCard(this);
                        self.updateChallengeOnServer(this, 1);
                    });
                    var card = cards[i];
                    var count = cards[i].getElementsByClassName('card-count--subtr');
                    if (count.length == 0) return;

                    count[0].addEventListener("click", function (e) {

                        e.preventDefault();
                        e.stopPropagation();

                        self.updateChallengeCardSubtract(card);
                        self.updateChallengeOnServer(card, -1);
                    });
                })();
            }
        }
    }, {
        key: "updateChallengeCard",
        value: function updateChallengeCard(card) {

            var cardIsMarkedAsComplete = card.classList.contains("card--complete");
            var cardIsSingleOnly = card.classList.contains("card--single");
            var points = card.getAttribute('data-points');

            if (cardIsMarkedAsComplete && cardIsSingleOnly) {
                points = points * -1;
                card.classList.remove("card--complete");
            } else {
                card.classList.add("card--complete");
                if (!cardIsSingleOnly) {
                    var currentCount = card.getElementsByClassName('card-count--number')[0];
                    currentCount.textContent = parseInt(currentCount.textContent) + 1;
                }
            }

            var event = new CustomEvent("challengeCardSaved", { "detail": points });
            document.dispatchEvent(event);
        }
    }, {
        key: "updateChallengeCardSubtract",
        value: function updateChallengeCardSubtract(card) {
            var cardIsMarkedAsComplete = card.classList.contains("card--complete");

            var points = card.getAttribute('data-points');
            //if (cardIsMarkedAsComplete) {
            points = points * -1;
            //} else {
            //card.classList.add("card--complete");
            //}
            console.log(card);
            var currentCount = card.getElementsByClassName('card-count--number')[0];
            currentCount.textContent = parseInt(currentCount.textContent) - 1;
            var event = new CustomEvent("challengeCardSaved", { "detail": points });
            document.dispatchEvent(event);
        }
    }, {
        key: "updateChallengeOnServer",
        value: function updateChallengeOnServer(card, count) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/card/togglechallenge');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function () {
                if (xhr.status !== 200) {
                    //Something went wrong message.
                    // return to login form
                    var username = document.getElementById("user-hide").textContent;
                    window.location.href = "/signin";
                    return;
                }
            };
            xhr.send(JSON.stringify({
                id: card.dataset.id,
                currentUser: this.user,
                boardName: document.getElementById("Cards").dataset.board,
                single: card.classList.contains("card--single"),
                count: count
            }));
        }
    }]);

    return ChallengeCards;
})();

module.exports = ChallengeCards;

},{}],2:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UserInfo = (function () {
    function UserInfo(user) {
        _classCallCheck(this, UserInfo);

        this.user = user;
    }

    _createClass(UserInfo, [{
        key: "init",
        value: function init() {
            this.registerEvents();
        }
    }, {
        key: "registerEvents",
        value: function registerEvents() {
            var _this = this;

            var event = new Event("challengeCardSaved");
            document.addEventListener("challengeCardSaved", function (event) {
                return _this.updateProgressBar(event.detail);
            });
        }
    }, {
        key: "updateProgressBar",
        value: function updateProgressBar(points) {
            console.log(points);
            var scoreboard = document.getElementById('intro-score');
            var currentPoints = parseInt(scoreboard.textContent);
            var newScore = currentPoints + parseInt(points);
            scoreboard.textContent = newScore;
        }
    }]);

    return UserInfo;
})();

module.exports = UserInfo;

},{}],3:[function(require,module,exports){
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _ModulesChallengeCards = require("./Modules/ChallengeCards");

var _ModulesChallengeCards2 = _interopRequireDefault(_ModulesChallengeCards);

var _ModulesUserInfo = require("./Modules/UserInfo");

var _ModulesUserInfo2 = _interopRequireDefault(_ModulesUserInfo);

document.addEventListener("DOMContentLoaded", function (event) {

    setTimeout(function () {
        document.getElementById("wrap").classList.add('wrap--init');
    }, 400);

    var placeholders = $('.form__item__textbox');
    $('.form__item__textbox').each(function () {
        if ($(this).val().length > 0) {
            $(this).addClass("form__item__textbox--hasvalue");
        }
    });
    placeholders.keypress(function () {
        $(this).addClass("form__item__textbox--hasvalue");
    });
    placeholders.keyup(function () {
        if ($(this).val().length == 0) {
            $(this).removeClass("form__item__textbox--hasvalue");
        }
        if ($(this).hasClass('lowercase')) {
            $(this).val($(this).val().toLowerCase());
        }
    });

    var username = document.getElementById("user-hide");

    if (!username) {
        return;
    }

    var challengeCards = new _ModulesChallengeCards2["default"](username.textContent);
    var userInfo = new _ModulesUserInfo2["default"](username.textContent);

    userInfo.init();

    var cards = document.getElementById('Cards');

    document.getElementById("notifications-toggle").addEventListener("click", function (e) {
        e.preventDefault();
        var container = document.getElementById('history-feed');
        if (container.classList.contains('hidden')) {
            this.classList.add('header__actions__icon--expanded');
            container.classList.remove('hidden');
            setTimeout(function () {
                container.classList.add("notifications--init");
            }, 50);
        } else {
            this.classList.remove('header__actions__icon--expanded');
            container.classList.remove("notifications--init");
            setTimeout(function () {
                container.classList.add('hidden');
            }, 300);
        }
    });

    document.getElementById("leaderboard-toggle").addEventListener("click", function (e) {
        e.preventDefault();

        if (document.getElementsByClassName("leaderboard").length > 0) {
            this.classList.remove('header__actions__icon--expanded');
            var leaderboard = document.getElementById("leaderboard");
            leaderboard.classList.remove("leaderboard--init");
            setTimeout(function () {
                leaderboard.parentElement.removeChild(leaderboard);
            }, 300);
        } else {
            this.classList.add('header__actions__icon--expanded');
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    document.body.insertAdjacentHTML("beforeend", xhr.responseText);
                    setTimeout(function () {
                        document.getElementById("leaderboard").classList.add("leaderboard--init");
                    }, 50);
                }
            };
            xhr.open('POST', '/leaderboard/index', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
                id: document.getElementById("Cards").dataset.boardid
            }));
        }
    });
});

},{"./Modules/ChallengeCards":1,"./Modules/UserInfo":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjOi9HaXQvY2hhbGxlbmdlYm9hcmQvQ2hhbGxlbmdlQm9hcmQuV2ViL0NvbnRlbnQvU2NyaXB0cy9Nb2R1bGVzL0NoYWxsZW5nZUNhcmRzLmpzIiwiYzovR2l0L2NoYWxsZW5nZWJvYXJkL0NoYWxsZW5nZUJvYXJkLldlYi9Db250ZW50L1NjcmlwdHMvTW9kdWxlcy9Vc2VySW5mby5qcyIsImM6L0dpdC9jaGFsbGVuZ2Vib2FyZC9DaGFsbGVuZ2VCb2FyZC5XZWIvQ29udGVudC9TY3JpcHRzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7SUNBTSxjQUFjO0FBQ0wsYUFEVCxjQUFjLENBQ0osSUFBSSxFQUFFOzhCQURoQixjQUFjOztBQUVaLFlBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFlBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0tBQzdCOztpQkFKQyxjQUFjOztlQUtFLDhCQUFHO0FBQ2pCLGdCQUFJLElBQUksR0FBRyxJQUFJLENBQUM7QUFDaEIsZ0JBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNwRCxpQkFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDbkMsQUFBQyxpQkFBQSxZQUFXO0FBQ1IseUJBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBUyxDQUFDLEVBQUU7QUFDM0MseUJBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQzs7QUFFbkIsNEJBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMvQiw0QkFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztx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VztBQUNsQiwyQkFBVyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7YUFDdEQsRUFBRSxHQUFHLENBQUMsQ0FBQztTQUNYLE1BQU07QUFDSCxnQkFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsaUNBQWlDLENBQUMsQ0FBQztBQUN0RCxnQkFBSSxHQUFHLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztBQUMvQixlQUFHLENBQUMsa0JBQWtCLEdBQUcsWUFBVztBQUNoQyxvQkFBSSxHQUFHLENBQUMsVUFBVSxJQUFJLGNBQWMsQ0FBQyxJQUFJLEVBQUU7QUFDdkMsNEJBQVEsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNoRSw4QkFBVSxDQUFDLFlBQVc7QUFDbEIsZ0NBQVEsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO3FCQUM3RSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2lCQUNWO2FBQ0osQ0FBQTtBQUNELGVBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLG9CQUFvQixFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzdDLGVBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztBQUN6RCxlQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7QUFDcEIsa0JBQUUsRUFBRSxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPO2FBQ3ZELENBQUMsQ0FBQyxDQUFDO1NBQ1A7S0FDSixDQUFDLENBQUM7Q0FDTixDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY2xhc3MgQ2hhbGxlbmdlQ2FyZHMge1xyXG4gICAgY29uc3RydWN0b3IodXNlcikge1xyXG4gICAgICAgIHRoaXMudXNlciA9IHVzZXI7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlckNsaWNrRXZlbnQoKTtcclxuICAgIH1cclxuICAgIHJlZ2lzdGVyQ2xpY2tFdmVudCgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGNhcmRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImNhcmRcIik7ICAgICAgICBcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhcmRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGNhcmRzW2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnVwZGF0ZUNoYWxsZW5nZUNhcmQodGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi51cGRhdGVDaGFsbGVuZ2VPblNlcnZlcih0aGlzLCAxKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHZhciBjYXJkID0gY2FyZHNbaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgY291bnQgPSBjYXJkc1tpXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjYXJkLWNvdW50LS1zdWJ0cicpO1xyXG4gICAgICAgICAgICAgICAgaWYoY291bnQubGVuZ3RoID09IDApXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvdW50WzBdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYudXBkYXRlQ2hhbGxlbmdlQ2FyZFN1YnRyYWN0KGNhcmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYudXBkYXRlQ2hhbGxlbmdlT25TZXJ2ZXIoY2FyZCwgLTEpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0oKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdXBkYXRlQ2hhbGxlbmdlQ2FyZChjYXJkKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIGNhcmRJc01hcmtlZEFzQ29tcGxldGUgPSBjYXJkLmNsYXNzTGlzdC5jb250YWlucyhcImNhcmQtLWNvbXBsZXRlXCIpO1xyXG4gICAgICAgIHZhciBjYXJkSXNTaW5nbGVPbmx5ID0gY2FyZC5jbGFzc0xpc3QuY29udGFpbnMoXCJjYXJkLS1zaW5nbGVcIik7XHJcbiAgICAgICAgdmFyIHBvaW50cyA9IGNhcmQuZ2V0QXR0cmlidXRlKCdkYXRhLXBvaW50cycpO1xyXG5cclxuICAgICAgICBpZiAoY2FyZElzTWFya2VkQXNDb21wbGV0ZSAmJiBjYXJkSXNTaW5nbGVPbmx5KSB7XHJcbiAgICAgICAgICAgIHBvaW50cyA9IHBvaW50cyAqIC0xO1xyXG4gICAgICAgICAgICBjYXJkLmNsYXNzTGlzdC5yZW1vdmUoXCJjYXJkLS1jb21wbGV0ZVwiKTsgXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2FyZC5jbGFzc0xpc3QuYWRkKFwiY2FyZC0tY29tcGxldGVcIik7IFxyXG4gICAgICAgICAgICBpZighY2FyZElzU2luZ2xlT25seSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRDb3VudCA9IGNhcmQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2FyZC1jb3VudC0tbnVtYmVyJylbMF07XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50Q291bnQudGV4dENvbnRlbnQgPSBwYXJzZUludChjdXJyZW50Q291bnQudGV4dENvbnRlbnQpICsgMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gICAgICAgIFxyXG5cclxuICAgICAgICB2YXIgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoXCJjaGFsbGVuZ2VDYXJkU2F2ZWRcIiwgeyBcImRldGFpbFwiOiBwb2ludHMgfSk7XHJcbiAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVDaGFsbGVuZ2VDYXJkU3VidHJhY3QoY2FyZCkge1xyXG4gICAgICAgIHZhciBjYXJkSXNNYXJrZWRBc0NvbXBsZXRlID0gY2FyZC5jbGFzc0xpc3QuY29udGFpbnMoXCJjYXJkLS1jb21wbGV0ZVwiKTtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgcG9pbnRzID0gY2FyZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcG9pbnRzJyk7XHJcbiAgICAgICAgLy9pZiAoY2FyZElzTWFya2VkQXNDb21wbGV0ZSkge1xyXG4gICAgICAgICAgICBwb2ludHMgPSBwb2ludHMgKiAtMTtcclxuICAgICAgICAvL30gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vY2FyZC5jbGFzc0xpc3QuYWRkKFwiY2FyZC0tY29tcGxldGVcIik7XHJcbiAgICAgICAgLy99XHJcbiAgICAgICAgY29uc29sZS5sb2coY2FyZCk7XHJcbiAgICAgICAgdmFyIGN1cnJlbnRDb3VudCA9IGNhcmQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2FyZC1jb3VudC0tbnVtYmVyJylbMF07XHJcbiAgICAgICAgY3VycmVudENvdW50LnRleHRDb250ZW50ID0gcGFyc2VJbnQoY3VycmVudENvdW50LnRleHRDb250ZW50KSAtIDE7XHJcbiAgICAgICAgdmFyIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFwiY2hhbGxlbmdlQ2FyZFNhdmVkXCIsIHsgXCJkZXRhaWxcIjogcG9pbnRzIH0pO1xyXG4gICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlQ2hhbGxlbmdlT25TZXJ2ZXIoY2FyZCwgY291bnQpIHtcclxuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgeGhyLm9wZW4oJ1BPU1QnLCAnL2NhcmQvdG9nZ2xlY2hhbGxlbmdlJyk7XHJcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XHJcbiAgICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgIT09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgLy9Tb21ldGhpbmcgd2VudCB3cm9uZyBtZXNzYWdlLlxyXG4gICAgICAgICAgICAgICAgLy8gcmV0dXJuIHRvIGxvZ2luIGZvcm1cclxuICAgICAgICAgICAgICAgIHZhciB1c2VybmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidXNlci1oaWRlXCIpLnRleHRDb250ZW50O1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi9zaWduaW5cIjtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSAgICAgICAgICAgICBcclxuICAgICAgICB9O1xyXG4gICAgICAgIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KHsgXHJcbiAgICAgICAgICAgIGlkOiBjYXJkLmRhdGFzZXQuaWQsXHJcbiAgICAgICAgICAgIGN1cnJlbnRVc2VyOiB0aGlzLnVzZXIsXHJcbiAgICAgICAgICAgIGJvYXJkTmFtZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJDYXJkc1wiKS5kYXRhc2V0LmJvYXJkLFxyXG4gICAgICAgICAgICBzaW5nbGU6IGNhcmQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiY2FyZC0tc2luZ2xlXCIpLFxyXG4gICAgICAgICAgICBjb3VudDogY291bnRcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBDaGFsbGVuZ2VDYXJkczsiLCJjbGFzcyBVc2VySW5mbyB7XHJcbiAgICBjb25zdHJ1Y3Rvcih1c2VyKSB7XHJcbiAgICAgICAgdGhpcy51c2VyID0gdXNlcjsgICAgICAgIFxyXG4gICAgfVxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnRzKCk7XHJcbiAgICB9XHJcbiAgICByZWdpc3RlckV2ZW50cygpIHtcclxuICAgICAgICB2YXIgZXZlbnQgPSBuZXcgRXZlbnQoXCJjaGFsbGVuZ2VDYXJkU2F2ZWRcIik7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNoYWxsZW5nZUNhcmRTYXZlZFwiLCBldmVudCA9PiB0aGlzLnVwZGF0ZVByb2dyZXNzQmFyKGV2ZW50LmRldGFpbCkpO1xyXG4gICAgfVxyXG4gICBcclxuICAgIHVwZGF0ZVByb2dyZXNzQmFyKHBvaW50cykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHBvaW50cyk7XHJcbiAgICAgICAgdmFyIHNjb3JlYm9hcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW50cm8tc2NvcmUnKTtcclxuICAgICAgICB2YXIgY3VycmVudFBvaW50cyA9IHBhcnNlSW50KHNjb3JlYm9hcmQudGV4dENvbnRlbnQpOyAgICAgICAgXHJcbiAgICAgICAgdmFyIG5ld1Njb3JlID0gY3VycmVudFBvaW50cyArIHBhcnNlSW50KHBvaW50cyk7XHJcbiAgICAgICAgc2NvcmVib2FyZC50ZXh0Q29udGVudCA9IG5ld1Njb3JlOyAgICAgICAgICAgIFxyXG4gICAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gVXNlckluZm87IiwiaW1wb3J0IENoYWxsZW5nZUNhcmRzIGZyb20gXCIuL01vZHVsZXMvQ2hhbGxlbmdlQ2FyZHNcIjtcclxuaW1wb3J0IFVzZXJJbmZvIGZyb20gXCIuL01vZHVsZXMvVXNlckluZm9cIjtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcblxyXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndyYXBcIikuY2xhc3NMaXN0LmFkZCgnd3JhcC0taW5pdCcpO1xyXG4gICAgfSwgNDAwKTtcclxuXHJcblxyXG4gICAgdmFyIHBsYWNlaG9sZGVycyA9ICQoJy5mb3JtX19pdGVtX190ZXh0Ym94Jyk7XHJcbiAgICAkKCcuZm9ybV9faXRlbV9fdGV4dGJveCcpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKCQodGhpcykudmFsKCkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKFwiZm9ybV9faXRlbV9fdGV4dGJveC0taGFzdmFsdWVcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBwbGFjZWhvbGRlcnMua2V5cHJlc3MoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCh0aGlzKS5hZGRDbGFzcyhcImZvcm1fX2l0ZW1fX3RleHRib3gtLWhhc3ZhbHVlXCIpO1xyXG4gICAgfSk7XHJcbiAgICBwbGFjZWhvbGRlcnMua2V5dXAoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKCQodGhpcykudmFsKCkubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcyhcImZvcm1fX2l0ZW1fX3RleHRib3gtLWhhc3ZhbHVlXCIpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKCdsb3dlcmNhc2UnKSkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLnZhbCgkKHRoaXMpLnZhbCgpLnRvTG93ZXJDYXNlKCkpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICB2YXIgdXNlcm5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVzZXItaGlkZVwiKTtcclxuXHJcbiAgICBpZiAoIXVzZXJuYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBjaGFsbGVuZ2VDYXJkcyA9IG5ldyBDaGFsbGVuZ2VDYXJkcyh1c2VybmFtZS50ZXh0Q29udGVudCk7XHJcbiAgICB2YXIgdXNlckluZm8gPSBuZXcgVXNlckluZm8odXNlcm5hbWUudGV4dENvbnRlbnQpO1xyXG5cclxuICAgIHVzZXJJbmZvLmluaXQoKTtcclxuXHJcbiAgICB2YXIgY2FyZHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnQ2FyZHMnKTtcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5vdGlmaWNhdGlvbnMtdG9nZ2xlXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGlzdG9yeS1mZWVkJyk7XHJcbiAgICAgICAgaWYgKGNvbnRhaW5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGRlbicpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnaGVhZGVyX19hY3Rpb25zX19pY29uLS1leHBhbmRlZCcpO1xyXG4gICAgICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChcIm5vdGlmaWNhdGlvbnMtLWluaXRcIik7XHJcbiAgICAgICAgICAgIH0sIDUwKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoJ2hlYWRlcl9fYWN0aW9uc19faWNvbi0tZXhwYW5kZWQnKTtcclxuICAgICAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJub3RpZmljYXRpb25zLS1pbml0XCIpO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xyXG4gICAgICAgICAgICB9LCAzMDApO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxlYWRlcmJvYXJkLXRvZ2dsZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblxyXG4gICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwibGVhZGVyYm9hcmRcIikubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoJ2hlYWRlcl9fYWN0aW9uc19faWNvbi0tZXhwYW5kZWQnKTtcclxuICAgICAgICAgICAgdmFyIGxlYWRlcmJvYXJkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWFkZXJib2FyZFwiKTtcclxuICAgICAgICAgICAgbGVhZGVyYm9hcmQuY2xhc3NMaXN0LnJlbW92ZShcImxlYWRlcmJvYXJkLS1pbml0XCIpO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgbGVhZGVyYm9hcmQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChsZWFkZXJib2FyZCk7XHJcbiAgICAgICAgICAgIH0sIDMwMCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdoZWFkZXJfX2FjdGlvbnNfX2ljb24tLWV4cGFuZGVkJyk7XHJcbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09IFhNTEh0dHBSZXF1ZXN0LkRPTkUpIHtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5Lmluc2VydEFkamFjZW50SFRNTChcImJlZm9yZWVuZFwiLCB4aHIucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxlYWRlcmJvYXJkXCIpLmNsYXNzTGlzdC5hZGQoXCJsZWFkZXJib2FyZC0taW5pdFwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9LCA1MCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgeGhyLm9wZW4oJ1BPU1QnLCAnL2xlYWRlcmJvYXJkL2luZGV4JywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xyXG4gICAgICAgICAgICB4aHIuc2VuZChKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgICAgICAgICBpZDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJDYXJkc1wiKS5kYXRhc2V0LmJvYXJkaWRcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59KTsiXX0=
